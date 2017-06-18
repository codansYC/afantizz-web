<?php
//redis配置
if(YII_ENV_DEV || YII_ENV_TEST){
	defined('REDIS_ADDRESS') or define('REDIS_ADDRESS', '127.0.0.1');
	defined('REDIS_PORT') or define('REDIS_PORT', '5263');
	
	defined('REDIS_ADDRESS_MSG') or define('REDIS_ADDRESS_MSG', '127.0.0.1');
	defined('REDIS_PORT_MSG') or define('REDIS_PORT_MSG', '6381');
}else if(YII_ENV_PROD){
//	defined('REDIS_ADDRESS') or define('REDIS_ADDRESS', '10.169.102.147');
    defined('REDIS_ADDRESS') or define('REDIS_ADDRESS', '106.14.162.33');
	defined('REDIS_PORT') or define('REDIS_PORT', '22222');
//    defined('REDIS_ADDRESS_MSG') or define('REDIS_ADDRESS_MSG', '10.169.102.147');
    defined('REDIS_ADDRESS_MSG') or define('REDIS_ADDRESS_MSG', '106.14.162.33');
	defined('REDIS_PORT_MSG') or define('REDIS_PORT_MSG', '6381');
}

