<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/7/27
 * Time: 下午7:15
 */

namespace app\controllers;


use app\models\Coupon;
use app\models\LudaMap;
use app\utils\BizConsts;
use app\utils\GlobalAction;
use app\utils\UtilHelper;
use phpDocumentor\Reflection\Types\Array_;

//header("Access-Control-Allow-Origin: *"); # 跨域处理
class LikingfitController extends BaseController{

    public $coupon_phase = 2;

    // ========== 优惠券 ===========
    function actionIndex() {
        if (isset($this->requestParam['eid'])) {
            $eid = $this->requestParam['eid'];
            echo \Yii::$app->view->renderFile('@app/web/m/getCoupon.html?eid='.$eid);
        } else {
            echo \Yii::$app->view->renderFile('@app/web/m/getCoupon.html');
        }
    }
    function actionGetCoupon() {

        $name = $this->requestParam['name'];
        $phone = $this->requestParam['phone'];
        $price = $this->requestParam['price'];

        //检查用户输入
        if (!isset($name) || $name == "") {
            UtilHelper::echoExitResult(22222, "请输入姓名");
        }
        if (!isset($phone) || $phone == '') {
            UtilHelper::echoExitResult(22222, "请输入手机号");
        }
        if (!UtilHelper::isPhone($phone)) {
            UtilHelper::echoExitResult(22222, "手机号格式不正确");
        }
        //检查数据库
        $isExist = Coupon::find()->where(['phone' => $phone,
            'phase' => $this->coupon_phase])->count() > 0;
        if ($isExist) {
            UtilHelper::echoExitResult(66666, "您已领取过优惠券");
        }
        $totolCount = Coupon::find()->where(['phase' => $this->coupon_phase])->count();
//        if ($totolCount>=300) {
//            UtilHelper::echoExitResult(22222, "优惠券已领完");
//        }
        $coupon = new Coupon();
        $coupon->name = $name;
        $coupon->phone = $phone;
        $coupon->get_date = GlobalAction::getTimeStr("Y-m-d H:i:s");
        $coupon->no = $totolCount+1;
        $coupon->price = $price;
        $coupon->phase = $this->coupon_phase;
        if (isset($this->requestParam['eid'])) {
            $coupon->eid = $this->requestParam['eid'];
        }
        $coupon->save();
        UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
    }

    function actionCoupon() {
        $phone = $this->requestParam['phone'];
        if (!isset($phone) || $phone == '') {
            UtilHelper::echoExitResult(22222, "请求失败");
        }
        if (!UtilHelper::isPhone($phone)) {
            UtilHelper::echoExitResult(22222, "请求失败");
        }
        $coupon = Coupon::find()->where(['phone' => $phone,
            'phase' => $this->coupon_phase])->asArray()->one();
        if (!$coupon) {
            UtilHelper::echoExitResult(22222, "暂时没有优惠券");
        }
        UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$coupon);
    }

    function actionAdmin() {
        try{
            $key = $this->requestParam['key'];
            if (!isset($key) || $key == '') {
                return;
                //UtilHelper::echoExitResult(BizConsts::UNLOGIN_ERRCODE,BizConsts::UNLOGIN_ERRMSG);
            }
            if ($key == 1024) {
                echo \Yii::$app->view->renderFile('@app/web/m/couponAdmin.html');
            } else if ($key == 'map') {
                echo \Yii::$app->view->renderFile('@app/web/m/liking_mapAdmin.html');
            }
        }catch (\Exception $e){
//            UtilHelper::handleException($e);
        }
    }

    function actionCouponList() {
        $list =  Coupon::find()->asArray()->all();
        UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$list);
    }

    function actionUseCoupon() {
        $id = $this->requestParam['id'];
        if (!isset($id) || $id == '') {
            UtilHelper::echoExitResult(22222, "参数错误");
        }
        $coupon = Coupon::find()->where(['id' => $id])->one();
        if (!$coupon) {
            UtilHelper::echoExitResult(22222, "优惠券不存在");
        }
        if ($coupon->phase != $this->coupon_phase) {
            UtilHelper::echoExitResult(22222, "此优惠券已过期");
        }
        $coupon->coupon_state = 0;
        $coupon->update();
        UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,null);

    }

    //======== 地图 =========
    function actionMap() {
        echo \Yii::$app->view->renderFile('@app/web/m/ludamap.html');
    }

    function actionAddPlace() {
        try {
            $name = $this->requestParam['name'];
            $lng = $this->requestParam['lng'];
            $lat = $this->requestParam['lat'];
            $typeName = $this->requestParam['type_name'];
            $typeId = $this->requestParam['type_id'];
            $isShowInMap = $this->requestParam['is_show'];

            $place = new LudaMap();
            $place->name = $name;
            $place->lng = $lng;
            $place->lat = $lat;
            $place->type_name = $typeName;
            $place->type_id = $typeId;
            $place->is_show = $isShowInMap;
            $place->save();
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,null);
        } catch (\Exception $e){
            UtilHelper::handleException($e);
        }
    }

    function actionPlaceList() {
        try {
            $placeByTypes = array();
            $places = LudaMap::find()->asArray()->all();
            foreach ($places as $place) {
                $isExist = false;
                for ($i=0;$i<count($placeByTypes);$i++) {
                    if ($placeByTypes[$i]['type_id'] == $place['type_id']) {
                        $tempPlace = $placeByTypes[$i]['place'];
                        array_push($tempPlace, $place);
                        $placeByTypes[$i]['place'] = $tempPlace;
                        $isExist = true;
                        break;
                    }
                }
                if (!$isExist) {
                    $tempPlace = array();
                    array_push($tempPlace, $place);
                    $newPlaceByType = ['type_id'=>$place['type_id'],
                                        'type_name'=>$place['type_name'],
                                        'place'=>$tempPlace];
                    array_push($placeByTypes,$newPlaceByType);
                }

            }
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$placeByTypes);
        } catch (\Exception $e){
            UtilHelper::handleException($e);
        }
    }

    function actionPlaceDelete() {
        try {
            $id = $this->requestParam['id'];
            $place = LudaMap::findOne($id);
            $place->delete();
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,null);
        } catch (\Exception $e){
            UtilHelper::handleException($e);
        }

    }

    //  =============================
    // 体验卡
    function actionGetTasteCard() {
        try {
            $id = $this->requestParam['id'];
            $place = LudaMap::findOne($id);
            $place->delete();
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,null);
        } catch (\Exception $e){
            UtilHelper::handleException($e);
        }
    }

}