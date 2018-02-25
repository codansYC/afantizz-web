<?php

namespace app\utils;

use Yii;
use app\exception\ParameterException;
use app\exception\OrderException;
use app\exception\CardException;
use yii\db\Exception;
use app\modules\v1\exception\BaseException;

/**
 * 通用方法类
 *
 * @author sunqiang
 *        
 */
class UtilHelper {
	/**
	 * 返回数据出口方法
	 *
	 * @param int $errCode        	
	 * @param string $errMsg        	
	 * @param object $data        	
	 *
	 * @return string json
	 */
	public static function echoResult($errCode, $errMsg = '', $data = null) {
		$result = array ();
		$result ['err_code'] = $errCode;
		$result ['err_msg'] = $errMsg;
		$result ['data'] = $data ? $data : ( object ) $data;
		echo json_encode ( $result );
	}
	
	public static function echoExitResult($errCode, $errMsg = '', $data = null) {
		$result = array ();
		$result ['err_code'] = $errCode;
		$result ['err_msg'] = $errMsg;
		$result ['data'] = $data ? $data : ( object ) $data;
		echo json_encode ( $result );
		exit();
	}
	
	/**
	 * 判断手机号码
	 *
	 * @param string $string        	
	 *
	 * @return bool
	 */
	public static function isPhone($string) {
		return preg_match ( '/^(((1[3|4|5|7|8|9]{1}[0-9]{1}))[0-9]{8})$/', $string );
		// return preg_match('/^1[3589]{1}[0-9]{9}|170[059]{1}[0-9]{8}|177[0-9]{8}$/', $string);
	}
	
	/**
	 * 根据年月获取天数
	 *
	 * @param int $year        	
	 * @param int $month        	
	 *
	 * @return int 该月天数
	 */
	public static function getDaysOfMonth($year, $month) {
		if (in_array ( $month, array (
				1,
				3,
				5,
				7,
				8,
				10,
				12 
		) )) {
			return 31;
		} elseif ($month == 2) {
			if ($year % 400 == 0 || ($year % 4 == 0 && $year % 100 !== 0)) { // 判断是否是闰年
				return 29;
			} else {
				return 28;
			}
		} else {
			return 30;
		}
	}
	
	/**
	 * php curl模拟post提交
	 *
	 * @param string $url
	 *        	http://xxx.xxx.xxx.xx/xx/xxx/top.php
	 * @param array $data
	 *        	需要post的数据
	 *        	
	 * @return mixed
	 */
	public static function curl_post($url, $data) {
		$options = array (
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_HEADER => false,
				CURLOPT_POST => true,
				CURLOPT_POSTFIELDS => $data,
				CURLOPT_URL => $url 
		);
		$ch = curl_init ();
		curl_setopt_array ( $ch, $options );
		$result = curl_exec ( $ch );
		curl_close ( $ch );
		return $result;
	}
	
	/**
	 * php curl模拟get提交
	 *
	 * @param string $url
	 *        	http://xxx.xxx.xxx.xx/xx/xxx/top.php
	 *        	
	 * @return mixed
	 */
	public static function curl_get($url) {
		// echo 'johnsun';
		$options = array (
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_HEADER => false,
				CURLOPT_URL => $url 
		);
		$ch = curl_init ();
		curl_setopt_array ( $ch, $options );
		$result = curl_exec ( $ch );
		curl_close ( $ch );
		return $result;
	}
	
	/**
	 * 获取上月起始日期
	 *
	 * @param '传入当月某天日期' $date        	
	 *
	 * @return array
	 */
	public static function getPreMonthDays($date) {
		$timestamp = strtotime ( $date );
		$firstday = date ( 'Y-m-01', strtotime ( date ( 'Y', $timestamp ) . '-' . (date ( 'm', $timestamp ) - 1) . '-01' ) );
		$lastday = date ( "Y-m-d", strtotime ( "$firstday +1 month -1 day" ) );
		return array (
				'firstday' => $firstday,
				'lastday' => $lastday 
		);
	}
	
