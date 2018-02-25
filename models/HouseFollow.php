<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2018/1/26
 * Time: 上午10:19
 */

namespace app\models;


use yii\db\ActiveRecord;

class HouseFollow extends ActiveRecord
{
    const HAS_FOLLOWED = true;
    public static function tableName()
    {
        return 'house_follow';
    }

}