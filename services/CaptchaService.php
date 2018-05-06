<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/20
 * Time: 下午1:54
 */

namespace app\services;

use app\models\Captcha;
use app\utils\BizConsts;
use app\utils\GlobalAction;


class CaptchaService
{
    /** 根据手机号从数据库查找验证码或者重新生成验证码
     * @param $phone
     * @return mixed|string
     */
    public static function createCaptchaWithPhone($phone) {
        $currentDate = GlobalAction::getTimeStr("Y-m-d H:i:s");
        $captchaObjc = Captcha::find()->where(['phone' => $phone])->one();
//
        if ($captchaObjc) {
            $interval = strtotime($currentDate) - strtotime($captchaObjc->create_time);
            if ($interval <= BizConsts::CAPTCHA_LIFE) {
                $captchaObjc->create_time = $currentDate;
                $captchaObjc->save();
                return $captchaObjc->code;
            }
            //重新生成
            $captcha = mt_rand(0,9).mt_rand(10000, 99999);
            $captchaObjc->code = $captcha;
            $captchaObjc->create_time = $currentDate;
            $captchaObjc->save();
            return $captcha;
        }
        $newCaptchaObjc = new Captcha();
        $newCaptchaObjc->phone = $phone;
        $captcha = mt_rand(0,9).mt_rand(10000, 99999);
        //测试手机号
        if ($phone == BizConsts::APPLE_WHITELIST_PHONE) {
            $captcha = 123456;
        }
        $newCaptchaObjc->code = $captcha;
        $newCaptchaObjc->create_time = $currentDate;
        $newCaptchaObjc->save();

        return $captcha;
    }

    /** 删除手机号对应的验证码(登录成功或验证码失效之后调用)
     * @param $phone
     * @param $captcha
     */
    public static function deleteCaptcha($phone,$captcha) {
        $captchaObjc = Captcha::find()->where(['phone' => $phone, 'code' => $captcha])->one();
        $captchaObjc->delete();
    }

    /** 检验手机号和验证码
     * @param $phone
     * @param $captcha
     * @return bool
     */
    public static function checkPhoneAndCaptcha($phone,$captcha) {
        $captchaObjc = Captcha::find()->where(['phone' => $phone, 'code' => $captcha])->one();
        if (!$captchaObjc) {
            return false;
        }
        $currentDate = GlobalAction::getTimeStr("Y-m-d H:i:s");
        $interval = strtotime($currentDate) - strtotime($captchaObjc->create_time);
        if ($interval > BizConsts::CAPTCHA_LIFE) {
            echo $interval;
            return false;
        }
        $captchaObjc->delete();
        return true;
    }



}