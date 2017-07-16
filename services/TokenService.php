<?php
namespace  app\modules\v1\services;

use app\utils\RedisUtil;
use app\models\ManagerToken;
use app\exception\LoginException;
use app\utils\SysConsts;
use app\models\Manager;
class TokenService{
	const REDIS_KEY = 'MANAGER_INFO_';
	const REDIS_TOKEN_EXPIRE = 2592000;//30天过期
    /**
     * 验证token
     * @param  $token
     * @param  $type true 主动退出 false 被动退出
     */
	public static function checkToken($token,$type){
		//取缓存
		$managerInfo = RedisUtil::getCache(self::REDIS_KEY.$token);
		if($managerInfo){
			return json_decode($managerInfo, true);
		}
		//取缓存失败,取DB
		$tokenInfo = ManagerToken::find()->where(['token' => $token, 'token_status' => SysConsts::AVAILABLE])->one();
		if (!$tokenInfo) {
		    //DB获取不到，则根据失效token获取数据
            $expiretokenInfo = ManagerToken::find()->where(['token' => $token,'token_status' => SysConsts::UNAVAILABLE])->one();
            $expiremanagerInfo = self::setTokenCache($expiretokenInfo['manager'], $token);
            if($type){
                $expiremanagerInfo['loginout_type'] = SysConsts::AVAILABLE_TWO;
            }else{
                $expiremanagerInfo['loginout_type'] = SysConsts::AVAILABLE_THREE;
            }
            //插入登出失效token记录
            ManagerService::adduserloginoutlog($expiremanagerInfo,$token);
			throw new LoginException(LoginException::LOGIN_EXPIRE_ERRMSG, LoginException::LOGIN_EXPIRE_ERRCODE);
		}
		if(strtotime($tokenInfo['end_time']) > time()){//如果token有效，验证通过
			$manager = $tokenInfo['manager'];
			$managerInfo = self::setTokenCache($manager, $token);
			return $managerInfo;
		}else{ // 更新token，返回登录态失效
            $manager = $tokenInfo['manager'];
            $managerInfo = self::setTokenCache($manager, $token);
            if($type){
                $managerInfo['loginout_type'] = SysConsts::AVAILABLE_TWO;
            }else{
                $managerInfo['loginout_type'] = SysConsts::AVAILABLE_THREE;
            }
            //插入登出失效token记录
            ManagerService::adduserloginoutlog($managerInfo,$token);
			$tokenInfo->token_status = SysConsts::UNAVAILABLE;
			$tokenInfo->save();
			throw new LoginException(LoginException::LOGIN_EXPIRE_ERRMSG, LoginException::LOGIN_EXPIRE_ERRCODE);
		}
	}
	
	/**
	 * 检查手机号是否可登录
	 * @param unknown $phone
	 */
	public static function checkPhoneValid($phone){
		$managerInfo = Manager::find()->where(['phone' => $phone, 'manager_status' => SysConsts::AVAILABLE])->one();
		if (empty($managerInfo)) {
			throw new LoginException(LoginException::NO_AUTH_PHONE_ERRMSG, LoginException::NO_AUTH_PHONE_ERRCODE);
		}
		return $managerInfo;
	}
	
	/**
	 * 生成token
	 * @param unknown $managerId
	 * @param unknown $token
	 */
	public static function saveToken($managerId,$token){
		$startTime = date('Y-m-d H:i:s');
		$endTime = date('Y-m-d H:i:s',strtotime('+30 day'));
		$mtoken = new ManagerToken();
		$mtoken->manager_id = $managerId;
		$mtoken->token = $token;
		$mtoken->start_time = $startTime;
		$mtoken->end_time = $endTime;
		$mtoken->create_time = $startTime;
		$mtoken->update_time = $startTime;
		$rs = $mtoken->save();
		return $rs;
	}
	
	/**
	 * 设置token缓存
	 * @param unknown $manager
	 * @param unknown $token
	 */
	public static function setTokenCache($manager,$token){
		$managerInfo['id'] = $manager['id'];
		$managerInfo['phone'] = $manager['phone'];
		$managerInfo['email'] = $manager['email'];
		$managerInfo['name'] = $manager['name'];
		//设置token缓存
		RedisUtil::setCache(self::REDIS_KEY.$token, json_encode($managerInfo), self::REDIS_TOKEN_EXPIRE);
		return $managerInfo;
	}

	
}