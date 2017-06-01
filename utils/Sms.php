<?php
namespace app\utils;

class Sms {
	// 主帐号
	public  $accountSid = '8a48b55148fe48600149075978d20444';
	
	// 主帐号Token
	public $accountToken = 'b333475b558d4a0ba0db12d5eefb39ef';
	
	// 应用Id
	public $appId = '8a216da85519f45401552918947e0f20';
	
	// 请求地址，格式如下，不需要写https://
	public $serverIP = 'app.cloopen.com';
	
	// 请求端口
	public $serverPort = '8883';
	
	// REST版本号
	public $softVersion = '2013-12-26';
	
	public $REST;
	
	public function __construct(){
		$this->REST = new REST( $this->serverIP, $this->serverPort, $this->softVersion );
		// 初始化REST SDK
		$this->REST->setAccount ( $this->accountSid, $this->accountToken );
		$this->REST->setAppId ( $this->appId );
	} 
	public function test1(){
		var_dump($this->REST);
		return;
	}
	/**
	 * 话单下载
	 *
	 * @param
	 *        	date day 代表前一天的数据（从00:00 – 23:59）;
	 *        	week代表前一周的数据(周一 到周日)；
	 *        	month表示上一个月的数据（上个月表示当前月减1，如果今天是4月10号，则查询结果是3月份的数据）
	 * @param
	 *        	keywords 客户的查询条件，由客户自行定义并提供给云通讯平台。默认不填忽略此参数
	 */
	function billRecords($date, $keywords) {
		// 初始化REST SDK
		global $accountSid, $accountToken, $appId, $serverIP, $serverPort, $softVersion;
		$rest = new REST ( $serverIP, $serverPort, $softVersion );
		$rest->setAccount ( $accountSid, $accountToken );
		$rest->setAppId ( $appId );
	
		// 调用话单下载接口
		$result = $rest->billRecords ( $date, $keywords );
		if ($result == NULL) {
			echo "result error!";
			break;
		}
		if ($result->statusCode != 0) {
			echo "error code :" . $result->statusCode . "<br>";
			echo "error msg :" . $result->statusMsg . "<br>";
			// TODO 添加错误处理逻辑
		} else {
			echo "BillRecords success!<br/>";
			// 获取返回信息
			echo "downUrl:" . $result->downUrl . "<br/>";
			echo "token:" . $result->token . "<br/>";
			// TODO 添加成功处理逻辑
		}
	}
	
	// Demo调用
	// billRecords("话单规则","客户的查询条件");
	/**
	 * 双向回呼
	 *
	 * @param
	 *        	from 主叫电话号码
	 * @param
	 *        	to 被叫电话号码
	 * @param
	 *        	customerSerNum 被叫侧显示的客服号码
	 * @param
	 *        	fromSerNum 主叫侧显示的号码
	 * @param
	 *        	promptTone 自定义回拨提示音
	 */
	function callBack($from, $to, $customerSerNum, $fromSerNum, $promptTone) {
		// 初始化REST SDK
		global $appId, $subAccountSid, $subAccountToken, $voIPAccount, $voIPPassword, $serverIP, $serverPort, $softVersion;
		$rest = new REST ( $serverIP, $serverPort, $softVersion );
		$rest->setSubAccount ( $subAccountSid, $subAccountToken, $voIPAccount, $voIPPassword );
		$rest->setAppId ( $appId );
	
		// 调用回拨接口
		echo "Try to make a callback,called is $to <br/>";
		$result = $rest->callBack ( $from, $to, $customerSerNum, $fromSerNum, $promptTone );
		if ($result == NULL) {
			echo "result error!";
			break;
		}
		if ($result->statusCode != 0) {
			echo "error code :" . $result->statusCode . "<br>";
			echo "error msg :" . $result->statusMsg . "<br>";
			// TODO 添加错误处理逻辑
		} else {
			echo "callback success!<br>";
			// 获取返回信息
			$callback = $result->CallBack;
			echo "callSid:" . $callback->callSid . "<br/>";
			echo "dateCreated:" . $callback->dateCreated . "<br/>";
			// TODO 添加成功处理逻辑
		}
	}
	
