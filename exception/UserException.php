<?php
    /**
     * Created by PhpStorm.
     * User: ScreamWolf
     * Date: 16/9/30
     * Time: 16:06
     */
    namespace app\modules\v1\exception;
    
    class UserException extends BaseException
    {
        
        const PARAM_ERROR_CODE = 30001;
        const PARAM_ERROR_MSG  = 'managerId或gym_id必须至少有一个';
        
        const MANAGER_ERROR_CODE = 30002;
        const MANAGER_ERROR_MSG  = '缺少参数managerId';
        
    }