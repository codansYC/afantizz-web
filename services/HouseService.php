<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/4
 * Time: 下午10:17
 */

namespace app\services;

use app\models\Collection;
use app\models\Complain;
use app\models\Facility;
use app\models\House;
use app\models\Accusation;
use app\models\HouseFollow;
use app\models\Image;
use app\models\UserToken;
use app\utils\GlobalAction;
use app\utils\BizConsts;
use app\utils\UtilHelper;

class HouseService
{

    const SORT_BY_RELEASE_DATE = 0;
    const SORT_BY_PRICE = 1;
    const SORT_BY_AREA = 2;
    const SORT_BY_USABLE_DATE = 3;
    const PAGE_NUM = 10;

    /**
     * @param $params
     * @return 房源列表
     */
    static function getHouseList($params)
    {
        $selCondition = [
            'house_id',
            'title',
            'price',
            'district' => 'house.district_code',
            'address',
            'rent_type',
            'traffic',
            'date' => 'house.update_time',
            'is_benefit' => 'LENGTH(trim(benefit))>0',
            'room_num',
            'hall_num',
            'room_type',
            'kitchen_type',
            'is_toilet_single' => "FIND_IN_SET('toilet',installation)>0"
        ];
        $query = House::find()->select($selCondition)
            ->where(['status' => House::HOUSE_AVAILABLE]);
        if (isset($params['district_code']) && !empty($params['district_code'])) {
            $query->andWhere(['district_code' => $params['district_code']]);
        }
        if (isset($params['subway']) && !empty($params['subway'])) {
            $query->andWhere(['like', 'subways', $params['subway']]);
        }
        if (isset($params['min_price']) && !empty($params['min_price'])) {
            $query->andWhere(['>', 'price', $params['min_price']]);
        }
        if (isset($params['max_price']) && !empty($params['max_price'])) {
            $query->andWhere(['<', 'price', $params['max_price']]);
        }
        if (isset($params['rent_type']) && !empty($params['rent_type'])) {
            $query->andWhere(['rent_type' => $params['rent_type']]);
        }
        $page = 1;
        if (isset($params['page']) && !empty($params['page'])) {
            $page = $params['page'];
        }
        $query->limit(self::PAGE_NUM)->offset(($page - 1) * self::PAGE_NUM);
        $sort = 'update_time DESC';
        if (isset($params['sort_type']) && !empty($params['sort_type'])) {
            switch ($params['sort_type']) {
                case '1':
                    $sort = 'price ASC';
                    break;
                case '2':
                    $query->andWhere(['>', 'area', 0]);
                    $sort = 'area ASC';
                    break;
                case '3':
                    $sort = 'usable_date ASC';
                    break;
                default:
                    break;
            }
        }
        $houseList = $query->orderBy($sort)->asArray()->all();
        foreach ($houseList AS $index => $house) {
            $houseList[$index]['date'] = explode(' ', $house['date'])[0];
            $houseList[$index]['district'] = UtilHelper::getDistrictByCode($house['district']);
            $imageObj = Image::find()->where(['source_id' => $house['house_id']])->asArray()->one();
            $houseList[$index]['image'] = $imageObj == null ? "" : $imageObj['thumb_url'];
        }
        return $houseList;
    }

    static function getHousesByKeyword($keyword)
    {
        $selCondition = [
            'house_id',
            'title',
            'price',
            'district' => 'house.district_code',
            'address',
            'rent_type',
            'traffic',
            'date' => 'house.update_time',
            'is_benefit' => 'LENGTH(trim(benefit))>0',
            'room_num',
            'hall_num',
            'room_type',
            'kitchen_type',
            'is_toilet_single' => "FIND_IN_SET('toilet',installation)"
        ];
        $houseList = House::find()->select($selCondition)
            ->where(['status' => House::HOUSE_AVAILABLE])
            ->where(['or',
                ['like', 'subways', $keyword],
                ['like', 'village', $keyword],
                ['like', 'address', $keyword]])
            ->orderBy('update_time DESC')
            ->asArray()
            ->all();
        foreach ($houseList AS $index => $house) {
            $houseList[$index]['date'] = explode(' ', $house['date'])[0];
            $houseList[$index]['district'] = UtilHelper::getDistrictByCode($house['district']);
            $imageObj = Image::find()
                ->where(['source_id' => $house['house_id']])
                ->one();
            $houseList[$index]['image'] = $imageObj == null ? "" : $imageObj->thumb_url;
        }
        return $houseList;
    }

