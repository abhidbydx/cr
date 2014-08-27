<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>CR Application Systems</title>
<meta http-equiv="content-type" content="text/html; charset=iso-8859-1">
<base href='/'>   
    <link rel="stylesheet" href="styles/main.scss">
    <link href="styles/style.css" rel="stylesheet" type="text/css">   
    <script src="bower_components/jquery/jquery.min.js"></script>
    <script src="http://angular-file-upload.appspot.com/js/angular-file-upload-shim.js"></script> 
    <script src="bower_components/angular/angular.min.js"></script> 
    <script src="http://angular-file-upload.appspot.com/js/angular-file-upload.js"></script>  
    <script src="bower_components/angular-route/angular-route.min.js"></script>
    <script src="bower_components/underscore/underscore-min.js"></script>
    <script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script src="bower_components/ng-grid/build/ng-grid.min.js"></script>
    <script src="bower_components/ng-grid/plugins/ng-grid-layout.js"></script>
    <script src="bower_components/angular-resource/angular-resource.min.js"></script>
    <script src="bower_components/angular-cookies/angular-cookies.min.js"></script>  
    <script src="bower_components/angular-sanitize/angular-sanitize.js"></script>    
</head>
<body ng-app="intranetApp">
<div id="banner">
  <!-- <a href='/'><img src='images/logo-kelltontech.jpg' /></a> -->
</div>
<div id="container">
  <div ng-view=""></div>
</div>
<div id="footer">
  <p align='center'>&copy; 2014 Kellton Tech Solutions Ltd.</p>
</div>
    <script src="scripts/app.js"></script>
    <script src="scripts/utility.js"></script>
        <script src="scripts/controllers/main.js"></script>
        <script src="scripts/directives/left-panel.js"></script>
        <script src="scripts/controllers/listing.js"></script>
        <script src="scripts/controllers/profile.js"></script>
        <script src="scripts/controllers/invitation.js"></script>  
        <script src="scripts/controllers/registers.js"></script>      
        <!-- services-->
        <script src="scripts/services/userService.js"></script>
        <script src="scripts/controllers/changeRequest.js"></script>

</body>
</html>
