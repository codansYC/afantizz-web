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
        if ($house["thumb_images"] && $house["thumb_images"] != '') {
            $thumbImages = explode(';',$house["thumb_images"]);
        } else {
            $thumbImages = explode(';',$house["images"]);
        }
        return $thumbImages;
    }

}