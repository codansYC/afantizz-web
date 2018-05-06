<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/23
 * Time: 下午3:19
 */

namespace app\models;


use yii\db\ActiveRecord;

class Captcha extends ActiveRecord
{
    public static function tableName()
    {
        return 'captcha';
    }

}