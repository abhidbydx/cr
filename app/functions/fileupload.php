<?php 
     include('Config.php');
    include('DataAccess.php');	
	$allowedExts = array("gif", "jpeg", "jpg", "png");
	$temp = explode(".", $_FILES["file"]["name"]);
	$extension = end($temp);
	$file_name=$temp[0];
	$cr_id=$_REQUEST['cr_id'];
    $upload_path='../cr_files/';
    mkdir($upload_path, 0777, true);
    chmod($upload_path, 0777);

  if ($_FILES["file"]["error"] > 0) {
    
  } else {    
    if (file_exists($upload_path . $_FILES["file"]["name"])) {     
    } else {
      $upload_file_name=$file_name.'_'.time().'.'.$extension;
      move_uploaded_file($_FILES["file"]["tmp_name"],
      $upload_path . $upload_file_name);
      $query = "INSERT INTO cr_files (cr_id,real_name, file_name) VALUES (
						'".$cr_id."', '".$_FILES["file"]["name"]."' ,  '".$upload_file_name."')"; 
	  $result = executeQuery($query);
    }
  }

?>
