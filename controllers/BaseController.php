<?php
namespace  app\controllers;

use Yii;
use yii\web\Controller;
use app\utils\UtilHelper;
use app\utils\RedisUtil;
use app\exception\BaseException;
use app\utils\Logger;
use app\utils\SysConsts;
//use app\modules\v1\exception\LoginException;
//use app\modules\v1\services\TokenService;

/**
 * 基础控制器类，在此做一些拦截操作
 * @author sunqiang@chushi007.com
 *
 */
class BaseController extends  Controller {
	//关闭框架csrf验证
	public $enableCsrfValidation = false;
	//关闭框架layout
	public $layout = false;
	
	protected  $requestParam = array();
	protected  $config = array();
	protected  $managerInfo = array();

	public function beforeAction($action){
		if(!parent::beforeAction($action)){
			return false;
		}
		try {
			$this->requestParam = $_REQUEST;
//	 		self::validParams();//检验参数合法性
//	 		self::filterParams();//过滤参数
//			self::apiConfig($action);//获取接口配置
//	 		self::validRequest();//检验请求的合法性
		} catch (\Exception $e) {
			UtilHelper::handleException($e);
			return false;
		}
		return true;
	}

	public function init(){
	}
	/*
	 * 获取接口配置
	 */
	private function apiConfig($action){
		$controllerName = $this->id;
		$actionName = $action->id;
		$defaultConfig = [
			'needToken' => true,
		];
		$config = array();
		if(isset($this->module->interface[$controllerName]) && isset($this->module->interface[$controllerName][$actionName])){
			$config = $this->module->interface[$controllerName][$actionName];
		}
		foreach ($defaultConfig AS $key => $defaultValue){
			if(!isset($config[$key])){
				$config[$key] = $defaultValue;
			}
		}
		$this->config = $config;
		return;
	}
	/**
	 * 验证请求的合法性
	 */
	private function validRequest(){
		//校验安全参数是否缺失
		if(!isset($this->requestParam['request_id']) || empty($this->requestParam['request_id'])){
			throw new BaseException(BaseException::PARAM_INVALID_ERRMSG, BaseException::PARAM_INVALID_ERRCODE);
		}
		if(!isset($this->requestParam['signature']) || empty($this->requestParam['signature'])){
			throw new BaseException(BaseException::PARAM_INVALID_ERRMSG, BaseException::PARAM_INVALID_ERRCODE);
		}
		if(!isset($this->requestParam['timestamp']) || empty($this->requestParam['timestamp'])){
			throw new BaseException(BaseException::PARAM_INVALID_ERRMSG, BaseException::PARAM_INVALID_ERRCODE);
		}
		if(!isset($this->requestParam['app_version']) || empty($this->requestParam['app_version'])){
			throw new BaseException(BaseException::PARAM_INVALID_ERRMSG, BaseException::PARAM_INVALID_ERRCODE);
		}
		if(!isset($this->requestParam['platform']) || empty($this->requestParam['platform'])){
			throw new BaseException(BaseException::PARAM_INVALID_ERRMSG, BaseException::PARAM_INVALID_ERRCODE);
		}
		$timestamp = $this->requestParam['timestamp'];
		$signature = $this->requestParam['signature'];
		$requestId = $this->requestParam['request_id'];
		$appVersion = $this->requestParam['app_version'];
		$platform = $this->requestParam['platform'];
		
		if(!isset($this->requestParam['check'])){
			//校验请求是否超时
			if(abs(time() - $timestamp) > SysConsts::INTERFACE_TIMEOUT){
				$interval = time() - $timestamp;
				$timeoutLog = 'requestId:'.$requestId.' currentTime:'.time().' requestTime:'.$timestamp.' intervalTime:'.$interval."\n";
				Logger::info($timeoutLog);
				throw new BaseException(BaseException::REQUEST_TIMEOUT_ERRMSG, BaseException::REQUEST_TIMEOUT_ERRCODE);
			}
		}
		//校验签名
		if($signature != $this->__Sign($this->requestParam)){
			throw new BaseException(BaseException::REQUEST_INVALID_ERRMSG, BaseException::REQUEST_INVALID_ERRCODE);
		}
		//登录态下的校验：校验token的有效性、校验请求的合法性，是否请求重放
		if($this->config['needToken']){
			if(empty($this->requestParam['token'])){
				throw new LoginException(LoginException::LOGIN_EXPIRE_ERRMSG, LoginException::LOGIN_EXPIRE_ERRCODE);
			}
			$token = $this->requestParam['token'];
			//校验重放攻击
			self::checkReqId($token,$signature);
			//校验token
			$this->managerInfo = TokenService::checkToken($token,$type=false);
		}
		return;
	}
	/*
	 * 签名生成
	 */
	private function __Sign($param){
		$appkey = self::getAppkey($param['app_version'],$param['platform']);
		$arr = array($appkey,$param['timestamp'],$param['request_id']);
		sort($arr,SORT_STRING);
		$dictStr = implode($arr);
		$sign = sha1($dictStr);
		return $sign;
	}
	
