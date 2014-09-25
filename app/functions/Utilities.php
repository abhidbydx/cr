<?php 
	
/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-09-22
 * 	Purpose    : Send CR form to client
*/  
	function sendMailCRInitiated($email,$clientId,$data) {	
		
		$postDataAprv = $postDataRejct = array();
		$postDataRejct['client_id'] = $postDataAprv['client_id'] = $clientId;
		$postDataRejct['cr_id'] = $postDataAprv['cr_id'] = $data['id'];
		$postDataAprv['action'] = 'approve';
		$postDataRejct['action'] = 'reject';
		$postDataAprv = urlencode(base64_encode(serialize($postDataAprv)));
		$postDataRejct = urlencode(base64_encode(serialize($postDataRejct)));

		$isBillable = "No";
		if($data['is_billable']==1){ 
			$isBillable = "Yes"; 
		}
		if($data['billed_cost_currency']==1){ 
			$currency = "INR";
		}else if ($data['billed_cost_currency']==2){ 
			$currency = "USD"; 
		}

		$to = $email;
	   	$subject = "New CR Initiated";
	   	$message = 'New CR has been initiated for the project <b>"'.$data['project_name'].'"</b>. Please find the details
	   	given below:<br>
	   	<table>';
	   	if(!empty($data['title'])) {
	   		$message .= '<tr><th width="40%">Title<th><td>'.$data['title'].'</td></tr>';
	   	}
	   	if(!empty($data['description'])) {
	   		$message .= '<tr><th width="40%">Description<th><td>'.$data['description'].'</td></tr>';
	   	}
	   	if(!empty($data['cr_date'])) {
	   		$message .= '<tr><th width="40%">Date<th><td>'.$data['cr_date'].'</td></tr>';
	   	}
	   	if(!empty($data['effort'])) {
	   		$message .= '<tr><th width="40%">Effort<th><td>'.$data['effort'].'</td></tr>';
	   	}
   		$message .= '<tr><th width="40%">Is Billable<th><td>'.$isBillable.'</td></tr>';
   		if(!empty($data['billed_cost'])) {
	   		$message .= '<tr><th width="40%">Billed Cost<th><td>'.$data['billed_cost'].'&nbsp;'.$currency.'</td></tr>';
	   	}
	   	$message .=	'<tr><th width="40%">&nbsp;<th><td>
	   				<a target="_blank" href="http://'.$_SERVER["HTTP_HOST"].'/crAction/'.$postDataAprv.'" style="cursor:pointer;"><input type="button" value="Approve" name="Approve"></a>&nbsp;
	   				<a target="_blank" href="http://'.$_SERVER["HTTP_HOST"].'/crAction/'.$postDataRejct.'" style="cursor:pointer;"><input type="button" value="Reject" name="Reject"></a>
	   				</td></tr></table>';
	   //	$semi_rand = md5(time()); 
		//$mime_boundary = "==Multipart_Boundary_x{$semi_rand}x"; 
		// headers for attachment 
		//$headers .= "\nMIME-Version: 1.0\n" . "Content-type:text/html;charset=UTF-8;\n" . " boundary=\"{$mime_boundary}\""; 
		// multipart boundary 
	//	$message = "This is a multi-part message in MIME format.\n\n" . "--{$mime_boundary}\n" . "Content-Type: text/plain; charset=\"iso-8859-1\"\n" . "Content-Transfer-Encoding: 7bit\n\n" . $message . "\n\n"; 
	//	$message .= "--{$mime_boundary}\n";
	   	$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
		// More headers
		$headers .= 'From: <intranet@kelltontech.com>' . "\r\n";
	   	/*if(!empty($data['file_name'])) {
	   		$upload_path='../cr_files/';
		   	foreach ($data['file_name'] as $fileData) {
		   		$filepath = $upload_path.$fileData['file_name'];
		   		$file = fopen($filepath,"rb");
				$data = fread($file,filesize($filepath));
				fclose($file);
				$data = chunk_split(base64_encode($data));
				$message .= "Content-Type: {\"application/octet-stream\"};\n" . " name=\"$filepath\"\n" . 
				"Content-Disposition: attachment;\n" . " filename=\"$filepath\"\n" . 
				"Content-Transfer-Encoding: base64\n\n" . $data . "\n\n";
				$message .= "--{$mime_boundary}\n";
		   	}
	    }  */
	   	$retval = mail ($to,$subject,$message,$headers);
	   	return $clientId;
	}

/*
 *	Created By : Soumya Pandey
 * 	Created On : 2014-09-22
 * 	Purpose    : Send CR form to client
*/  
	function sendLoginMail($email,$clientId) {		
		$clientId = urlencode(base64_encode(serialize($clientId)));
		$to = $email;
	   	$subject = "Registration";
	   	$message = 'This is simple text message. '.'http://'.$_SERVER["HTTP_HOST"].'/registers/'.$clientId;
	   	$header = "From:intranet@kelltontech.com \r\n";
	   	$retval = mail ($to,$subject,$message,$header);
	   	return 'login';
	}
?>