<?php

namespace app\utils;

use Yii;

$yii = dirname ( __FILE__ ) . '/../vendor/yiisoft/yii2/Yii.php';
require_once ($yii);

defined ( 'LOG_ROOT' ) or define ( "LOG_ROOT", dirname ( __FILE__ ) . "/../logs/" );

/**
 * 通用Log类
 *
 * @author sunqiang@chushi007.com
 *        
 */
class Logger {
	const INFO = 0;
	const WARN = 1;
	const ERR = 2;
	const FATAL = 3;
	private $level;
	private $logDate;
	private $logFile;
	private $logFileName;
	private $ip;
	private static $log;
	private $records = array ();
	private $maxRecordCount = 1;
	private $curRecordCount = 0;
	private $processID = '0';
	
	function __construct($logname = '') {
		if (! empty ( self::$log )) {
			return;
		}
		
		if (strlen ( $logname )) {
			$logname = self::_transFilename ( $logname );
			$logname = basename ( $logname, '.log' );
		} else {
			if (Yii::$app) {
				$controller = Yii::$app->controller;
				$controllerId = $controller->id;
				$action = $controller->action;
				$actionId = $action->id;
				$logname = $controllerId . "_" . $actionId;
			} else {
				$logname = basename ( $_SERVER ['SCRIPT_FILENAME'], '.php' );
			}
		}
		$this->logFileName = $logname . '.log';
		$this->level = defined ( 'LOG_LEVEL' ) ? LOG_LEVEL : self::ERR;
		$this->ip = Yii::$app->request->userIP;
		$this->processID = str_pad ( (function_exists ( 'posix_getpid' ) ? posix_getpid () : 0), 5 );
		
		self::$log = $this;
	}
	
	function __destruct() {
		if ($this->curRecordCount > 0) {
			if (empty ( $this->logFile ) || $this->logDate != date ( 'Ymd' )) {
				if (! empty ( $this->logFile )) {
					fclose ( $this->logFile );
				}
				$this->_setHandle ();
			}
			
			$str = implode ( "\n", $this->records );
			fwrite ( $this->logFile, $str . "\n" );
			$this->records = array ();
			$this->curRecordCount = 0;
		}
		
		if (! empty ( $this->logFile )) {
			fclose ( $this->logFile );
		}
	}
	
	private function _setHandle() {
		$this->logDate = date ( 'Ymd' );
		$logDir = LOG_ROOT . $this->logDate . '/';
		
		if (! file_exists ( $logDir )) {
			@umask ( 0 );
			@mkdir ( $logDir, 0777, true );
		}
		/*这句不知道什么问题*/
//		$this->logFile = fopen ( $logDir . $this->logFileName, 'a' );
	}
	
	private function _transFilename($filename) {
		if (! strlen ( $filename )) {
			return $filename;
		}
		
		$filename = str_replace ( '\\', '#', $filename );
		$filename = str_replace ( '/', '#', $filename );
		$filename = str_replace ( ':', ';', $filename );
		$filename = str_replace ( '"', '$', $filename );
		$filename = str_replace ( '*', '@', $filename );
		$filename = str_replace ( '?', '!', $filename );
		$filename = str_replace ( '>', ')', $filename );
		$filename = str_replace ( '<', '(', $filename );
		$filename = str_replace ( '|', ']', $filename );
		
		return $filename;
	}
	
	public static function init() {
		if (empty ( self::$log )) {
			$stack = debug_backtrace ();
			$top_call = $stack [0];
			$logname = basename ( $top_call ['file'], '.php' );
			
			self::$log = new Logger ( $logname );
		}
	}
	
	private static function _write($s) {
		if (! strlen ( $s )) {
			return false;
		}
		
		self::$log->records [] = $s;
		self::$log->curRecordCount ++;
		
		if (self::$log->curRecordCount >= self::$log->maxRecordCount) {
			if (empty ( self::$log->logFile ) || self::$log->logDate != date ( 'Ymd' )) {
				if (! empty ( self::$log->logFile )) {
					fclose ( self::$log->logFile );
				}
				self::$log->_setHandle ();
			}
			$str = implode ( "\n", self::$log->records );
//			fwrite ( self::$log->logFile, $str . "\n" );
//			self::$log->curRecordCount = 0;
//			self::$log->records = array ();
		}
		
		return true;
	}
	public static function info($str) {
		if (! strlen ( $str )) {
			return false;
		}
		
		if (empty ( self::$log )) {
			self::$log = new Logger ();
		}
		
		if (self::$log->level < self::INFO) {
			return false;
		}
		
		$trc = debug_backtrace ();
		$s = date ( 'Y-m-d H:i:s' );
		$s .= "\tINFO\tPID:" . self::$log->processID;
		$s .= "\t" . $trc [0] ['file'];
		$s .= "\tline " . $trc [0] ['line'];
		$s .= "\tip:" . self::$log->ip . "\t";
		$s .= "\t" . $str;
		
		self::_write ( $s );
		
		return true;
	}
	public static function notice($str) {
		if (! strlen ( $str )) {
			return false;
		}
		
		if (empty ( self::$log )) {
			self::$log = new Logger ();
		}
		
		if (self::$log->level < self::INFO) {
			return false;
		}
		
		$trc = debug_backtrace ();
		$s = date ( 'Y-m-d H:i:s' );
		$s .= "\tNOTICE\tPID:" . self::$log->processID;
		$s .= "\t" . $trc [0] ['file'];
		$s .= "\tline " . $trc [0] ['line'];
		$s .= "\tip:" . self::$log->ip . "\t";
		$s .= "\t" . $str;
		self::_write ( $s );
		
		return true;
	}
	public static function warn($str) {
		if (! strlen ( $str )) {
			return false;
		}
		
		if (empty ( self::$log )) {
			self::$log = new Logger ();
		}
		
		if (self::$log->level < self::WARN) {
			return false;
		}
		
		$trc = debug_backtrace ();
		$s = date ( 'Y-m-d H:i:s' );
		$s .= "\tWARN\tPID:" . self::$log->processID;
		$s .= "\t" . $trc [0] ['file'];
		$s .= "\tline " . $trc [0] ['line'];
		$s .= "\tip:" . self::$log->ip . "\t";
		$s .= "\t" . $str;
		self::_write ( $s );
		
		return true;
	}
	public static function err($str) {
		if (! strlen ( $str )) {
			return false;
		}
		
		if (empty ( self::$log )) {
			self::$log = new Logger ();
		}
		
		if (self::$log->level < self::ERR) {
			return false;
		}
		
		$trc = debug_backtrace ();
		$s = date ( 'Y-m-d H:i:s' );
		$s .= "\tERR\tPID:" . self::$log->processID;
		$s .= "\t" . $trc [0] ['file'];
		$s .= "\tline " . $trc [0] ['line'];
		$s .= "\tip:" . self::$log->ip . "\t";
		$s .= "\t" . $str;
		self::_write ( $s );
		
		return true;
	}
}

//End of script
