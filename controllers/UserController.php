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
use app\utils\BizConsts;

class UserController extends BaseController{

    function actionInfo() {
        try{
            $token = $this->requestParam['token'];
            $data = UserService::getUserByToken($token);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$data);
        }catch (\Exception $e){
            UtilHelper::handleException($e);
        }

    }

}