<?php
session_start();
include_once('tracker-cookies.php');
//Script to track Site Visited minxpanel event
$mpCookiesJson 	= (isset($_COOKIE['site_visit_mixpanel'])) ? json_decode($_COOKIE['site_visit_mixpanel'], true) : "";
$visitedflag	= (isset($mpCookiesJson['visitedflag']) == 1) ? 1 : 0;
$is_visit_mixpanel = 0;
if((int)$_SESSION['firstvisit_mixpanel']==0 && $visitedflag == 0)  {
   unset($_COOKIE['pagevisit_mixpanel']);
   $is_visit_mixpanel = 1;
   $_SESSION['firstvisit_mixpanel'] = 1;
}
if((int)$is_visit_mixpanel) {    
    $mixpanel_arr = array('visitedflag' => 1, 'pagename' => 'proptiger', 'pageurl' => 'proptiger.com');
    $mixpanel_arr_json = json_encode($mixpanel_arr);
    setcookie('site_visit_mixpanel', $mixpanel_arr_json, time()+60*60*24, '/');
}else {   
    $mixpanel_arr = array('visitedflag' => 0, 'pagename' => 'proptiger', 'pageurl' => 'proptiger.com');
    $mixpanel_arr_json = json_encode($mixpanel_arr);
    setcookie('site_visit_mixpanel', $mixpanel_arr_json, time()+60*60*24, '/');
}
//End Site Visited minxpanel event

//Get website version
$websiteVersionArr = parse_ini_file("website_version.ini");
if ($websiteVersionArr !== FALSE && isset($websiteVersionArr['website_version'])) {
	$websiteVersion = $websiteVersionArr['website_version'];
}else{
	$websiteVersion = 'notset';
}

function checkstatus () {
    $urlServiceUrl = $_SERVER['REQUEST_URI'];
    if ( stripos( '---'.$urlServiceUrl , '/maps') ) {
        $urlServiceUrl = str_replace('/maps', '', $urlServiceUrl);
    }
    $filterPos = stripos( $urlServiceUrl , '/filters' );
    if ( $filterPos ) {
        $urlServiceUrl = substr( $urlServiceUrl, 0, $filterPos );
    }
    $urlServiceUrl=ltrim($urlServiceUrl, '/');
    if($urlServiceUrl!='check-seo'){
        $ch = curl_init('http://'.$_SERVER['HTTP_HOST'].'/data/v1/url?url='.$urlServiceUrl); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);     
        $response = json_decode(curl_exec($ch), true);   
        curl_close($ch);
        if($response['data']['httpStatus'] == 404 ){
            header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
            header("Status: 404 Not Found");
            $_SERVER['REDIRECT_STATUS'] = 404;
            include_once('404.php');
        }
        else if($response['data']['httpStatus'] == 301 ){
            header($_SERVER["SERVER_PROTOCOL"]." 301 Moved Permanently"); 
            header("Location: http://" . $_SERVER['HTTP_HOST'] . '/' . $response['data']['redirectUrl']); 
        }
    }
}
checkstatus();

?>

<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" xmlns:ng="http://angularjs.org" id="ng-app"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" xmlns:ng="http://angularjs.org" id="ng-app"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" xmlns:ng="http://angularjs.org" id="ng-app"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" xmlns:ng="http://angularjs.org" id="ng-app"> <!--<![endif]-->
<?php
    $debug = !empty( $_REQUEST['debug'] ) ? 1 : 0;
    $mpdebug = !empty( $_REQUEST['mpdebug'] ) ? 1 : 0;
    if($mpdebug == 1){$mpdebugmode=true;}else{$mpdebugmode=false;}