	// Demo调用
	// callBack("主叫电话号码","被叫电话号码","被叫侧显示的客服号码","主叫侧显示的号码","自定义回拨提示音");
	
	/**
	 * 创建子帐号
	 *
	 * @param
	 *        	friendlyName 子帐号名称
	 */
	function createSubAccount($friendlyName) {
		// 初始化REST SDK
		global $accountSid, $accountToken, $appId, $serverIP, $serverPort, $softVersion;
		$rest = new REST ( $serverIP, $serverPort, $softVersion );
		$rest->setAccount ( $accountSid, $accountToken );
		$rest->setAppId ( $appId );
	
		// 调用云通讯平台的创建子帐号,绑定您的子帐号名称
		echo "Try to create a subaccount, binding to user $friendlyName <br/>";
		$result = $rest->CreateSubAccount ( $friendlyName );
		if ($result == NULL) {
			echo "result error!";
			break;
		}
		if ($result->statusCode != 0) {
			echo "error code :" . $result->statusCode . "<br/>";
			echo "error msg :" . $result->statusMsg . "<br>";
			// TODO 添加错误处理逻辑
		} else {
			echo "create SubbAccount success<br/>";
			// 获取返回信息
			$subaccount = $result->SubAccount;
			echo "subAccountid:" . $subaccount->subAccountSid . "<br/>";
			echo "subToken:" . $subaccount->subToken . "<br/>";
			echo "dateCreated:" . $subaccount->dateCreated . "<br/>";
			echo "voipAccount:" . $subaccount->voipAccount . "<br/>";
			echo "voipPwd:" . $subaccount->voipPwd . "<br/>";
			// TODO 把云平台子帐号信息存储在您的服务器上.
			// TODO 添加成功处理逻辑
		}
	}
	
	// Demo调用
	// createSubAccount("子帐号名称");
	/**
	 * 获取子帐号
	 *
	 * @param
	 *        	startNo 开始的序号，默认从0开始
	 * @param
	 *        	offset 一次查询的最大条数，最小是1条，最大是100条
	 */
	function getSubAccounts($startNo, $offset) {
		// 初始化REST SDK
		global $accountSid, $accountToken, $appId, $serverIP, $serverPort, $softVersion;
		$rest = new REST ( $serverIP, $serverPort, $softVersion );
		$rest->setAccount ( $accountSid, $accountToken );
		$rest->setAppId ( $appId );
	
		// 调用云通讯平台的获取子帐号接口
		echo "Try to get subaccount list<br/>";
		$result = $rest->getSubAccounts ( $startNo, $offset );
		if ($result == NULL) {
			echo "result error!";
			break;
		}
		if ($result->statusCode != 0) {
			echo "error code :" . $result->statusCode . "<br/>";
			echo "error msg :" . $result->statusMsg . "<br>";
			// TODO 添加错误处理逻辑
		} else {
			echo "get SubbAccount list success<br/>";
			// 获取返回信息
			$subaccount = $result->SubAccount;
			for($i = 0; $i < count ( $subaccount ); $i ++) {
				echo "subAccountid:" . $subaccount [$i]->subAccountSid . "<br/>";
				echo "subToken:" . $subaccount [$i]->subToken . "<br/>";
				echo "dateCreated:" . $subaccount [$i]->dateCreated . "<br/>";
				echo "voipAccount:" . $subaccount [$i]->voipAccount . "<br/>";
				echo "voipPwd:" . $subaccount [$i]->voipPwd . "<br/>";
				echo "friendlyName:" . $subaccount [$i]->friendlyName . "<br/>";
				echo "<br/>";
			}
			// TODO 把云平台子帐号信息存储在您的服务器上.
			// TODO 添加成功处理逻辑
		}
	}
	
