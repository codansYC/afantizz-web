<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/18
 * Time: 下午7:44
 */

namespace app\models;


use yii\db\ActiveRecord;

class Feedback extends ActiveRecord
{

    public static function tableName()
    {
        return 'feedback';
    }

}