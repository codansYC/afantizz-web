<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/1
 * Time: 下午3:36
 */
namespace app\services;

use app\models\User;
use Yii;

class UserService {

    static function getUserByToken($token) {
        $user = User::find()->where(['id' => '5'])->all();
        return $user;
    }

    static function getUsers() {
        return User::findAll();
    }
}