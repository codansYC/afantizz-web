<?php
namespace  app\exception;

use app\utils\ExceptionConsts;
use app\utils\Logger;

class BaseException extends \Exception { 
	public function __construct($message,$code = ExceptionConsts::PARAM_EXCEPTION_ERRCODE){
// 		Logger::info($message);
		parent::__construct($message,$code);
	}
	
}
