<?php

namespace app\models;

use yii\db\ActiveRecord;
use app\utils\BizConsts;
use app\utils\SysConsts;

class ManagePlace extends ActiveRecord
{
    const ALL = 0;
    const PROVINCE = 1;
    const CITY = 2;
    const DISTRICT = 3;
    const GYM = 4;

    public static function tableName() {
        return SysConsts::DBNAME . '.t_manage_place';
    }

    public function beforeSave($insert) {
        if (parent::beforeSave($insert)) {
            if ($insert) {
                $this->create_time = date('Y-m-d H:i:s');
            }
            $this->update_time = date('Y-m-d H:i:s');
            return true;
        }
        return false;
    }

    public function getGym() {
        $condition = [
            'or',
            'place_id = city_id and place_type = 2',
            'place_id = district_id and place_type = 3',
            'place_id = gym_id and place_type = 4',
        ];
        return $this->hasMany(Gym::className(), $condition);
    }

    /**
     * @author shihuipeng@chushi007.com
     * @return mixed
     */
    public function getGym2() {
        return $this->hasOne(Gym::className(), ['gym_id' => 'gym_id']);
    }
}