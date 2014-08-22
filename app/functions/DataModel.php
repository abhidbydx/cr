<?php 
	include('DataAccess.php');
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-08-12
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
 * 	Created On : 2014-08-14
 * 	Purpose    : Db operations to check login 
*/  
	function checkLoginDb($userName,$pwd){ 
		$password = 'qgxKJ32HCKqEdPvZi4nx5ungMcPG003f106vg9nz' . $pwd;
        $password = sha1($password);
        $QueryUser = sprintf("SELECT * FROM 22959_users WHERE email='%s' AND password='%s' and role_id!=21", mysql_real_escape_string(stripslashes($userName)), mysql_real_escape_string(stripslashes($password)));
        $result = executeQuery($QueryUser);
        $row = mysql_fetch_array($result);
        $num_of_row = mysql_num_rows($result);       
        if($num_of_row>0) {         	
            $_SESSION['USER_ID']=$row['id'];
            $_SESSION['USER_NAME']=$row['first_name'].' '.$row['last_name'];                    
            $userRegisterArr=array('name'=>$row['first_name'].' '.$row['last_name'],'id'=>$row['id'],'user'=>'pms');
            return $userRegisterArr;
        } else {
        	$QueryUser = sprintf("SELECT * FROM cr_users WHERE email='%s' AND password='%s' and is_active=1", mysql_real_escape_string(stripslashes($userName)), mysql_real_escape_string(stripslashes($password)));
	        $result = executeQuery($QueryUser);
	        $row = mysql_fetch_array($result);
	        $num_of_row = mysql_num_rows($result);  
	        if($num_of_row>0) {         	
	            $_SESSION['USER_ID']=$row['id'];
	            $_SESSION['USER_NAME']=$row['first_name'].' '.$row['last_name'];                    
	            $userRegisterArr=array('name'=>$row['first_name'].' '.$row['last_name'],'id'=>$row['id'],'user'=>'cr');
	            return $userRegisterArr;
	        } else {
	        	return false;
	        }   
        }
	}

/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : Db operations to get all active projects
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
 * 	Created On : 2014-08-20
 * 	Purpose    : Db operations for getting projects
*/  
	function getProjects($projectId){
		$projectId = implode(",",$projectId);
		$query = sprintf("SELECT name,id FROM 22959_projects where id in (%s)", mysql_real_escape_string(stripslashes($projectId)));
		$result = executeQuery($query);
		$posts = array();
		if(mysql_num_rows($result)) {
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
 * 	Purpose    : Db operations for Sign In 
*/  
	function getAllProjectCrs($projectId){
		$query = sprintf("SELECT * FROM cr_projects where project_id='%s'", mysql_real_escape_string(stripslashes($projectId)));
		$result = executeQuery($query);
		$posts = array();
		if(mysql_num_rows($result)) {
			while($post = mysql_fetch_assoc($result)) {
				$posts[] = $post;
			}
			return $posts;
		}
		return false;
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-08-22
 * 	Purpose    : Db operations for registration
*/  
	function signupDb($data){
		$email = $data['email'];
		$password = $data['password'];
		$password = 'qgxKJ32HCKqEdPvZi4nx5ungMcPG003f106vg9nz' . $password;
        $password = sha1($password);
		$first_name = $data['first_name'];
		$last_name = $data['last_name'];
		$projectIds = implode(",",$data['projectIds']);
		$query_insert_new_user = "INSERT INTO cr_users (first_name ,last_name , email ,password ,project_id,created) VALUES (
						'".$first_name."', '".$last_name."' ,  '".$email."',  '".$password."','".$projectIds."',NOW() )"; 
		$result = executeQuery($query_insert_new_user);
		$QueryUser = sprintf("SELECT * FROM cr_users WHERE email='%s' AND password='%s' and is_active=1", mysql_real_escape_string(stripslashes($email)), mysql_real_escape_string(stripslashes($password)));
        $result = executeQuery($QueryUser);
        $row = mysql_fetch_array($result);
        $num_of_row = mysql_num_rows($result);  
        if($num_of_row>0) {         	
            $_SESSION['USER_ID']=$row['id'];
            $_SESSION['USER_NAME']=$row['first_name'].' '.$row['last_name'];                    
            $userRegisterArr=array('name'=>$row['first_name'].' '.$row['last_name'],'id'=>$row['id'],'user'=>'cr');
            return $userRegisterArr;
        } else {
        	return false;
        }   
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
	/*
 *	Created By : Abhishek kumar
 * 	Created On : 2014-20-08
 * 	Purpose    : Db operations for insetion of cr 
*/  
	function insertCR($data){
		    $project_id   =$data['project_id'];
		    $crTitle      =$data['crtitle'];
		    $crDesc       =$data['crdesc'];
		    $crDate       =date('Y-m-d H:i:s',strtotime($data['cr_date']));
		    $crCreated    =$data['created_by'];
			echo $query = "INSERT INTO cr_projects (project_id ,title , description, cr_date,created_by) VALUES ('".$project_id."', '".$crTitle."' ,  '".$crDesc."','".$crDate."',".$crCreated." )"; 
			$result = executeQuery($query);
		
		return $result;
	}

?>
