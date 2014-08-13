<?php 
	$link = mysql_connect(DBHOST,DBUSER,DBPASS) or die('Cannot connect to the DB');
	mysql_select_db(DBNAME,$link) or die('Cannot select the DB');
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : Generating random number
*/  
	function executeQuery($query) {		
		$result = mysql_query($query); 
		if($result==false){
			throw new Exception('DB Access Exception');
		}
		return $result;
	}
?>
