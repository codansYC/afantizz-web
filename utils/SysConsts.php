<?php
namespace  app\utils;

class SysConsts {
	//*********************************以下为业务常量定义********************************************//
	//系统配置
	const SERVERPREFIX = 'macbh';
	// 高德接口key
	const AMAP_KEY = '15872e89e4709238d1c637643de9e4a4';
	//数据库名
	const DBNAME = 'liking';
	//星期配置
	const MONDAY = '周一';
	const TUESDAY = '周二';
	const WEDNESDAY = '周三';
	const THURSDAY = '周四';
	const FRIDAY = '周五';
	const SATURDAY = '周六';
	const SUNDAY = '周日';
	//数据基础默认值
	const UNAVAILABLE = 0;
	const AVAILABLE = 1;
    const AVAILABLE_TWO = 2;
    const AVAILABLE_THREE = 3;
	//guid
	const EPOCH = 1464948542000;
	//SESSION
	const SESSION = 'SESSION_';
	//接口超时时间
	const INTERFACE_TIMEOUT = 10;
	//*********************************短信模板********************************************//
	const SMS_CANCEL_RESERVE = 97525;//取消用户预约短信
	const SMS_CANCEL_SCHEDULE = 99695;//关闭课程
	const SMS_CHANGE_TRAINER_TO_USER = 111895;//变更私教课教练,发送给会员:"【Liking健身】您的{1}私教课程，现更换为{2}教练（{3}）为您授课，如有疑问请联系客服（{4}）"
	const SMS_CHANGE_TRAINER_TO_TRAINER = 111896;//变更私教课教练,发送给新教练:"【Liking健身】原{1}教练负责会员（ {2} {3}）的{4}课程，现更换由你进行授课，请及时也会员进行联系"
	const SMS_CHANGE_END_TIME = 111897;//变更私教课结束时间:“【Liking健身】您的{1}私教课程，有效期为您延长至{2}，为了健身效果请保持上课频率喔，如有疑问请联系客服（{3}）"
	const SMS_GYM_FEE = 114817;//【Liking健身】您的验证码为{1}，请于{2}内正确输入，如非本人操作，请忽略此短信。
    
    //*********************************以下为redis常量定义********************************************//
	//接口请求
	const REQUEST_HISTORY = 'REQUEST_HISTORY_';  //登录历史
	//*********************************以下为返回码定义********************************************//
	const SUCCESS = 0;
	const SUCCESS_MSG = 'SUCCESS';
	const ERROR = -1;
	const ERROR_MSG = 'ERROR';
	//搜索"全部"项
	const SEARCH_ALL = -1;
	//非法请求
	const	REQUEST_INVALID_ERRCODE = 10000;
	const  REQUEST_INVALID_ERRMSG = '非法请求';
	//参数非法
	const PARAM_INVALID_ERRCODE = 10001;
	const PARAM_INVALID_ERRMSG = '参数非法';
	//参数缺失
	const PARAMETER_EXCEPTION_ERRCODE = 10002;
	const PARAMETER_EXCEPTION_ERRMSG = '参数缺失异常';
	//DB异常
	const DB_UNREACH_ERRCODE = 10003;
	const DB_UNREACH_ERRMSG = '10003 请联系管理员';
	//Redis异常
	const REDIS_UNREACH_ERRCODE = 10004;
	const REDIS_UNREACH_ERRMSG = '10004 请联系管理员';
	//统一异常返回信息
	const SYSTEM_EXCEPTION_ERRCODE = 10005;
	const SYSTEM_EXCEPTION_ERRMSG = '系统异常,请稍后重试';
	//验证码错误
	const CAPTCHA_ERRCODE = 10006;
	const CAPTCHA_ERRMSG = 10006;
	//文件上传
	const FILE_UPLOAD_SIZE = '5242880';//1024*1024*5 //3924582
	
	const FILE_UPLOAD_ERROR = 30000;
	const FILE_UPLOAD_ERROR_MSG = '文件上传出错';
	
	const FILE_UPLOAD_ERROR2 = 30001;
	const FILE_UPLOAD_ERROR_MSG2 = '图片类型不符合,请上传jpg/jpeg;png格式照片';
	
	const FILE_UPLOAD_ERROR3 = 30003;
	const FILE_UPLOAD_ERROR_MSG3 = '文件太大了,请上传小于5M图片';
	//物料库存
	const MATERIAL_STOCK_SHORT_ERRCODE = 24001;
	const MATERIAL_STOCK_SHORT_ERRMSG = '物料库存不足';
	const MATERIAL_NOT_EXIST_ERRCODE = 24002;
	const MATERIAL_NOT_EXIST_ERRMSG = '物料不存在';

	const CUISINE_EXIST_ERROR_CODE = '11002';
	const CUISINE_EXIST_ERROR_MSG = '该商品名称已存在';
}



















