<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/4
 * Time: 下午10:17
 */

namespace app\services;

use app\models\Collection;
use app\models\Facility;
use app\models\House;
use app\models\Accusation;
use app\models\Image;
use app\utils\ErrorCode;
use phpDocumentor\Reflection\Types\Array_;
use Yii;
use app\utils\GlobalAction;
use app\utils\BizConsts;
use app\utils\UtilHelper;

class HouseService {

    static function getHouseList($district,$subway,$price,$style,$rentMode,$sort,$page) {

//        $field = [
//            'house_id',
//            'rent_mode',
//            'district',
//            'address',
//            'style',
//        ];
        $houseList = House::find()->where(['sell_state' => '在架']);

        if (isset($district) && $district != null) {
            $houseList = $houseList->andWhere(['like', 'district', $district]);
        }
        if (isset($subway) && $subway != null) {
            $houseList = $houseList->andWhere(['like', 'subways', $subway]);

        }
        if (isset($rentMode) && $rentMode != null) {
            $houseList = $houseList->andWhere(['rent_mode' => $rentMode]);
        }

        if (isset($style) && $style != null) {
            $transformStyle = '';
            switch ($style) {
                case '一居':
                    $transformStyle = '1室';
                    break;
                case '二居':
                    $transformStyle = '2室';
                    break;
                case '三居':
                    $transformStyle = '3室';
                    break;
                default:
                    break;
            }
            if ($transformStyle == '') {

                $houseList = $houseList->andWhere(['not like', 'style', '1室'])
                                       ->andWhere(['not like', 'style', '2室'])
                                       ->andWhere(['not like', 'style', '3室']);
            } else {

                $houseList = $houseList->andWhere(['like','style',$transformStyle]);

            }
        }

        //价格
        if (isset($price) && $price != null) {
            $priceRange = explode('~',$price);

            if (count($priceRange) == 2) {

                $min_price = (double)$priceRange[0];
                $max_price = (double)$priceRange[1];

            } else {
                $priceRange = explode('以', $price);
                if (next($priceRange) == "上") {
                    $min_price = (double)$priceRange[0];
                    $max_price = 9999999999.9;
                } else {
                    $min_price = 0.0;
                    $max_price = (double)$priceRange[0];
                }
            }

            $houseList = $houseList->andWhere(['between','price',$min_price,$max_price]);

        }

        //页码
        if (!isset($page) && $page != null) {
            $page = 1;
        }
        $pageNum = 21;
        //排序方式
        $orderDes = 'release_date DESC';
        switch ($sort) {
            case '价格':
                $orderDes = 'price ASC';
                break;
            case '面积':
                $houseList = $houseList->andWhere(['>','area',0]);
                $orderDes = 'area ASC';
                break;
            case '入住时间':
                $orderDes = 'usable_date ASC';
                break;
            default:
                break;

        }

        $houseList = $houseList->limit( $pageNum )
                  ->offset( ( $page - 1 ) * $pageNum )
                  ->orderBy($orderDes)
                  ->asArray()
                  ->all();
        foreach ($houseList AS $index => $house) {
            $date = $house['release_date'];
            $houseList[$index]['release_date'] = GlobalAction::computeTime($date);
            $houseList[$index]['images'] = House::getThumbImages($house);
            $houseList[$index]['facilities'] = self::getFacilities($house['house_id']);
            if ($house['traffic'] == null) {
                $houseList[$index]['traffic'] = '';
            }
        }

        return $houseList;
    }

    static function getHousesByKeyword($keyword) {

        $houseList = House::find()->where(['sell_state' => '在架'])
                                  ->andWhere(['or',
                                      ['like','subways',$keyword],
                                      ['like','district',$keyword],
                                      ['like','village',$keyword],
                                      ['like','address',$keyword]
                                  ])
                                  ->orderBy('release_date DESC')
                                  ->asArray()
                                  ->all();
        foreach ($houseList AS $index => $house) {
            $date = $house['release_date'];
            $houseList[$index]['release_date'] = GlobalAction::computeTime($date);
            $houseList[$index]['images'] = House::getThumbImages($house);
            $houseList[$index]['facilities'] = self::getFacilities($house['house_id']);
            if ($house['traffic'] == null) {
                $houseList[$index]['traffic'] = '';
            }
        }
        return $houseList;
    }

