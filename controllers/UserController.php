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
use app\utils\UtilHelper;
use app\utils\BizConsts;
header("Access-Control-Allow-Origin: *"); # 跨域处理
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

    function actionRelease() {
        try{
            $token = $this->requestParam['token'];
            if (!isset($token) || $token == '') {
                UtilHelper::echoExitResult(BizConsts::UNLOGIN_ERRCODE,BizConsts::UNLOGIN_ERRMSG);
            }
            $data = UserService::getUserReleaseHouse($token);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$data);
        }catch (\Exception $e){
            UtilHelper::handleException($e);
        }
    }

    function actionCollection() {
        try{
            $token = $this->requestParam['token'];
            if (!isset($token) || $token == '') {
                UtilHelper::echoExitResult(BizConsts::UNLOGIN_ERRCODE,BizConsts::UNLOGIN_ERRMSG);
            }
            $data = UserService::getUserCollectionHouse($token);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$data);
        }catch (\Exception $e){
            UtilHelper::handleException($e);
        }

    }

}