	/**
	 * 获取下月起始日期
	 *
	 * @param '传入当月某天日期' $date        	
	 *
	 * @return array
	 */
	public static function getNextMonthDays($date) {
		$timestamp = strtotime ( $date );
		$arr = getdate ( $timestamp );
		if ($arr ['mon'] == 12) {
			$year = $arr ['year'] + 1;
			$month = $arr ['mon'] - 11;
			$firstday = $year . '-0' . $month . '-01';
			$lastday = date ( 'Y-m-d', strtotime ( "$firstday +1 month -1 day" ) );
		} else {
			$firstday = date ( 'Y-m-01', strtotime ( date ( 'Y', $timestamp ) . '-' . (date ( 'm', $timestamp ) + 1) . '-01' ) );
			$lastday = date ( 'Y-m-d', strtotime ( "$firstday +1 month -1 day" ) );
		}
		return array (
				'firstday' => $firstday,
				'lastday' => $lastday 
		);
	}
	
	/**
	 * 获取当月起始日期
	 *
	 * @param '传入当月某天日期 $date        	
	 *
	 * @return array
	 */
	public static function getCurrentMonth($date) {
		$firstday = date ( "Y-m-01", strtotime ( $date ) );
		$lastday = date ( "Y-m-d", strtotime ( "$firstday +1 month -1 day" ) );
		return array (
				'firstday' => $firstday,
				'lastday' => $lastday 
		);
	}
	
	/**
	 * 获取某月所有日期
	 *
	 * @param string $month
	 *        	需要查询的某月:2015-07或2015-07-07
	 * @param string $format
	 *        	返回日期的格式
	 *        	
	 * @return array 本月所有日期
	 */
	public static function getMonthDays($month = 'this month', $format = "Y-m-d") {
		$start = strtotime ( "first day of $month" );
		$end = strtotime ( "last day of $month" );
		$days = array ();
		for($i = $start; $i <= $end; $i += 24 * 3600) {
			$days [] = date ( $format, $i );
		}
		return $days;
	}
	
	/**
	 * 获取未来几天的日期
	 * @param string $format
	 */
	public static function getNextDays($elapse = BizConsts::GYM_COURSE_DAYS,$format = "Ymd n.j") {
		$start = strtotime ( date ( 'Y-m-d' ), time () );
		$dateCfg = ['日','一','二','三','四','五','六'];
		for($i = 0; $i < $elapse; $i ++) {
			$newTimestamp = $start + $i * 24 * 3600;
			$time = date ( $format, $newTimestamp);
			$time = explode(" ",$time);
			$show = '今天';
			if($i > 0){
				$show = $dateCfg[date('w',$newTimestamp)];
			}
			$days [$time[1]] = [
				'date' => $time[1],
				'show' => $show,
				'format' => $time[0]
			];
		}
		return $days;
	}
	
	public static function getWeekDay($date) {
		$wkday_ar = array (
				'周日',
				'周一',
				'周二',
				'周三',
				'周四',
				'周五',
				'周六' 
		);
		$weekDay = date ( 'w', strtotime ( $date ) );
		
		return $wkday_ar [$weekDay];
	}
	
	/**
	 * 汉字切割
	 *
	 * @param
	 *        	unknown object $str
	 * @param
	 *        	unknown object |string $charset
	 *        	
	 * @return string
	 */
	public static function mbstringtoarray($str, $charset = 'utf-8') {
		$array = array ();
		$strlen = mb_strlen ( $str );
		while ( $strlen ) {
			$array [] = mb_substr ( $str, 0, 1, $charset );
			$str = mb_substr ( $str, 1, $strlen, $charset );
			$strlen = mb_strlen ( $str );
		}
		return $array;
	}
	
