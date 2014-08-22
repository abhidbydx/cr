<?php 
	include('Config.php');
	include('DataModel.php');
	include('Utilities.php');

	$arrayObject  = $_POST;
	$page         = $arrayObject['page'];
	try {
		if(!empty($page)){
			switch ($page)
			{
				case "checkLogin":
						checkLogin($arrayObject);
						break;
				case "checkEmail":
						checkEmail($arrayObject);
						break;
				case "getAllProjects":
						getAllProjects($arrayObject);
						break;			
				case "getAllCr":
						getAllCr($arrayObject);
						break;
				case "register":
						signup($arrayObject);
						break;
				case "addCR":
						addCR($arrayObject);
						break;
				case "checkRegistration":
						checkRegistration($arrayObject);
						break;
				case "validateSignedIn":
						validateSignedIn($arrayObject,$data);
						break;
				case "forgotPassword":
						forgotPassword($arrayObject,$data);
						break;
				case "deleteCR":
						deleteCR($arrayObject);
				break;
				default:
						echo '{"status":"Error","message":"No such webservice available!"}';
			}
		}
	} catch (Exception $e) {
		$response_arr = array('status' => 'Error', 'message' => $e->getMessage());
		echo json_encode($response_arr);
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-08-12
 * 	Purpose    : Check email 
*/   
	function checkEmail($arrayObject){
        $email      = $arrayObject['email'];
        $projectIds = $arrayObject['projectIds'];		
		if($email!='' && $email!=null){
			$exists = checkEmailDb($email);
			if($exists) {
				if($exists['status']=='active') {
					$response_arr = array('status' => 'Error', 'message' => "The user is already active.");
				} else {
					$response_arr = array('status' => 'Error', 'message' => "User is inactive.");
				}
			}else{
				if(!empty($projectIds)) {
					$finalAry = $projectAry = array();
					$projectAry = getProjects($projectIds);
					foreach($projectAry as $ary) {
						$finalAry['projectIds'][] = $ary['id'];
					}
					$finalAry['email'] = $email;
					$serial_arr = urlencode(base64_encode(serialize($finalAry)));
					$to = $email;
				   	$subject = "Kellton CR Management";
				   	$message = "This is simple text message.";
				   	$header = "From:intranet@kelltontech.com \r\n";
				   	$retval = mail ($to,$subject,$message,$header);
				   	if( $retval == true )  {
				       $response_arr = array('status' => 'Success', 'message' => 'Invitation sent successfully.');
				    }
				    else
				    { 
				       $response_arr = array('status' => 'Error', 'message' => 'http://cr.localhost.com/registers/'.$serial_arr);
				    }
				} else {
					$response_arr = array('status' => 'Error', 'message' => 'Projects list cannot be empty.');
				}			    
			}
		}else{
			$response_arr = array('status' => 'Error', 'message' => "Please enter an email address.");
		}
		echo json_encode($response_arr);
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-08-13
 * 	Purpose    : Check username 
*/   
	function checkLogin($arrayObject){
        $userName      = $arrayObject['username'];
        $pwd      = $arrayObject['password']; 
        $data = checkLoginDb($userName,$pwd);
        if($data) {    
            echo json_encode($data);
        }  else  {
            echo json_encode(array('status' => 'Error', 'message' => "Invalid Credentials!!."));
        }
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-08-14
 * 	Purpose    : get all active projects of an user
*/   
	function getAllProjects($arrayObject){
		$user_id      = $arrayObject['user_id'];
		$userType     = $arrayObject['user'];
		if($user_id!='' && $user_id!=null && $userType!='' && $userType!=null){
			$result = getAllActiveProject($user_id,$userType);
			if($result) {
				$response_arr = array('status' => 'Success', 'projects' => $result);
			}else{
				$response_arr = array('status' => 'Success', 'message' => "There are no project allocated to you.");
			}
		}else{
			$response_arr = array('status' => 'Error', 'message' => "User Id and User Type cannot be null.");
		}
		echo json_encode($response_arr);
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-08-19
 * 	Purpose    : SignIn Validation 
*/
	function getAllCr($arrayObject){
        $projectId      = $arrayObject['projectId'];
		if($projectId!='' && $projectId!=null){
			$result = getAllProjectCrs($projectId);
			if($result) {
				$response_arr = array('status' => 'Success', 'cr' => $result);
			}else{
				$response_arr = array('status' => 'Error', 'message' => "There are no any CR for this project.");
			}
		}else{
			$response_arr = array('status' => 'Error', 'message' => "Project Id cannot be null.");
		}
		echo json_encode($response_arr);
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-08-22
 * 	Purpose    : Registeration
*/
	function signup($arrayObject){
        $password      = $arrayObject['password'];
        $email         = $arrayObject['email'];
		if($password!='' && $password!=null && $email!='' && $email!=null){
			$exists = signupDb($arrayObject);
			if($exists) {
				$response_arr = $exists;
			}else{
				$response_arr = array('status' => 'Error', 'message' => "Something went wrong.");
			}
		}else{
			$response_arr = array('status' => 'Error', 'message' => "Please enter email and password.");
		}
		echo json_encode($response_arr);
	}

/*
 *	Created By : Abhishek Kumar
 * 	Created On : 2014-8-21
 * 	Purpose    : add cr
*/
	function addCR($arrayObject){
        $projectId      = $arrayObject['project_id'];
		if($projectId!='' && $projectId!=null){
			$result = insertCR($arrayObject);
			if($result) {
				$response_arr = array('status' => 'Success');
			}else{
				$response_arr = array('status' => 'Error', 'message' => ".");
			}
		}else{
			$response_arr = array('status' => 'Error', 'message' => "Project Id cannot be null.");
		}
		echo json_encode($response_arr);
	}

/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-8-22
 * 	Purpose    : confirm registration
*/
	function checkRegistration($arrayObject){
        $email      = $arrayObject['email'];	
		if($email!='' && $email!=null){
			$exists = checkEmailDb($email);
			if($exists) {
				if($exists['status']=='active') {
					$response_arr = array('status' => 'Active');
				} else {
					$response_arr = array('status' => 'Inactive');
				}
			} else {
				$response_arr = array('status' => '');
			}
		}else{
			$response_arr = array('status' => 'Error', 'message' => "Email not found.");
		}
		echo json_encode($response_arr);
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : validate already signed in user
*/
	function validateSignedIn($arrayObject,$data){
        $pincode      = $arrayObject->pincode;
		$userName      = $arrayObject->username;
		if($pincode!='' && $pincode!=null && $userName!='' && $userName!=null){
			$exists = validateSignedInDb($pincode,$userName);
			if($exists)
				$response_arr = array('status' => 'Success', 'message' => 'Successfully signed in.');
			else
				$response_arr = array('status' => 'Error', 'message' => "Incorrect passcode. Please try again.");
		}else{
			$response_arr = array('status' => 'Error', 'message' => "Please enter username and passcode.");
		}
		writeLog("validateSignedIn",$data,json_encode($response_arr));
		echo json_encode($response_arr);
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : forgot password
*/
	function forgotPassword($arrayObject,$data){
		$email        = $arrayObject->email;
		$password     = $arrayObject->password;
		$username     = $arrayObject->username;
		if($password!='' && $password!=null){
			$value = $password;
			$field = 'password';
			$responseField = 'username';
		}
		if($username!='' && $username!=null){
			$value = $username;
			$field = 'username';
			$responseField = 'password';
		}		
		if($email!='' && $email!=null && $value!='' && $value!=null){
			$response = forgotPasswordDb($field,$value,$email,$responseField);
			if($response){
				$response_arr = array('status' => 'Success', $responseField => $response);
			}else
				$response_arr = array('status' => 'Error', 'message' => "Unable to match your email address and $field.");
		}else{
			$response_arr = array('status' => 'Error', 'message' => "Please enter an email address and $field.");
		}
		writeLog("forgotPassword",$data,json_encode($response_arr));
		echo json_encode($response_arr);
	}

	/*
 *	Created By : Abhishek Kumar
 * 	Created On : 2014-8-21
 * 	Purpose    : add cr
*/
	function deleteCR($arrayObject){
        $crId      = $arrayObject['id'];
		if($crId!='' && $crId!=null){
			$result = deleteCRData($arrayObject);
			if($result) {
				$response_arr = array('status' => 'Success');
			}else{
				$response_arr = array('status' => 'Error', 'message' => ".");
			}
		}else{
			$response_arr = array('status' => 'Error', 'message' => "Id cannot be null.");
		}
		echo json_encode($response_arr);
	}
?>