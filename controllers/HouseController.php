<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/4
 * Time: 下午9:55
 */

namespace app\controllers;

use app\models\User;
use app\services\HouseBrowseService;
use app\services\HouseService;
use app\services\UserService;
use app\utils\GlobalAction;
use app\utils\UtilHelper;
use Yii;
use yii\web\Controller;
use app\utils\BizConsts;

header("Access-Control-Allow-Origin: *"); # 跨域处理

class HouseController extends BaseController {

    /**
     * 房源列表
     */
    public function actionList() {
        try {
            $houseList = HouseService::getHouseList($this->requestParam);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$houseList);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    /**
     * 搜索房源
     */
    function actionSearch() {
        try {
            $keyword = $this->requestParam['keyword'];
            if (empty($keyword)) {
                UtilHelper::echoExitResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,[]);
            }
            $houses = HouseService::getHousesByKeyword($keyword);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$houses);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    /**
     * 房源详情
     */
    function actionInfo() {
        try {
            $houseId = $this->requestParam['house_id'];
            $token = $this->requestParam['token'];
            $house = HouseService::getHouseInfo($houseId,$token);
            HouseBrowseService::recordBrowse($houseId,$token);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$house);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    /**
     * 房源信息(编辑房源时复原的信息)
     */
    function actionRestore() {
        $houseId = $this->requestParam['house_id'];
        $token = $this->requestParam['token'];
        if (!$this->checkLoginState($token)) {
            UtilHelper::echoExitResult(BizConsts::UNLOGIN_ERRCODE, BizConsts::UNLOGIN_ERRMSG);
        }
        $house = HouseService::getRestoreInfo($houseId);
        UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$house);
    }

    /**
     * 发布房源
     */
    function actionRelease() {
        try {
            $params = $this->requestParam;
            HouseService::validData($params);
            HouseService::releaseHouse($params);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    /**
     * 修改房源
     */
    function actionModify() {
        try {
            $params = $this->requestParam;

            HouseService::validData($params);
            HouseService::modifyHouse($params);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    /**
     * 置顶房源
     */
    function actionStick() {
        try {
            $token = $this->requestParam['token'];
            $houseId = $this->requestParam['house_id'];
            if (!$this->checkLoginState($token)) {
                UtilHelper::echoExitResult(BizConsts::UNLOGIN_ERRCODE, BizConsts::UNLOGIN_ERRMSG);
            }
            HouseService::stickHouse($token,$houseId);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    /**
     * 删除房源
     */
    function actionDelete() {
        try {
            $token = $this->requestParam['token'];
            $houseId = $this->requestParam['house_id'];
            if (!$this->checkLoginState($token)) {
                UtilHelper::echoExitResult(BizConsts::UNLOGIN_ERRCODE, BizConsts::UNLOGIN_ERRMSG);
            }
            HouseService::deleteHouse($token, $houseId);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    /**
     * 修改房源出租状态
     */
    function actionChangeSellState() {
        try {
            $token = $this->requestParam['token'];
            $houseId = $this->requestParam['house_id'];
            $sell = $this->requestParam['sell'];
            if (!$this->checkLoginState($token)) {
                UtilHelper::echoExitResult(BizConsts::UNLOGIN_ERRCODE, BizConsts::UNLOGIN_ERRMSG);
            }
            HouseService::changeSellState($token,$houseId,$sell);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    /**
     * 举报房源
     */
    function actionComplain() {
        try {
            $params = $this->requestParam;
            if (empty($params['reason']) && empty($params['desc'])) {
                UtilHelper::echoExitResult(BizConsts::ABSENCE_COMPLAIN_REASON_ERRCODE,BizConsts::ABSENCE_COMPLAIN_REASON_ERRMSG);
            }
            HouseService::complainHouse($params);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

}
