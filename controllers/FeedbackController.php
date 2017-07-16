<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/18
 * Time: 下午7:43
 */

namespace app\controllers;

use app\models\Feedback;
use app\utils\GlobalAction;
use app\utils\BizConsts;
use app\utils\UtilHelper;
header("Access-Control-Allow-Origin: *"); # 跨域处理

class FeedbackController extends BaseController
{
    function actionFeedback() {
        try {
            $token = $this->requestParam['token'];
            $content = $this->requestParam['content'];
            $platform = $this->requestParam['platform'];
            $date = GlobalAction::getTimeStr("Y-m-d H:i:s");
            if (!isset($content) || $content == '') {
                UtilHelper::echoExitResult(BizConsts::FEEDBACK_INPUT_ERRCODE,BizConsts::FEEDBACK_INPUT_ERRMSG);
            }
            if (!isset($token)) {
                $token = '';
            }
            if (!isset($platform)) {
                $platform = 'mobile';
            }

            $feedback = new Feedback();
            $feedback->token = $token;
            $feedback->content = $content;
            $feedback->platform = $platform;
            $feedback->date = $date;
            $feedback->save();
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

}