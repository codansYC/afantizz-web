<?php

$dev = false;
$debug = false;

$devDB = [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=127.0.0.1;dbname=afantizz',
    'username' => 'root',
    'password' => '',
];

$debugDB = [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=localhost;dbname=afantizz_test',
    'username' => 'root',
    'password' => '123456',
    'charset' => 'utf8',
];

$DB = [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=localhost;dbname=afantizz',
    'username' => 'root',
    'password' => '123456',
    'charset' => 'utf8',
];


return $dev ? $devDB : ($debug ? $debugDB : $DB);