?>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="fragment" content="!" >
    <meta ng-repeat="(key, value) in seoData.metatags" name="{{key}}" content="{{value}}">
    <title>Proptiger.com</title>
    <base href="http://<?php echo $_SERVER[ 'SERVER_NAME' ]; ?>/" />
    <!--[if IE]><script type="text/javascript">
        // Fix for IE ignoring relative base tags.
        // See http://stackoverflow.com/questions/3926197/html-base-tag-and-local-folder-path-with-internet-explorer
        (function() {
            var baseTag = document.getElementsByTagName('base')[0];
            baseTag.href = baseTag.href;
        })();
    </script><![endif]-->
    <!-- meta name="viewport" content="width=device-width, initial-scale=1.0" -->
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

    <link rel="alternate" href="android-app://com.proptiger/pt/project/{{ urlData.redirectUrl }}" ng-if="urlData.showAppLink" />
    <link rel="stylesheet" href="bower_components/bootstrap/release/bootstrap.min.css">
    <link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.css" />
    
    <!-- build:css(.tmp) styles/css/main.css -->
 
    <link rel="stylesheet" href="styles/css/style.css">
    <!-- endbuild -->
    <script type="text/javascript" src="//use.typekit.net/lrv3erb.js"></script>
    <script type="text/javascript">try{Typekit.load();}catch(e){}</script>
    <script src="//cdn.optimizely.com/js/1038282661.js"></script>
    <script type="text/javascript">
		var websiteVersion = '<?php echo $websiteVersion ?>';
        var _gaq = _gaq || [];
        _gaq.push(['_setCustomVar',4,'Server', websiteVersion, 1]);
        (function() {
            'use strict';
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);            
        })();        
        //Server check      
        if(window.location.hostname == 'www.proptiger.com' || window.location.hostname == 'proptiger.com'){
			var mpkey = '014783e1860d8a1295bfd787e3fc7229'
			var gakey = 'UA-22638191-1'			 
			var webEngageId = '~c2ab377a';
			var vizuryId = 'VIZVRM949';
			var google_conversion_id = 1042824175;
			var google_conversion_label = "mNqLCPfdiwQQ7_eg8QM";
			var google_custom_params = window.google_tag_params;
			var google_remarketing_only = true; 
		}else{
			var mpkey = 'b1e62b63bc0fea04f8d2903396efa9b3'
			var gakey = 'UA-37530240-1'		 
			var webEngageId = '';
			var vizuryId = '';		
			var google_conversion_id = 0;
			var google_conversion_label = "bad";
			var google_custom_params = window.google_tag_params;
			var google_remarketing_only = true;		 
		}
		//End //Server check
		 _gaq.push(['_setAccount', gakey]);
		 _gaq.push(['_setSiteSpeedSampleRate', 100]);
                 var mixpanel;
        </script>
    
