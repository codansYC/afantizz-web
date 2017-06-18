<?php
    
    namespace app\models;
    
    use app\utils\SysConsts;
    use Yii;
    
    /**
     * This is the model class for table "t_manager_device".
     *
     * @property integer $id
     * @property string  $manager_id
     * @property string  $device_id
     * @property string  $device_token
     * @property string  $registration_id
     * @property string  $platform
     * @property string  $os_version
     * @property string  $app_version
     * @property string  $phone_type
     * @property string  $extra
     * @property integer $device_status
     * @property string  $create_time
     * @property string  $update_time
     */
    class ManagerDevice extends \yii\db\ActiveRecord
    {
        const AVAILABLE = 0;
        const OTHER_LOGIN = 1;
        const LOGOUT = 2;
        /**
         * @inheritdoc
         */
        public static function tableName()
        {
            return SysConsts::DBNAME . '.t_manager_device';
        }
        
        /**
         * @inheritdoc
         */
        public function rules()
        {
            return [
                [
                    [
                        'manager_id',
                        'device_id',
                        'registration_id',
                        'platform',
                        'os_version',
                        'app_version',
                        'phone_type',
                        //'device_status',
                    ],
                    'required',
                    'message' => '缺少参数{attribute}',
                ],
            ];
        }
        
        /**
         * @inheritdoc
         */
        public function attributeLabels()
        {
            return [
                'id'              => 'ID',
                'manager_id'      => 'Manager ID',
                'device_id'       => 'Device ID',
                'device_token'    => 'Device Token',
                'registration_id' => 'Registration ID',
                'platform'        => 'Platform',
                'os_version'      => 'Os Version',
                'app_version'     => 'App Version',
                'phone_type'      => 'Phone Type',
                'extra'           => 'Extra',
                'device_status'   => 'Device Status',
                'create_time'     => 'Create Time',
                'update_time'     => 'Update Time',
            ];
        }
        
        public function beforeSave( $insert )
        {
            if( parent::beforeSave( $insert ) ){
                if( $insert ){
                    $this->create_time = date( 'Y-m-d H:i:s' );
                }
                $this->update_time = date( 'Y-m-d H:i:s' );
                
                return true;
            }
            
            return false;
        }
    }
