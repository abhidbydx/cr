<?php
session_start();
session_destroy();
setcookie("USER_INFO","",time()-3600,"/");
header('Location: /');
?>
