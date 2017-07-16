<?php
namespace  app\utils;

class BizConsts {
	//*********************************以下为业务常量定义********************************************//
	// 高德接口key
	const AMAP_KEY = '15872e89e4709238d1c637643de9e4a4';
	const DEFAULT_DISTANCE = -1;
	
	const API_V1 = 'v1';//v1 api
	const API_V2 = 'v2';//v2 api
	const BIG_VERSION_INTERVAL = 5;//大版本间隔，5个版本 
	
	const APPLE_WHITELIST_PHONE = '15801569925';
	
	const API_KEY = 'B9E526DIAHC047FG1K8J3';

    //验证码时间 (300s)
    const CAPTCHA_LIFE = 300;
    //默认图片
    const DEFAULT_HOUSE_IMAGE = 'upload/defaultHouseImage.png';
	
	//分页数据量
	const TEAM_COURSE_PAGE = 7;
	const PERSONAL_COURSE_PAGE = 3;
    const USER_LIST_PAGE = 10;
    const RANK_LIST_PAGE = 10;
    const TRAINER_LIST_PAGE = 10;
    const GYMANN_LIST_PAGE = 10;
    const GYMANN_HISTORY_PAGE = 10;
    const TRAINER_COURSE_PAGE = 10;
    const VIP_USER_PAGE = 10;
    const MSG_PAGE = 10;
	
	//默认城市区域，上海徐汇
	const DEFAULT_CITY = 310100;
	const DEFAULT_DISTRICT = 310104;
	
	//数据库名
	const DBNAME = 'afantizz';
	
	const EMPTY_STR = "";
	
	//接口超时时间
	const INTERFACE_TIMEOUT = 10;
	
	//纪元时间
	const EPOCH = 1464948542000;
	const DAY_SECOND = 86400;
	const MONTH_DAY = 30;
	
	const CAPTCHA_AVAILABLE = 600;//验证码ttl
	
	const H5_CAPTCHA_AVAILABLE = 60;  //验证码期限
	
	//客服电话
	const CUSTOMER_SERVICE_NUMBER = '4006559797';
	
	const PLATFORM_IOS =1;  //ios平台
	const PLATFORM_ANDROID = 2;  //android平台
	
	const RAND_CHAR_NUM = 12;  //随机字符串个数
	
	//短信模板
	const SMS_VERIFY_TEMPLATE = 185133;//登录验证码模板
	const SMS_FETCH_FOOD_TEMPLATE = 97653; // [取餐时间,健身房名称,营养餐（写死),客服电话] 前30分钟通知领餐  1
	const SMS_CANCEL_FOOD_TEMPLATE = 97655; // [营养餐（写死),订单号,客服电话]  取消营养餐
	const SMS_COMPLETE_FOOD_TEMPLATE = 97656; // [营养餐（写死),订单号,客服电话]  确认领餐  1
	const SMS_CARD_WILLOVER_TEMPLATE = 97660;  //[3天(写死),客服电话]  会员卡将过期：会员卡结束时间-当前日期= 3 天，每天下午 20：00 发送 1
	const SMS_CARD_TIMEOVER_TMPLATE = 97661;  //[客服电话] 会员卡到期  每天晚上8点 1
	const SMS_TRAINERCOURSE_COMPLTER_TMEPLATE = 97664; //[私教课名称,客服电话]  私教课完成  1
	const SMS_TEAMCOURSE_BEGIN_TEMPLATE = 97666;  //[团体课名称,课程开始时间,客服电话] 团体课开始前1小时  1
	const SMS_TEAMCOURSE_CANCEL_TEMPLATE = 110844;  //[订单类别,订单号,订单金额,4006559797] 退款短信
	const SMS_STATIC_FOODNAME = '营养餐';
	const SMS_STATIC_DAYS = '3天';
	const IS_PUSH = 1;  //已推送
	const NO_PUSH = 0;  //未推送
	const IS_SMS = 1;  //已发短信
	const NO_SMS = 0;  //未发短信
	
