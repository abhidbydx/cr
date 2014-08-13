<?php   
    $con=mysql_connect('127.0.0.1','root','');
    $db=mysql_select_db('pms_dbydx',$con);    
    if($_POST['username']!='' && $_POST['password']!='') {

         user_login($_POST['username'],$_POST['password']);
    }

    function user_login($eid = null,$pwd = null){
    	$password = 'qgxKJ32HCKqEdPvZi4nx5ungMcPG003f106vg9nz' . $pwd;
        $password = sha1($password);
        $QueryUser = "SELECT * FROM 22959_users WHERE email='".$eid."' AND password='".$password."'";
        $QueryUserExecute 	= mysql_query($QueryUser) or die(mysql_error());
        $row = mysql_fetch_array($QueryUserExecute);
        $num_of_row = mysql_num_rows($QueryUserExecute);       
        if($num_of_row>0) {         	
            $_SESSION['USER_ID']=$row['id'];
            $_SESSION['USER_NAME']=$row['first_name'].' '.$row['last_name'];                    
            $userRegisterArr=array('name'=>$row['first_name'].' '.$row['last_name'],'id'=>$row['id']);
            echo json_encode($userRegisterArr);
           
        }
        else  {
               
                echo "error";
               }
        }

?>
