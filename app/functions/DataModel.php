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
	function getAllActiveProject($userId,$userType){
		if($userType=='pms') {
			$query = sprintf("SELECT p.id, p.name, p.leader_name from 22959_project_users pu inner join 22959_projects p on (p.id=pu.project_id)
    where pu.user_id='%s' and p.status='active' group by pu.project_id", mysql_real_escape_string(stripslashes($userId)));
			$result = executeQuery($query);
			if(mysql_num_rows($result)) {
				$posts = $projectIds = array();
				while($post = mysql_fetch_assoc($result)) { 
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
	function getAllProjectCrs($projectId){
		$query = sprintf("SELECT *,cp.id as crid, cf.is_deleted as file_deleted FROM cr_projects cp left join cr_files as cf on(cp.id=cf.cr_id) where cp.is_deleted=0  and project_id='%s'", mysql_real_escape_string(stripslashes($projectId)));
		$result = executeQuery($query);
		$posts = array();
		if(mysql_num_rows($result)) {
			while($post = mysql_fetch_assoc($result)) {
				if(!empty($post['real_name']) && $post['file_deleted']==0)
				$file_arr[$post['crid']][]=array('real_name'=>$post['real_name'],'file_name'=>$post['file_name']);
				$posts[$post['crid']] = array('file_name'=>$file_arr[$post['crid']],'id'=>$post['crid'],'title'=>$post['title'],'description'=>$post['description'],'status'=>$post['status'],'cr_date'=>$post['cr_date'],'created_by'=>$post['created_by']);
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
	    $crTitle      =$data['crtitle'];
	    $crDesc       =$data['crdesc'];
	    $crDate       =date('Y-m-d H:i:s',strtotime($data['cr_date']));
	    $crCreated    =$data['created_by'];
		$query  = "INSERT INTO cr_projects (project_id ,title , description, cr_date,created_by) VALUES ('".$project_id."', '".$crTitle."' ,  '".$crDesc."','".$crDate."',".$crCreated." )"; 
		$result = executeQuery($query);
		$last_id= mysql_insert_id();
		if($last_id) {
			$data['cr_id'] = $last_id;
			insertCRLog($data,'add');
		}	
		return $last_id;
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
	    $crReason     =$data['crreason'];
	    $crDate       =date('Y-m-d H:i:s',strtotime($data['cr_date']));
	    $crCreated    =$data['created_by'];
	    if($crStatus!=3) $crReason='';
		$query = "UPDATE cr_projects set title='$crTitle', description='$crDesc' , status='$crStatus', modified_by='$crCreated',reason='$crReason' where id=".$cr_id; 
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
			//$posts = array();
			if(mysql_num_rows($result)) {
				while($post = mysql_fetch_assoc($result)) {
					if(!empty($post['real_name']) && $post['file_deleted']==0)
						$file_arr[$post['crid']][]=array('real_name'=>$post['real_name'],'file_name'=>$post['file_name']);
						$posts = array('file_name'=>$file_arr[$post['crid']],'id'=>$post['crid'],'title'=>$post['title'],'description'=>$post['description'],'status'=>$post['status'],'cr_date'=>$post['cr_date'],'created_by'=>$post['created_by'],'reason'=>$post['reason']);
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

?>