	/**
	 * 按指定长度切割字符串
	 *
	 * @param '字符串 $str        	
	 * @param int $length        	
	 *
	 * @return string '字符串|string
	 */
	public static function subString($str, $length = 9) {
		$resutl = '';
		if (empty ( $str )) {
			return $resutl;
		}
		$arr = self::mbstringtoarray ( $str );
		if (count ( $arr ) <= $length) {
			return $str;
		}
		$tmp = array_slice ( $arr, 0, $length );
		$resutl = implode ( '', $tmp );
		$resutl .= '...';
		return $resutl;
	}
	
	/**
	 * 异常处理能用方法，在此处可以做log记录
	 *
	 * @param mixed $e
	 *        	抛出的异常
	 */
	public static function handleException($e) {
		Logger::err($e->getMessage());
        echo $e->__toString();
		// DB异常
		if ($e instanceof Exception) {
			UtilHelper::echoResult ( BizConsts::DB_UNREACH_ERRCODE, BizConsts::DB_UNREACH_ERRMSG );
			return;
		}
		if ($e instanceof \RedisException) {
			UtilHelper::echoResult ( BizConsts::REDIS_UNREACH_ERRCODE, BizConsts::REDIS_UNREACH_ERRMSG );
			return;
		}
		if ($e instanceof BaseException || is_subclass_of($e, 'app\modules\v1\exception\BaseException')) {
            UtilHelper::echoResult($e->getCode(), $e->getMessage());
            return;
        }
        if (is_subclass_of($e, 'app\exception\BaseException')) {
        	UtilHelper::echoResult($e->getCode(), $e->getMessage());
        	return;
        }
		UtilHelper::echoResult ( BizConsts::SYSTEM_EXCEPTION_ERRCODE, BizConsts::SYSTEM_EXCEPTION_ERRMSG );
		return;
	}
	
	/**
	 *
	 * @author shihuipeng@chushi007.com
	 *        
	 * @param $e object        	
	 *
	 * @return string
	 */
	public static function getExceptionLog($e) {
		$exceptionLog = array ();
		$exceptionLog ['msg'] = $e->getMessage ();
		$exceptionLog ['file'] = $e->getFile ();
		$exceptionLog ['line'] = $e->getLine ();
		$exceptionLog ['trace'] = $e->getTrace ();
		
		return json_encode ( $exceptionLog );
	}
	
	/**
	 * 获取用户唯一ID
	 */
	public static function getUniqId() {
		$uniq = uniqid ( BizConsts::SERVERPREFIX );
		return $uniq;
	}
	
	/**
	 * 生成地址ID
	 * 生成策略：hostname,timestamp,pid及random全部转为十六进制数
	 * 将上述十六进制数拼接为字符吕，md5取前18位
	 */
	public static function generateAddrId() {
		$hostname = gethostname (); // 机器名
		$timestamp = time (); // 当前时间戳
		$pid = getmypid (); // 执行当前脚本的pid
		$random = mt_rand ( 0, 9999999 ); // 随机数
		$hostnameHex = bin2hex ( $hostname );
		$timestampHex = base_convert ( $timestamp, 10, 16 );
		$pidHex = base_convert ( $pid, 10, 16 );
		$randomHex = base_convert ( $random, 10, 16 );
		
		$addrId = $hostnameHex . $timestampHex . $pidHex . $randomHex;
		$addrId = md5 ( $addrId );
		$addrId = substr ( $addrId, 0, 18 );
		
		return $addrId;
	}
	
	/**
	 * 获取城市区域名称
	 *
	 * @param int $cityId        	
	 * @param int $areaId        	
	 *
	 * @return array
	 */
	public static function getCityAreaInfo($cityId, $areaId) {
		$cities = json_decode ( CITIES, true );
		$cityAreas = json_decode ( CITYAREAS, true );
		
		$cityName = $cities [$cityId];
		$areaInCity = $cityAreas [$cityId];
		$areaName = $areaInCity [$areaId];
		
		return array (
				'cityName' => $cityName,
				'areaName' => $areaName 
		);
	}
	
