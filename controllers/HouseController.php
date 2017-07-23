<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/4
 * Time: 下午9:55
 */

namespace app\controllers;

use app\models\User;
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
    function actionList() {
        try {

            $district = $this->requestParam['district'];
            $subway = $this->requestParam['subway'];
            $price = $this->requestParam['price'];
            $style = $this->requestParam['style'];
            $rentMode = $this->requestParam['rent_mode'];
            $sort = $this->requestParam['sort'];
            $page = $this->requestParam['page'];
            $houses = HouseService::getHouseList($district,$subway,$price,$style,$rentMode,$sort,$page);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$houses);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    /**
     * 搜索房源
     */
    function actionSearch() {
        try {
            $keyword = $this->requestParam['search_keyword'];
            $houses = HouseService::getHousesByKeyword($keyword);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$houses);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    /**
     * 房源详情
     */
    function actionDetail() {
        try {
            $hid = $this->requestParam['house_id'];
            $token = $this->requestParam['token'];
            $house = HouseService::getHouseInfo($hid,$token);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG,$house);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
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
            GlobalAction::checkLoginState($token);
            $houseId = $this->requestParam['house_id'];
            HouseService::stickHouse($houseId);
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
            GlobalAction::checkLoginState($token);
            $houseId = $this->requestParam['house_id'];
            HouseService::deleteHouse($houseId);
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
            GlobalAction::checkLoginState($token);
            $sell = $this->requestParam['sell'];
            $houseId = $this->requestParam['house_id'];
            HouseService::changeSellState($houseId,$sell);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    /**
     * 收藏房源
     */
    function actionCollection() {
        try {
            $token = $this->requestParam['token'];
            GlobalAction::checkLoginState($token);
            HouseService::collectionHouse($this->requestParam);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    /**
     * 取消收藏房源
     */
    function actionCancelCollection() {
        try {
            $token = $this->requestParam['token'];
            GlobalAction::checkLoginState($token);
            HouseService::cancelCollectionHouse($this->requestParam);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

    /**
     * 举报房源
     */
    function actionAccusation() {
        try {
            HouseService::complainHouse($this->requestParam);
            UtilHelper::echoResult(BizConsts::SUCCESS,BizConsts::SUCCESS_MSG);
        } catch (\Exception $e) {
            UtilHelper::handleException($e);
        }
    }

}
