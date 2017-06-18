<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/3
 * Time: 下午3:40
 */

namespace app\utils;


class GlobalAction {

    /**
     * @return bool
     */
    static function isMobile(){
        $useragent=isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
        $useragent_commentsblock=preg_match('|\(.*?\)|',$useragent,$matches)>0?$matches[0]:'';
        function CheckSubstrs($substrs,$text){
            foreach($substrs as $substr)
                if(false!==strpos($text,$substr)){
                    return true;
                }
            return false;
        }
        $mobile_os_list=array('Google Wireless Transcoder','Windows CE','WindowsCE','Symbian','Android','armv6l','armv5','Mobile','CentOS','mowser','AvantGo','Opera Mobi','J2ME/MIDP','Smartphone','Go.Web','Palm','iPAQ');
        $mobile_token_list=array('Profile/MIDP','Configuration/CLDC-','160×160','176×220','240×240','240×320','320×240','UP.Browser','UP.Link','SymbianOS','PalmOS','PocketPC','SonyEricsson','Nokia','BlackBerry','Vodafone','BenQ','Novarra-Vision','Iris','NetFront','HTC_','Xda_','SAMSUNG-SGH','Wapaka','DoCoMo','iPhone','iPod');

        $found_mobile=CheckSubstrs($mobile_os_list,$useragent_commentsblock) ||
            CheckSubstrs($mobile_token_list,$useragent);

        if ($found_mobile){
            return true;
        }else{
            return false;
        }
    }

    /** 检验是不是数字
     * @param $val 字符串
     * @return int 0或1
     */
    static function isNumber($val) {
        $pattern = '/^\d+$/';
        return preg_match($pattern,$val);
    }

    /** 获取时间字符串
     * @param string $format 日期格式
     * @return bool|string    日期
     */
    static function getTimeStr($format="YmdHi") {
        date_default_timezone_set("Asia/Shanghai");
        return date($format);
    }

    /**
     * @param $date 日期
     * @return mixed|string 转换后的日期字符串
     */
    static function computeTime($date) {

        $currentDate = self::getTimeStr("Y-m-d H:i:s");
        $interval = strtotime($currentDate) - strtotime($date);

        if ($interval<60) {
            return '刚刚';
        }
        if ($interval < 3600) {
            return floor($interval/60).'分钟前';
        }
        if ($interval < 3600*24) {
            return floor($interval/3600).'小时前';
        }
        if ($interval < 3600*24*30) {
            return floor($interval/(3600*24)).'天前';
        }

        return explode(' ',$date)[0];

    }

    /** 生成随机数
     * @param $length        随机数的长度
     * @return null|string   随机数字符串
     */
    static function getRandChar($length){
        $str = null;
        $strPol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
        $max = strlen($strPol)-1;

        for($i=0;$i<$length;$i++){
            $str.=$strPol[rand(0,$max)];//rand($min,$max)生成介于min和max两个数之间的一个随机整数
        }

        return $str;
    }

    /** 检查登录状态
     * @param $token  用户token
     */
    static function checkLoginState($token) {
        if (!isset($token) || $token == '') {
            UtilHelper::echoExitResult(BizConsts::UNLOGIN_ERRCODE,BizConsts::UNLOGIN_ERRMSG);
        }
    }


}