	/**
	 * 根据地址信息返回高德坐标
	 *
	 * @param string $address        	
	 *
	 * @return array 经纬度
	 */
	public static function getLocationFromAddressByAmap($address) {
		$location = '';
		$url = "http://restapi.amap.com/v3/geocode/geo";
		$data = 'address=' . $address . '&output=json&callback=function&key=' . BizConsts::AMAP_KEY;
		$data = self::curl_post ( $url, $data );
		$data = str_replace ( array (
				'function({',
				'}]})' 
		), array (
				'{',
				'}]}' 
		), $data );
		$data = json_decode ( $data, true );
		if ($data && $data ['info'] == 'OK') {
			$location = $data ['geocodes'] [0] ['location'];
		}
		
		return $location ? explode ( ',', $location ) : array (
				'',
				'' 
		);
	}
	
	/**
	 * 计算两地之间的距离
	 *
	 * @param string $origin
	 *        	起点
	 * @param string $destination
	 *        	终点
	 *        	
	 * @return number 两地距离
	 */
	public static function getLocationDistanceByAmap($origin, $destination) {
		$distance = BizConsts::EMPTY_STR;
		$url = 'http://restapi.amap.com/v3/direction/walking?key=' . BizConsts::AMAP_KEY . '&origin=' . $origin . '&destination=' . $destination;
		$data = self::curl_get ( $url );
		
		$data = json_decode ( $data, true );
		
		if ($data ['status']) {
			$paths = $data ['route'] ['paths'];
			$distance = $paths [0] ['distance'];
		}
		
		return $distance;
	}
	
	/**
	 * 计算两地之间的距离,大厨小灶用,默认距离为false
	 *
	 * @param string $origin
	 *        	起点
	 * @param string $destination
	 *        	终点
	 *        	
	 * @return number 两地距离,为负表示接口返回错误，直接展示超出配送范围
	 */
	public static function getLocationDistanceByAmapChef($origin, $destination) {
		$distance = - 100;
		$url = 'http://restapi.amap.com/v3/direction/walking?key=' . BizConsts::AMAP_KEY . '&origin=' . $origin . '&destination=' . $destination;
		$data = self::curl_get ( $url );
		
		$data = json_decode ( $data, true );
		
		if ($data ['status']) {
			$paths = $data ['route'] ['paths'];
			$distance = $paths [0] ['distance'];
		}
		
		return $distance;
	}
	
	/**
	 * 获取当前位置
	 *
	 * @param '纬度 $latitude        	
	 * @param '经度 $longitude        	
	 *
	 * @return array
	 */
	public static function getCurrentLocationInfo($latitude, $longitude) {
		$url = "http://restapi.amap.com/v3/geocode/regeo?output=json&location=$longitude,$latitude&key=" . BizConsts::AMAP_KEY . '&radius=500&extensions=all';
		$data = self::curl_get ( $url );
		$data = json_decode ( $data, true );
		// $info = BizConsts::LOCATIONERR;
		$result = array (
				'address' => '',
				'addressInfo' => '',
				'cityName' => '',
				'district' => '',
				'dinwei' => 0 
		);
		if ($data ['status']) {
			$info = $data ['regeocode'] ['pois'] [0] ['name']; // 最近的地点
			$result ['addressInfo'] = $info;
			$arr = self::mbstringtoarray ( $info );
			$les = '';
			if (count ( $arr ) > 9) {
				$arr = array_slice ( $arr, 0, 8 );
				$les = '...';
			}
			$info = implode ( '', $arr ) . $les;
			$result ['address'] = $info;
			$areaInfo = $data ['regeocode'] ['addressComponent'];
			$result ['cityName'] = ! empty ( $areaInfo ['city'] ) ? $areaInfo ['city'] : $areaInfo ['province'];
			$result ['district'] = $areaInfo ['district'];
			$result ['dinwei'] = 1;
		}
		return $result;
	}
	