	//推送redis键名
	const NOTIFY_GOODFOOD_ORDER = 'NOTIFY_GOODFOOD_ORDER';  //领餐时间前30分钟发送消息    1
	const NOTIFY_TEAMCOURSE_ORDER = 'NOTIFY_TEAMCOURSE_ORDER';  //团体课开始前1小时通知   1
	const NOTIFY_GOODFOOD_ORDER_MSG = '请记得%s至%s领取您购买的营养餐';  // 1,取餐时间  2 健身房名称
	const NOTIFY_TEAMCOURSE_ORDER_MSG = '您预约的%s将于%s开始，请安排好自己的行程，准时开练';  //1,课程名称 2, 课程开始时间
	
	//用户类型
	const USER_TYPE_APP = 0;
	const IS_NOTNEW_USER = 0;  //非新用户
	const IS_NEW_USER = 1;  //是新用户
	
	const USER_COMMON_TYPE = 1; //普通用户
	const USER_CATD_TYPE = 2;  //会员用户
	
	const JOIN_USER = 0;  //成为会员
	const JOIN_TRAINER = 1;  //成为教练
	
	const WECHAT_NAME = 'Liking健身';  //微信公众号名称 
	const SHARE_TITLE = '畅想肉体的碰撞，我在LIKING等你！';
	const SHARE_CONTENT = '帅哥美女陪你健身！全球首家互联网智能健身房LIKING健身，手环、APP一键控制，体验未来健身新时代！';
	
	const SHARE_SHOW_TITLE ="<div style='margin:0px; padding:0px;font-size:15px; width:100%; text-align:center'><font color='#596167'>邀请好友,好友立刻获得</font><font color='#34C86C'>20元优惠券</font></div>";
	const SHARE_SHOW_CONTENT = "<div style='margin:0px; padding:0px; font-size:14px; width:100%;'><font color='#596167'>好友完成购卡,您将立刻获得</font><font color='#34C86C'>100</font><font color='#596167'>元可叠加无门槛购卡优惠券，优惠金额无上限</font></div>";
	const SHARE_CONFIRM_TEXT = '输入好友邀请码,你将获得20元优惠券';
	const TRAINER_CONFIRM_TEXT = '全城健身房任你选,购买课程后与教练协调';
	
	const TRAINER_COURSE_TIMES = '为保证上课质量,购买课程数量不能小于%s次,不能大于%s次';
	const PERSONCOURSE_PROMPT = '失约三次及以上,每失约一次则减少一次上课次数,请谨慎安排上课时间';
	const TEAM_COURSE_PROMPT = '课程购买后,课程开始前4小时不能取消,请谨慎购买';
	const TRAINER_COURSE_STARTTIME = '即日起-';
	
	const SHARE_TYPE_TEAM = 1;  //团体课分享
	const SHARE_TYPE_TRAINER = 2;  //私教课分享
	const SHARE_TYPE_EXERCISE = 3; //分享运动数据
	const SHARE_TYPE_INVITE = 4; //邀请好友
	
	//用户token可用性
	const USER_TOKEN_TTL = 30;
	const USER_TOKEN_AVAILABLE = 1;
	const USER_TOKEN_UNAVAILABLE = 0;
	
	//用户设备状态
	const DEVICE_AVAILABLE = 0;
	const DEVICE_OTHER_LOGIN = 1;
	const DEVICE_LOGOUT = 2;
	
	//支付
	const PAYTITLE = 'Liking健身';
	const ORDER_PAYTYPE_WX = 0;//微信支付
	const ORDER_PAYTYPE_ALI = 1; //支付宝支付
	const ORDER_PAYTYPE_BALANCE = 2; //余额支付
	const ORDER_PAYTYPE_FREE = 3;  //免金额支付
	
	const ORDER_INIT = 0; //已下单
	const ORDER_COMPLETE = 1; //已完成
	const ORDER_CANCEL = 2;  //已取消
	
	const ORDER_UNPAY = 0;//未支付
	const ORDER_PAYED = 1;//已支付
	
	const PAY_LIMIT_TIME = 300;  //支付期限5分钟
	
	//退款
	const ORDER_UNREFUND = 0; //未退款
	const ORDER_REFUND = 1;  //已退款
	
	const UNEXECUTE = 0;  //未执行
	const EXECUTED =1;  //已执行
	
	//场馆
	const GYM_UNAVAILABLE = 0; //场馆不可用
	const GYM_AVAILABLE = 1; //场馆可用
	const GYM_ANNOUNCEMENT_AVAILABLE = 1;
	const GYM_ANNOUNCEMENT_UNAILABLE = 0;	
	const GYM_COURSE_DAYS = 7;
	const GYM_IS_WIFI = 1;  //支持wifi
	const GYM_IS_WASH = 1; //支持洗浴
	const GYM_NO_DAY = 0;  //不支持24小时
	
