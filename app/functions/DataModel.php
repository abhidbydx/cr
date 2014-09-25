<?php 
	include('DataAccess.php');
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-08-12
 * 	Purpose    : Db operations to check email 
*/  
	function checkEmailDb($email){
		$query  = sprintf("SELECT email,is_active FROM cr_users where email='%s'", mysql_real_escape_string(stripslashes($email)));
		$result = executeQuery($query);
		if(mysql_num_rows($result)) {
			$posts = array();
			while($post = mysql_fetch_assoc($result)) {
				$posts[] = $post;
			}
			if($posts[0]['is_active']==0) {
				$posts['status'] = 'inactive';
			} else {
				$posts['status'] = 'active';
			}
			return $posts;
		}
		$query  = sprintf("SELECT email,role_id FROM 22959_users where email='%s'", mysql_real_escape_string(stripslashes($email)));
		$result = executeQuery($query);
		if(mysql_num_rows($result)) {
			$posts = array();
			while($post = mysql_fetch_assoc($result)) {
				$posts[] = $post;
			}
			if($posts[0]['role_id']==21) {
				$posts['status'] = 'inactive';
			} else {
				$posts['status'] = 'active';
			}
			return $posts;
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
        	if(in_array($row['role_id'],array(1,28,16,3))) {
        		$_SESSION['USER_ID']=$row['id'];
	            $_SESSION['USER_NAME']=$row['first_name'].' '.$row['last_name'];                    
	            $userRegisterArr=array('name'=>$row['first_name'].' '.$row['last_name'],'id'=>$row['id'],'user'=>'pms');
	            return $userRegisterArr;
        	} else {
        		return 'invalid';
        	}
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
	function getAllActiveProject($userId,$userType){
		if($userType=='pms') {
			$query = sprintf("SELECT p.id, p.name, p.leader_name from 22959_project_users pu inner join 22959_projects p on (p.id=pu.project_id)
    where pu.user_id='%s' and p.status='active' group by pu.project_id", mysql_real_escape_string(stripslashes($userId)));
			$result = executeQuery($query);
			if(mysql_num_rows($result)) {
				$posts = $projectIds = array();
				while($post = mysql_fetch_assoc($result)) { 
					$post['encryptedProjectId'] = urlencode(base64_encode(serialize($post['id'])));
					$query = sprintf("SELECT concat(cu.first_name,' ',cu.last_name) as client,id from cr_users cu where FIND_IN_SET(%s, project_id)", mysql_real_escape_string(stripslashes($post['id'])));
					$clientResult = executeQuery($query);
					if(mysql_num_rows($clientResult)) {
						while($val = mysql_fetch_assoc($clientResult)) {
							$post['client'][$val['id']] = $val['client'];
						}
					} else {
						$post['client'] = '-';
					}
					$posts[] = $post;
				}
				return $posts;
			}
		} else {
			$query = sprintf("SELECT cu.project_id from cr_users cu where cu.id='%s'", mysql_real_escape_string(stripslashes($userId)));
			$result = executeQuery($query);
			if(mysql_num_rows($result)) {
				$posts = array();
				while($post = mysql_fetch_assoc($result)) {
					$posts[] = $post;
				}
				$projectIds = $posts[0]['project_id'];
			}
			$query = sprintf("SELECT p.id,p.name,p.leader_name from 22959_projects p where p.id in (%s)", mysql_real_escape_string(stripslashes($projectIds)));
		}		
		$result = executeQuery($query);
		if(mysql_num_rows($result)) {
			$posts = array();
			while($post = mysql_fetch_assoc($result)) {
				$post['encryptedProjectId'] = urlencode(base64_encode(serialize($post['id'])));
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
	function getAllProjectCrs($projectId,$userType='pms'){
		if($userType=='cr') {
			$query = sprintf("SELECT *,cp.id as crid, cf.is_deleted as file_deleted FROM cr_projects cp left join cr_files as cf on(cp.id=cf.cr_id) where cp.is_deleted=0 and cp.status!=1  and project_id='%s'", mysql_real_escape_string(stripslashes($projectId)));
		} else {
			$query = sprintf("SELECT *,cp.id as crid, cf.is_deleted as file_deleted FROM cr_projects cp left join cr_files as cf on(cp.id=cf.cr_id) where cp.is_deleted=0  and project_id='%s'", mysql_real_escape_string(stripslashes($projectId)));
		}
		
		$result = executeQuery($query);
		$posts = array();
		if(mysql_num_rows($result)) {
			while($post = mysql_fetch_assoc($result)) {
				if(!empty($post['real_name']) && $post['file_deleted']==0)
				$file_arr[$post['crid']][]=array('real_name'=>$post['real_name'],'file_name'=>$post['file_name']);
				$posts[$post['crid']] = array('file_name'=>$file_arr[$post['crid']],'id'=>$post['crid'],'title'=>$post['title'],'description'=>$post['description'],'status'=>$post['status'],'cr_date'=>date('jS M, Y',strtotime($post['cr_date'])),'created_by'=>$post['created_by'],'effort'=>$post['effort'],'action_date'=>date('jS M, Y',strtotime($post['action_taken_on'])));
			}
			return $posts;
		}
		return false;
	}

/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-09-24
 * 	Purpose    : Db operations for Sending mail to client 
*/  
	function sendMailToClientDb($data){
		$crId  = $data['response']['last_id'];
	    $query = sprintf("SELECT *,p.name as project_name,cp.id as crid, cf.is_deleted as file_deleted FROM cr_projects cp left join cr_files as cf on(cp.id=cf.cr_id) inner join 22959_projects as p on(p.id=cp.project_id) where cp.is_deleted=0 and cp.id='%s'", mysql_real_escape_string(stripslashes($crId)));
		$result = executeQuery($query);
		$crData = array();
		if(mysql_num_rows($result)) {
			while($post = mysql_fetch_assoc($result)) {
				if(!empty($post['real_name']) && $post['file_deleted']==0)
				$fileData[$post['crid']][]=array('real_name'=>$post['real_name'],'file_name'=>$post['file_name']);
				$crData['data'] = array('file_name'=>$fileData[$post['crid']],'id'=>$post['crid'],'title'=>$post['title'],'description'=>$post['description'],'status'=>$post['status'],'cr_date'=>date('jS M, Y',strtotime($post['cr_date'])),'created_by'=>$post['created_by'],'effort'=>$post['effort'],'action_date'=>date('jS M, Y',strtotime($post['action_taken_on'])),'is_billable'=>$post['is_billable'],'is_not_billable_reason'=>$post['is_not_billable_reason'],'actual_cost'=>$post['actual_cost'],'billed_cost'=>$post['billed_cost'],'actual_cost_currency'=>$post['actual_cost_currency'],'billed_cost_currency'=>$post['billed_cost_currency'],'send_on_secondary_email'=>$post['send_on_secondary_email'],'project_name'=>$post['project_name']);
			}
			if(!empty($data['response']['primaryClient'])) {
				$primaryData = $data['response']['primaryClient'];
				$clientID = sendMailCRInitiated($primaryData['email'],$primaryData['id'],$crData['data']);
				if ($primaryData['send_login_mail']) { //echo "sending login mail primary".$primaryData['send_login_mail'];
					sendLoginMail($primaryData['email'],$primaryData['id']);
				}
			}
			if(!empty($data['response']['secondaryClient'])) {
				$secondaryData = $data['response']['secondaryClient'];
				$clientID = sendMailCRInitiated($secondaryData['email'],$secondaryData['id'],$crData['data']);
				if ($secondaryData['send_login_mail']) {// echo "sending login mail secondary".$secondaryData['send_login_mail'];
					sendLoginMail($secondaryData['email'],$secondaryData['id']);
				}
			}
		} else {
			return array('Status'=>'Error','message'=>'Cr id cannnot be blank');
		}
		return getAllProjectCrs($data['projectId']);
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
 * 	Created On : 2014-08-22
 * 	Purpose    : Db operations for changing password
*/  
	function changePasswordDb($data){
		$user_id = $data['user_id'];
		$password = $data['current_passowrd'];
		$password = 'qgxKJ32HCKqEdPvZi4nx5ungMcPG003f106vg9nz' . $password;
        $password = sha1($password);
		$query = sprintf("SELECT id FROM cr_users WHERE password='%s' and id=%s", mysql_real_escape_string(stripslashes($password)), mysql_real_escape_string(stripslashes($user_id)));
        $result = executeQuery($query);
		$posts = array();
		if(mysql_num_rows($result)){ 
			$password = $data['new_passowrd'];
			$password = 'qgxKJ32HCKqEdPvZi4nx5ungMcPG003f106vg9nz' . $password;
	        $password = sha1($password);
			$query = sprintf("UPDATE cr_users set password='%s' WHERE id=%s", mysql_real_escape_string(stripslashes($password)), mysql_real_escape_string(stripslashes($user_id)));
        	$result = executeQuery($query);
			return $result;
		} else {
			return false;
		}
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-08-27
 * 	Purpose    : Db operations to get user details
*/  
	function getUserInfoDb($userId){
		$query = sprintf("SELECT email, first_name, last_name, mobile_no FROM cr_users where id='%s'", mysql_real_escape_string(stripslashes($userId)));
		$result = executeQuery($query);
		$posts = array();
		if(mysql_num_rows($result)){ 
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
 * 	Purpose    : Db operations to update user profile
*/  
	function updateUserInfoDb($arrayObject){
		$user_id = $arrayObject['user_id'];
		$first_name = $arrayObject['first_name'];
		$last_name = $arrayObject['last_name'];
		$mobile_no = $arrayObject['mobile_no'];
		$updateQuery = sprintf("update cr_users set first_name='%s',last_name='%s',mobile_no='%s' where id='%s'", mysql_real_escape_string(stripslashes($first_name)), mysql_real_escape_string(stripslashes($last_name)), mysql_real_escape_string(stripslashes($mobile_no)), mysql_real_escape_string(stripslashes($user_id)));
		$result = executeQuery($updateQuery);
		if($result) {
			$query = sprintf("SELECT email, first_name, last_name, mobile_no FROM cr_users where id='%s'", mysql_real_escape_string(stripslashes($user_id)));
			$result = executeQuery($query);
			$posts = array();
			if(mysql_num_rows($result)){ 
				while($post = mysql_fetch_assoc($result)) {
					$posts[] = $post;
				}
				return $posts;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

/*
 *	Created By : Abhishek kumar
 * 	Created On : 2014-20-08
 * 	Purpose    : Db operations for insetion of cr 
*/  
	function insertCR($data){
	    $project_id   =$data['project_id'];
	    $effort = $actual_cost = $billed_cost = 0;
	    $actual_cost_currency = $billed_cost_currency = 1;
	    $crTitle      =$data['crtitle'];
	    $crDesc       =$data['crdesc'];
	    $crDate       =date('Y-m-d H:i:s',strtotime($data['cr_date']));
	    $crCreated    =$data['created_by'];
	    $effort       =$data['creffort'];
	    $crbillable   =$data['crbillable'];
	    if(!empty($data['effort'])) {
	    	$effort = $data['effort'];
	    }
	    if(!empty($data['actual_cost_currency'])) {
	    	$actual_cost_currency = $data['actual_cost_currency'];
	    }
	    if(!empty($data['actual_cost'])) {
	    	$actual_cost = $data['actual_cost'];
	    }
	    if(!empty($data['billed_cost_currency'])) {
	    	$billed_cost_currency = $data['billed_cost_currency'];
	    }
	    if(!empty($data['billed_cost'])) {
	    	$billed_cost = $data['billed_cost'];
	    }
	    $billable_reason  = $data['billable_reason'];
	    $status = '1';
	    if($data['cameFrom']=='publish') {
	    	$status = '2';
	    }
	    $send_on_secondary_email = 0;
	    if($data['client_secondary_email']) {
	    	$send_on_secondary_email = 1;
	    }
		$query  = "INSERT INTO cr_projects (project_id ,title , description, cr_date,created_by,effort,is_billable,is_not_billable_reason,actual_cost,billed_cost,actual_cost_currency,billed_cost_currency,created,modified,status,send_on_secondary_email) VALUES ('".$project_id."', '".$crTitle."' ,  '".$crDesc."','".$crDate."',".$crCreated.",".$effort.",".$crbillable.",'".$billable_reason."',".$actual_cost.",".$billed_cost.",".$actual_cost_currency.",".$billed_cost_currency.",NOW(),NOW(),'".$status."','".$send_on_secondary_email."')"; 
		$result = executeQuery($query);
		$last_id= mysql_insert_id(); 
		if($last_id) {
			if($data['cameFrom']=='publish') {
		    	$clientEmail = $data['client_email'];
		    	$primaryClient = $secondaryClient = array();
		    	$clientDetails = registerCrUser($clientEmail,$project_id,1);
		    	$primaryClient['email'] = $clientEmail;
		    	$primaryClient['id'] = $clientDetails['client_id'];
		    	$primaryClient['send_login_mail'] = $clientDetails['send_mail'];
		    	if($send_on_secondary_email==1) {
		    		$secondaryEmail = $data['client_secondary_email'];
		    		$clientDetails = registerCrUser($secondaryEmail,$project_id,0);
		    		$secondaryClient['email'] = $secondaryEmail;
			    	$secondaryClient['id'] = $clientDetails['client_id'];
			    	$secondaryClient['send_login_mail'] = $clientDetails['send_mail'];
		    	}
		    }
			$data['cr_id'] = $last_id;
			insertCRLog($data,'add');
		}	
		return array('last_id'=>$last_id,'primaryClient'=>$primaryClient,'secondaryClient'=>$secondaryClient);
	}

/*
 *	Created By : Abhishek kumar
 * 	Created On : 2014-20-08
 * 	Purpose    : Db operations for deletion of cr 
*/  
	function deleteCRData($data){
	    $cr_id   =$data['id'];		   
	    $modified_by   =$data['modified_by'];		    
		$query = "UPDATE cr_projects set is_deleted=1,modified_by=".$modified_by." where id=".$cr_id; 
		$result = executeQuery($query);
		if($result) {
			insertCRLog($data,'delete');
		}	
		return $result;
	}

/*
 *	Created By : Abhishek kumar
 * 	Created On : 2014-20-08
 * 	Purpose    : Db operations for updation of cr 
*/  
	function updateCRData($data){
	    $cr_id        =$data['id'];
	    $crTitle      =$data['crtitle'];
	    $crDesc       =$data['crdesc'];
	    $crStatus     =$data['crstatus'];
	    $cr_effort     =$data['creffort'];
	    $cr_billable     =$data['crbillable'];
	    $actual_cost_currency     =$data['actual_cost_currency'];
	    $actual_cost     =$data['actual_cost'];
	    $billed_cost_currency     =$data['billed_cost_currency'];
	    $billed_cost     =$data['billed_cost'];
	    $billable_reason     =$data['billable_reason'];
	    $crReason     =$data['crreason'];
	    $crDate       =date('Y-m-d H:i:s',strtotime($data['cr_date']));
	    $action_taken_on = null;
	    if(!empty($data['action_taken_on'])) {
	    	$action_taken_on       =date('Y-m-d H:i:s',strtotime($data['action_taken_on']));
	    }
	    $send_on_secondary_email = 0;
	    if($data['client_secondary_email']) {
	    	$send_on_secondary_email = 1;
	    }
	    $crCreated    =$data['created_by'];
	    if($crStatus!=3) $crReason='';
		$query = "UPDATE cr_projects set title='$crTitle', description='$crDesc' , status='$crStatus', modified_by='$crCreated',reason='$crReason',effort='$cr_effort',is_billable='$cr_billable',is_not_billable_reason='$billable_reason',actual_cost='$actual_cost',billed_cost='$billed_cost',actual_cost_currency='$actual_cost_currency',billed_cost_currency='$billed_cost_currency',action_taken_on='$action_taken_on',send_on_secondary_email='$send_on_secondary_email' where id=".$cr_id; 
		$result = executeQuery($query);
		if($result) {
			insertCRLog($data,'update');
		}	
		return $result;
	}

/*
 *	Created By : Abhishek kumar
 * 	Created On : 2014-20-08
 * 	Purpose    : Db operations for get of cr by id
*/  
	function getCRDataByID($data){
	    $cr_id   =$data['id'];		    
		$query = "SELECT *,cp.id as crid, cf.is_deleted as file_deleted from cr_projects as cp left join cr_files as cf on(cp.id=cf.cr_id) where cp.id=".$cr_id; 
		$result = executeQuery($query);
		if(mysql_num_rows($result)) {
			while($post = mysql_fetch_assoc($result)) {
				if(!empty($post['real_name']) && $post['file_deleted']==0)
					$file_arr[$post['crid']][]=array('real_name'=>$post['real_name'],'file_name'=>$post['file_name']);
					$posts = array('file_name'=>$file_arr[$post['crid']],'id'=>$post['crid'],'title'=>$post['title'],'description'=>$post['description'],'status'=>$post['status'],'cr_date'=>date('jS M, Y',strtotime($post['cr_date'])),'created_by'=>$post['created_by'],'reason'=>$post['reason'],'effort'=>$post['effort'],'is_billable'=>$post['is_billable'],'is_not_billable_reason'=>$post['is_not_billable_reason'],'actual_cost'=>$post['actual_cost'],'billed_cost'=>$post['billed_cost'],'actual_cost_currency'=>$post['actual_cost_currency'],'billed_cost_currency'=>$post['billed_cost_currency'],'send_on_secondary_email'=>$post['send_on_secondary_email']);
			}
			return $posts;
		}
		return false;		
	}

/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-09-01
 * 	Purpose    : Db operations for maintaining CR logs
*/  
	function insertCRLog($data,$cameFrom){
		if($cameFrom=='add') {
			$cr_project_id   = $data['cr_id'];
		    $crTitle      = $data['crtitle'];
		    $crDesc       = $data['crdesc'];
		    $modified_by    = $data['created_by'];
		    $user_type    = $data['user'];
		    $query  = "INSERT INTO cr_logs (cr_project_id ,title , description, modified_by, user_type, created, modified) VALUES ('".$cr_project_id."', '".$crTitle."' ,  '".$crDesc."',".$modified_by.",'".$user_type."',NOW() , NOW())"; 
		   
		}
		if($cameFrom=='update') {
			$cr_id        =$data['id'];
		    $crTitle      =$data['crtitle'];
		    $crDesc       =$data['crdesc'];
		    $crStatus     =$data['crstatus'];
		    $modified_by    =$data['created_by'];
		    $user_type    = $data['user'];
		    $query  = "INSERT INTO cr_logs (cr_project_id ,title , description, status, modified_by, user_type, created, modified) VALUES ('".$cr_id."', '".$crTitle."' ,  '".$crDesc."' ,  '".$crStatus."',".$modified_by.",'".$user_type."',NOW() , NOW())"; 
		}
		if($cameFrom=='delete') {
			$cr_id =$data['id'];
			$user_type = $data['user'];
			$modified_by = $data['modified_by'];
			$query =  "select title, description, status, is_deleted from cr_projects where id=".$cr_id;
		    $crDetails = executeQuery($query);
		    $logData = array();
			if(mysql_num_rows($crDetails)){ 
				while($post = mysql_fetch_assoc($crDetails)) {
					$logData = array('title'=> $post['title'], 'description'=> $post['description'], 'status'=> $post['status']);
				}
			}
		    $query  = "INSERT INTO cr_logs (cr_project_id ,title , description, status, modified_by,is_deleted, user_type, created, modified) VALUES ('".$cr_id."', '".$logData['title']."' ,  '".$logData['description']."' ,  '".$logData['status']."',".$modified_by.",1,'".$user_type."',NOW() , NOW())"; 
		}
		executeQuery($query);
	}
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-09-16
 * 	Purpose    : Db operations to get client details
*/  
	function getPrimaryClientDb($pId){
		$query = sprintf("SELECT id,email, first_name, last_name, phone_no,secondary_email, project_id FROM cr_clients where project_id='%s'", mysql_real_escape_string(stripslashes($pId)));
		$result = executeQuery($query);
		$posts = array();
		if(mysql_num_rows($result)){ 
			while($post = mysql_fetch_assoc($result)) {
				$posts[] = $post;
			}
			return $posts;
		}
		return false;
	}
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-09-17
 * 	Purpose    : Db operations to get all client details
*/  
	function getAllClientsDb($userId){
		$query = sprintf("SELECT p.id, p.name, p.leader_name from 22959_project_users pu inner join 22959_projects p on (p.id=pu.project_id)
    where pu.user_id='%s' and p.status='active' group by pu.project_id", mysql_real_escape_string(stripslashes($userId)));
		$result = executeQuery($query);
		$projectIds = array();
		if(mysql_num_rows($result)){ 
			while($post = mysql_fetch_assoc($result)) {
				$projectIds[] = $post['id'];
			}
		}
		if(!empty($projectIds)) {
			$query = sprintf("SELECT cc.id client_id,p.id project_id,cc.email, cc.first_name, cc.last_name, cc.phone_no,cc.secondary_email, p.name FROM cr_clients cc inner join 22959_projects p on (p.id=cc.project_id) where project_id in (%s)", mysql_real_escape_string(stripslashes(implode(",",$projectIds))));
			$result = executeQuery($query);
			$posts = array();
			if(mysql_num_rows($result)){ 
				while($post = mysql_fetch_assoc($result)) {
					$posts[] = $post;
				}
				return array('status' => 'Success', 'details' => $posts);
			} else {
				return array('status' => 'Error', 'message' => "There are no clients associated to any project.");
			}
		}
		return array('status' => 'Error', 'message' => "There are no project allocated to you.");
	}

/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-09-18
 * 	Purpose    : Db operations to update client details
*/  
	function updateClientDetailDb($data){
		$query = sprintf("SELECT id,project_id FROM cr_clients where id='%s'", mysql_real_escape_string(stripslashes($data['client_id'])));
		$result = executeQuery($query);
		if(mysql_num_rows($result)){
			while($post = mysql_fetch_assoc($result)) {
				$clientProjectId = $post['project_id'];
			}
			if($clientProjectId==$data['project_id']) {
				$query = "UPDATE cr_clients set first_name='".$data['first_name']."', last_name='".$data['last_name']."' , email='".$data['email']."', secondary_email='".$data['secondary_email']."',phone_no='".$data['phone_no']."',modified=NOW(),modified_by='".$data['user_id']."' where project_id=".$data['project_id']; 
				$result = executeQuery($query);
				if($result) {
					return getAllClientsDb($data['user_id']);
				}
			} else {
				$query = sprintf("SELECT id FROM cr_clients where project_id='%s'", mysql_real_escape_string(stripslashes($data['project_id'])));
				$result = executeQuery($query);
				if(mysql_num_rows($result)){ 
					return array('status' => 'Error', 'message' => "There is already a client associated to this project.");
				} else {
					$query = "UPDATE cr_clients set first_name='".$data['first_name']."', last_name='".$data['last_name']."' , email='".$data['email']."', secondary_email='".$data['secondary_email']."',phone_no='".$data['phone_no']."',modified=NOW(),modified_by='".$data['user_id']."' where project_id=".$data['project_id']; 
					$result = executeQuery($query);
					if($result) {
						return getAllClientsDb($data['user_id']);
					}		
				}
			}			
		} else {
			return array('status' => 'Error', 'message' => "Something went wrong.");
		}
	}

/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-09-18
 * 	Purpose    : Db operations to insert client details
*/  
	function saveClientDetailDb($data){
		$query = sprintf("SELECT id FROM cr_clients where project_id='%s'", mysql_real_escape_string(stripslashes($data['project_id'])));
		$result = executeQuery($query);
		if(mysql_num_rows($result)){ 
			return array('status' => 'Error', 'message' => "There is already a client associated to this project.");
		} else {
			$query = "INSERT INTO cr_clients(project_id,created_by,created,modified,modified_by,first_name,last_name,email,secondary_email,phone_no) VALUES (".$data['project_id'].",".$data['user_id'].",NOW(),NOW(),".$data['user_id'].",'".$data['first_name']."','".$data['last_name']."' , '".$data['email']."','".$data['secondary_email']."','".$data['phone_no']."')"; 
			$result = executeQuery($query);
			if($result) {
				return getAllClientsDb($data['user_id']);
			}			
		}
	}

/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-09-19
 * 	Purpose    : Db operations to register client details
*/  
	function registerCrUser($email,$project_id,$isPrimary=1){
		$query  = sprintf("SELECT email,is_active,id FROM cr_users where email='%s'", mysql_real_escape_string(stripslashes($email)));
		$result = executeQuery($query);
		if(mysql_num_rows($result)) {
			$posts = array();
			while($post = mysql_fetch_assoc($result)) {
				$posts[] = $post;
			}
			//if($posts[0]['is_active']==0) {
			//	$query_insert_new_user = "UPDATE cr_users set is_active=1 where email='".$email."'"; 
			//	$result = executeQuery($query_insert_new_user);
			//} 
			return array('client_id'=>$posts[0]['id'],'send_mail'=>false);
		} else {
			if($isPrimary==1) {
				$query = sprintf("SELECT first_name, last_name, phone_no, project_id FROM cr_clients where email='%s'", mysql_real_escape_string(stripslashes($email)));
				$result = executeQuery($query);
				$posts = array();
				if(mysql_num_rows($result)){ 
					while($post = mysql_fetch_assoc($result)) {
						$query_insert_new_user = "INSERT INTO cr_users (first_name ,last_name , email  ,project_id,created) VALUES (
							'".$post['first_name']."', '".$post['last_name']."' ,  '".$email."','".$project_id."',NOW() )"; 
						$result = executeQuery($query_insert_new_user);
					}
				}
			} else {
				$query_insert_new_user = "INSERT INTO cr_users (  email ,project_id,created) VALUES (
							 '".$email."','".$project_id."',NOW() )"; 
				$result = executeQuery($query_insert_new_user);
			}
			$QueryUser = sprintf("SELECT id FROM cr_users WHERE email='%s' and is_active=1", mysql_real_escape_string(stripslashes($email)));
	        $result = executeQuery($QueryUser);
	        $row = mysql_fetch_array($result);
	        $num_of_row = mysql_num_rows($result);  
	        if($num_of_row>0) {
	        	return array('client_id'=>$row['id'],'send_mail'=>true);  
	        } 
		}
	}

/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-09-22
 * 	Purpose    : Db operations to publish CR
*/  
	function publishCrDb($data){
		$crId = $data['cr_id'];
		$modified_by = $data['modified_by'];
		$query = "UPDATE cr_projects set status='2',modified_by=".$modified_by." where id=".$crId; 
		$result = executeQuery($query);
		$query = sprintf("SELECT *,p.name as project_name,cp.id as crid, cf.is_deleted as file_deleted,cc.email,cc.secondary_email,cc.first_name,cc.last_name FROM cr_projects cp left join cr_files as cf on(cp.id=cf.cr_id) left join cr_clients cc on (cp.project_id=cc.project_id) inner join 22959_projects p on (p.id=cp.project_id) where cp.is_deleted=0 and cp.id='%s'", mysql_real_escape_string(stripslashes($crId)));
		$result = executeQuery($query);
		if(mysql_num_rows($result)) {
			$crData = array();
			while($post = mysql_fetch_assoc($result)) {
				if(!empty($post['real_name']) && $post['file_deleted']==0)
				$fileData[$post['crid']][]=array('real_name'=>$post['real_name'],'file_name'=>$post['file_name']);
				$crData['data'] = array('file_name'=>$fileData[$post['crid']],'project_id'=>$post['project_id'],'id'=>$post['crid'],'title'=>$post['title'],'description'=>$post['description'],'status'=>$post['status'],'cr_date'=>date('jS M, Y',strtotime($post['cr_date'])),'created_by'=>$post['created_by'],'effort'=>$post['effort'],'action_date'=>date('jS M, Y',strtotime($post['action_taken_on'])),'send_on_secondary_email'=>$post['send_on_secondary_email'],'is_billable'=>$post['is_billable'],'is_not_billable_reason'=>$post['is_not_billable_reason'],'actual_cost'=>$post['actual_cost'],'billed_cost'=>$post['billed_cost'],'actual_cost_currency'=>$post['actual_cost_currency'],'billed_cost_currency'=>$post['billed_cost_currency'],'project_name'=>$post['project_name']);
				$crData['clients'] = array('primary'=>$post['email'],'secondary'=>$post['secondary_email']);
			}
		}
		$row = mysql_fetch_array($result);
        $num_of_row = mysql_num_rows($result);  
		if(!empty($crData['clients']['primary'])) {
			$clientDetails = registerCrUser($crData['clients']['primary'],$crData['data']['project_id'],1);
			$clientID = sendMailCRInitiated($crData['clients']['primary'],$clientDetails['client_id'],$crData['data']);
	    	if($clientDetails['send_mail']) {
	    		$loginEmail = sendLoginMail($crData['clients']['primary'],$clientDetails['client_id']);
	    	}
			if($crData['data']['send_on_secondary_email']==1) {
				if(!empty($crData['clients']['secondary'])) {
					$clientDetails = registerCrUser($crData['clients']['secondary'],$crData['data']['project_id'],0);
					$clientID = sendMailCRInitiated($crData['clients']['secondary'],$clientDetails['client_id'],$crData['data']);
			    	if($clientDetails['send_mail']) {
			    		$loginEmail = sendLoginMail($crData['clients']['secondary'],$clientDetails['client_id']);
			    	}
				}
			} 
		}
		return getAllProjectCrs($crData['data']['project_id']);
	}

/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-09-22
 * 	Purpose    : Db operations to publish CR
*/  
	function updateCrActionDb($data){
		$crId = $data['cr_id'];
		$modified_by = $data['client_id'];
		if($data['action']=='approve') {
			$status = 3;
		}
		if($data['action']=='reject') {
			$status = 4;
		}
		$action_taken_on       =date('Y-m-d H:i:s');
		$query = "UPDATE cr_projects set status='".$status."',modified_by=".$modified_by.",action_taken_on='".$action_taken_on."' where id=".$crId; 
		$result = executeQuery($query);
		return true;
	}
?>