	/**
	 * 通过市、区名获取对应ID
	 *
	 * @param string $areaName
	 *        	区域名
	 * @param string $cityName
	 *        	城市名
	 *        	
	 * @return array
	 */
	public static function getRegionIdsByName($areaName, $cityName) {
		$city_area = json_decode ( CITYAREAS, true );
		$cityId = array_search ( $cityName, json_decode ( CITIES, true ) );
		$areas = $city_area [$cityId];
		$areaId = array_search ( $areaName, $areas );
		
		return array (
				'cityId' => $cityId,
				'districtId' => $areaId 
		);
	}
	
	/**
	 * 根据起始点的经纬度粗略计算两者距离
	 *
	 * @param array $start
	 *        	起点经纬度
	 * @param array $destination
	 *        	目的地经纬度
	 *        	
	 * @return int 两点距离
	 */
	public static function getDistance($start, $destination) {
		$earthRadius = 6378 * 1000;
		
		// deg2rad()函数将角度转换为弧度
		$radLat1 = deg2rad ( $start ['latitude'] );
		$radLat2 = deg2rad ( $destination ['latitude'] );
		$radLng1 = deg2rad ( $start ['longitude'] );
		$radLng2 = deg2rad ( $destination ['longitude'] );
		
		$calcLatitude = $radLat1 - $radLat2;
		$calcLongitude = $radLng1 - $radLng2;
		$distance = round ( 2 * asin ( sqrt ( pow ( sin ( $calcLatitude / 2 ), 2 ) + cos ( $radLat1 ) * cos ( $radLat2 ) * pow ( sin ( $calcLongitude / 2 ), 2 ) ) ) * $earthRadius );
		
		return $distance;
	}
	
	/**
	 * 库存记Log
	 *
	 * @param
	 *        	$filename
	 * @param 'log内容 $str        	
	 * @param
	 *        	$directory
	 *        	
	 * @internal param skuId $skuId
	 */
	public static function writeStockLog($filename, $str, $directory) {
		$logDir = STOCK_RECORD_PATH . $directory . '/';
		if (! file_exists ( $logDir )) {
			@umask ( 0 );
			@mkdir ( $logDir, 0777, true );
		}
		$logName = $logDir . $filename . '.log';
		$fh = fopen ( $logName, "a" );
		@chmod ( $logName, 0766 );
		fwrite ( $fh, $str );
		fclose ( $fh );
	}
	
	/**
	 * 写基础Log
	 *
	 * @param
	 *        	$log
	 *        	
	 */
	public static function writeBaseLog($log) {
		$logDir = dirname ( __FILE__ ) . '/../logs/' . date ( 'Ymd' ) . '/';
		if (! file_exists ( $logDir )) {
			@umask ( 0 );
			@mkdir ( $logDir, 0777, true );
		}
		$logName = $logDir . 'base.log';
		$fh = fopen ( $logName, "a" );
		@chmod ( $logName, 0766 );
		fwrite ( $fh, $log );
		fclose ( $fh );
	}
	
	/**
	 * 校验验证码是否六位数字
	 *
	 * @param string $captcha        	
	 *
	 * @return bool
	 */
	public static function checkCaptcha($captcha) {
		return preg_match ( "/^\\d{6}$/", $captcha );
	}
	
	/**
	 * 登录校验
	 *
	 * @param string $phone
	 *        	手机号
	 * @param string $captcha
	 *        	验证码
	 */
	public static function validLogin($phone, $captcha) {
		// 检验是否正确手机号
		if (! self::isPhone ( $phone )) {
			self::echoExitResult( BizConsts::INVALID_PHONE_ERRCODE, BizConsts::INVALID_PHONE_ERRMSG );
		}
		// 检验是否有效验证码，必须是6位数字
		if (! self::checkCaptcha ( $captcha )) {
		    echo $captcha;
			self::echoExitResult( BizConsts::INVALID_CAPTCHA_ERRCODE, BizConsts::INVALID_CAPTCHA_ERRMSG );
		}
		/*
		// 检验验证码是否已过期
		$validCaptcha = RedisUtil::getCache ( BizConsts::USER_LOGIN_VERIFY . $phone );
		if (! $validCaptcha) {
			self::echoExitResult( BizConsts::EXPIRE_CAPTCHA_ERRCODE, BizConsts::EXPIRE_CAPTCHA_ERRMSG );
		}
		// 校验输入的验证码是否正确
		if ($captcha != $validCaptcha) {
			self::echoExitResult( BizConsts::WRONG_CAPTCHA_ERRCODE, BizConsts::WRONG_CAPTCHA_ERRMSG );
		}
		*/
	}
	