</head>
<body>
      <div>
      <img src='/bower_components/bootstrap/img/glyphicons-halflings.png' style='display:none;' >
      <img src='/styles/images/footer-bg.gif' style='display:none;' >
      <img src='/images/compare_help.png' style='display:none;' >
      </div>
    <div id="app_keys" style="display:none">
        <?php
            if ( $_SERVER['SERVER_NAME'] == 'www.proptiger.com' || $_SERVER['SERVER_NAME'] == 'proptiger.com' ) {
            ?>
                <div id="fb_key">477856065604774</div>
                <div id="g_cid">781642854580-10t33aa5uudtpkhr4apl6rak8rk356hh.apps.googleusercontent.com</div>
            <?php
            }
            else {
            ?>
                <div id="fb_key">453650188023108</div>
                <div id="g_cid">781642854580-a3otk3ehtast1fb7mspckmlg32kif2us.apps.googleusercontent.com</div>
            <?php
            }
        ?>
    </div>
    <!--[if lt IE 7]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!--[if lt IE 9]>
      <script src="bower_components/es5-shim/es5-shim.js"></script>
      <script src="bower_components/json3/lib/json3.min.js"></script>
    <![endif]-->

    <!-- Add your site or application content here -->
    <pt-header></pt-header>
    <div pt-loading id="loading"></div>
    <div ng-class="fullView" class="mainContainer row-fluid">
        <div id="views" ui-view></div>
    </div>
    <div pt-footer id="appFooter" ng-if="!hideFooter"></div>
    <div id="blocking-info" align="center">
        <img id="compare_help_text" src="images/compare_help.png" />
    </div>
    <div map-help id="help"> </div>
    <!-- Google Analytics: change UA-XXXXX-X to be your site's ID -->

    <script>
        window.initials = {"center":[28.5355,77.391],"zoom":{min:11,max:14}, "view":[28.1521,76.7328,28.7426,78.1651],"cityId":20, "city":"noida","q":"CITY:noida","bedroom":"","minBudget":"","maxBudget":"","locality":"","propertyType":null,"builder":"","pageType":"MAP-SALE-LISTING-CITY"}
    </script>

    <script src="bower_components/jquery/jquery.min.js"></script>
    <script src="bower_components/angular/angular.min.js"></script>

    <!-- build:js({.tmp,app}) scripts/bower.js -->

    <script src="bower_components/jquery-ui/ui/jquery.ui.core.js"></script>
    <script src="bower_components/jquery-ui/ui/jquery.ui.widget.js"></script>
    <script src="bower_components/jquery-ui/ui/jquery.ui.mouse.js"></script>
    <script src="bower_components/jquery-ui/ui/jquery.ui.draggable.js"></script>
    <script src="bower_components/jquery-ui/ui/jquery.ui.droppable.js"></script>
    <script src="bower_components/jquery-ui/ui/jquery.ui.sortable.js"></script>
    <script src="bower_components/jquery-ui/ui/jquery.ui.effect.js"></script>
    <script src="bower_components/jquery-ui/ui/jquery.ui.effect-drop.js"></script>
    <script src="bower_components/jquery-ui/ui/jquery.ui.effect-bounce.js"></script>
    <script src="bower_components/jquery-ui/ui/jquery.ui.slider.js"></script>
    <script src="bower_components/angular-facebook/lib/angular-facebook.js"></script>
    <script src="bower_components/angular-google-plus/src/angular-google-plus.js"></script>

    <script src="bower_components/angular-route/angular-route.min.js"></script>
    <script src="bower_components/underscore/underscore-min.js"></script>
    <script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script src="bower_components/ng-grid/build/ng-grid.min.js"></script>
    <script src="bower_components/ng-grid/plugins/ng-grid-layout.js"></script>
    <script src="bower_components/angular-ui-slider/src/slider.js"></script>
    <script src="bower_components/highcharts/highcharts.js"></script>
    <script src="bower_components/highcharts/highcharts-more.js"></script>
    <script src="bower_components/bootstrap/release/bootstrap.min.js"></script>
    <script src="bower_components/angular-animate/angular-animate.min.js"></script>
    <script src="bower_components/angular-ui-bootstrap/release/ui-bootstrap-tpls.min.js"></script>
    <script src="bower_components/angular-strap/dist/angular-strap.min.js"></script>
    <script src="bower_components/angular-resource/angular-resource.min.js"></script>
    <script src="bower_components/angular-cookies/angular-cookies.min.js"></script>    
    <script src="bower_components/jquery.panzoom/dist/jquery.panzoom.min.js"></script> 
    <script src="bower_components/vendor/angular-sanitize.min.js"></script>
    <script src="bower_components/vendor/json2.min.js"></script>
    <script src="bower_components/vendor/jstorage.min.js"></script>
    <script src="bower_components/angular-strap/vendor/bootstrap-datepicker.js"></script>
    <script src="bower_components/bootstrap/js/bootstrap-tooltip.js"></script>
    <script src="bower_components/angular-once/once.js"></script>
    <script src="bower_components/ng-tags-input/ng-tags-input.js"></script>
    <script src="scripts/vendor/jquery.mousewheel.js"></script>
    <script src="scripts/vendor/perfect-scrollbar.js"></script>
    <script src="scripts/vendor/json2.min.js"></script>
    <script src="scripts/vendor/jstorage.min.js"></script>
    <script src="scripts/vendor/pt-zoominout.js"></script>
    <script src="scripts/vendor/angular-sanitize.min.js"></script>   
    
    <!-- endbuild -->
    <script src="scripts/app.js"></script>
    <script src="scripts/run.js"></script>
    
    <!-- build:js({.tmp,app}) scripts/common.js -->
    <script src="scripts/services/trackingService.js"></script>
    <script src="scripts/validators/leadValidators.js"></script>
    <script src="scripts/services/leadService.js"></script>
    <script src="scripts/services/flags.js"></script>
    <script src="scripts/directives/common/pt-image-block.js"></script>
    <script src="scripts/directives/common/pt-text-block.js"></script>
    <script src="scripts/services/LangSelService.js"></script>
    <script src="scripts/services/errorreportService.js"></script>
    <script src="scripts/services/projectMapService.js"></script>
    <script src="scripts/services/neighborhoodMapService.js"></script>
    <script src="scripts/directives/common/pt-reporterror.js"></script>
    <script src="scripts/services/filterService.js"></script>
    <script src="scripts/formatters/common.js"></script>
    <script src="scripts/services/pageSettings.js"></script>
    <script src="scripts/services/blockingInfo.js"></script>
    <script src="scripts/services/imageService.js"></script>
    <script src="scripts/validators/commonValidators.js"></script>
    <script src="scripts/parsers/imageParser.js"></script>
    <script src="scripts/parsers/widgetParser.js"></script>
    <script src="scripts/parsers/localityParser.js"></script>
    <script src="scripts/parsers/citiesParser.js"></script>
    <script src="scripts/parsers/unitParser.js"></script>
    <script src="scripts/parsers/graphParser.js"></script>
    <script src="scripts/parsers/gridParser.js"></script>
    <script src="scripts/parsers/recentlyViewedParser.js"></script>
    <script src="scripts/parsers/projectParser.js"></script>
    <script src="scripts/parsers/builderParser.js"></script>
    <script src="scripts/parsers/discussionParser.js"></script>
    <script src="scripts/services/globalService.js"></script>
    <script src="scripts/services/langService.js"></script>
    <script src="scripts/services/commonLocationService.js"></script>
    <script src="scripts/services/propertyService.js"></script>
    <script src="scripts/services/citiesService.js"></script>
    <script src="scripts/services/localityService.js"></script>
    <script src="scripts/services/builderService.js"></script>
    <script src="scripts/services/projectService.js"></script>
    <script src="scripts/services/searchService.js"></script>
    <script src="scripts/services/dashboardService.js"></script>
    <script src="scripts/services/widgetService.js"></script>
    <script src="scripts/services/unitInfoService.js"></script>
    <script src="scripts/services/builderService.js"></script>
    <script src="scripts/services/banksService.js"></script>
    <script src="scripts/services/userService.js"></script>
    <script src="scripts/services/signupService.js"></script>
    <script src="scripts/services/gaService.js"></script>
    <script src="scripts/services/getHttpService.js"></script>
    <script src="scripts/services/notificationService.js"></script>
    <script src="scripts/services/loadingService.js"></script>
    <script src="scripts/services/lazyLoadFactory.js"></script>
    <script src="scripts/services/filters.js"></script>
    <script src="scripts/services/constants.js"></script>
    <script src="scripts/services/compareStorage.js"></script>
    <script src="scripts/services/favoriteService.js"></script>
    <script src="scripts/configs/chartConfig.js"></script>
    <script src="scripts/configs/widgetConfig.js"></script>
    <script src="scripts/configs/environment.js"></script>
    <script src="scripts/validators/smartFloat.js"></script>
    <script src="scripts/directives/base/pt-focus.js"></script>
    <script src="scripts/directives/base/pt-draggable.js"></script>
    <script src="scripts/directives/base/pt-droppable.js"></script>
    <script src="scripts/directives/base/pt-hover.js"></script>
    <script src="scripts/directives/base/pt-sortable.js"></script>
    <script src="scripts/directives/base/pt-dashboard.js"></script>
    <script src="scripts/directives/base/pt-chart.js"></script>
    <script src="scripts/directives/common/pt-builder-overlay.js"></script>
    <script src="scripts/directives/common/pt-builder-overview-card.js"></script>
    <script src="scripts/directives/common/pt-loading-block.js"></script>
    <script src="scripts/directives/common/pt-compare-panel.js"></script>
    <script src="scripts/directives/common/pt-listing-overview-card.js"></script>
    <script src="scripts/directives/common/pt-locality-overlay.js"></script>
    <script src="scripts/directives/common/pt-property-listings.js"></script>
    <script src="scripts/directives/common/pt-favorite.js"></script>
    <script src="scripts/directives/common/pt-areaoverview.js"></script>
    <script src="scripts/directives/overview/pt-overviewGallery.js"></script>
    <script src="scripts/directives/common/pt-review.js"></script>
    <script src="scripts/directives/common/pt-locationpricetrend.js"></script>
    <script src="scripts/directives/common/pt-neighborhood.js"></script>
    <script src="scripts/directives/base/treeView.js"></script>
    <script src="scripts/directives/base/pt-confirmClick.js"></script>
    <script src="scripts/directives/base/pt-placeholder.js"></script>
    <script src="scripts/directives/base/pt-shallow-range.js"></script>
    <script src="scripts/directives/base/pt-rightArrow.js"></script>
    <script src="scripts/directives/base/pt-leftArrow.js"></script>
    <script src="scripts/directives/common/pt-carousel.js"></script>
    <script src="scripts/directives/common/pt-dropdown.js"></script>
    <script src="scripts/directives/common/pt-carouselFullScreen.js"></script>
    <script src="scripts/directives/common/pt-discussionBoard.js"></script>
    <script src="scripts/directives/common/pt-gallery.js"></script>
    <script src="scripts/directives/common/pt-blog.js"></script>
    <script src="scripts/directives/common/pt-overviewforward.js"></script>
    <script src="scripts/directives/common/pt-widgetContainer.js"></script>
    <script src="scripts/directives/common/pt-widgetLinkContainer.js"></script>
    <script src="scripts/directives/common/pt-leftwidgetcontainer.js"></script>
    <script src="scripts/directives/common/pt-quicklinks.js"></script>
    <script src="scripts/directives/common/pt-myaccount.js"></script>
    <script src="scripts/directives/common/pt-widgetChart.js"></script>
    <script src="scripts/directives/common/pt-widgetGrid.js"></script>
    <script src="scripts/directives/common/pt-sidebar.js"></script>
    <script src="scripts/directives/common/pt-header.js"></script>
    <script src="scripts/directives/common/pt-listingfilter.js"></script>
    <script src="scripts/directives/common/pt-footer.js"></script>
    <script src="scripts/directives/common/pt-appreciation.js"></script>
    <script src="scripts/directives/common/pt-discussions.js"></script>
    <script src="scripts/directives/common/pt-rating.js"></script>
    <script src="scripts/directives/common/pt-galleryFullView.js"></script>
    <script src="scripts/directives/common/pt-recentlyviewed.js"></script>
    <script src="scripts/directives/common/pt-myfavorites.js"></script>
    <script src="scripts/directives/common/pt-enquiredproperty.js"></script>
    <script src="scripts/directives/common/pt-savedsearches.js"></script>
    <script src="scripts/directives/common/pt-notification.js"></script>
    <script src="scripts/directives/common/pt-loading.js"></script>
    <script src="scripts/directives/common/pt-enquireForm.js"></script>
    <script src="scripts/directives/common/pt-lead.js"></script>    
    <script src="scripts/directives/common/pt-scroll.js"></script>
    <script src="scripts/directives/common/pt-breadcrum.js"></script>
    <script src="scripts/directives/common/pt-description.js"></script>
    <script src="scripts/directives/common/pt-compare-button.js"></script>
    <script src="scripts/directives/common/pt-aboutlinks.js"></script>
    <script src="scripts/directives/common/pt-staticimage.js"></script>
    <script src="scripts/directives/project/pt-headerBar.js"></script>
    <script src="scripts/directives/project/pt-headerSmall.js"></script>
    <script src="scripts/directives/project/pt-projectnavigator.js"></script>
    <script src="scripts/directives/project/pt-overview.js"></script>
    <script src="scripts/directives/project/pt-specification.js"></script>
    <script src="scripts/directives/project/pt-projectemi.js"></script>
    <script src="scripts/directives/project/pt-overlayemi.js"></script>
    <script src="scripts/directives/project/pt-projectdeals.js"></script>
    <script src="scripts/directives/project/pt-projecthomeloan.js"></script>
    <script src="scripts/directives/project/pt-amenities.js"></script>
    <script src="scripts/directives/project/pt-similarProjects.js"></script>
    <script src="scripts/directives/project/pt-propertyOption.js"></script>
    <script src="scripts/directives/project/pt-neighborhood.js"></script>
    <script src="scripts/directives/base/pt-multiselect.js"></script>
    <script src="scripts/directives/base/pt-singleselect.js"></script>
    <script src="scripts/directives/base/pt-typeahead.js"></script>
    <script src="scripts/directives/listings/pt-listing-element.js"></script>
    <script src="scripts/controllers/common/commonFullScreenCtrl.js"></script>
    <script src="scripts/controllers/common/facebook.js"></script>
    <script src="scripts/controllers/common/googleplus.js"></script>
    <script src="scripts/controllers/pageController.js"></script>
    <script src="scripts/controllers/listings.js"></script>
    <script src="scripts/controllers/common/signUpCtrl.js"></script>
    <script src="scripts/controllers/filterCtrl.js"></script>
    <script src="scripts/controllers/overviewCtrl.js"></script>
    <script src="scripts/controllers/projectDetailCtrl.js"></script>
    <script src="scripts/controllers/searchFilter.js"></script>
    <script src="scripts/controllers/compare.js"></script>
    <script src="scripts/controllers/compareBucket.js"></script>
    <script src="scripts/controllers/leadController.js"></script>
    <script src="scripts/services/filters.js"></script>
    <script src="scripts/services/discussionService.js"></script>
    <script src="scripts/controllers/staticPageCtrl.js"></script>
    <script src="scripts/controllers/homeCtrl.js"></script>
    
    <script src="scripts/directives/base/pt-rangeSlider.js"></script>
    <script src="scripts/directives/project/pt-incomeslider.js"></script>
    <script src="scripts/directives/common/pt-selectCity.js"></script>
    <!-- endbuild -->
    <!-- build:js({.tmp,app}) scripts/maps.js -->
    <script src="scripts/services/homePageService.js"></script>
    <script src="scripts/services/mapFactory.js"></script>
    <script src="scripts/services/markerFactory.js"></script>
    <script src="scripts/services/mapOverlay.js"></script>
    <script src="scripts/services/mapFilter.js"></script>
    <script src="scripts/services/mapDirection.js"></script>
    <script src="scripts/directives/maps/pt-map.js"></script>
    <script src="scripts/directives/maps/pt-map-marker.js"></script>
    <script src="scripts/directives/maps/pt-alv.js"></script>
    <script src="scripts/directives/maps/pt-map-neighborhood.js"></script>
    <script src="scripts/directives/maps/pt-alv-listitem-locality.js"></script>
    <script src="scripts/directives/maps/pt-alv-listitem-projects.js"></script>
    <script src="scripts/directives/maps/pt-alv-listitem-simi-prop.js"></script>
    <script src="scripts/directives/maps/pt-projectDetail.js"></script>
    <script src="scripts/directives/maps/pt-markers.js"></script>
    <script src="scripts/directives/maps/pt-gradientgr.js"></script>
    <script src="scripts/directives/maps/pt-neighbourhood-dd.js"></script>
    <script src="scripts/directives/maps/neighborhood-palette.js"></script>
    <script src="scripts/directives/maps/pt-zoom-map.js"></script>
    <script src="scripts/directives/maps/pt-showby-price-poss.js"></script>
    <script src="scripts/controllers/mapListingsCtrl.js"></script>
    <script src="scripts/directives/maps/map-help.js"></script>

    <!-- endbuild -->
    <!-- build:js({.tmp,app}) scripts/portfolio.js -->
    <script src="scripts/parsers/dashboardParser.js"></script>
    <script src="scripts/parsers/propertyParser.js"></script>
    <script src="scripts/parsers/portfolioParser.js"></script>
    <script src="scripts/services/portfolioService.js"></script>
    <script src="scripts/services/portfolioHelper.js"></script>
    
    <script src="scripts/directives/portfolio/pt-propertyList.js"></script>
    <script src="scripts/directives/portfolio/pt-portfolioAtGlance.js"></script>
    <script src="scripts/directives/portfolio/pt-propertyDetail.js"></script>
    <script src="scripts/directives/portfolio/pt-portfolioRelated.js"></script>
    <script src="scripts/directives/portfolio/pt-portfolioEmail.js"></script>
    <script src="scripts/directives/portfolio/pt-financialSummary.js"></script>
    <script src="scripts/directives/portfolio/pt-portfolioDemandGraph.js"></script>
    <script src="scripts/directives/portfolio/pt-portfolioRequests.js"></script>
    <script src="scripts/directives/portfolio/pt-constructionUpdate.js"></script>
    <script src="scripts/controllers/addPropertyCtrl.js"></script>
    <script src="scripts/controllers/portfolioCtrl.js"></script>
    <script src="scripts/controllers/portfolioIndexCtrl.js"></script>
    <script src="scripts/controllers/propertyDetailCtrl.js"></script>
    <script src="scripts/controllers/testCtrl.js"></script>
    
    <!-- endbuild -->    
 