	// Demo调用
	// getSubAccounts("开始的序号","一次查询的最大条数");
	/**
	 * IVR外呼
	 *
	 * @param
	 *        	number 待呼叫号码，为Dial节点的属性
	 * @param
	 *        	userdata 用户数据，在<startservice>通知中返回，只允许填写数字字符，为Dial节点的属性
	 * @param
	 *        	record 是否录音，可填项为true和false，默认值为false不录音，为Dial节点的属性
	 */
	function ivrDial($number, $userdata, $record) {
		// 初始化REST SDK
		global $accountSid, $accountToken, $appId, $serverIP, $serverPort, $softVersion;
		$rest = new REST ( $serverIP, $serverPort, $softVersion );
		$rest->setAccount ( $accountSid, $accountToken );
		$rest->setAppId ( $appId );
	
		// 调用IVR外呼接口
		$result = $rest->ivrDial ( $number, $userdata, $record );
		if ($result == NULL) {
			echo "result error!";
			break;
		}
		if ($result->statusCode != 0) {
			echo "error code :" . $result->statusCode . "<br>";
			echo "error msg :" . $result->statusMsg . "<br>";
			// TODO 添加错误处理逻辑
		} else {
			echo "ivrDial success!<br/>";
			// 获取返回信息
			echo "callSid:" . $result->callSid . "<br/>";
			// TODO 添加成功处理逻辑
		}
	}
	
	// Demo调用
	// ivrDial("待呼叫号码","用户数据","是否录音");
	/**
	 * 营销外呼
	 *
	 * @param
	 *        	to 被叫号码
	 * @param
	 *        	mediaName 语音文件名称，格式 wav。与mediaTxt不能同时为空。当不为空时mediaTxt属性失效。
	 * @param
	 *        	mediaTxt 文本内容
	 * @param
	 *        	displayNum 显示的主叫号码
	 * @param
	 *        	playTimes 循环播放次数，1－3次，默认播放1次。
	 * @param
	 *        	respUrl 营销外呼状态通知回调地址，云通讯平台将向该Url地址发送呼叫结果通知。
	 */
	function landingCall($to, $mediaName, $mediaTxt, $displayNum, $playTimes, $respUrl) {
		// 初始化REST SDK
		global $accountSid, $accountToken, $appId, $serverIP, $serverPort, $softVersion;
		$rest = new REST ( $serverIP, $serverPort, $softVersion );
		$rest->setAccount ( $accountSid, $accountToken );
		$rest->setAppId ( $appId );
	
		// 调用营销外呼接口
		echo "Try to make a landingcall,called is $to <br/>";
		$result = $rest->landingCall ( $to, $mediaName, $mediaTxt, $displayNum, $playTimes, $respUrl );
		if ($result == NULL) {
			echo "result error!";
			break;
		}
		if ($result->statusCode != 0) {
			echo "error code :" . $result->statusCode . "<br>";
			echo "error msg :" . $result->statusMsg . "<br>";
			// TODO 添加错误处理逻辑
		} else {
			echo "landingcall success!<br>";
			// 获取返回信息
			$landingCall = $result->LandingCall;
			echo "callSid:" . $landingCall->callSid . "<br/>";
			echo "dateCreated:" . $landingCall->dateCreated . "<br/>";
			// TODO 添加成功处理逻辑
		}
	}
	
	// Demo调用
	// landingCall("被叫号码","语音文件名称","文本内容","显示的主叫号码","循环播放次数","营销外呼状态通知回调地址");
	/**
	 * 主帐号信息查询
	 */
	function queryAccountInfo() {
		// 初始化REST SDK
		global $accountSid, $accountToken, $appId, $serverIP, $serverPort, $softVersion;
		$rest = new REST ( $serverIP, $serverPort, $softVersion );
		$rest->setAccount ( $accountSid, $accountToken );
		$rest->setAppId ( $appId );
	
		// 调用主帐号信息查询接口
		$result = $rest->queryAccountInfo ();
		if ($result == NULL) {
			echo "result error!";
			break;
		}
		if ($result->statusCode != 0) {
			echo "error code :" . $result->statusCode . "<br>";
			echo "error msg :" . $result->statusMsg . "<br>";
			// TODO 添加错误处理逻辑
		} else {
			echo "query AccountInfo success!<br/>";
			// 获取返回信息
			$account = $result->Account;
			echo "friendlyName:" . $account->friendlyName . "<br/>";
			echo "type:" . $account->type . "<br/>";
			echo "status:" . $account->status . "<br/>";
			echo "dateCreated:" . $account->dateCreated . "<br/>";
			echo "dateUpdated:" . $account->dateUpdated . "<br/>";
			echo "balance:" . $account->balance . "<br/>";
			// TODO 添加成功处理逻辑
		}
	}
	
