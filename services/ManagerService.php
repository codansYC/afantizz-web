<?php
namespace app\modules\v1\services;

use Yii;
use app\models\Manager;
use app\utils\SysConsts;
use app\utils\RedisUtil;
use app\models\ManagePlace;
use app\exception\LoginException;
use app\models\ManagerToken;
use app\models\ManagerDevice;
use app\models\ManagerLog;
class ManagerService{
	/*
	 * 根据ID获取管理员
	 */
	public static function get($id){
		return Manager::findOne(['id' => $id]);
	}
	/*
	 * 根据邮箱获取后台人员
	 */
	public static function getByEmail($email){
		$condition = [
			'email' => $email,
			'manager_status' => SysConsts::AVAILABLE
		];
		return Manager::findOne($condition);
	}
	/*
	 * 登录
	 */
	public static function login($email, $password, $token){
		$manager = self::getByEmail($email);
		if(!$manager){
			throw new LoginException(LoginException::NO_MATCH_EMAIL_ERRMSG, LoginException::NO_MATCH_EMAIL_ERRCODE);
		}
		$guid = RedisUtil::getCache($token);
		if(md5($manager['password'].$guid) != $password){
			throw new LoginException(LoginException::PASSWORD_NOT_CORRECT_ERRMSG, LoginException::PASSWORD_NOT_CORRECT_ERRCODE);
		}
		return $manager;
	}
	/*
	 * 登出
	 */
	public static function logout($token, $registrationId = null){
		ManagerToken::updateAll(['token_status' => SysConsts::UNAVAILABLE], ['token' => $token]);
		if (!empty($registrationId)) {
			ManagerDevice::updateAll(['device_status' => ManagerDevice::LOGOUT], ['registration_id' => $registrationId]);
		}
		return;
	}
	/*
	 * 获取人员负责地点
	 */
	public static function getManagerPlace($managerId){
		$managerPlaces = [
			'all' => false,
			'city' => [],
			'district' => [],
			'gym' => []
		];
		$condition = [
			'manager_id' => $managerId,
			'relation_status' => SysConsts::AVAILABLE
		];
		$places = ManagePlace::findAll($condition);
		foreach ($places AS $place){
			switch ($place['place_type']){
				case ManagePlace::ALL : {
					$managerPlaces['all'] = true;
					break;
				}
				case ManagePlace::CITY : {
					$managerPlaces['city'][] = $place['place_id'];
					break;
				}
				case ManagePlace::DISTRICT : {
					$managerPlaces['district'][] = $place['place_id'];
					break;
				}
				case ManagePlace::GYM : {
					$managerPlaces['gym'][] = $place['place_id'];
					break;
				}
			}
		}
		return $managerPlaces;
	}
	/*
	 * 获取人员负责场馆
	 */
	public static function getManagerGym($managerId){
		$place = self::getManagerPlace($managerId);
		$gymList = GymService::getPlaceGym($place);
		return $gymList;
	}

    /*
	 * 添加登录日志
	 */
    public static function adduserloginlog($parmas,$token)
    {
        try{

            $trans = \Yii::$app->db->beginTransaction();

            if(!empty($parmas) && !empty($token)){

                $managerlog  = new ManagerLog();

                $managerlog->userid = $parmas->id;
                $managerlog->username = $parmas->name;
                $managerlog->userphone = $parmas->phone;
                $managerlog->user_ip = self::getClientIP();
                $managerlog->user_token = $token;
                $managerlog->user_type = SysConsts::AVAILABLE;
                $managerlog->loginout_type = SysConsts::AVAILABLE;
                $managerlog->save();

                $trans->commit();
                return;
            }

        } catch( \Exception $e ){
            $trans->rollBack();
            throw $e;
        }
    }

    /*
    * 添加登出日志
    */
    public static function adduserloginoutlog($parmas,$token)
    {
        try{

            $trans = \Yii::$app->db->beginTransaction();

            if(!empty($parmas) && !empty($token)){

                $managerlog  = new ManagerLog();

                $managerlog->userid = $parmas['id'];
                $managerlog->username = $parmas['name'];
                $managerlog->userphone = $parmas['phone'];
                $managerlog->user_ip = self::getClientIP();;
                $managerlog->user_token = $token;
                $managerlog->user_type = SysConsts::AVAILABLE;
                $managerlog->loginout_type = $parmas['loginout_type'];
                $managerlog->save();

                $trans->commit();
                return;
            }

        } catch( \Exception $e ){
            $trans->rollBack();
            throw $e;
        }
    }

    /*
	 * 获取IP方法
	 */
    public static function getClientIP()
    {
        global $ip;
        if (getenv("HTTP_CLIENT_IP"))
            $ip = getenv("HTTP_CLIENT_IP");
        else if(getenv("HTTP_X_FORWARDED_FOR"))
            $ip = getenv("HTTP_X_FORWARDED_FOR");
        else if(getenv("REMOTE_ADDR"))
            $ip = getenv("REMOTE_ADDR");
        else $ip = "Unknow";
        return $ip;
    }
}