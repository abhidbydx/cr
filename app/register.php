<?php 
	$params = unserialize(base64_decode(urldecode($_GET['param'])));
	print_r($params);
?>