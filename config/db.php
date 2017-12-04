<?php

$pro = true;

if (!$pro) {
    return [
        'class' => 'yii\db\Connection',
        'dsn' => 'mysql:host=localhost;dbname=afantizz',
        'username' => 'root',
        'password' => '',
    ];
}
return [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=localhost;dbname=afantizz',
    'username' => 'root',
    'password' => '123456',
    'charset' => 'utf8',
];

