<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/11/5
 * Time: 下午6:21
 */

namespace app\controllers;


class WxController extends BaseController
{
    public function actionIndex() {
        $token = '498522';
        $signature = $_GET['signature'];
        $timestamp = $_GET['timestamp'];
        $nonce = $_GET['nonce'];
        $echostr = $_GET['echostr'];

        $arr = array($token,$timestamp,$nonce);
        sort($arr);
        $str = sha1(implode($arr));
        if ($signature == $str) {
            echo $echostr;
        } else {
            return false;
        }
    }
}