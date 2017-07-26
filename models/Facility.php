<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/7/26
 * Time: 下午1:53
 */

namespace app\models;


use yii\db\ActiveRecord;

class Facility extends ActiveRecord
{
    public static function tableName() {
        return 'facility';
    }
}