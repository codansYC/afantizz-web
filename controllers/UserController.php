<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/1
 * Time: 下午4:00
 */

namespace app\controllers;

use app\services\UserService;
use Yii;
use yii\web\Controller;

class UserController extends BaseController{

    function actionInfo() {
//        $token = $this->requestParam['token'];
//        $data['num'] = "123";

        $data = UserService::getUserByToken(5);
        $num = count($data);
        $count['num'] = $num;
        echo json_encode($count);
//        try{
//            $token = $this->requestParam['token'];
//            $data = UserService::getUserByToken($token);
//            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$data);
//        }catch (\Exception $e){
//            UtilHelper::handleException($e);
//        }

    }

}