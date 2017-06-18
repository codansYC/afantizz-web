<?php

namespace app\models;

use yii\db\ActiveRecord;
use app\utils\BizConsts;
use app\utils\SysConsts;

class Manager extends ActiveRecord{
	public static function tableName()
    {
        return SysConsts::DBNAME.'.t_manager';
    }
    public function beforeSave($insert){
    	if(parent::beforeSave($insert)){
    		if($insert){
    			$this->create_time = date('Y-m-d H:i:s');
    		}
    		$this->update_time = date('Y-m-d H:i:s');
    		return true;
    	}
    	return false;
    }
}