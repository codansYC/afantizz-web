<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/7/23
 * Time: 下午2:21
 */

namespace app\controllers;



use app\models\IndexRecord;

class RecordController extends BaseController{

    function actionIndex() {
        try {
            $token = $this->requestParam['token'];
            $platform = $this->requestParam['platform'];
            $size = $this->requestParam['size'];
            $user_agent = $this->requestParam['user_agent'];
            $date = GlobalAction::getTimeStr("Y-m-d H:i:s");
            if (!isset($token)) {
                $token = '';
            }
            $record = new IndexRecord();
            $record->token = $token;
            $record->platform = $platform;
            $record->size = $size;
            $record->date = $date;
            $record->user_agent = $user_agent;
            $record->save();
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

}