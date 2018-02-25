<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/1
 * Time: 下午3:36
 */
namespace app\services;

use app\models\HouseFollow;
use app\models\Image;
use app\models\User;
use app\models\House;
use app\models\UserToken;
use app\utils\BizConsts;
use app\utils\UtilHelper;

class UserService
{

    static public function getUserByToken($token) {
        $user = UserToken::find()
            ->where(['token' => $token])
            ->one();
        if (!$user) {
            return null;
        }
        return User::find()
            ->where(['user_id' => $user->user_id])
            ->one();
    }

    static public function getUserIdByToken($token)
    {
        $user = UserToken::find()
            ->where(['token' => $token])
            ->one();
        if ($user) {
            return $user->user_id;
        }
        return null;
    }

    static public function getUserByPhone($phone, $platform)
    {
        $user = User::find()
            ->where(['phone' => $phone])
            ->one();
        if (!$user) {
            $user = self::addUserWithPhone($phone, $platform);
        } else {
            $user->platform = $platform;
            $user->update_time = UtilHelper::getTimeStr("Y-m-d H:i:s");
            $user->save();
        }
        $userInfo = array('phone'=>$phone, 'token'=>self::getTokenWithUserId($user->user_id)->token);
        return $userInfo;
    }

    static private function addUserWithPhone($phone,$platform)
    {

        $user = new User();
        $user->phone = $phone;
        $user->user_id = 'afantizz'.UtilHelper::getGuid();
        $user->platform = $platform;
        $user->create_time = UtilHelper::getTimeStr("Y-m-d H:i:s");
        $user->save();
        self::generateUserToken($user->user_id, $phone);
        return $user;
    }

    static private function generateUserToken($userId, $phone) {
        $userToken = UserToken::find()->where(['user_id' => $userId])->one();
        $time = UtilHelper::getTimeStr("Y-m-d H:i:s");
        if (!$userToken) {
            $userToken = new UserToken();
            $userToken->create_time = $time;
            $userToken->user_id = $userId;
        }
        $userToken->update_time = $time;
        $userToken->token = UtilHelper::generateToken($userId, $phone);
        $userToken->save();
    }

    static private function getTokenWithUserId($userId) {
        $userToken = UserToken::find()
            ->select('token')
            ->where(['user_id' => $userId])
            ->one();
        return $userToken;
    }

    static function getUserReleaseHouse($userId)
    {
        $selCondition = [
            'house_id',
            'title',
            'price' => 'CONCAT("¥", price)',
            'district' => 'house.district_code',
            'address',
            'status',
            'date' => 'house.update_time',
        ];
        $houses = House::find()
            ->select($selCondition)
            ->where(["user_id" => $userId, "user_delete" => 0])
            ->orderBy("update_time DESC")
            ->asArray()
            ->all();
        foreach ($houses AS $index => $house) {
            $houses[$index]['district'] = UtilHelper::getDistrictByCode($house['district']);
            $houses[$index]['date'] = explode(' ',$house['date'])[0];
            $houseList[$index]['district'] = UtilHelper::getDistrictByCode($house['district']);

            $browseCount = HouseBrowseService::getBrowseCount($house['house_id']);
            $houses[$index]['browse_total_num'] = $browseCount['total'];
            $houses[$index]['browse_today_num'] = $browseCount['today'];

            $houses[$index]['follow_num'] = HouseFollow::find()
                ->where(['house_id' => $house['house_id'], 'status' => 1])
                ->count();
            $imageObj = Image::find()
                ->where(['source_id' => $house['house_id']])
                ->one();
            $houses[$index]['image'] = $imageObj ? $imageObj->thumb_url: "";
        }
        return $houses;
    }

    static function getUserFollowHouse($userId)
    {
        $houseIds = HouseFollow::find()
            ->select(['house_id'])
            ->where(["user_id" => $userId,'status' => 1])
            ->orderBy("update_time DESC")
            ->asArray()
            ->all();

        $selCondition = [
            'house_id',
            'title',
            'price' => 'CONCAT("¥", price)',
            'district' => 'house.district_code',
            'address',
            'status',
            'date' => 'house.update_time',
        ];
        $houses = House::find()
            ->select($selCondition)
            ->where(['in', 'house_id', $houseIds])
            ->asArray()
            ->all();
        foreach ($houses AS $index => $house) {
            $houses[$index]['district'] = UtilHelper::getDistrictByCode($house['district']);
            $houses[$index]['date'] = explode(' ',$house['date'])[0];
            $houseList[$index]['district'] = UtilHelper::getDistrictByCode($house['district']);
            $imageObj = Image::find()
                ->where(['source_id' => $house['house_id']])
                ->one();
            $houses[$index]['image'] = $imageObj == null ? "" : $imageObj->thumb_url;
        }
        return $houses;

    }

    static function followHouse($houseId, $userId) {
        $follow = HouseFollow::find()
            ->where(['house_id'=>$houseId, 'user_id'=>$userId])
            ->one();
        $date = UtilHelper::getTimeStr('YmdHms');
        if (!$follow) {
            $follow = new HouseFollow();
            $follow->house_id = $houseId;
            $follow->user_id = $userId;
            $follow->create_time = $date;
        }
        if ($follow->status == HouseFollow::HAS_FOLLOWED) {
            UtilHelper::echoExitResult(BizConsts::House_Has_Collected_ERRCODE, BizConsts::House_Has_Collected_ERRMSG);
        }
        $follow->update_time = $date;
        $follow->status = HouseFollow::HAS_FOLLOWED;
        $follow->save();
    }

    static function cancelFollowHouse($houseId, $userId) {
        $follow = HouseFollow::find()
            ->where(['house_id'=>$houseId, 'user_id'=>$userId])
            ->one();
        if (!$follow || $follow->status != HouseFollow::HAS_FOLLOWED) {
            UtilHelper::echoExitResult(BizConsts::House_UnCollected_ERRCODE, BizConsts::House_UnCollected_ERRMSG);
        }
        $date = UtilHelper::getTimeStr('YmdHms');
        $follow->update_time = $date;
        $follow->status = !HouseFollow::HAS_FOLLOWED;
        $follow->save();
    }

}

