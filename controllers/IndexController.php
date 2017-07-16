<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/1
 * Time: 上午11:50
 */
namespace app\controllers;
use app\utils\GlobalAction;
use Yii;
use yii\web\Controller;

header("Access-Control-Allow-Origin: *"); # 跨域处理
class IndexController extends BaseController {

    function actionIndex() {

        if (GlobalAction::isMobile()) {
            //返回手机版网页
            echo \Yii::$app->view->renderFile('@app/web/m/index.html');
        } else {
            //返回pc端网页
            echo \Yii::$app->view->renderFile('@app/web/pc/index.html');
        }
    }


}

