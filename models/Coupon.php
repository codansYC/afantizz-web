<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/7/28
 * Time: 下午4:52
 */

namespace app\models;


use yii\db\ActiveRecord;

class Coupon extends ActiveRecord
{
    public static function tableName() {
        return 'coupon';
    }

}