	//周边
	const FOOD_LIST_SIZE = 10; //单页展示的食物的数量
	const FOOD_UNAVAILABLE = 0; //食品可用
	const FOOD_AVAILABLE = 1;  //食品不可用
	
	//课程类型
	const COURSE_TYPE_TEAM =1;
	const COURSE_TYPE_PERSONAL = 2;
	
	const COURSE_TEAM_AVAILABLE = 1;
	const COURSE_TEAM_UNAVAILABLE = 0;
	
	const COURSE_TEAM_FEE = 1;
	const NO_FEE_DESC = '免费';
	const COURSE_BEFORE_DESC = '报名中';
	const COURSE_WILL_DESC = '待开始';
	const COURSE_BEGIN_DESC = '进行中';
	const COURSE_OVER_DESC = '已结束';
	const COURSE_CANCEL_DESC = '已关闭';
	
	//images
	const IMG_UNAVAILABLE = 0; //图片不可用
	const IMG_AVAILABLE = 1;  //图片可用
	const IMG_TYPE_USER = 1;
	const IMG_TYPE_TRAINER = 2;
	const IMG_TYPE_COURSE = 3;
	const IMG_TYPE_GYM = 4;
	const IMG_TYPE_FOOD = 5;  //食物图片大分类
	const IMG_TYPE_PLAN = 6;//训练计划
	const IMG_SUBTYPE_COVER = 1;  //食物封面图片
	const IMG_SUBTYPE_ROLL = 2; //食物详情轮播图片 
	
	//tag
	const TAG_TYPE_TRAINER = 1;
	const TAG_TYPE_COURSE = 2;
	const TAG_TYPE_FOOD = 3; // 食物标签类型
	const TAG_TYPE_GYM = 4;
	const TAG_UNAVAILABLE = 0;  //无效标签
	const TAG_AVAILABLE = 1;  //有效标签
	
	//团体课排期可用性
	const COURSE_SCHEDULE_AVAILABLE = 1;
	const COURSE_SCHEDULE_UNAVAILABLE = 0;
	const COURSE_ORDER_STATUS_CREATE = 0;
	const COURSE_ORDER_STATUS_CANCEL = 1;
	const COURSE_PAGE_SIZE = 10;
	
	//团体课是否收费
	const TEAM_COURSE_FREE = 0;  //免费课程
	const TEAM_COURSE_FEE = 1;  //收费团体课
	
	const TEAM_COURSE_CANCEL_TIME = 14400;   //付费团体课可取消的时间 4小时
	const TEAM_COURSE_BTN_SHOW  = 1;  //可展示取消按钮 
	
	//教练可用性
	const TRAINER_UNAVAILABLE = 0;
	const TRAINER_AVAILABLE = 1;
	
	//私教全职兼职
	const TRAINER_FULLTIME = 1;
	const TRAINER_PARTTIME = 2;
	
	const TRAINER_IMG_INDEX = 1;  //封面
	const TRAINER_IMG_INFO = 2;
	
	const TRAINER_PLACE_AVAIABLE = 1;  //可用
	const TRAINER_PLACE_UNAVAIABLE = 0; //不可用
	
	const TRAINER_COURSE_LIMITTIME = '+12 month';
	
	const TRAINER_COURSE_PERDAY = 7;  //每个私教课次增加的天数
	const TRAINER_COURSE_MAXTIMES = 60;  //最大购买次数
	
	
	//优惠券
	const COUPON_AVAILABLE = 0;  //优惠券可用
	const COUPON_ALREADY_USED = 1;  //优惠券已使用
	const COUPON_TIMEOUT = 2;  //优惠券已过期
	const COUPON_EXCHANGE_AVAIABLE = 0;  //未兑换
	const COUPON_EXCHANGE_UNAVAIABLE = 1;  //已兑换
	
	const COUPON_VALID_DELAY = 0;  //自动延长
	const COUPON_VALID_SET = 1;  //读取已有时间 
	
	const COUPON_NOTMATCH = 3;  //优惠券不匹配
	const COUPON_PAGSIZE = 10; //优惠券单页数
	const COUPON_EMPTY_CODE = 0;  //空优惠码
	
