<?php 
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-28-03
 * 	Purpose    : Generating random number
*/  
	function randomString($length=16) {		
		$chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		$str = "";   
		for ($i = 0; $i < $length; $i++) {
			$str .= $chars[mt_rand(0, strlen($chars) - 1)];
		}
		return $str;
	}
	

?>
