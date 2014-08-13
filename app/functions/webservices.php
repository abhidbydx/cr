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
				case "signUp":
						signUp($arrayObject,$data);
						break;			
				case "signIn":
						signIn($arrayObject,$data);
						break;
				case "checkPassword":
						checkPassword($arrayObject,$data);
						break;
				case "resetPincode":
						resetPincode($arrayObject,$data);
						break;
				case "validateSignedIn":
						validateSignedIn($arrayObject,$data);
						break;
				case "forgotPassword":
						forgotPassword($arrayObject,$data);
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
 * 	Created On : 2014-27-03
 * 	Purpose    : Check email 
*/   
	function checkEmail($arrayObject){
        $email      = $arrayObject['email'];
		if($email!='' && $email!=null){
			$exists = checkEmailDb($email);
			if($exists) {
				$response_arr = array('status' => 'Error', 'message' => "Email already exists.");
			}else{
				$response_arr = array('status' => 'Success', 'message' => 'Correct email.');
			}
		}else{
			$response_arr = array('status' => 'Error', 'message' => "Please enter an email address.");
		}
		echo json_encode($response_arr);
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : Check username 
*/   
	function checkLogin($arrayObject){
        $userName      = $arrayObject['username'];
        $pwd      = $arrayObject['password'];
		$password = 'qgxKJ32HCKqEdPvZi4nx5ungMcPG003f106vg9nz' . $pwd;
        $password = sha1($password);
        $QueryUser = "SELECT * FROM 22959_users WHERE email='".$userName."' AND password='".$password."'";
        $QueryUserExecute 	= mysql_query($QueryUser) or die(mysql_error());
        $row = mysql_fetch_array($QueryUserExecute);
        $num_of_row = mysql_num_rows($QueryUserExecute);       
        if($num_of_row>0) {         	
            $_SESSION['USER_ID']=$row['id'];
            $_SESSION['USER_NAME']=$row['first_name'].' '.$row['last_name'];                    
            $userRegisterArr=array('name'=>$row['first_name'].' '.$row['last_name'],'id'=>$row['id']);
            echo json_encode($userRegisterArr);
           
        }  else  {
               
                echo "error";
        }
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : SignUp Validation 
*/   
	function signUp($arrayObject,$data){
		$email      = $arrayObject->email;
		$userName   = $arrayObject->username;
		if($email!='' && $email!=null && $userName!='' && $userName!=null){
			$exists = signUpDb($email,$userName);
			if($exists) {
				$response_arr = array('status' => 'Error', 'message' => $exists." already exists.");
			}else{
				$pateintId = signUpInsertDb($arrayObject);
				$tokenResult = updateAccessToken($pateintId);
				if($tokenResult!='error')
					$response_arr = array('status' => 'Success', 'username' => $userName,'accesstoken'=>$tokenResult);
				else
					$response_arr = array('status' => 'Error', 'message' => "Please try again.");
			}
		}else{
			$response_arr = array('status' => 'Error', 'message' => "Please enter username and an email address.");
		}
		writeLog("signUp",$data,json_encode($response_arr));
		echo json_encode($response_arr);
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : SignIn Validation 
*/
	function signIn($arrayObject,$data){
        $password      = $arrayObject->password;
        $userName      = $arrayObject->username;
		if($password!='' && $password!=null && $userName!='' && $userName!=null){
			$pateintId = signInDb($password,$userName);
			if($pateintId) {
				$tokenResult = updateAccessToken($pateintId);
				if($tokenResult=='error')
					$response_arr = array('status' => 'Error', 'message' => "Please try again.");
				else
					$response_arr = array('status' => 'Success', 'username' => $userName,'accesstoken'=>$tokenResult);
			}else{
				$response_arr = array('status' => 'Error', 'message' => "The username or password are incorrect. Please try again.");
			}
		}else{
			$response_arr = array('status' => 'Error', 'message' => "Please enter username and password.");
		}
		writeLog("signIn",$data,json_encode($response_arr));
		echo json_encode($response_arr);
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : validate password
*/
	function checkPassword($arrayObject,$data){
        $password      = $arrayObject->password;
        $userName      = $arrayObject->username;
		if($password!='' && $password!=null && $userName!='' && $userName!=null){
			$exists = checkPasswordDb($password,$userName);
			if($exists) {
				$response_arr = array('status' => 'Success', 'message' => 'Password is Correct.');
			}else{
				$response_arr = array('status' => 'Error', 'message' => "Your password could not be validated. Please try again.");
			}
		}else{
			$response_arr = array('status' => 'Error', 'message' => "Please enter username and password.");
		}
		writeLog("checkPassword",$data,json_encode($response_arr));
		echo json_encode($response_arr);
	}
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-27-03
 * 	Purpose    : reset pincode
*/
	function resetPincode($arrayObject,$data){
        $pincode       = $arrayObject->pincode;
        $userName      = $arrayObject->username;
		if($pincode!='' && $pincode!=null && $userName!='' && $userName!=null){
			$result = resetPincodeDb($pincode,$userName);
			$response_arr = array('status' => 'Success', 'message' => 'Pincode has been updated successfully.');
		}else{
			$response_arr = array('status' => 'Error', 'message' => "Please enter username and passcode.");
		}
		writeLog("resetPincode",$data,json_encode($response_arr));
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
?>