<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/18
 * Time: 上午12:18
 */

namespace app\models;


use yii\db\ActiveRecord;

class Collection extends ActiveRecord {

    public static function tableName() {
        return 'collection';
    }

}