	/**
	 * 生成用户token
	 *
	 * @param string $userId
	 *        	用户ID
	 * @param string $phone
	 *        	用户号码
	 *        	
	 * @return string 用户Token
	 */
	public static function generateToken($userId, $phone) {
		$arr = array (
				$userId,
				$phone,
				time () 
		);
		sort ( $arr, SORT_STRING );
		$dictStr = implode ( $arr );
		$token = md5 ( $dictStr );
		
		return $token;
	}
	
	/**
	 * 获取GUID
	 *
	 * @param bool $bigint
	 *        	true:unsigned bigint false:unsigned int
	 * @return number guid
	 */
	public static function getGuid($bigint = false) {
		/*
		 * Time - 41 bits
		 */
		$time = floor ( microtime ( true ) * 1000 );
		
		/*
		 * Substract custom epoch from current time
		 */
		$time -= BizConsts::EPOCH;
		
		/*
		 * Create a base and add time to it
		 */
		$base = decbin ( pow ( 2, 40 ) - 1 + $time );
		/*
		 * Configured machine id - 10 bits - up to 512 machines
		 */
		$machineid = decbin ( pow ( 2, 9 ) - 1 + MACHINE_ID );
		
		// Configured machine id - 10 bits - up to 1024 machines
		// $machineid = decbin(MACHINE_ID);
		// $len = strlen($machineid);
		// $placeholder = '';
		// if($len < 10){
		// $interval = 10 - $len;
		// for ($i = 0 ; $i < $interval; $i++){
		// $placeholder .= '0';
		// }
		// }
		// $machineid = $placeholder.$machineid;
		
		/*
		 * sequence number - 12 bits - up to 2048 random numbers per machine
		 */
		$random = mt_rand ( 1, pow ( 2, 11 ) - 1 );
		$random = decbin ( pow ( 2, 11 ) - 1 + $random );
		/*
		 * Pack
		 */
		$base = $base . $machineid . $random;
		/*
		 * Return unique time id no
		 */
		$id = bindec ( $base );
		
		if (! $bigint) {
			$id = $id % 10000000000;
			if ($id >= 4294967295) {
				$id = $id % 1000000000;
			}
		}
		
		return $id;
	}
	
	/**
	 * 检验地址相关参数
	 *
	 * @param
	 *        	unknown object $userAddr
	 */
	public static function validAddress($userAddr) {
		$phone = $userAddr ['phone'];
		$address = $userAddr ['address'];
		$userName = $userAddr ['userName'];
		if (! UtilHelper::isPhone ( $phone )) {
			self::echoResult ( BizConsts::INVALID_PHONE_ERRCODE, BizConsts::INVALID_PHONE_ERRMSG );
		}
		
		if (empty ( $address )) {
			self::echoResult ( BizConsts::ADDRESS_EMPTY_ERRCODE, BizConsts::ADDRESS_EMPTY_ERRMSG );
		}
		
		if (empty ( $userName )) {
			self::echoResult ( BizConsts::ADDRESS_NAMEEMPTY_ERRCODE, BizConsts::ADDRESS_NAMEEMPTY_ERRMSG );
		}
	}
	public static function getProjectPicPath() {
		return Yii::getAlias ( '@app' ) . '/web/img/';
	}
	
	/**
	 * 取结果的前16位
	 */
	public static function generateMsgId() {
		$msgId = substr ( self::generateId (), 0, 16 );
		return $msgId;
	}
	