    /**
     * @param $houseId
     * @param $token
     * @return mixed 房源详情
     */
    static function getHouseInfo($houseId, $token)
    {
        $house = House::find()
            ->where(['house_id' => $houseId])
            ->one();

        $houseInfo['title'] = $house->title;
        $houseInfo['address'] = $house->address;
        $houseInfo['district'] = UtilHelper::getDistrictByCode($house->district_code);
        $houseInfo['price'] = $house->price . '元/月';
        $houseInfo['rent_type'] = $house->rent_type;
        $houseInfo['date'] = explode(' ', $house->update_time)[0];
        $houseInfo['benefit'] = $house->benefit;
        $houseInfo['room_num'] = $house->room_num;
        $houseInfo['hall_num'] = $house->hall_num;
        $houseInfo['toilet_num'] = $house->toilet_num;
        $houseInfo['pay_mode'] = $house->pay_mode;
        $houseInfo['village'] = $house->village;
        $houseInfo['floor'] = $house->floor;
        $houseInfo['max_floor'] = $house->max_floor;
        $houseInfo['orientation'] = \Yii::$app->params['orientation'][$house->orientation];
        $houseInfo['area'] = $house->area . 'm²';
        $houseInfo['usable_time'] = explode(' ', $house->usable_time)[0];
        $houseInfo['deadline_time'] = explode(' ', $house->deadline_time)[0];
        $houseInfo['contact'] = $house->contact;
        $houseInfo['phone'] = $house->phone;
        $houseInfo['wx'] = $house->wx;
        $houseInfo['qq'] = $house->qq;
        $houseInfo['house_desc'] = $house->house_desc;
        if (empty($token)) {
            $houseInfo['is_follow'] = false;
        } else {
            $houseInfo['is_follow'] = HouseFollow::find()
                ->where(['house_id' => $houseId,
                    'user_id' => UserService::getUserIdByToken($token), 'status' => 1])
                ->exists();
        }

        $installation = explode(",", $house->installation);
        $facilities = array();
        foreach ($installation AS $in) {
            $facility = \Yii::$app->params['facilities'][$in];
            array_push($facilities, $facility);
        }
        $houseInfo['facilities'] = $facilities;
        $houseInfo['is_toilet_single'] = in_array('toilet', $installation);
        $houseInfo['images'] = Image::find()->select(['url', 'middle_url'])
            ->where(['source_id' => $houseId])
            ->asArray()
            ->all();
        return $houseInfo;
    }

    static function getRestoreInfo($houseId)
    {
        $house = House::find()
            ->where(['house_id' => $houseId])
            ->asArray()
            ->one();
        $house['images'] = Image::find()->select(['url', 'thumb_url'])
            ->where(['source_id' => $houseId])
            ->asArray()
            ->all();
        return $house;
    }

    static function validData($data)
    {

        //错误码和错误信息
        $err_code = BizConsts::RELEASE_HOUSE_ERRCODE;
        $err_msg = BizConsts::RELEASE_HOUSE_ERRMSG;

        if (!isset($data['token']) || !UserToken::find()->where(['token' => $data['token']])->exists()) {
            $err_code = BizConsts::UNLOGIN_ERRCODE;
            $err_msg = BizConsts::UNLOGIN_ERRMSG;
            UtilHelper::echoExitResult($err_code, $err_msg);
        }
        if (empty($data['images'])) {
            UtilHelper::echoExitResult($err_code, '请上传房间图片');
        }
        if (empty($data['address'])) {
            UtilHelper::echoExitResult($err_code, '请填写详细地址');
        }
        if (!is_numeric($data['room_num'])
            || !is_numeric($data['hall_num'])
            || !is_numeric($data['toilet_num'])
        ) {
            UtilHelper::echoExitResult($err_code, '请正确填写房间户型');
        }

        if (empty($data['area']) || !is_numeric($data['area'])) {
            UtilHelper::echoExitResult($err_code, '请正确填写面积');
        }

        if (empty($data['floor']) || !is_numeric($data['floor'])) {
            UtilHelper::echoExitResult($err_code, '请正确填写楼层');
        }
        if (empty($data['max_floor']) || !is_numeric($data['max_floor'])) {
            UtilHelper::echoExitResult($err_code, '请正确填写最高楼层');
        }
        if (empty($data['price']) || !is_numeric($data['price'])) {
            UtilHelper::echoExitResult($err_code, '请正确填写价格');
        }
        if (empty($data['usable_date'])) {
            UtilHelper::echoExitResult($err_code, '请选择入住日期');
        }
        if (empty($data['deadline_date'])) {
            UtilHelper::echoExitResult($err_code, '请选择房间到期日期');
        }

        if (empty($data['installation'])) {
            UtilHelper::echoExitResult($err_code, '请选择房间设施');
        }

        if (empty($data['title'])) {
            UtilHelper::echoExitResult($err_code, '请填写标题');
        }

        $phone = $data['phone'];
        $wx = $data['wx'];
        $qq = $data['qq'];

        //电话、微信、QQ至少填一项
        if (empty($phone) && empty($wx) && empty($qq)) {
            UtilHelper::echoExitResult($err_code, '手机、微信、QQ至少填一项');
        }
        //电话
        if (!empty($phone) && !UtilHelper::isPhone($phone)) {
            UtilHelper::echoExitResult($err_code, '请填写正确的联系电话');
        }

    }