	/**
	 * 校验请求参数
	 */
	private function validParams(){
		//post请求要校验requestParam是否为空
		if(Yii::$app->request->isPost){
			if(empty($this->requestParam)){
				$invalidLog = self::getLogInfo($this->requestParam)."\n";
				Logger::info($invalidLog);
				throw new BaseException(BaseException::PARAM_INVALID_ERRMSG, BaseException::PARAM_INVALID_ERRCODE);
			}
		}
	}
	
	/**
	 * 过滤参数，防止xss等攻击
	 * @param array $requestParam	请求参数
	 */
	private function filterParams(){
		if(\Yii::$app->request->pathInfo == 'v1/index/err-log'){
			return true;
		}
		foreach ($this->requestParam as $reqKey => $reqValue){
			$filterVal = $reqValue;
			if(is_array($reqValue)){
				foreach ($reqValue as  $value){
					$filterVal = $value;
				}
			}
			self::filterReqVal($filterVal);
		}
	}
	
	private function filterReqVal($reqVal){
		$purifier = \HTMLPurifier::getInstance();
		$clean = $purifier->purify($reqVal);
		if($clean != $reqVal){
			throw new BaseException(BaseException::PARAM_INVALID_ERRMSG, BaseException::PARAM_INVALID_ERRCODE);
		}
	}
	
	/**
	 * 登录态下验证signature,请求防刷
	 * @param string 	$token			用户token
	 * @param int 		$signature		当次请求signature
	 */
	private function checkReqId($token,$signature){
		//后续key值要改成REQUEST_HISTORY_USERID，因为token会变化
		$lastSig = RedisUtil::getCache(SysConsts::REQUEST_HISTORY.$token);
		if($lastSig && $signature == $lastSig){
			throw new BaseException(BaseException::REQUEST_INVALID_ERRMSG, BaseException::REQUEST_INVALID_ERRCODE);
		}
		//reset redis signature
		RedisUtil::setCache(SysConsts::REQUEST_HISTORY.$token, $signature, SysConsts::INTERFACE_TIMEOUT);
	}
	
	/**
	 * 构建无效请求Log信息
	 * @param array	 $requestParam	请求参数
	 * @return string	 Log
	 */
	private function getLogInfo(){
		$clientInfo = array();
		$clientInfo['url'] = \Yii::$app->request->url;
		$clientInfo['userAgent'] = \Yii::$app->request->userAgent;
		$clientInfo['userHost'] = \Yii::$app->request->userHost;
		$clientInfo['userIp'] = \Yii::$app->request->userIP;
	
		$logInfo = array();
		$logInfo['requestParam'] = $this->requestParam;
		$logInfo['clientInfo'] = $clientInfo;
	
		return json_encode($logInfo);
	}
	
	/**
	 * 获取对应appkey
	 * @param string $appVersion	
	 * @param string $platform
	 * @return string
	 */
	private function getAppkey($appVersion,$platform){
		$appkeys = json_decode(constant('APPKEY_'.strtoupper($platform)),true);
		
		if(!isset($appkeys[$appVersion])){
			throw new BaseException(BaseException::PARAM_INVALID_ERRMSG, BaseException::PARAM_INVALID_ERRCODE);
		}
		
		return $appkeys[$appVersion];
	}
	
}











