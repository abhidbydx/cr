<?php 
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-28-03
 * 	Purpose    : Maintaining log
*/   
	function writeLog($message,$request,$response){
		  $request  = "Request:".$request;
		  $response = "Response:".$response;
		  $serverPath = getcwd();
		  echo $logfile    = $serverPath."/logs/default.log";
		  if( ($time = $_SERVER['REQUEST_TIME']) == '') {
			   $time = time();
		  }
		  if( ($remote_addr = $_SERVER['REMOTE_ADDR']) == '') {
			   $remote_addr = "REMOTE_ADDR_UNKNOWN";
		  }
		  if( ($request_uri = $_SERVER['REQUEST_URI']) == '') {
				$request_uri = "REQUEST_URI_UNKNOWN";
		  }
		  $date = date("Y-m-d H:i:s", $time);
 
		  if (file_exists($logfile)) {
				if($fd = @fopen($logfile, "a")) {
					
					$result = fputcsv($fd, array($date, $remote_addr, $request_uri, $message,$request,$response));
					fclose($fd);
					
					if($result > 0)
						return array(status => true);  
					else
						return array(status => false, message => 'Unable to write to '.$logfile.'!');
				} else {
					return array(status => false, message => 'Unable to open log '.$logfile.'!');
				}
		}else{ echo "DD".$logfile;
			if($fd = @fopen($logfile, "w")) {
				$result = fputcsv($fd, array($date, $remote_addr, $request_uri, $message,$request,$response));
				fclose($fd);
				if($result > 0)
				  return array(status => true);  
				else
				  return array(status => false, message => 'Unable to write to '.$logfile.'!');
			} else {
				return array(status => false, message => 'Unable to open log '.$logfile.'!');
			}
		}
	}
	
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
	
	/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : maintain access token
*/
	function updateAccessToken($userId){
		$currentDate = strtotime(date("Y-m-d H:i:s"));
		$futureDate = $currentDate+(60*30);
		$formatDate = date("Y-m-d H:i:s", $futureDate);
		$token = randomString();
		$id = updateAccessTokenDb($userId);
		$details = array();
		if($id) { 
			$result = updateInsertTokenDb($id,$token,$formatDate,'update');
			return $token;
		}else{
			$results_insert_new_user = updateInsertTokenDb($userId,$token,$formatDate,'insert');
			return $token;
		}
	}
?>