	const COUPON_TYPE_FOOD = 1;  //营养餐优惠券
	const COUPON_TYPE_COURSE = 2;  //私教课优惠券
	const COUPON_TYPE_CART = 3; //购卡优惠
	const COUPON_TYPE_TEAM = 4; //付费团体课
	
	const NEW_USER_COUPON_ID = 2000; //新手购卡优惠
	const INVIVATE_COUPON_ID = 3000;  //邀请优惠券
	
	const COUPON_FIRST_AMOUNT = 50;  //每次送50
	const COUPON_SENOND_AMOUNT = 100; //每次送100
	const COUPON_EXPIRE_TIME = "+1 month";  //优惠券有效期
	const MIN_REWARD_CARDCFG_ID = 10000;  //最低奖励卡ID
	
	//卡
	const CARD_FREE_TIME = 1; //闲时卡
	const CARD_ALL_DAY = 2;  //全天卡
	
	const GYM_CARD_UNENABLE = 0;  //不可用
	const GYM_CARD_ENABLED = 1;  //可用
	
	//卡操作类型
	const CARD_PUCHASE = 1;//购卡
	const CARD_RENEW = 2;//续卡
	const CARD_UPGRADE = 3;//升级卡
	
	const MONTH_CARD_CATEGORY = 1000;
	
	const CARD_RENEW_TIPS = "续卡只能续同类型会员卡";
	const CARD_UPDATE_TIPS = "升级卡只能升级至全通卡";
	
	const CARD_AVAILABLE = 1;
	const CARD_UNAVAILABLE = 0;
	
	const CARD_CANSELECT = 1;
	const CARD_NOSELECT = 0;
	
	//banner
	const BANNER_AVAILABLE = 1;
	const BANNER_UNAVAILABLE = 0;
	//course order action desc
	const CREATE_COURSE_ORDER_DESC = '预约团体课';
	const CREATE_TRAINER_ORDER_DESC = '创建私教课';
	const ORDER_PAY_SUCCESS_DESC = '订单支付成功';
	const ORDER_COMPLETE_DESC = '私教课确认完成';
	const ORDER_CANCLE_DESC = '取消团体课';
	const ORDER_FOOD_CREATE = '创建食物订单';
	const ORDER_FOOD_CANCEL_USER = '用户取消订单';
	const ORDER_FOOD_COMPLETE_DESC = '用户确认领餐';
	const ORDER_CARD_CREATE_DESC = '创建购卡订单';
	const ORDER_CANCEL_PAY_DESC = '后台取消用户订单';
	
	//order
	const PERSONAL_ORDER_STATUS_INIT = 0;  //已支付
	const PERSONAL_ORDER_STATUS_CANCLE = 1;  //已取消
	const PERSONAL_ORDER_STATUS_COMPLETED = 2;  //已完成 
	
	const ORDER_LIST_SIZE = 10;  //营养餐订单列表
	const FOOD_ORDER_INIT = 0; //已提交
	const FOOD_ORDER_PAYED = 1; //已支付
	const FOOD_ORDER_CANCEL = 2;  //已取消
	const FOOD_ORDER_COMPLETED = 3; //已完成
	
	
	const TEAMCOURSE_ORDER_LIST_SIZE = 10;
	const ORDER_TYPE_FOOD = 1;  //食物订单 
	const ORDER_TYPE_CARD = 3;  //购卡订单
	
	const TEAM_COURSE_INIT = 0;
	
	//goods
	const GOODS_STATUS_AVAILABLE = 1;   //食物可用状态
	const GOODS_TYPE_FOOD = 1;  //食物类型的商品
	const GYM_FOOD_AVAILABLE = 1;  //场馆库存可用
	const FOOD_ORDER_SERIAL = 'FOOD_ORDER_SERIAL_';
	const REDIS_LIFETIME_DAY = 86400;
	const CARD_FULL_DAY_DESC = '全天';
	
	const AUTH_ENTRANCE = 1;//进门
	const AUTH_OUT = 2;//出门
	
	const AUTH_CODE_AVAILABLE = 1;
	const AUTH_CODE_UNAVAILABLE = 0;
	
	const AUTH_CODE_EXPIRED = 300;
	const AUTH_CODE_TIPS = "密码5分钟内有效，请及时使用";
	
	const APP_FORCE_UPDATE = 1;
	const APP_OPTIONAL_UPDATE = 0;
	
