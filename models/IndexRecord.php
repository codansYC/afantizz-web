<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/7/23
 * Time: 下午2:48
 */

namespace app\models;


use yii\db\ActiveRecord;

class IndexRecord extends ActiveRecord{

    public static function tableName()
    {
        return 'indexRecord';
    }
}