<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "t_manager_token".
 *
 * @property integer $id
 * @property string $manager_id
 * @property string $token
 * @property string $start_time
 * @property string $end_time
 * @property integer $token_status
 * @property string $create_time
 * @property string $update_time
 */
class ManagerToken extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 't_manager_token';
    }


    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'manager_id' => 'Manager ID',
            'token' => 'Token',
            'start_time' => 'Start Time',
            'end_time' => 'End Time',
            'token_status' => 'Token Status',
            'create_time' => 'Create Time',
            'update_time' => 'Update Time',
        ];
    }
    
    public function getManager(){
    	return $this->hasOne(Manager::className(), ['id' => 'manager_id']);
    }
}
