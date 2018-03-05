<?php

// comment out the following two lines when deployed to production
defined('YII_DEBUG') or define('YII_DEBUG', true);
defined('YII_ENV') or define('YII_ENV', 'dev');

require(__DIR__ . '/../vendor/autoload.php');
require(__DIR__ . '/../vendor/yiisoft/yii2/Yii.php');
$hostname = bin2hex(gethostname());
$machine_id = base_convert($hostname,16,10) % 100;
defined('MACHINE_ID') or define('MACHINE_ID', $machine_id);

$config = require(__DIR__ . '/../config/web.php');


(new yii\web\Application($config))->run();