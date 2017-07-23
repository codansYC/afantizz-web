<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/1
 * Time: 下午3:36
 */
namespace app\services;

use app\models\User;
use app\models\House;
use app\models\Collection;
use app\utils\BizConsts;
use app\utils\GlobalAction;
use app\utils\UtilHelper;
use phpDocumentor\Reflection\Types\Array_;
use Yii;

class UserService
{

    static function getUserByToken($token)
    {
        $user = User::find()
            ->where(['token' => $token])
            ->asArray()
            ->one();
        return $user;
    }

    static function getUserByPhone($phone,$platform)
    {
        $user = User::find()
            ->where(['phone' => $phone])
            ->one();
        $user->platform = $platform;
        $user->login_date = GlobalAction::getTimeStr("Y-m-d H:i:s");
        $user->save();
        return $user;
    }

    static function addNewUserWithPhone($phone,$platform)
    {
        $user = new User();
        $user->phone = $phone;
        $user->token = md5($phone);
        $user->save();
    }

    static function getUserReleaseHouse($token)
    {
        $today = date("Y-m-d");
        $houses = House::find()->where(["token" => $token, "user_delete" => 0])
            ->orderBy("release_date DESC")
            ->asArray()
            ->all();
        foreach ($houses AS $index => $house) {
            $date = $house['release_date'];
            $houseId = $house['house_id'];
            $collection_count = Collection::find()->where(['house_id' => $houseId])
                                                  ->count();
            $houses[$index]['collection_count'] = $collection_count;
            if ($house['today'] == $today) {
                $houses[$index]['today_browse_count'] = $house['today_browse_count'];
            } else {
                $houses[$index]['today_browse_count'] = 0;
            }
            $houses[$index]['release_date'] = GlobalAction::computeTime($date);
            $houses[$index]['images'] = House::getThumbImages($house);
        }
        return $houses;
    }

    static function getUserCollectionHouse($token)
    {
        $houseIds = Collection::find()->select('house_id')
                                      ->where(["token" => $token])
                                      ->orderBy('collection_date DESC')
                                      ->asArray()
                                      ->all();

        $houses = Array();
        foreach ($houseIds AS $houseId) {
            $house = House::find()->where(["house_id" => $houseId])
                                  ->asArray()
                                  ->one();
            $date = $house['release_date'];
            $house['release_date'] = GlobalAction::computeTime($date);
            $house['images'] = House::getThumbImages($house);
            array_push($houses,$house);
        }
        return $houses;

    }

}