	/**
	 * 生成唯一ID
	 * 生成策略：hostname,timestamp,pid及random字典升序排序取sha1值
	 *
	 * @return string
	 */
	public static function generateId() {
		$hostname = gethostname (); // 机器名
		$timestamp = microtime (); // 当前时间戳
		$timestamp = preg_replace ( "/\s/", "", $timestamp ); // 去除空格
		$pid = getmypid (); // 执行当前脚本的pid
		$random = mt_rand ( 0, 99999999 ); // 随机数
		
		$arr = array (
				$hostname,
				$timestamp,
				$pid,
				$random 
		);
		sort ( $arr, SORT_STRING );
		$dictStr = implode ( $arr );
		$msgId = sha1 ( $dictStr );
		
		return $msgId;
	}
	
	/**
	 * 将返回数据中的null转换为空字符串
	 *
	 * @param array $records        	
	 *
	 * @return array
	 */
	public static function formatNulltoEmptyStr($records) {
		foreach ( $records as $index => $record ) {
			foreach ( $record as $key => $value ) {
				if (is_null ( $value )) {
					$record [$key] = '';
				}
			}
			$records [$index] = $record;
		}
		return $records;
	}
	
	/**
	 * 按指定格式返回排期时间
	 *
	 * @param
	 *        	array	排期时间 $scheduleDate
	 * @return array
	 */
	public static function formatScheduleDate($scheduleDate) {
		$today = date('w');
		$fomat = "";
		$scheduleTime = strtotime ( $scheduleDate );
		$scheduleDay = date ( 'w', $scheduleTime );
		$scheduleDay = $scheduleDay ? $scheduleDay : 7;
		$interval = $scheduleDay - $today;
		switch ($interval) {
			case 0 :
				$format = '今天';
				break;
			case 1 :
				$format = '明天';
				break;
			default :
				$format = date('Y-m-d',$scheduleTime);
				break;
		}
		
		return $format;
	}
	
	public static function getCardTime($startTime,$categoryId,$operateType){
		$endTime = self::getCardDeadline($startTime,$categoryId);
		if(BizConsts::CARD_PUCHASE == $operateType){
			$cardTime = "即日起" . " ~ " . $endTime;
		}else{
			$cardTime = $startTime . " ~ " . $endTime;
		}
		
		return $cardTime;
	}
	
	public static function getCardDeadline($startTime,$categoryId){
		switch ($categoryId) {
			case 1000 :
				$endTime = date ( "Y-m-d", strtotime ( "+1 month", strtotime($startTime)) );
				break;
			case 2000 :
				$endTime = date ( "Y-m-d", strtotime ( "+3 month", strtotime($startTime) ) );
				break;
			case 3000 :
				$endTime = date ( "Y-m-d", strtotime ( "+6 month", strtotime($startTime) ) );
				break;
			case 4000 :
				$endTime = date ( "Y-m-d", strtotime ( "+1 year", strtotime($startTime) ) );
				break;
			default :
				self::echoResult ( BizConsts::PARAM_INVALID_ERRCODE, BizConsts::PARAM_INVALID_ERRMSG );
				break;
		}
		
		$endTime = date("Y-m-d",strtotime($endTime." -1 day"));
		
		return $endTime;
	}
	