    static function getHouseInfo($houseId,$token) {

        $house = House::find()->where(['house_id' => $houseId])
                                  ->asArray()
                                  ->one();
        /*
        记录浏览量
        */
        $updateHouse = House::find()->where(['house_id' => $houseId])->one();
        $today = $house['today'];
        $updateHouse->browse_count = $house['browse_count']+1;
        $updateHouse->today_browse_count = $house['today_browse_count']+1;
        if ($today != date("Y-m-d")) {
            $updateHouse->today = date("Y-m-d");
            $updateHouse->today_browse_count = 1;
        }
        $updateHouse->update();
        if ($house['images'] == BizConsts::DEFAULT_HOUSE_IMAGE) {
            $house["images"] = array();
        } else {
            $house["images"] = House::handleImages($house);
        }
        $house["release_date"] = GlobalAction::computeTime($house['release_date']);
        if ($token != '') {
            $house["isCollection"] = Collection::find()->where(['house_id' => $houseId, 'token' => $token])
                                                       ->count() > 0;
        }
        $house['facilities'] = self::getFacilities($house['house_id']);
        return $house;
    }

    static function validData($data) {

        //错误码和错误信息
        $err_code = BizConsts::RELEASE_HOUSE_ERRCODE;
        $err_msg = BizConsts::RELEASE_HOUSE_ERRMSG;

        $token = $data['token'];
//        $village = $data['village'];

        if (self::invalid($token)) {
            $err_code = BizConsts::UNLOGIN_ERRCODE;
            $err_msg = BizConsts::UNLOGIN_ERRMSG;
            UtilHelper::echoExitResult($err_code,$err_msg);
        }

        $address = $data['address'];
        //地址
        if (self::invalid($address)) {
            UtilHelper::echoExitResult($err_code,'请填写详细地址');
        }
        $style = $data['style'];
        $area = $data['area'];

        $usableDate = $data['usable_date'];
        $deadline = $data['deadline_date'];
        $floor = $data['floor'];
        $max_floor = $data['max_floor'];
        $price = $data['price'];
        $payMode = $data['pay_mode'];

        //户型
        $room = explode('室',$style);
        if (count($room) < 2) {
            UtilHelper::echoExitResult($err_code,'请完善房间户型');
        } else if (!GlobalAction::isNumber($room[0])) {
            UtilHelper::echoExitResult($err_code,'房间户型请填入正确的数字');
        }

        $hall = explode('厅',$room[1]);
        if (count($hall) < 2)  {
            UtilHelper::echoExitResult($err_code,'请完善房间户型');
        } else if (!GlobalAction::isNumber($hall[0])) {
            UtilHelper::echoExitResult($err_code,'房间户型请填入正确的数字');
        }

        $toilet = explode('卫',$hall[1]);
        if (count($hall) < 2) {
            UtilHelper::echoExitResult($err_code,'请完善房间户型');
        } else if (!GlobalAction::isNumber($toilet[0])) {
            UtilHelper::echoExitResult($err_code,'房间户型请填入正确的数字');
        }
        //楼层
        if (self::invalid($floor)) {
            UtilHelper::echoExitResult($err_code,'请填写您的房间所在楼层');
        }
        //最高楼层
        if (self::invalid($max_floor)) {
            UtilHelper::echoExitResult($err_code,'请填写最高楼层');
        }
        //面积
        if (!self::invalid($area) && !self::areaIsValid($area)) {
            UtilHelper::echoExitResult($err_code,'请填写正确的房间面积');
        }
        //价格
        if (self::invalid($price)) {
            UtilHelper::echoExitResult($err_code,'请填写房间租金');
        } else if (!self::priceIsValid($price)) {
            UtilHelper::echoExitResult($err_code,'请填写正确的房间租金');
        }
        //支付方式
        if (self::invalid($payMode)) {
            UtilHelper::echoExitResult($err_code,'请填写支付方式');
        }
        //可入住时间
        if (self::invalid($usableDate)) {
            UtilHelper::echoExitResult($err_code,'请选择可入住日期');
        }
        //到期时间
        if (self::invalid($deadline)) {
            UtilHelper::echoExitResult($err_code,'请选择房间到期日期');
        }

        if (!isset($data['facilities'])) {
            UtilHelper::echoExitResult($err_code,'请选择房间设施');
        }
        $facilities = $data['facilities'];

        //房间设施
        if (self::invalid($facilities) || empty($facilities)) {
            UtilHelper::echoExitResult($err_code,'请选择房间设施');
        }

        //标题
        $title = $data['title'];
        if (self::invalid($title)) {
            UtilHelper::echoExitResult($err_code,'请填写标题');
        }

        $phone = $data['phone'];
        $wx = $data['wx'];
        $qq = $data['qq'];

        //电话、微信、QQ至少填一项
        if (self::invalid($phone) && self::invalid($wx) && self::invalid($qq)) {
            UtilHelper::echoExitResult($err_code,'手机、微信、QQ至少填一项');
        }
        //电话
        if (!self::invalid($phone) && !UtilHelper::isPhone($phone)) {
            UtilHelper::echoExitResult($err_code,'请填写正确的联系电话');
        }

    }

