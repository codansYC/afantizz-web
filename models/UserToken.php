<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2018/1/17
 * Time: 下午4:00
 */

namespace app\models;


use yii\db\ActiveRecord;

class UserToken extends ActiveRecord
{
    public static function tableName()
    {
        return 'user_token';
    }
}