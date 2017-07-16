<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/18
 * Time: 下午3:37
 */

namespace app\models;


use yii\db\ActiveRecord;

class Accusation extends ActiveRecord
{
    public static function tableName()
    {
        return 'accusation';
    }

}