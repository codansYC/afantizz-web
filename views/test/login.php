
<?php
/**
 * Created by PhpStorm.
 * User: lekuai
 * Date: 2017/6/21
 * Time: 下午9:13
 */
use yii\widgets\ActiveForm;
use yii\captcha\Captcha;
$form = ActiveForm::begin([
    'id' => 'login-form',
]);
?>
<?php
echo Captcha::widget(['name'=>'captchaimg','captchaAction'=>'test/captcha','imageOptions'=>['id'=>'captchaimg', 'title'=>'换一个', 'alt'=>'换一个', 'style'=>'cursor:pointer;margin-left:25px;'],'template'=>'{image}']);//我这里写的跟官方的不一样，因为我这里加了一个参数(login/captcha),这个参数指向你当前控制器名，如果不加这句，就会找到默认的site控制器上去，验证码会一直出不来，在style里是可以写css代码的，可以调试样式 ?>
<?php
ActiveForm::end();
?>