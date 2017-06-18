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


class IndexController extends BaseController {

    function actionIndex() {
        if (GlobalAction::isMobile()) {
            //返回手机版网页
            return $this->render('index');
        } else {
            //返回pc端网页
            echo \Yii::$app->view->renderFile('@app/web/pc/index.html');
        }

    }


}

