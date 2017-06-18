<?php
namespace  app\utils;

use \Redis;
/**
 * Redis缓存工具类
 * @author sunqiang
 *
 */
class RedisUtil {
	public static function getRedisConn($type = 'xz'){

		if (!extension_loaded('redis')) {
			dl('redis.so');
		}
		$redis = new Redis();

		if($type == 'xz'){
			$redis->pconnect(REDIS_ADDRESS,REDIS_PORT);
		}else{
			$redis->pconnect(REDIS_ADDRESS_MSG,REDIS_PORT_MSG);
		}

		return $redis;
	}

	/**
	 * 设置键的生成时间
	 */
	public static function expire($key,$lifeTime,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->setTimeout($key,$lifeTime);
		return $result;
	}
	
	/**
	 * 设置缓存
	 * @param string $cachename
	 * @param mixed $value
	 * @param int $lifeTime
	 * @return boolean
	 */
	public static function setCache($cachename, $value, $lifeTime=0,$type = 'xz'){

		$redis = self::getRedisConn($type);

		if($lifeTime){// 带生存时间的写入
			$result = $redis->setex($cachename,$lifeTime,$value);
		}else{
			$result = $redis->set($cachename, $value);
		}

		return $result;
	}

	/**
	 * 获取缓存
	 * @param string $cachename
	 * @return mixed
	 */
	public static function getCache($cachename,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->get($cachename);
		return $result;
	}

	/**
	 * 删除缓存
	 * @param string $cachename
	 * @return mixed
	 */
	public static function delCache($cachename,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->delete($cachename);
		return $result;
	}

	public static function setnx($name, $value,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->setnx($name, $value);
		return $result;
	}

	/**
	 * 递增键值
	 * @param unknown $key
	 */
	public static function incr($key,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->incr($key);
		return $result;
	}
	
	/**
	 * 带生存时间的写入,默认30秒
	 */
	public static function setex($name, $life=30, $value,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->setex($name, $life, $value);
		return $result;
	}

	public static function hSet($table,$key,$value,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->hSet($table,$key,$value);
		return $result;
	}

	public static function hGet($table,$key,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->hGet($table,$key);
		return $result;
	}

	public static function hDel($table,$key,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->hDel($table,$key);
		return $result;
	}

	//向名称为key的hash中批量添加元素
	public static function hMset($key,$data,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->hMset($key,$data);
		return $result;
	}

	public static function hGetAll($table,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->hGetAll($table);
		return $result;
	}

	// 有序集合
	public static function zAdd($key, $score, $member,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->zAdd($key, $score, $member);
		return $result;
	}
	public static function zScore($key, $member,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->zScore($key, $member);
		return $result;
	}

	// 无序集合
	public static function sAdd($key, $value,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->sAdd($key, $value);
		return $result;
	}
	// 名称为key的集合中查找是否有value元素，有ture 没有 false
	public static function sIsMember($key, $value,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->sIsMember($key, $value);
		return $result;
	}

	public static function sMembers($key,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->sMembers($key);
		return $result;
	}

	public static function sCard($key,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->sCard($key);
		return $result;
	}

	// 在名称为key的list左边（头）添加一个值为value的 元素，返回0和1。左进
	public static function pushList($key, $value,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->lPush($key, $value);
		return $result;
	}

	// 返回名称为key的list中元素并删除。右出
	public static function popList($key,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->rPop($key);
		return $result;
	}

	//删除无序集合中的元素
	public static function sRemove($set,$key,$type = 'xz'){
	    $redis = self::getRedisConn($type);
	    $result = $redis->sRem($set,$key);
	    return $result;
	}
	
	//删除无序集合中的元素
	public static function lPush($listKey,$value,$type = 'xz'){
		$redis = self::getRedisConn($type);
		$result = $redis->lPush($listKey,$value);
		return $result;
	}
	
}