    static function releaseHouse($data) {
        $house = new House();
        $houseId = self::saveHouse($house,$data);
        UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$houseId);
    }

    static function modifyHouse($data) {

        $houseId = $data['house_id'];
        $house = House::find()->where(["house_id" => $houseId])->one();
        self::saveHouse($house,$data);
        UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
    }

    static function saveHouse($house,$data) {

        $house->rent_mode = $data['rent_mode'];
        $house->token = $data['token'];
        $house->village = isset($data['village']) ? $data['village'] : '未知';
        $house->address = $data['address'];
        $house->district = $data['district'];
        $house->style = $data['style'];
        $house->kitchen_type = $data['kitchen_type'];

        $area = $data['area'];
        if (isset($area) && is_numeric($area)) {
            $house->area = $area;
        }else{
            $house->area = 0;
        }

        $house->usable_date = $data['usable_date'];
        $house->deadline_date = $data['deadline_date'];
        $house->floor = $data['floor'];
        $house->max_floor = $data['max_floor'];
        $house->price = $data['price'];
        $house->pay_mode = $data['pay_mode'];
        $house->title = $data['title'];
        $house->benefit = isset($data['benefit']) ? $data['benefit'] : '';
        $house->house_desc = isset($data['house_desc']) ? $data['house_desc'] : '';
        $house->contact = isset($data['contact']) ? $data['contact'] : '';
        $house->phone = $data['phone'];
        $house->wx = $data['wx'];
        $house->qq = $data['qq'];

        $images = $data['images'];
        $DEFAULT_HOUSE_IMAGE = 'upload/defaultHouseImage.png';
        if (!isset($images) || $images == null || $images == '') {
            $images = $DEFAULT_HOUSE_IMAGE;
        }
        $house->images = $images;
        $thumb_images = $data['thumb_images'];
        if (!isset($thumb_images) || $thumb_images == null || $thumb_images == '') {
            $thumb_images = $DEFAULT_HOUSE_IMAGE;
        }
        $house->thumb_images = $thumb_images;

        $house->orientation = $data['orientation'];
        $house->subways = isset($data['subways']) ? $data['subways'] : "";
        $house->traffic = isset($data['traffic']) ? $data['traffic'] : "";
        $house->sell_state = '在架';
        $house->release_date = GlobalAction::getTimeStr("Y-m-d H:i:s");
        $house->save();
        $houseId = $house->attributes['house_id'];
        self::saveFacilities($data['facilities'],$houseId);
        return $houseId;
    }

    static function saveFacilities($facilities, $houseId) {
        foreach ($facilities AS $index => $f) {
            $facility = new Facility();
            $facility->house_id = $houseId;
            $facility->name = $f;
            $facility->save();
        }
    }

    static function getFacilities($houseId) {
        $facilityArr = array();
        $facilities = Facility::find()->where(['house_id' => $houseId])->all();
        foreach ($facilities AS $index => $facility) {
            array_push($facilityArr,$facility->name);
        }
        return $facilityArr;
    }

    static function stickHouse($houseId) {
        $house = House::findOne($houseId);
        $house->release_date = GlobalAction::getTimeStr("Y-m-d H:i:s");
        $house->save();
    }

    static function deleteHouse($houseId) {
        $house = House::findOne($houseId);
        $house->user_delete = true;
        $house->sell_state = "已下架";
        $house->save();
    }

    static function changeSellState($houseId,$sell) {
        $house = House::findOne($houseId);
        $sellStateDesc = $sell == 0 ? "已下架" : "在架";
        $house->sell_state = $sellStateDesc;
        if ($sell == 1) {
            $house->release_date = GlobalAction::getTimeStr("Y-m-d H:i:s");
        }
        $house->save();
    }

    static function collectionHouse($params) {
        $token = $params['token'];
        $houseId = $params['house_id'];
        $count = Collection::find()->where(['house_id' => $houseId, 'token' => $token])
                                   ->count();
        if ($count > 0) {
            UtilHelper::echoExitResult(BizConsts::House_Has_Collected_ERRCODE,BizConsts::House_Has_Collected_ERRMSG);
        }

        $collectionHouse = new Collection();
        $collectionHouse->token = $token;
        $collectionHouse->house_id = $houseId;
        $collectionHouse->collection_date = GlobalAction::getTimeStr("Y-m-d H:i:s");
        $collectionHouse->save();
    }

    static function cancelCollectionHouse($params)
    {
        $token = $params['token'];
        $houseId = $params['house_id'];
        $count = Collection::find()->where(['house_id' => $houseId, 'token' => $token])
                                   ->count();
        if ($count == 0) {
            UtilHelper::echoExitResult(BizConsts::House_UnCollected_ERRCODE, BizConsts::House_UnCollected_ERRMSG);
        }
        Collection::deleteAll('house_id = :house_id AND token = :token', [':house_id' => $houseId, ':token' => $token]);

    }

    /** 举报房源
     * @param $params
     */
    static function complainHouse($params) {
        $houseId = $params['house_id'];
        $reason = $params['reason'];
        $token = $params['token'];
        $phone = $params['phone'];
        $desc = $params['desc'];
        if ((!isset($reason) || empty($reason)) && (!isset($desc) || empty($desc))) {
            UtilHelper::echoExitResult(BizConsts::ABSENCE_COMPLAIN_REASON_ERRCODE,BizConsts::ABSENCE_COMPLAIN_REASON_ERRMSG);
        }
        $accusateDate = GlobalAction::getTimeStr("Y-m-d H:i:s");
        $accusation = new Accusation();
        $accusation->house_id = $houseId;
        $accusation->reason = isset($reason) ? $reason : "无理由举报";
        $accusation->token = $token;
        $accusation->phone = $phone;
        $accusation->desc = $desc;
        $accusation->accusate_date = $accusateDate;
        $accusation->save();

    }

    static function invalid($val) {
        if (isset($val) && $val != "" && $val != "NaN") {
            return false;
        }
        return true;
    }

    static function priceIsValid($price) {
        $pattern = '/^(([1-9]{1})[0-9]*)$/';
        return preg_match($pattern,$price);
    }
    static function areaIsValid($area) {
        $pattern = '/^(([1-9]{1})[0-9]*)$/';
        return preg_match($pattern,$area);
    }
    static function styleIsValid($style) {
        $pattern = '/^[0-9]*$/';
        return preg_match($pattern,$style);
    }

}

