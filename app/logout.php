<?php
session_start();
session_destroy();
setcookie("USER_INFO","",time()-36000,"/");
header('Location: /');
?>
