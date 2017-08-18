<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/8/18
 * Time: 下午11:30
 */

namespace app\models;


use yii\db\ActiveRecord;

class LudaMap extends ActiveRecord
{
    static function tableName()
    {
        return 'ludaMap';
    }

}