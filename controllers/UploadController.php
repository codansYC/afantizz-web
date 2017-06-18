<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/14
 * Time: 下午6:52
 */

namespace app\controllers;


use app\utils\GlobalAction;
use app\utils\UtilHelper;
use app\utils\BizConsts;
use app\models\Image;

class UploadController extends BaseController {

    function actionUpload()
    {
        $targetFolder = 'upload'; // Relative to the root
        if ($_FILES['file']) {
            $file = $_FILES['file'];
        } else {
            $file = $_FILES['Filedata'];
        }

        $tempFile = $file['tmp_name'];
        $targetPath = $targetFolder;
        $type = next(explode(".", $file['name']));
        $extension = next(explode("/", $file['type']));
        $needRotate = ($type != $extension);
        $originImageRandStr = GlobalAction::getTimeStr() . GlobalAction::getRandChar(12);
        $originImageFile = $targetPath . '/' . $originImageRandStr . '.' . $extension;
        $thumbImageRandStr = GlobalAction::getTimeStr() . GlobalAction::getRandChar(12);
        $thumbImageFile = $targetPath . '/' . $thumbImageRandStr . '.' . $extension;
        $fileTypes = array('jpg', 'jpeg', 'gif', 'png');
        $fileParts = pathinfo($file['name']);

        $extension = strtolower($fileParts['extension']);
        if (!in_array($extension, $fileTypes)) {
            UtilHelper::echoExitResult(BizConsts::IMAGE_INVALID_ERRCODE, BizConsts::IMAGE_INVALID_ERRMSG);
        }

        if (!$this->compressImage($tempFile, $originImageFile, $thumbImageFile, $needRotate)) {
            UtilHelper::echoExitResult(BizConsts::UPLOAD_FAIL_ERRCODE, BizConsts::UPLOAD_FAIL_ERRMSG);
        }

        $image = new Image();
        $image->origin_url = $originImageFile;
        $image->thumb_url = $thumbImageFile;
        UtilHelper::echoResult(BizConsts::SUCCESS, BizConsts::SUCCESS_MSG, $image);
    }

    /*
        图片压缩
        */
    function compressImage($filePath,$bigImageFile,$smallImageFile,$needRotate) {

        $extension = next(explode(".",$bigImageFile));
        switch ($extension) {
            case 'jpg':
                $originImage = imagecreatefromjpg($filePath);
                break;
            case 'jpeg':
                $originImage = imagecreatefromjpeg($filePath);
                break;
            case 'png':
                $originImage = imagecreatefrompng($filePath);
                break;
            case 'gif':
                $originImage = imagecreatefromgif($filePath);
                break;
            default:

                return false;
        }

        list($originW, $originH) = getimagesize($filePath);
        $w_h_ratio = $originW / $originH;
        $final_w = 800;
        $final_h = $final_w / $w_h_ratio;

        if ($originImage) {
            $compress = imagecreatetruecolor($final_w, $final_h);
            imagecopyresampled($compress, $originImage, 0, 0, 0, 0, $final_w, $final_h, $originW, $originH);
            $this->saveImage($extension,$compress,$bigImageFile,$needRotate);

            if (!$this->cropImage($bigImageFile,$smallImageFile)) {
                $this->saveImage($extension,$compress,$smallImageFile);
                echo "图片裁剪失败";
            }
            return true;
        }

        return false;
    }

    /*
    图片剪裁
    */
    function cropImage($filePath,$smallImageFile) {
        $extension = next(explode(".",$smallImageFile));
        switch ($extension) {
            case 'jpg':
                $originImage = imagecreatefromjpg($filePath);
                break;
            case 'jpeg':
                $originImage = imagecreatefromjpeg($filePath);
                break;
            case 'png':
                $originImage = imagecreatefrompng($filePath);
                break;
            case 'gif':
                $originImage = imagecreatefromgif($filePath);
                break;
            default:
                return false;
        }

        list($img_w, $img_h) = getimagesize($filePath);
        //剪裁后的宽高比
        $w_h_ratio = 4.0 / 3.0;
        if ($img_w / $img_h > $w_h_ratio) {
            $new_h = $img_h;
            $new_w = $img_h * $w_h_ratio;
            $crop_y = 0;
            $crop_x = ($img_w - $new_w) / 2.0;
        } else if ($img_w / $img_h < $w_h_ratio) {
            $new_w = $img_w;
            $new_h = $new_w / $w_h_ratio;
            $crop_x = 0;
            $crop_y = ($img_h - $new_h) / 2;
        } else {
            $new_w = $img_w;
            $new_h = $img_h;
            $crop_x = 0;
            $crop_y = 0;
        }

        //剪裁
        $croped = imagecreatetruecolor($new_w, $new_h);
        imagecopy($croped, $originImage, 0, 0, $crop_x, $crop_y, $img_w, $img_h);
        if ($this->saveImage($extension,$croped,$smallImageFile)) {
            return true;
        }
        return false;
    }

    function saveImage($extension,$image,$file,$needRotate=false) {
        $rotateAngle = -90;
        if ($needRotate) {
//        $image = imagerotate($image,$rotateAngle,0);
        }
        switch ($extension) {
            case 'jpg':
//            echo 'jpg';die;
                if (imagejpg($image,$file)) {
                    return true;
                }
                return false;
            case 'jpeg':
//            echo 'jpeg';die;
                if (imagejpeg($image,$file)) {
                    return true;
                }
                return false;
            case 'png':
//            echo 'png';die;
                if (imagepng($image,$file)) {
                    return true;
                }
                return false;
            case 'gif':
                if (imagegif($image,$file)) {
                    return true;
                }
                return false;
            default:
                return false;
        }
    }

}