    /**
     * @param $data 发布房源
     */
    static function releaseHouse($data)
    {
        $house = new House();
        $house->house_id = UtilHelper::getGuid();
        $houseId = self::saveHouse($house, $data);
        UtilHelper::echoResult(BizConsts::SUCCESS, BizConsts::SUCCESS_MSG, ['house_id' => $houseId]);
    }

    /**
     * @param $data  修改房源
     */
    static function modifyHouse($data)
    {

        $houseId = $data['house_id'];
        $house = House::find()->where(["house_id" => $houseId])->one();
        self::saveHouse($house, $data);
        UtilHelper::echoResult(BizConsts::SUCCESS, BizConsts::SUCCESS_MSG);
    }

    static function saveHouse($house, $data)
    {
        $userId = UserToken::find()->where(['token' => $data['token']])->one()->user_id;
        $house->user_id = $userId;
        $house->rent_type = $data['rent_type'];
        $house->village = isset($data['village']) ? $data['village'] : '';
        $house->district_code = $data['district_code'];
        $house->address = $data['address'];
        $house->room_num = $data['room_num'];
        $house->hall_num = $data['hall_num'];
        $house->toilet_num = $data['toilet_num'];
        $house->kitchen_type = $data['kitchen_type'];
        $house->area = $data['area'];
        $house->usable_time = $data['usable_date'];
        $house->deadline_time = $data['deadline_date'];
        $house->orientation = $data['orientation'];
        $house->floor = $data['floor'];
        $house->max_floor = $data['max_floor'];
        $house->installation = $data['installation'];
        $house->floor = $data['floor'];
        $house->price = $data['price'];
        $house->pay_mode = $data['pay_mode'];
        $house->title = $data['title'];
        $house->contact = $data['contact'];
        $house->phone = $data['phone'];
        $house->wx = $data['wx'];
        $house->qq = $data['qq'];
        $house->subways = $data['subways'];
        $house->traffic = $data['traffic'];
        if (isset($data['benefit'])) {
            $house->benefit = $data['benefit'];
        }
        if (isset($data['house_desc'])) {
            $house->house_desc = $data['house_desc'];
        }
        $house->create_time = UtilHelper::getTimeStr('YmdHis');
        $house->status = 1;
        $images = explode(',', $data['images']);
        self::updateImages($images, $house->house_id);
        $house->save();
        return $house->house_id;
    }

    static function updateImages($images, $houseId)
    {
        $imgs = Image::find()->where(['in', 'url', $images])->all();
        foreach ($imgs AS $index => $img) {
            $img->source_id = $houseId;
            $img->save();
        }
    }


    static function stickHouse($token, $houseId)
    {
        $userId = UserService::getUserIdByToken($token);
        $house = House::find()
            ->where(['user_id' => $userId, 'house_id' => $houseId])
            ->one();
        $house->update_time = UtilHelper::getTimeStr('YmdHis');
        $house->save();
    }

    static function deleteHouse($token, $houseId)
    {
        $userId = UserService::getUserIdByToken($token);
        $house = House::find()
            ->where(['user_id' => $userId, 'house_id' => $houseId])
            ->one();
        $house->user_delete = true;
        $house->status = 0;
        $house->save();
    }

    static function changeSellState($token, $houseId, $sell)
    {
        $userId = UserService::getUserIdByToken($token);
        $house = House::find()
            ->where(['user_id' => $userId, 'house_id' => $houseId])
            ->one();
        $house->status = $sell;
        if ($sell) {
            $house->update_time = UtilHelper::getTimeStr("Y-m-d H:i:s");
        }
        $house->save();
    }

    /** 举报房源
     * @param $params
     */
    static function complainHouse($params)
    {

        $houseId = $params['house_id'];
        $reason = $params['reason'];
        $phone = $params['phone'];
        $desc = $params['desc'];

        $complain = new Complain();
        $complain->house_id = $houseId;
        if (isset($params['token']) && !empty($params['token'])) {
            $userId = UserService::getUserIdByToken($params['token']);
            if ($userId != null) {
                $complain->user_id = $userId;
            }
        }
        $complain->reason = $reason;
        $complain->desc = $desc;
        $complain->phone = $phone;
        $complain->create_time = UtilHelper::getTimeStr("Y-m-d H:i:s");
        $complain->save();

    }

    static function invalid($val)
    {
        if (isset($val) && $val != "" && $val != "NaN") {
            return false;
        }
        return true;
    }

    static function priceIsValid($price)
    {
        $pattern = '/^(([1-9]{1})[0-9]*)$/';
        return preg_match($pattern, $price);
    }

    static function areaIsValid($area)
    {
        $pattern = '/^(([1-9]{1})[0-9]*)$/';
        return preg_match($pattern, $area);
    }

    static function styleIsValid($style)
    {
        $pattern = '/^[0-9]*$/';
        return preg_match($pattern, $style);
    }
}