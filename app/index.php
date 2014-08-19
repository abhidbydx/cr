<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>CR Application Systems</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width"> 
    <base href='/'>   
    <link rel="stylesheet" href="styles/main.scss">
    <script src="bower_components/jquery/jquery.min.js"></script>
    <script src="bower_components/angular/angular.min.js"></script>
    

    <!-- build:js({.tmp,app}) scripts/bower.js -->


    
    <script src="bower_components/angular-route/angular-route.min.js"></script>
    <script src="bower_components/underscore/underscore-min.js"></script>
    <script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script src="bower_components/ng-grid/build/ng-grid.min.js"></script>
    <script src="bower_components/ng-grid/plugins/ng-grid-layout.js"></script>
    <script src="bower_components/angular-resource/angular-resource.min.js"></script>
    <script src="bower_components/angular-cookies/angular-cookies.min.js"></script>    
    
    <!-- endbuild -->
  </head>
  <body ng-app="intranetApp">
    <!--[if lt IE 7]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!-- Add your site or application content here -->
    <div class="container">
      <div class="header">
      <a href='/'><img src='images/logo-kelltontech.jpg' /></a>
       <!-- <a href='/'>CR System</a>-->
      </div>
      <div>&nbsp;</div>

      <div ng-view=""></div>

      <div class="footer">
        
      </div>
    </div>


   

    <!-- build:js(.) scripts/oldieshim.js -->
    <!--[if lt IE 9]>
    <script src="bower_components/es5-shim/es5-shim.js"></script>
    <script src="bower_components/json3/lib/json3.min.js"></script>
    <![endif]-->
    <!-- endbuild -->

    <!-- build:js(.) scripts/vendor.js -->
    <!-- bower:js -->
    <!-- endbower -->
    <!-- endbuild -->

        <!-- build:js({.tmp,app}) scripts/scripts.js -->
        <script src="scripts/app.js"></script>
        <script src="scripts/controllers/main.js"></script>
        <script src="scripts/directives/left-panel.js"></script>
        <script src="scripts/controllers/listing.js"></script>
        <script src="scripts/controllers/invitation.js"></script>        
        <!-- services-->
        <script src="scripts/services/userService.js"></script>
        <script src="scripts/controllers/changeRequest.js"></script>
        <script src="scripts/directives/left-panel.js"></script>
        <!-- endbuild -->
</body>
</html>