<!--vizury code-->
<script type="text/javascript">
(function() {
    function async_load(){
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = ("https:" == document.location.protocol ?"https://ssl" : "http://www")+ ".vizury.com/analyze/pixel.php?account_id="+vizuryId;
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
        s.onload = function() {
            try {
                pixel.parse();
            } catch (i) {
            }
        };
        s.onreadystatechange = function() {
            if (s.readyState == "complete" || s.readyState == "loaded") {
                try {
                    pixel.parse();
                } catch (i) {
                }
            }
        };
   }
    if (window.attachEvent)
        window.attachEvent('onload', async_load);
    else
        window.addEventListener('load', async_load, false);
})();
</script>
<!--End vizury code-->
<!-- async bootstrap -->
<script type="text/javascript">
  (function() {
    function async_bootstrap(){
        angular.element(document).ready(function() {
             angular.bootstrap(document, ['serviceApp']);
        });
    }
    if (window.attachEvent)
        window.attachEvent('onload', async_bootstrap);
    else
        window.addEventListener('load', async_bootstrap, false);
})();

</script>

<script type="text/javascript">
 (function() {
      function async_mixpanel() {
         //mixpanel script
         //mixpanel script
        (function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===e.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.2.min.js';f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f);b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2}})(document,window.mixpanel||[]);
		mixpanel.init(mpkey);mixpanel.set_config({debug: '<?php echo $mpdebugmode ?>'});		
    }
    if (window.attachEvent)
        window.attachEvent('onload', async_mixpanel);
    else
        window.addEventListener('load', async_mixpanel, false);
 })();
</script>

  </body>
</html>
