<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/11/20
 * Time: 下午10:54
 */

namespace app\models;


use yii\db\ActiveRecord;

class TasteCard extends ActiveRecord
{
    public static function tableName()
    {
        return 'taste_card';
    }
}