	// Demo调用
	// queryAccountInfo();
	/**
	 * 子帐号信息查询
	 *
	 * @param
	 *        	friendlyName 子帐号名称
	 */
	function querySubAccount($friendlyName) {
		// 初始化REST SDK
		global $accountSid, $accountToken, $appId, $serverIP, $serverPort, $softVersion;
		$rest = new REST ( $serverIP, $serverPort, $softVersion );
		$rest->setAccount ( $accountSid, $accountToken );
		$rest->setAppId ( $appId );
	
		// 调用云通讯平台的子帐号信息查询接口
		echo "Try to query a subaccount : $friendlyName<br/>";
		$result = $rest->querySubAccount ( $friendlyName );
		if ($result == NULL) {
			echo "result error!";
			break;
		}
	
		if ($result->statusCode != 0) {
			echo "error code :" . $result->statusCode . "<br/>";
			echo "error msg :" . $result->statusMsg . "<br>";
			// TODO 添加错误处理逻辑
		} else {
			echo "query SubAccount success<br/>";
			// 获取返回信息
			$subaccount = $result->SubAccount;
			echo "subAccountid:" . $subaccount->subAccountSid . "<br/>";
			echo "subToken:" . $subaccount->subToken . "<br/>";
			echo "dateCreated:" . $subaccount->dateCreated . "<br/>";
			echo "voipAccount:" . $subaccount->voipAccount . "<br/>";
			echo "voipPwd:" . $subaccount->voipPwd . "<br/>";
			// TODO 把云平台子帐号信息存储在您的服务器上.
			// TODO 添加成功处理逻辑
		}
	}
	
	// Demo调用
	// querySubAccount("子帐号名称");
	/**
	 * 发送模板短信
	 *
	 * @param
	 *        	to 手机号码集合,用英文逗号分开
	 * @param
	 *        	datas 内容数据 格式为数组 例如：array('Marry','Alon')，如不需替换请填 null
	 * @param $tempId 模板Id
	 */
	function sendTemplateSMS($to, $datas, $tempId){
		//测试环境不发短信
		if(isset($_SERVER['RUNTIME_ENV']) && $_SERVER['RUNTIME_ENV'] == 'dev' ){
			return true;
		}
		
		// 发送模板短信
		// 	echo "Sending TemplateSMS to $to <br/>";
		$result = $this->REST->sendTemplateSMS ( $to, $datas, $tempId );
	
		return $result;exit();
	}
	// Demo调用
	// sendTemplateSMS("手机号码","内容数据","模板Id");
	
	/**
	 * 语音验证码
	 *
	 * @param
	 *        	verifyCode 验证码内容，为数字和英文字母，不区分大小写，长度4-8位
	 * @param
	 *        	playTimes 播放次数，1－3次
	 * @param
	 *        	to 接收号码
	 * @param
	 *        	displayNum 显示的主叫号码
	 * @param
	 *        	respUrl 语音验证码状态通知回调地址，云通讯平台将向该Url地址发送呼叫结果通知
	 */
	function voiceVerify($verifyCode, $playTimes, $to, $displayNum, $respUrl) {
		// 初始化REST SDK
		global $accountSid, $accountToken, $appId, $serverIP, $serverPort, $softVersion;
		$rest = new REST ( $serverIP, $serverPort, $softVersion );
		$rest->setAccount ( $accountSid, $accountToken );
		$rest->setAppId ( $appId );
	
		// 调用语音验证码接口
		echo "Try to make a voiceverify,called is $to <br/>";
		$result = $rest->voiceVerify ( $verifyCode, $playTimes, $to, $displayNum, $respUrl );
		if ($result == NULL) {
			echo "result error!";
			break;
		}
	
		if ($result->statusCode != 0) {
			echo "error code :" . $result->statusCode . "<br>";
			echo "error msg :" . $result->statusMsg . "<br>";
			// TODO 添加错误处理逻辑
		} else {
			echo "voiceverify success!<br>";
			// 获取返回信息
			$voiceVerify = $result->VoiceVerify;
			echo "callSid:" . $voiceVerify->callSid . "<br/>";
			echo "dateCreated:" . $voiceVerify->dateCreated . "<br/>";
			// TODO 添加成功处理逻辑
		}
	}
}