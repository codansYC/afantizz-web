<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2018/1/24
 * Time: 下午11:30
 */

namespace app\services;


use app\models\HouseBrowse;
use app\utils\UtilHelper;

class HouseBrowseService
{

    static function recordBrowse($houseId, $token) {
        $browse = new HouseBrowse();
        $browse->house_id = $houseId;
        if (!empty($token)) {
            $userId = UserService::getUserIdByToken($token);
            if ($userId) {
                $browse->user_id = $userId;
            }
        }
        $browse->create_time = UtilHelper::getTimeStr('YmdHis');
        $browse->save();
    }

    static function getBrowseCount($houseId) {
        $todayTimestamp = UtilHelper::getTimeStr('Ymd');
        $browseList = HouseBrowse::find()
            ->where(['house_id' => $houseId])
            ->all();
        $browseCount['total'] = count($browseList);
        $todayBrowseCount = 0;
        foreach ($browseList AS $browse) {
            if (strtotime($browse->create_time) > strtotime($todayTimestamp)) {
                $todayBrowseCount++;
            }
        }
        $browseCount['today'] = $todayBrowseCount;
        return $browseCount;
    }

}