	//萤石云配置
	const Y_APP_KEY = 'ccfdec3a9fb849bdb252b2ca37960dc0';
	const Y_APP_SECRET = '6f94b5938bd52988b6f5180df46fb9aa';
	const Y_TOKEN_URL = 'https://open.ys7.com/api/lapp/token/get';  //获取token地址
	const Y_CAPTURE_URL = 'https://open.ys7.com/api/lapp/device/capture';  //抓取图片地址
	const Y_TOKEN_INFO = 'Y_TOKEN_INFO';  //token缓存
	const Y_CAMERA_SERIAL = 'Y_CAMERA_SERIAL_';
	const Y_CAPTURE_EXPIRE = 300;
	const CAMER_PAGE_SIZE = 10;
	
	const Y_CAMERAID_URL = "https://open.ys7.com/api/method";
	
	
	//*********************************以下为redis常量定义********************************************//
	//用户登录验证码
	const USER_LOGIN_VERIFY = 'USER_LOGIN_VERIFY_';
	//用户信息
	const USER_DEFAULT_NICK = 'LikingFans';
	const USER_INFO = 'USER_INFO_';
	const REQUEST_HISTORY = 'REQUEST_HISTORY_';  //登录历史
	
	const CAPTCHA_TIMES_LIMIT = 'CAPTCHA_TIMES_LIMIT_';  //60s间隔
	
	
	
	//*********************************以下为返回码定义********************************************//
	//格式XYabc    X: 1 系统返回码   2 业务返回码     Y: 0购物车   1订单   2优惠券   3 会员卡
	//请求成功
	const SUCCESS = 0;
	const SUCCESS_MSG = 'success';
	
	//非法请求
	const	REQUEST_INVALID_ERRCODE = 10000;
	const  REQUEST_INVALID_ERRMSG = '非法请求';
	
	//订单业务相关异常
	const REQUEST_TIMEOUT_ERRCODE = 10006;
	const REQUEST_TIMEOUT_ERRMSG = '请求超时';
	
	//参数非法
	const PARAM_INVALID_ERRCODE = 10001;
	const PARAM_INVALID_ERRMSG = '参数错误';
	
	//参数缺失
	const PARAMETER_EXCEPTION_ERRCODE = 10002;
	const PARAMETER_EXCEPTION_ERRMSG = '参数缺失异常';
	
	//DB异常
	const DB_UNREACH_ERRCODE = 10003;
	const DB_UNREACH_ERRMSG = 'DB连接异常';
	
	//Redis异常
	const REDIS_UNREACH_ERRCODE = 10004;
	const REDIS_UNREACH_ERRMSG = 'redis连接异常';
	
	//统一异常返回信息
	const SYSTEM_EXCEPTION_ERRCODE = 10005;
	const SYSTEM_EXCEPTION_ERRMSG = '系统异常,请稍后重试';
	
	const INVALID_PHONE_REQUEST_CODE = 10006;
	const INVALID_PHONE_REQUEST_MSG = '获取验证码太频繁';
	
	const INVALID_PHONE_ERRCODE = 10007;
	const INVALID_PHONE_ERRMSG = '无效手机号';
	
	const GET_CAPTCHA_ERRCODE = 10008;
	const GET_CAPTCHA_ERRMSG = '获取验证码失败';
	
	const INVALID_CAPTCHA_ERRCODE = 10009;
	const INVALID_CAPTCHA_ERRMSG = '验证码出错，请验证后重试';
	
	const EXPIRE_CAPTCHA_ERRCODE = 10010;
	const EXPIRE_CAPTCHA_ERRMSG = '验证码已过期';
	
	const WRONG_CAPTCHA_ERRCODE = 10011;
	const WRONG_CAPTCHA_ERRMSG = '验证码错误，请重试';
	
	const LOGIN_FAIL_ERRCODE = 10012;
	const LOGIN_FAIL_ERRMSG = '登录失败';
	
	const LOGIN_EXPIRE_ERRCODE = 10013;
	const LOGIN_EXPIRE_ERRMSG = '登录态失效，请重新登录';
	
	const LOGOUT_FAIL_ERRCODE= 10014;
	const LOGOUT_FAIL_ERRMSG = '退出登录失败，请重试';
	
