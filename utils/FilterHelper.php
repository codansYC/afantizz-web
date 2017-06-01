<?php
namespace  app\utils;

/**
 * 参数过滤辅助类
 * @author sunqiang@chushi007.com
 *
 */
class FilterHelper {
	/**
	 * 遍历 addslashes
	 *
	 * @param mixed $data
	 * @return mixed
	 */
	public static function filterData($data){
		if(is_array($data)){
			foreach($data as $key=>$val){
				$data[$key] = self::filterData($val);
			}
		}else{
			$data = self::filterText($data);
		}
		return $data;
	}

	public static function  filterText($str, $dirtyfilter=true, $filterEsc = true){
		$str = trim ( $str );
		$str = preg_replace ( '/[\a\f\e\0\x0B]/is', "", $str );
		$filter = $filterEsc;
		if ($filter)
		{
			$str = preg_replace ( '/[\n\r\t]/is', "", $str );
		}
		$str = htmlspecialchars ( $str, ENT_QUOTES );
		$str = self::filterTag ( $str );
		$str = self::filterCommon ( $str );
		if(false && $dirtyfilter)
		{
			$str = self::filterDirty ( $str );
		}
		return $str;
	}

	public static function filterCommon($str)
	{
		$str = str_replace ( "\0", "0", $str );
		$str = str_replace ( "&#032;", " ", $str );
		$str = preg_replace ( "/\\\$/", "&#036;", $str );
		$str = stripslashes ( $str );
		return $str;
	}

	public static function filterTag($str)
	{
		$str = str_ireplace ( "javascript", "j&#097;v&#097;v&amp;#097;script", $str );
		$str = str_ireplace ( "alert", "&#097;lert", $str );
		$str = str_ireplace ( "about:", "&#097;bout:", $str );
		$str = str_ireplace ( "onmouseover", "&#111;nmouseover", $str );
		$str = str_ireplace ( "onclick", "&#111;nclick", $str );
		$str = str_ireplace ( "onload", "&#111;nload", $str );
		$str = str_ireplace ( "onsubmit", "&#111;nsubmit", $str );
		$str = str_ireplace ( "<script", "&#60;script", $str );
		$str = str_ireplace ( "onerror", "&#111;nerror", $str );
		$str = str_ireplace ( "document.", "&#100;ocument.", $str );

		return $str;
	}

}
