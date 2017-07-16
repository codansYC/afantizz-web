<?php
namespace app\controllers;

use app\services\CaptchaService;
use app\services\UserService;
use app\utils\GlobalAction;
use Yii;
use app\utils\UtilHelper;
use app\utils\BizConsts;
use app\utils\RedisUtil;
use app\utils\Sms;
use app\utils\SysConsts;
use app\services\TokenService;
use app\exception\LoginException;
use app\services\ManagerService;
header("Access-Control-Allow-Origin: *"); # 跨域处理
class LoginController extends BaseController{

	/**
	 * 获取验证码
	 */
	public function actionCaptcha(){
		try{
			if (! isset ( $this->requestParam ['phone'] ) || empty ( $this->requestParam ['phone'] )) {
				UtilHelper::echoExitResult(BizConsts::PARAM_INVALID_ERRCODE, BizConsts::PARAM_INVALID_ERRMSG );
			}
			$phone = $this->requestParam['phone'];

			if(!UtilHelper::isPhone($phone)){
				UtilHelper::echoExitResult(BizConsts::INVALID_PHONE_ERRCODE,BizConsts::INVALID_PHONE_ERRMSG);
			}
			/*
			TokenService::checkPhoneValid($phone);  //检查该手机号权限
			*/

//			$captcha = mt_rand(0,9).mt_rand(10000, 99999)
            if (BizConsts::APPLE_WHITELIST_PHONE == $phone) {
                UtilHelper::echoExitResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
                return;
            }
            $captcha = CaptchaService::createCaptchaWithPhone($phone);

            /*这里有点问题  改为下面存数据库的方式
			RedisUtil::setCache(BizConsts::USER_LOGIN_VERIFY.$phone,$captcha,BizConsts::CAPTCHA_AVAILABLE);
            */

			// 发送动态验证码
			$sms = new Sms();
			$result = $sms->sendTemplateSMS($phone, [$captcha], BizConsts::SMS_VERIFY_TEMPLATE);

			if($result){
				if(isset($_SERVER['RUNTIME_ENV']) && $_SERVER['RUNTIME_ENV'] == 'dev' ){
					UtilHelper::echoExitResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,array('captcha' => $captcha));
				}else{
					if(BizConsts::APPLE_WHITELIST_PHONE == $phone){
						UtilHelper::echoExitResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,array('captcha' => $captcha));
					}
					UtilHelper::echoExitResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
				}
			}

			UtilHelper::echoExitResult(BizConsts::GET_CAPTCHA_ERRCODE,BizConsts::GET_CAPTCHA_ERRMSG);
		}catch (\Exception $e){
			UtilHelper::handleException($e);
		}
	}
	
	/**
	 * 登录接口
	 */
	public function actionLogin(){
		try {

			$phone = $this->requestParam['phone'];
			$captcha = $this->requestParam['captcha'];
            $valid = true;
			if(BizConsts::APPLE_WHITELIST_PHONE != $phone ){
				UtilHelper::validLogin($phone,$captcha);//校验手机号及验证码
                $valid = CaptchaService::checkPhoneAndCaptcha($phone,$captcha);
			}

            if (!$valid) {
                UtilHelper::echoExitResult(BizConsts::WRONG_CAPTCHA_ERRCODE,BizConsts::WRONG_CAPTCHA_ERRMSG);
            }
            $user = UserService::getUserByPhone($phone);
            if (!$user) {
                UserService::addNewUserWithPhone($phone);
                $user = UserService::getUserByPhone($phone);
            }
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$user);
            /*
			$manager = TokenService::checkPhoneValid($phone);
			$token = UtilHelper::generateToken($manager['id'], $manager['phone']);
			$ts = TokenService::saveToken($manager['id'], $token);
			if(!$ts){
				throw new LoginException(LoginException::LOGIN_FAIL_ERRMSG,LoginException::LOGIN_FAIL_ERRCODE);
			}
            //插入login log（登录日志）
            ManagerService::adduserloginlog($manager,$token);
            TokenService::setTokenCache($manager, $token);
			RedisUtil::delCache(BizConsts::USER_LOGIN_VERIFY.$phone); //验证码无效
			$data['token'] = $token;
			$data['name'] = $manager['name'];
			UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$data);
            */
		} catch (\Exception $e) {
			UtilHelper::handleException($e);
		}
	}
	/*
	 * 登出
	 */
	public function actionLogout(){
		try {
			$token = $this->requestParam['token'];
			$registrationId = isset($this->requestParam['registration_id']) ? $this->requestParam['registration_id'] : null;
            //插入loginout log（登出日志）
			$managerInfo = TokenService::checkToken($token,$type=false);
            $managerInfo['loginout_type'] = SysConsts::AVAILABLE_TWO;
            ManagerService::adduserloginoutlog($managerInfo,$token);
			ManagerService::logout($token, $registrationId);
			UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
		} catch (\Exception $e) {
			UtilHelper::handleException($e);
		}
	}
}