	const APP_OUTOFVER_ERRCODE= 10015;
	const APP_OUTOFVER_ERRMSG = '有重大更新，请升级App抢先体验';
	
	const API_SIGN_ERROR_CODE = 21027;
	const API_SIGN_ERROR_MSG = '签名错误';
	
	const API_SIGN_EMPTY_CODE = 21028;
	const API_SIGN_EMPTY_MSG = 'sign参数不可为空';
	
	const APP_UPDATE_ALERT_ERRCODE = 10016;
	const APP_UPDATE_ALERT_ERRMSG = 'App有重要更新，请升级后重试';
	
	//订单相关
	const FOOD_CARTDATA_ERRCODE = 20001;
	const FOOD_CARTDATA_ERRMSG = '购物车数据格式错误';
	
	const FOOD_DATA_ERRORCODE = 20002;
	const FOOD_DATA_ERRORMSG = '食品数据错误';
	
	const FOOD_STOCK_FAIL_CODE = 20003;
	const FOOD_STOCK_FAIL_MSG = '该健身房%s库存不足,请检查后重试';
	
	//优惠券
	const COUPON_INFO_FAIL_CODE = 22001;
	const COUPON_INFO_FAIL_MSG = '优惠券不存在';
	
	const COUPON_LIMIT_FAIL_CODE = 22002;
	const COUPON_LIMIT_FAIL_MSG = '未达到使用额度';
	
	const COUPON_START_FAIL_CODE = 22003;
	const COUPON_START_FAIL_MSG = '优惠券不在使用时间范围内';
	
	const COUPON_CODENOTEXIST_CODE = 22004;
	const COUPON_CODENOTEXIST_MSG = '优惠券码不存在';
	
	const COUPON_EXCHANGE_FAILE_CODE = 22005;
	const COUPON_EXCHANGE_FAILE_MSG = '兑换失败';
	
	const COUPON_EXCHANGE_EXISTS_CODE = 22006;
	const COUPON_EXCHANGE_EXISTS_MSG = '优惠券已兑换';
	
	const COUPON_EXCHANGE_TIMEOUT_CODE = 22040;
	const COUPON_EXCHANGE_TIMEOUT_MSG ='该兑换码已过期';
	
	const COUPON_HAVECODE_EXISTS_CODE = 22007;
	const COUPON_HAVECODE_EXISTS_MSG = '你已兑换过该类型优惠券';
	
	const COUPON_TIMEOUT_CODE = 22008;
	const COUPON_TIMEOUT_MSG = '优惠券已过期 ';
	
	const STOCK_SET_DATAERR_CODE = 22009;
	const STOCK_SET_DATAERR_MSG = '库存设置数据无效';
	
	const TEAMCOURSE_LIMITPEOPLE_CODE = 22010;
	const TEAMCOURSE_LIMITPEOPLE_MSG = '预约人数已满';
	
	const TEAMCOURSE_SETFAIL_CODE = 22011;
	const TEAMCOURSE_SETFAIL_MSG = '预约失败';
	
	const PRIVATECOURSE_LIMITPEOPLE_CODE = 22012;
	const PRIVATECOURSE_LIMITPEOPLE_MSG = '最后一个名额已被抢走';
	
	const CART_NOVALID_CODE = 22013;  
	const CART_NOVALID_MSG = '无会员卡或会员卡剩余有效期太短，请购卡后重试';

	const CART_FREE_NOTINCLUDE_CODE = 22014;
	const CART_FREE_NOTINCLUDE_MSG = '课程开始时间在错峰卡之外，请升级卡后重试';
	
	const TEAMCOURSE_DATAERR_CODE = 22015;
	const TEAMCOURSE_DATAERR_MSG = '团体课排期不存在';
	
	const TEAMCOURSE_TIMEOUT_CODE = 22016;
	const TEAMCOURSE_TIMEOUT_MSG = '课程进行中无法预约';
	
	const TEAMCOURSE_PREORDER_FAIL_CODE = 22017;
	const TEAMCOURSE_PREORDER_FAIL_MSG = '预约失败';
	
	const TEAMCOURSE_ALREADY_FAIL_CODE = 22018;
	const TEAMCOURSE_ALREADY_FAIL_MSG = '你已预约过该课程';
	
	const TRAINERCOURSE_DATAEMPTY_CODE = 22019;
	const TRAINERCOURSE_DATAEMPTY_MSG = '不存在的训练项目';
	
