<?php
    
    namespace app\models;
    
    use app\utils\SysConsts;
    use Yii;
    
    /**
     * This is the model class for table "t_manager_msg".
     *
     * @property integer $id
     * @property string  $msg_id
     * @property string  $manager_id
     * @property integer $is_read
     * @property integer $is_delete
     * @property string  $create_time
     * @property string  $update_time
     * @property integer $new_column
     */
    class ManagerMsg extends \yii\db\ActiveRecord
    {
        
        const MSG_UNREAD   = 0;
        
        const MSG_READ     = 1;
        
        const MSG_UNDELETE = 0;
        
        /**
         * @inheritdoc
         */
        public static function tableName()
        {
            return SysConsts::DBNAME . '.t_manager_msg';
        }
        
        /**
         * @inheritdoc
         */
        public function rules()
        {
            return [
                [ [ 'msg_id', 'manager_id' ], 'required' ],
                [ [ 'is_read', 'is_delete' ], 'integer' ],
                [ [ 'msg_id' ], 'string', 'max' => 32 ],
                [ [ 'manager_id' ], 'string', 'max' => 18 ],
                [ [ 'create_time', 'update_time' ], 'string', 'max' => 19 ],
            ];
        }
        
        /**
         * @inheritdoc
         */
        public function attributeLabels()
        {
            return [
                'id'          => 'ID',
                'msg_id'      => 'Msg ID',
                'manager_id'  => 'Manager ID',
                'is_read'     => 'Is Read',
                'is_delete'   => 'Is Delete',
                'create_time' => 'Create Time',
                'update_time' => 'Update Time',
            ];
        }
        
        public function getMsg()
        {
            return $this->hasOne(
                Msg::className(),
                [
                    'msg_id' => 'msg_id',
                ]
            );
        }
    }
