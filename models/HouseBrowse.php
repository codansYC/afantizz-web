<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2018/1/24
 * Time: 下午11:28
 */

namespace app\models;


use yii\db\ActiveRecord;

class HouseBrowse extends ActiveRecord
{

    public static function tableName()
    {
        return 'house_browse';
    }
}