	const TRAINERCOURSE_TRAINEREMPTY_CODE = 22020;
	const TRAINERCOURSE_TRAINEREMPTY_MSG = '教练数据错误';
	
	const TRAINERCOURSER_NOCART_CODE = 22021;
	const TRAINERCOURSE_NOCART_MSG = '无可用会员卡,请购卡后重试';
	
	const ORDER_DATA_EMPTY_CODE = 22022;
	const ORDER_DATA_EMPTY_MSG = '无效数据';
	
	const USER_AUTH_FAIL_CODE = 22023;
	const USER_AUTH_FAIL_MSG = '无权操作';
	
	const TRAINCOURSE_COMPLETE_FAIL_CODE = 22024;
	const TRAINCOURSE_COMPLETE_FAIL_MSG = '操作失败';
	
	const TEAMCOURSE_BEGINNING_FAILE_CODE = 22025;
	const TEAMCOURSE_BEGINNING_FAILE_MSG = '课程进行中无法取消';
	
	const TEAMCOURSE_ENDING_FAILE_CODE = 22026;
	const TEAMCOURSE_ENDING_FAILE_MSG = '课程已结束无法取消';
	
	const PAY_LIMITTIMEOUT_CODE = 22027;
	const PAY_LIMITTIMEOUT_MSG = '支付时间已过期';
	
	const ORDER_HAVE_PAYED_CODE = 22028;
	const ORDER_HAVE_PAYED_MSG = '该笔订单已支付';
	
	const FOOD_ORDER_UNPAY_CODE = 22029;
	const FOOD_ORDER_UNPAY_MSG = '该订单还未支付';
	
	const USER_UPDATE_FAIL_CODE = 22030;
	const USER_UPDATE_FAIL_MSG = '用户信息更新失败';
	
	const INVITATE_NOCODE_CODE = 22031;
	const INVITATE_NOCODE_MSG = '不存在的邀请码';
	
	const INVITATE_NOTSELF_CODE = 22032;
	const INVITATE_NOTSELF_MSG = '不能自己邀请自己哦';
	
	const INVITATE_HAVING_CODE = 22033;
	const INVITATE_HAVING_MSG = '你已接受过邀请,不能重复被邀请';
	
	const INVITATE_FAIL_CODE = 22034;
	const INVITATE_FAIL_MSG = '操作失败,稍后再试';
	
	const TEAMCOURSE_FEE_FAIL_CODE = 22100;
	const TEAMCOURSE_FEE_FAIL_MSG = '课程付费类型不符';
	
	const TEAMCOURSE_LIMIT_DAYS_CODE = 221001;
	const TEAMCOURSE_LIMIT_DAYS_MSG = '只能预约前3天的课程哦';
	
	const PERSONAL_COURSE_TIMESLIMIT_CODE = 221002;
	const PERSONAL_COURSE_TIMESLIMIT_MSG = '购买的课次低于最小次数';
	
	const PERSONAL_COURSE_MAXTIMES_CODE = 221003;
	const PERSONAL_COURSE_MAXTIMES_MSG = '购买的课次低于最小次数';
	
	const TRAINER_EMPTY_COURSE_CODE = 221004;
	const TRAINER_EMPTY_COURSE_MSG = '该教练下无可约的私教课';
	
	const TRAINER_COURSE_PLACE_CODE = 221005;
	const TRAINER_COURSE_PLACE_MSG = '该教练无可用的上课地点';
	
	const SELECT_TIMES_INTTYPE_CODE = 221006;
	const SELECT_TIMES_INTTYPE_MSG = '课次只能是大于零的整数哦';
	
	const TEAMCOURSE_CANCEL_LIMIT_CODE = 221007;
	const TEAMCOURSE_CANCEL_LIMIT_MSG = '付费团体课开课前4小时内不能取消';
	
	const FEETEAM_COURSE_NOPAY_CODE = 221008;
	const FEETEAM_COURSE_NOPAY_MSG = '该付费团体课未付款';
	
	const CARD_GYMID_NOTMATCH_CODE = 221009;
	const CARD_GYMID_NOTMATCH_MSG = '您的会员卡不在该健身房下，请切换至购卡健身房';
	
	const CARD_NOTBIND_CODE = 221010;
	const CARD_NOTBIND_MSG = '你的会员卡还未绑定,请绑定后重试';
	
