<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/7/27
 * Time: 下午7:15
 */

namespace app\controllers;


use app\models\Coupon;
use app\utils\BizConsts;
use app\utils\GlobalAction;
use app\utils\UtilHelper;
//header("Access-Control-Allow-Origin: *"); # 跨域处理
class LikingfitController extends BaseController{

    function actionIndex() {
        echo \Yii::$app->view->renderFile('@app/web/m/getCoupon.html');
    }
    function actionGetCoupon() {

        $name = $this->requestParam['name'];
        $phone = $this->requestParam['phone'];
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
        $isExist = Coupon::find()->where(['phone' => $phone])->count() > 0;
        if ($isExist) {
            UtilHelper::echoExitResult(66666, "您已领取过优惠券");
        }
        $totolCount = Coupon::find()->count();
//        if ($totolCount>=300) {
//            UtilHelper::echoExitResult(22222, "优惠券已领完");
//        }
        $coupon = new Coupon();
        $coupon->name = $name;
        $coupon->phone = $phone;
        $coupon->get_date = GlobalAction::getTimeStr("Y-m-d H:i:s");
        $coupon->no = $totolCount+1;
        $coupon->coupon_state = 1;
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
        $coupon = Coupon::find()->where(['phone' => $phone])->asArray()->one();
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
        $coupon->coupon_state = 0;
        $coupon->update();
        UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,null);

    }

    function actionMap() {
        echo \Yii::$app->view->renderFile('@app/web/m/ludamap.html');
    }
}