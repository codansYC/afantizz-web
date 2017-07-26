<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/21
 * Time: 下午10:58
 */

namespace app\controllers;

use app\models\Facility;
use app\utils\UtilHelper;
use app\utils\BizConsts;
use app\utils\GlobalAction;
use app\models\House;

class AdminController extends BaseController
{
    public function actionAdmin()
    {
        echo \Yii::$app->view->renderFile('@app/web/pc/admin.html');
    }

    public function actionRelease()
    {
        try {
            $params = $this->requestParam;
            self::validData($params);
            self::releaseHouse($params);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    function validData($data)
    {

        //错误码和错误信息
        $err_code = BizConsts::RELEASE_HOUSE_ERRCODE;
        $err_msg = BizConsts::RELEASE_HOUSE_ERRMSG;

        $village = $data['village'];
        $address = $data['address'];
        $style = $data['style'];
        $area = $data['area'];

        $usableDate = $data['usable_date'];
        $deadline = $data['deadline_date'];
        $floor = $data['floor'];
        $max_floor = $data['max_floor'];
        $facilities = $data['facilities'];

        $price = $data['price'];

        $payMode = $data['pay_mode'];

        $title = $data['title'];

        $phone = $data['phone'];
        $wx = $data['wx'];
        $qq = $data['qq'];

        $release_date = $data['release_date'];
        //地址
        if (self::invalid($address)) {
            UtilHelper::echoExitResult($err_code, '请填写详细地址');
        }
        //户型
//        $room = explode('室', $style);
//        if (count($room) < 2) {
//            UtilHelper::echoExitResult($err_code, '请完善房间户型');
//        } else if (!GlobalAction::isNumber($room[0])) {
//            UtilHelper::echoExitResult($err_code, '房间户型请填入正确的数字');
//        }
//
//        $hall = explode('厅', $room[1]);
//        if (count($hall) < 2) {
//            UtilHelper::echoExitResult($err_code, '请完善房间户型');
//        } else if (!GlobalAction::isNumber($hall[0])) {
//            UtilHelper::echoExitResult($err_code, '房间户型请填入正确的数字');
//        }
//
//        $toilet = explode('卫', $hall[1]);
//        if (count($hall) < 2) {
//            UtilHelper::echoExitResult($err_code, '请完善房间户型');
//        } else if (!GlobalAction::isNumber($toilet[0])) {
//            UtilHelper::echoExitResult($err_code, '房间户型请填入正确的数字');
//        }


        //面积
//        if (self::invalid($area)) {
//            UtilHelper::echoExitResult($err_code, '请填写房间可使用面积');
//        } else if (!self::areaIsValid($area)) {
//            UtilHelper::echoExitResult($err_code, '请填写正确的房间面积');
//        }
        //可入住时间
        if (self::invalid($usableDate)) {
            UtilHelper::echoExitResult($err_code, '请选择可入住日期');
        }

        //房间设施
        if (self::invalid($facilities) || count($facilities) == 0) {
            UtilHelper::echoExitResult($err_code, '请选择房间设施');
        }
        //价格
        if (self::invalid($price)) {
            UtilHelper::echoExitResult($err_code, '请填写房间租金');
        } else if (!self::priceIsValid($price)) {
            UtilHelper::echoExitResult($err_code, '请填写正确的房间租金');
        }
        //支付方式
        if (self::invalid($payMode)) {
            UtilHelper::echoExitResult($err_code, '请填写支付方式');
        }
        //标题
        if (self::invalid($title)) {
            UtilHelper::echoExitResult($err_code, '请填写标题');
        }

        //发布时间
        if (self::invalid($release_date)) {
            UtilHelper::echoExitResult($err_code, '请填写发布时间');
        }

        //电话、微信、QQ至少填一项
        if (self::invalid($phone) && self::invalid($wx) && self::invalid($qq)) {
            UtilHelper::echoExitResult($err_code,'手机、微信、QQ至少填一项');
        }
        //电话
        if (!self::invalid($phone) && !UtilHelper::isPhone($phone)) {
            UtilHelper::echoExitResult($err_code,'请填写正确的联系电话');
        }
    }

    static function releaseHouse($data)
    {
        $house = new House();
        self::saveHouse($house,$data);
        UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
    }

    function invalid($val) {
        if (isset($val) && $val != "" && $val != "NaN") {
            return false;
        }
        return true;
    }

    function saveHouse($house,$data) {

        $house->rent_mode = $data['rent_mode'];
        $house->village = $data['village'];
        $house->address = $data['address'];
        $house->district = $data['district'];
        $house->style = $data['style'];
        $house->area = $data['area'];
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
        $house->orientation = $data['orientation'];
        $house->traffic = $data['traffic'];
        $house->subways = isset($data['subways']) ? $data['subways'] : "";
        $house->sell_state = '在架';
        $house->release_date = $data['release_date'];
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
        $house->save();
        $houseId = $house->attributes['house_id'];
        self::saveFacilities($data['facilities'],$houseId);
    }

    function saveFacilities($facilities, $houseId) {
        foreach ($facilities AS $index => $f) {
            if ($f == '') {
                continue;
            }
            $facility = new Facility();
            $facility->house_id = $houseId;
            $facility->name = $f;
            $facility->save();
        }
    }

    function priceIsValid($price) {
        $pattern = '/^(([1-9]{1})[0-9]*)$/';
        return preg_match($pattern,$price);
    }
    function areaIsValid($area) {
        $pattern = '/^(([1-9]{1})[0-9]*)$/';
        return preg_match($pattern,$area);
    }
    function styleIsValid($style) {
        $pattern = '/^[0-9]*$/';
        return preg_match($pattern,$style);
    }

    //用于将房间设施移到facility表
    function actionMove() {
        $houseList = House::find()->all();
        foreach ($houseList AS $index => $house) {
            $houseId = $house->house_id;
            $facilities = explode(';',$house->facilities);
            self::saveFacilities($facilities,$houseId);
        }
    }
}