	const AUTHCODE_UNEXPERIENCE_CODE = 22035;
	const AUTHCODE_UNEXPERIENCE_MSG = "体验名额已使用，请购卡后重试";

	const AUTHCODE_FREETIME_CODE = 22036;
	const AUTHCODE_FREETIME_MSG = "错峰卡当前时段不可用";
	
	const AUTHCODE_CARD_EXPIRED_CODE = 22037;
	const AUTHCODE_CARD_EXPIRED_MSG = "您的会员卡已过期，请购卡后重试";
	
	const UPDATE_CARD_FAIL_CODE = 23000;
	const UPDATE_CARD_FAIL_MSG = "条件不符，无法升级";

	const UPDATE_CARD_NOCARD_CODE = 23001;
	const UPDATE_CARD_NOCARD_MSG = "用户没有会员卡，无法续卡或升级";
	
	const UPDATE_CARD_NOTALLDAY_CODE = 23002;
	const UPDATE_CARD_NOTALLDAY_MSG = "升级卡只能升到全天卡";
	
	const USER_CARD_EXPIRED_CODE = 23003;
	const USER_CARD_EXPIRED_MSG = "用户会员卡已过期";
	
	const USER_CARD_EXIST_CODE = 23004;
	const USER_CARD_EXIST_MSG = "用户有会员卡，不能进行购卡操作";
	
	const RENEW_CARD_CODE = 23005;
	const RENEW_CARD_MSG = "续卡只能续同类型的卡";
	
	const CARD_NOTEXIST_CODE = 23006;
	const CARD_NOTEXIST_MSG = "没有对应的健身卡";
	
	const CARD_INVALID_OPERATE_CODE = 23007;
	const CARD_INVALID_OPERATE_MSG = "非法的卡操作类型";
	
	const RENEW_CARD_NOCARD_CODE = 23008;
	const RENEW_CARD_NOCARD_MSG = "用户没有会员卡，无法升级";
	
	const RENEW_CARD_NOMONTH_CODE = 23009;
	const RENEW_CARD_NOMONTH_MSG = "只能续同类型卡";
	
	const EXCHANGE_COUPON_FAIL_CODE = 230010;
	const EXCHANGE_COUPON_FAIL_MSG = '优惠券领取失败,请稍后重试';
	
	const COURSE_NOTIN_GYM_CODE = 230011;
	const COURSE_NOTIN_GYM_MSG = '该课程不属于当前健身房下';
	
	const TRAINER_NOTINCLUDE_GYM_CODE = 230012;
	const TRAINER_NOTINCLUDE_GYM_MSG = '该教练不支持当前健身房上课';
	
	const GYM_NOTEXIST_ERRCODE =240000;
	const GYM_NOTEXIST_ERRMSG = "场馆不存在";
	
	const GYM_NOTSAME_ERRCODE =240001;
	const GYM_NOTSAME_ERRMSG = "您购卡健身房与当前健身房不相同，不能进行续卡升级卡操作";

    const IMAGE_INVALID_ERRCODE = 300001;
    const IMAGE_INVALID_ERRMSG = "图片格式不支持";
    const UPLOAD_FAIL_ERRCODE = 300002;
    const UPLOAD_FAIL_ERRMSG = "图片上传失败";

    const UNLOGIN_ERRCODE = 10000;
    const UNLOGIN_ERRMSG = "用户未登录";
    const RELEASE_HOUSE_ERRCODE = 10001; //发布房源失败
    const RELEASE_HOUSE_ERRMSG = "发布房源失败";
    const House_Has_Collected_ERRCODE = 10002;   //房源已收藏
    const House_Has_Collected_ERRMSG = "您已收藏过该房源";   //房源已收藏
    const House_UnCollected_ERRCODE = 10003;   //房源未收藏
    const House_UnCollected_ERRMSG = "您未收藏该房源";   //房源已收藏
    const FEEDBACK_INPUT_ERRCODE = 10004;   //意见反馈提示输入内容
    const FEEDBACK_INPUT_ERRMSG = "请填写反馈意见";   //意见反馈提示输入内容
    const ABSENCE_COMPLAIN_REASON_ERRCODE = 10005;   //缺少举报理由
    const ABSENCE_COMPLAIN_REASON_ERRMSG = "请选择举报理由或简要描述举报理由";

}



















