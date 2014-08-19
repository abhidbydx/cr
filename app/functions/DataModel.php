<?php 
	include('DataAccess.php');
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : Db operations to check email 
*/  
	function checkEmailDb($email){
		$query  = sprintf("SELECT email FROM cr_users where email='%s'", mysql_real_escape_string(stripslashes($email)));
		$result = executeQuery($query);
		if(mysql_num_rows($result)) {
			return true;
		}
		$query  = sprintf("SELECT email FROM 22959_users where email='%s'", mysql_real_escape_string(stripslashes($email)));
		$result = executeQuery($query);
		if(mysql_num_rows($result)) {
			return true;
		}
		return false;
	}

/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : Db operations for Sign Up 
*/  
	function getAllActiveProject($userId){
		$query = sprintf("SELECT p.id, p.name from 22959_project_users pu inner join 22959_projects p on (p.id=pu.project_id)
    where pu.user_id='%s' and p.status='active' group by pu.project_id", mysql_real_escape_string(stripslashes($userId)));
		$result = executeQuery($query);
		if(mysql_num_rows($result)) {
			$posts = array();
			while($post = mysql_fetch_assoc($result)) {
				$posts[] = $post;
			}
			return $posts;
		}
		return false;
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : Db operations for Sign Up Insertion 
*/  
	function signUpInsertDb($arrayObject){
		$query_insert_new_user = "INSERT INTO patient (firstname ,lastname , email ,password ,username,pincode,city,state,zip,street1,street2,phone,phone_is,country) VALUES (
						'".$arrayObject->FirstName."', '".$arrayObject->LastName."' ,  '".$arrayObject->email."',  '".$arrayObject->password."','".$arrayObject->username."','".$arrayObject->pincode."','".$arrayObject->city."','".$arrayObject->state."','".$arrayObject->zip."','".$arrayObject->address1."','".$arrayObject->address2."','".$arrayObject->phone."','".$arrayObject->typephone."','".$arrayObject->country."' )"; 
		$result = executeQuery($query_insert_new_user);
		$query = sprintf("SELECT patient_id,email,username FROM patient where username='%s'", mysql_real_escape_string(stripslashes($arrayObject->username)));
		$userDetail = executeQuery($query);
		if(mysql_num_rows($userDetail)) {
			while($detail = mysql_fetch_assoc($userDetail)) {
				$userDetails[] = $detail;
			}
			return $userDetails[0]['patient_id'];
		}
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : Db operations for Sign In 
*/  
	function signInDb($password,$userName){
		$query = sprintf("SELECT patient_id,email,username FROM patient where password='%s' and username='%s'", mysql_real_escape_string(stripslashes($password)), mysql_real_escape_string(stripslashes($userName)));
		$result = executeQuery($query);
		$posts = array();
		if(mysql_num_rows($result)) {
			while($post = mysql_fetch_assoc($result)) {
				$posts[] = $post;
			}
			return $posts[0]['patient_id'];
		}
		return false;
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : Db operations to check password
*/  
	function checkPasswordDb($password,$userName){
		$query = sprintf("SELECT email,username FROM patient where password='%s'and username='%s'", mysql_real_escape_string(stripslashes($password)), mysql_real_escape_string(stripslashes($userName)));
		$result = executeQuery($query);
		if(mysql_num_rows($result)) {
			return true;
		}
		return false;
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : Db operations to reset pincode
*/  
	function resetPincodeDb($pincode,$userName){
		$query = sprintf("update patient set pincode='%s' where username='%s'", mysql_real_escape_string(stripslashes($pincode)), mysql_real_escape_string(stripslashes($userName)));
		$result = executeQuery($query);
		return $result;
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : Db operations to validate signin process
*/  
	function validateSignedInDb($pincode,$userName){
		$query = sprintf("SELECT email,username FROM patient where pincode='%s' and username='%s'", mysql_real_escape_string(stripslashes($pincode)), mysql_real_escape_string(stripslashes($userName)));
		$result = executeQuery($query);
		if(mysql_num_rows($result)){
			return true;
		}
		return false;
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : Db operations to reset pincode
*/  
	function forgotPasswordDb($field,$value,$email,$responseField){
		$query = sprintf("SELECT password,username FROM patient where %s='%s' and email='%s'", $field, mysql_real_escape_string(stripslashes($value)), mysql_real_escape_string(stripslashes($email)));
		$result = executeQuery($query);
		$posts = array();
		if(mysql_num_rows($result)){
			while($post = mysql_fetch_assoc($result)) {
				$posts[] = $post;
			}
			return $posts[0][$responseField];
		}
		return false;
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : Db operations to update access token
*/  
	function updateAccessTokenDb($userId){
		$query = sprintf("SELECT id FROM user_token where userid='%s'", mysql_real_escape_string(stripslashes($userId)));
		$accessDetails = executeQuery($query);
		if(mysql_num_rows($accessDetails)) { 
			while($detail = mysql_fetch_assoc($accessDetails)) {
				$details[] = $detail;
			}
			return $details[0]['id'];
		}
		return false;
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : Db operations for Sign Up Insertion 
*/  
	function updateInsertTokenDb($userId,$token,$formatDate,$action){
		if($action=='update'){
			$updateQuery = sprintf("update user_token set accesstoken='%s',validtill='%s' where id='%s'", mysql_real_escape_string(stripslashes($token)), mysql_real_escape_string(stripslashes($formatDate)), mysql_real_escape_string(stripslashes($userId)));
			$result = executeQuery($updateQuery);
		}else if($action=='insert'){
			$query_insert_new_user = "INSERT INTO user_token (userid ,accesstoken , validtill) VALUES ('".$userId."', '".$token."' ,  '".$formatDate."' )"; 
			$result = executeQuery($query_insert_new_user);
		}
		return $result;
	}
?>
