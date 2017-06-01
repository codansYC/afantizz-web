<?php
namespace  app\modules\v1\exception;


class LoginException extends BaseException { 
	const LOGIN_FAIL_ERRCODE = 20001;
	const LOGIN_FAIL_ERRMSG = '登录失败';
	const LOGIN_EXPIRE_ERRCODE = 20002;
	const LOGIN_EXPIRE_ERRMSG = '登录态失效，请重新登录';
	const NO_MATCH_EMAIL_ERRCODE = 20003;
	const NO_MATCH_EMAIL_ERRMSG = "用户不存在";
	const PASSWORD_NOT_CORRECT_ERRCODE = 20004;
	const PASSWORD_NOT_CORRECT_ERRMSG = "密码不正确";
	const CAPTCHA_ERRCODE = 20005;
	const CAPTCHA_ERRMSG = "验证码不正确";
	const NO_AUTH_PHONE_ERRCODE = 20006;
	const NO_AUTH_PHONE_ERRMSG = '该手机号没有权限';
	
}