	/**
	 * 数字转字母
	 * @param unknown $in
	 * @param string $to_num
	 * @param string $pad_up
	 * @param string $passKey
	 * @return string
	 */
	public static function alphaID($in, $to_num = false, $pad_up = false, $passKey = null)
	{
		$index = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
		if ($passKey !== null) {
			for ($n = 0; $n<strlen($index); $n++) {
				$i[] = substr( $index,$n ,1);
			}
	
			$passhash = hash('sha256',$passKey);
			$passhash = (strlen($passhash) < strlen($index))
			? hash('sha512',$passKey)
			: $passhash;
	
			for ($n=0; $n < strlen($index); $n++) {
				$p[] =  substr($passhash, $n ,1);
			}
	
			array_multisort($p,  SORT_DESC, $i);
			$index = implode($i);
		}
	
		$base  = strlen($index);
	
		if ($to_num) {
			// Digital number  <<--  alphabet letter code
			$in  = strrev($in);
			$out = 0;
			$len = strlen($in) - 1;
			for ($t = 0; $t <= $len; $t++) {
				$bcpow = bcpow($base, $len - $t);
				$out   = $out + strpos($index, substr($in, $t, 1)) * $bcpow;
			}
	
			if (is_numeric($pad_up)) {
				$pad_up--;
				if ($pad_up > 0) {
					$out -= pow($base, $pad_up);
				}
			}
			$out = sprintf('%F', $out);
			$out = substr($out, 0, strpos($out, '.'));
		} else {
			// Digital number  -->>  alphabet letter code
			if (is_numeric($pad_up)) {
				$pad_up--;
				if ($pad_up > 0) {
					$in += pow($base, $pad_up);
				}
			}
	
			$out = "";
			for ($t = floor(log($in, $base)); $t >= 0; $t--) {
				$bcp = bcpow($base, $t);
				$a   = floor($in / $bcp) % $base;
				$out = $out . substr($index, $a, 1);
				$in  = $in - ($a * $bcp);
			}
			$out = strrev($out); // reverse
		}
	
		return $out;
	}
	
	/**
	 * 校验当前时间点是否可用
	 * @param unknown $time  时间 11:00
	 * @return true 有效  false 无效
	 */
	public static function checkCurrentTimeInFreetime($time,$date=''){
		$result = false;
		$freeTime = array();
		$freeDay = \Yii::$app->params['free_day'];
		$dateTimestamp = time();
		if(!empty($date)){
			$dateTimestamp = strtotime($date);
		}
		$weekDay = date('w',$dateTimestamp);
		if(!in_array($weekDay, $freeDay)){
			$freeTime = \Yii::$app->params['free_time'];
		}else{
			$result = true;
			return $result;
		}
		foreach ($freeTime as $val){
			if($time>=$val[0] && $time <= $val[1]){
				$result = true;
				break;
			}
		}
		return $result;
	}
	
	/**
	 * 检查一个字符串是否为正整数
	 * @param unknown $number
	 */
	public static function checkIntType($number){
		if(is_numeric($number) && strpos($number,".")==false){
			return ($number>0)?true:false;
		}else{
			return false;
		}
	}
	
	/**
	 * 随机获取字符串
	 * @param unknown $length
	 * @return Ambigous <NULL, string>
	 */
	public static function getRandChar($length){
		$str = null;
		$strPol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
		$max = strlen($strPol)-1;
	
		for($i=0;$i<$length;$i++){
			$str.=$strPol[rand(0,$max)];//rand($min,$max)生成介于min和max两个数之间的一个随机整数
		}
	
		return $str;
	}
	
	/**
	 * 格式化距离
	 * @param unknown $distance
	 */
	public static function formateDistance($distance){
		$result = '';
		if($distance==0){
			return $result;
		}
		if($distance<1000){
			$result = $distance.'m';
		}else{
			$result = round($distance/1000,2).'km';
		}
		return $result;
	}
	/*
	 * 格式化日期
	 * 20160101 => 2016-01-01
	 */
	public static function FormatDate($date){
		$year = substr($date, 0, 4);
		$month = substr($date, 4, 2);
		if(!$month){
			$month = '01';
		}
		$day = substr($date, 6, 2);
		if(!$day){
			$day = '01';
		}
		return "$year-$month-$day";
	}

    /** 获取时间字符串
     * @param string $format 日期格式
     * @return bool|string    日期
     */
    static function getTimeStr($format="YmdHi") {
        date_default_timezone_set("Asia/Shanghai");
        return date($format);
    }


    /** 根据district_code 获取 district
     * @param $code  区县代号
     */
    static function getDistrictByCode($code) {
        $districts = \Yii::$app->params['districts'];
        return $districts[$code];
    }
}



















