<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/4
 * Time: 下午10:20
 */

namespace app\models;

use yii\db\ActiveRecord;

class House extends ActiveRecord {

    public static function tableName()
    {
        return 'house';
    }

    //添加数据库之外的属性字段
    public $collection_count = 0;  //关注量
    //是否被当前用户收藏
    public $isCollection = false;  //false 未收藏;  true 已收藏

    static function handleImages($house) {
        $images = array();
        if ($house["thumb_images"] && $house["thumb_images"] != '') {
            $thumbImages = explode(';',$house["thumb_images"]);
            $originImages = explode(';',$house["images"]);
        } else {
            $originImages = explode(';',$house["images"]);
            $thumbImages = $originImages;
        }
        for ($i=0; $i<count($originImages); $i++) {
            $originImage = $originImages[$i];
            $thumbImage = $thumbImages[$i];
            $image = new Image();
            $image->origin_url = $originImage;
            $image->thumb_url = $thumbImage;
            $images[] = $image;
        }
        return $images;
    }

    static function getThumbImages($house) {
        $thumbImages = array();
        $thumbImagesStr = $house["thumb_images"];
        if ($thumbImagesStr != null && $thumbImagesStr != '') {
            $thumbImages = explode(';',$thumbImagesStr);
        } else {
            $thumbImages = explode(';',$house["images"]);
        }
        return $thumbImages;
    }

}