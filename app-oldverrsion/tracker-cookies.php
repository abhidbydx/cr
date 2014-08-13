<?php

/* GA Cookie Parser */

class GA_Parse
{

  var $campaign_source;    		// Campaign Source
  var $campaign_name;  			// Campaign Name
  var $campaign_medium;    		// Campaign Medium
  var $campaign_content;   		// Campaign Content
  var $campaign_term;      		// Campaign Term

  var $first_visit;      		// Date of first visit
  var $previous_visit;			// Date of previous visit
  var $current_visit_started;	// Current visit started at
  var $times_visited;			// Times visited
  var $pages_viewed;			// Pages viewed in current session

  function __construct($cookie) {
    // If we have the cookies we can go ahead and parse them.
    if (isset($cookie["__utma"]) and isset($cookie["__utmz"])) {
      $this->cookie = $cookie;
      $this->ParseCookies();
    }
  }

  function ParseCookies(){
    // Parse __utmz cookie
    list($domain_hash,$timestamp, $session_number, $campaign_numer, $campaign_data) = explode('.', $this->cookie["__utmz"],5);

    // Parse the campaign data
    $campaign_data = parse_str(strtr($campaign_data, "|", "&"));

    $this->campaign_source = $utmcsr;
    $this->campaign_name = $utmccn;
    $this->campaign_medium = $utmcmd;
    if (isset($utmctr)) $this->campaign_term = $utmctr;
    if (isset($utmcct)) $this->campaign_content = $utmcct;

    // You should tag you campaigns manually to have a full view
    // of your adwords campaigns data.
    // The same happens with Urchin, tag manually to have your campaign data parsed properly.

    if (isset($utmgclid)) {
      $this->campaign_source = "google";
      $this->campaign_medium = "cpc";
      $this->campaign_term = $utmctr;
    }

    // Parse the __utma Cookie
    list($domain_hash,$random_id,$time_initial_visit,$time_beginning_previous_visit,$time_beginning_current_visit,$session_counter) = explode('.', $this->cookie["__utma"]);

    $this->first_visit = date("Y-m-d H:i:s",$time_initial_visit);
    $this->previous_visit = date("Y-m-d H:i:s",$time_beginning_previous_visit);
    $this->current_visit_started = date("Y-m-d H:i:s",$time_beginning_current_visit);
    $this->times_visited = $session_counter;
    $this->randomid = $random_id;
    // Parse the __utmb Cookie

    list($domain_hash,$pages_viewed,$garbage,$time_beginning_current_session) = explode('.', $this->cookie["__utmb"]);
    $this->pages_viewed = $pages_viewed;

    // End ParseCookies
  }

  // End GA_Parse
}

$c = $_COOKIE;
$source = '';
if(isset($_COOKIE["USER_FROM"]))
  $source = $_COOKIE["USER_FROM"];
$ppc = '';
if(isset($_COOKIE["USER_FROM_PPC"]))
  $ppc = $_COOKIE["USER_FROM_PPC"];

if((!isset($_COOKIE["USER_FROM"]) || $_COOKIE["USER_FROM"]=='') || @($_GET['utm_source']!='' && $_GET['utm_source']!='banner_ad'))
  {
    $get_source = '';
    if(isset($_GET['utm_source']))
      $get_source = trim(strtolower($_GET['utm_source']));
    
    $get_network = '';
    if(isset($_GET['Network'])) {
      $get_network = trim(strtolower($_GET['Network']));
      setcookie("USER_NETWORK",$get_network,time()+3600*24*7,'/');
      $_COOKIE["USER_NETWORK"] = $get_network;
    }
    $utm_medium = '';
    if(isset($_GET['utm_medium']))
      {
	$utm_medium = trim(strtolower($_GET['utm_medium']));
	setcookie("USER_MEDIUM",$_GET['utm_medium'],time()+3600*24*7,'/');
	$_COOKIE["USER_MEDIUM"] = $_GET['utm_medium'];
      }	
    
    if($get_source=='yahoo' || $get_source=='adwords' || $get_source=='adword'  || $get_source=='google' || $get_source=='mailer' || $get_source=='mailerinternal' || 
       $get_source=='externalmailer'  || $get_source=='mailerexternal' || $get_source=='tyroo' || $get_source=='clove' || $get_source=='tyroo' || $get_source=='clove' || 
       $get_source=='monster.com' || $get_source=='valuefirst.com' || $get_source=='digitalmailers' || $get_source=='mim' || 
       $get_source=='istream' || $get_source=='googlepromotion' || $get_source=='timesjobs.com' || $get_source=='timesmoney' || 
       $get_source=='commonfloor.com' || $get_source=='dovesoft' || $get_source=='inspiringclue' || $get_source=='blueearth' || 
       $get_source=='way2online' || $get_source=='marketingmailer' || $get_source=='harshasagar' || $utm_medium=='cpc' || 
       $utm_medium=='banner' || $utm_medium=='mailerexternal' || $utm_medium=='mailerinternal')	// Paid Traffic
      {
	/*
	  # Paid Url Example
	  http://www.proptiger.com/google_page_4.php?
	  projectName=East%2520Avenue%2520-%2520Pune
	  utm_source=AdWords
	  utm_adgroup=PRA%2520East%2520Avenue
	  utm_medium=PPC
	  utm_term=pra%2520east%2520avenue
	  utm_content=10127500815
	  utm_campaign=Hot%2520Projects
	  Network=Search
	  SiteTarget=
	*/
	setcookie("USER_ADGROUP",$_GET['utm_adgroup'],time()+3600*24*7,'/');
	setcookie("USER_KEYWORD",$_GET['utm_term'],time()+3600*24*7,'/');		
	setcookie("USER_CAMPAIGN",$_GET['utm_campaign'],time()+3600*24*7,'/');
	setcookie("USER_IP",$_SERVER["REMOTE_ADDR"],time()+3600*24*7,'/');		
	

	$_COOKIE["USER_ADGROUP"] = $_GET['utm_adgroup'];
	$_COOKIE["USER_KEYWORD"] = $_GET['utm_term'];		
	$_COOKIE["USER_CAMPAIGN"] = $_GET['utm_campaign'];
	$_COOKIE["USER_IP"] = $_SERVER["REMOTE_ADDR"];	

	$ppc = 'TRUE';

	if($get_source=='yahoo' && $get_network=='search')
	  {
	    $source = 'Yahoo Search';
	    $ppc = 'TRUE';
	  }
	else if($get_source=='yahoo' && $get_network=='content')
	  {
	    $source = 'Yahoo Display';
	    $ppc = 'TRUE';
	  }
	else if($get_source=='yahoo' && $get_network=='')
	  {
	    $source = 'Yahoo';
	    $ppc = 'TRUE';
	  }
	else if(($get_source=='adword' || $get_source=='adwords' || $get_source=='google' || $utm_medium=='cpc') && $get_network=='search')
	  {
	    $source = 'Google Search';
	    $ppc = 'TRUE';
	  }
	else if(($get_source=='adword' || $get_source=='adwords' || $get_source=='google' || $utm_medium=='cpc') && $get_network=='content')
	  {
	    $source = 'Google Display';
	    $ppc = 'TRUE';
	  }
	else if(($get_source=='adword' || $get_source=='adwords' || $get_source=='google' || $utm_medium=='cpc') && $get_network=='')
	  {
	    $source = 'Google';
	    $ppc = 'TRUE';
	  }
	else if($get_source=='mailer' || $get_source=='mailerinternal')
	  {
	    $source = 'Mailer Internal';
	    $ppc = 'FALSE';
	  }
	else if($get_source=='tyroo')
	  {
	    $source = 'Tyroo';
	    $ppc = 'TRUE';
	  }
	else if($get_source=='clove')
	  {
	    $source = 'Clove';
	    $ppc = 'TRUE';
	  }
	else if($get_source=='externalmailer' || $get_source=='mailerexternal')
	  {
	    $source = 'Mailer External';
	    $ppc = 'FALSE';
	  }
	else if($get_source=='monster.com')
	  {
	    $source = 'Monster.com';
	    $ppc = 'TRUE';
	  }
	else if($get_source=='valuefirst.com')
	  {
	    $source = 'ValueFirst.com';
	    $ppc = 'TRUE';
	  }
	else if($get_source=='digitalmailers')
	  {
	    $source = 'Digital Mailers';
	    $ppc = 'TRUE';
	  }
	else if($get_source=='mim')
	  {
	    $source = 'MIM';
	    $ppc = 'TRUE';
	  }
	else if($get_source=='istream')
	  {
	    $source = 'ISTREAM';
	    $ppc = 'TRUE';
	  }
	else if($get_source=='googlepromotion')
	  {
	    $source = 'GOOGLEPROMOTION';
	    $ppc = 'FALSE';
	  }
	else
	  {
	    $source = $_GET['utm_source'];
	    $ppc = 'TRUE';
	  }
	
	
	if($utm_medium=='banner' || $utm_medium=='mailerexternal')
	  {			
	    $source = trim($_GET['utm_source']);			
	    $ppc = 'TRUE';
	  }
	else  if($utm_medium=='mailerinternal')
	  {
	    $source = 'Mailer Internal';
	    $ppc = 'FALSE';
	  }
	
	setcookie("USER_FROM",$source,time()+3600*24*7,'/');
	setcookie("USER_FROM_PPC",$ppc,time()+3600*24*7,'/');
	
	$_COOKIE["USER_FROM"] = $source;
	$_COOKIE["USER_FROM_PPC"] = $ppc;
	
	
	if ((!isset($_COOKIE["REF_URL"]) || $_COOKIE["REF_URL"]=='') && isset($_SERVER['HTTP_REFERER'])) {
	  setcookie("REF_URL",$_SERVER['HTTP_REFERER'],time()+3600*24*7,'/');
	  $_COOKIE["REF_URL"] = $_SERVER['HTTP_REFERER'];
	}

	if (!isset($_COOKIE["LANDING_PAGE"]) || $_COOKIE["LANDING_PAGE"] == '') {
	  $landingpage = $url = "http://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"];
	  setcookie("LANDING_PAGE",$landingpage,time()+3600*24*7,'/');
	  $_COOKIE["LANDING_PAGE"] = $landingpage;
	}

	$paramsForData['src'] = $srcfrm[5];
	$paramsForData['frmname'] = $frmname[1];
	$paramsForData['pgname'] = $pgname[9];
	$paramsForData['req_uri'] = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER']:'';
	$paramsForData['pgurl'] = basename($_SERVER['PHP_SELF']);
      }
    else	// SEO (Non Paid) or Direct Traffic
      {
	$tracker=true;
	$source='';
	$ppc='';
	$ref_flag = 0;
	if(!isset($_COOKIE["USER_FROM"]) || $_COOKIE["USER_FROM"]=='')
	  {
	    if(isset($_SERVER["HTTP_REFERER"]))
	      {
		$ref_flag = 1;

		if(isset($_COOKIE["PHPSESSID"])) {
		  //setcookie("USER_ID",$_COOKIE["PHPSESSID"],time()+3600*24*7,'/');
		  $_COOKIE["USER_ID"] = $_COOKIE["PHPSESSID"];
		}
		else {
		  session_start();
		}

		$ref=$_SERVER["HTTP_REFERER"];

		if(stristr($ref,"Google"))
		  {
		    $source="Google SEO";
		    setcookie("USER_FROM","Google SEO",time()+3600*24*7,'/');
		    $_COOKIE["USER_FROM"] = "Google SEO";
		  }
		elseif(stristr($ref,"Bing"))
		  {
		    $source="Bing";
		    setcookie("USER_FROM","Bing",time()+3600*24*7,'/');
		    $_COOKIE["USER_FROM"] = "Bing";
		  }
		elseif(stristr($ref,"Aol"))
		  {
		    $source="Aol";
		    setcookie("USER_FROM","Aol",time()+3600*24*7,'/');
		    $_COOKIE["USER_FROM"] = "Aol";
		  }
		elseif(stristr($ref,"Yahoo"))
		  {
		    $source="Yahoo";
		    setcookie("USER_FROM","Yahoo",time()+3600*24*7,'/');
		    $_COOKIE["USER_FROM"] = "Yahoo";
		  }
		else
		  {
		    $source="Other SEO";
		    setcookie("USER_FROM","Other SEO",time()+3600*24*7,'/');
		    $_COOKIE["USER_FROM"] = "Other SEO";
		  }
	      }
	    else
	      {
		if(isset($_COOKIE["PHPSESSID"])){
		  //setcookie("USER_ID",$_COOKIE["PHPSESSID"]);
		  $_COOKIE["USER_ID"] = $_COOKIE["PHPSESSID"];
		}

		$source="Website";
		setcookie("USER_FROM","Website",time()+3600*24*7,'/');
		$_COOKIE["USER_FROM"] = "Website";
	      }
	  }
	else
	  {
	    $source = $_COOKIE["USER_FROM"];
	  }

	$url = '';
	if(isset($_SERVER['HTTP_REFERER']))
	  $url = $_SERVER["HTTP_REFERER"];
	$ppc = "FALSE";
	if(stristr($url,"gclid"))
	  {
	    $ppc="TRUE";
	  }

	if (!isset($_COOKIE["REF_URL"]) || $_COOKIE["REF_URL"]=='') {
	  setcookie("REF_URL",$url,time()+3600*24*7,'/');
	  $_COOKIE["REF_URL"] = $url;
	}

	$landingpage = $url = "http://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"];
	setcookie("LANDING_PAGE",$landingpage,time()+3600*24*7,'/');
	$_COOKIE["LANDING_PAGE"] = $landingpage;

	/*
	  # SEO URL Example
	  http://www.google.co.in/url?sa=t
	  &rct=j
	  &q=pra%20east%20avenue
	  &source=web
	  &cd=4
	  &ved=0CF4QFjAD
	  &url=http%3A%2F%2Fwww.proptiger.com%2Fp-pra-east-avenue-pune-wagholi.php
	  &ei=YfFNT4LAJsbrrQfVhsysDw
	  &usg=AFQjCNGoqAYEuOO_v6Bmh5R0qUh4QpBD4w
	  &cad=rja
	*/


	$breakrefurl=explode("?",$url);
	$breakrefurl=array_slice($breakrefurl,1);
	$breakrefurl=implode($breakrefurl);
	$breakrefurl=explode("&",$breakrefurl);

	for($i=0;$i<sizeof($breakrefurl);$i++)
	  {
	    if(stristr($breakrefurl[$i],"q=") || stristr($breakrefurl[$i],"_ylu="))		// q= For Google, __ylu= For Yahoo
	      {
		$newval=explode("=",$breakrefurl[$i]);
		$keyword=$newval[1];
		if(stristr($breakrefurl[$i],"q="))
		  {
		    $source="Google SEO";
		  }
		else if(stristr($breakrefurl[$i],"_ylu="))
		  {
		    $source="Yahoo SEO";
		  }
		$ppc = "FALSE";
		setcookie("USER_FROM",$source,time()+3600*24*7,'/');
		$_COOKIE["USER_FROM"] = $source;
	      }
	  }


	/*--------------- SEO - Non Paid ------------------*/

	# This will handle the url like below:
	#?projectId=1&utm_source=AdWords&utm_medium=PPC&utm_term=property in gurgaon&utm_content=12312321&utm_campaign=SJR%20Trillium&Network=Search&SiteTarget=placement

	$querystr = $_SERVER["REQUEST_URI"];
	$querystr_data=explode("?",$querystr);
	$querystr_data=array_slice($querystr_data,1);
	$querystr_data=implode($querystr_data);
	$querystr_data=explode("&",$querystr_data);

	$keyword='';
	$campaign='';
	$adgroup='';

	for($i=0;$i<sizeof($querystr_data);$i++)
	  {

	    if(stristr($querystr_data[$i],"utm_term"))
	      {

		$newval=explode("=",$querystr_data[$i]);
		$keyword=$newval[1];
	      }

	    if(stristr($querystr_data[$i],"utm_campaign"))
	      {
		$newval=explode("=",$querystr_data[$i]);
		$campaign=$newval[1];
	      }

	    if(stristr($querystr_data[$i],"utm_adgroup"))
	      {
		$newval=explode("=",$querystr_data[$i]);
		$adgroup=$newval[1];
	      }
	  }


	/*--------------- SEO - Non Paid ------------------*/
	# If no data set but have values in Cookies __utmz

	if($keyword=='' && $campaign=='' && $adgroup=='' && $_COOKIE['__utmz']!='')
	  {
	    $utmz = $_COOKIE['__utmz'];
	    $querystr_data=explode("|",$utmz);

	    $keyword='';
	    $campaign='';
	    $adgroup='';

	    //?projectId=1&utm_source=AdWords&utm_medium=PPC&utm_term=property in                   gurgaon&utm_content=12312321&utm_campaign=SJR%20Trillium&Network=Search&SiteTarget=placement

	    for($i=0;$i<sizeof($querystr_data);$i++)
	      {

		if(stristr($querystr_data[$i],"utmctr"))
		  {

		    $newval=explode("=",$querystr_data[$i]);
		    $keyword=$newval[1];
		  }

		if(stristr($querystr_data[$i],"utmccn"))
		  {
		    $newval=explode("=",$querystr_data[$i]);
		    $campaign=$newval[1];
		  }


		if(stristr($querystr_data[$i],"utmcsr"))
		  {
		    $newval=explode("=",$querystr_data[$i]);
		    $adgroup=$newval[1];
		  }

	      }
	  }

	/*--------------- SEO - Non Paid ------------------*/

	if($ppc!='') setcookie("USER_FROM_PPC",$ppc,time()+3600*24*7,'/');
	if($keyword!='') setcookie("USER_KEYWORD",$keyword,time()+3600*24*7,'/');
	if($campaign!='') setcookie("USER_CAMPAIGN",$campaign,time()+3600*24*7,'/');
	if($adgroup!='') setcookie("USER_ADGROUP",$adgroup,time()+3600*24*7,'/');
	setcookie("USER_IP",$_SERVER["REMOTE_ADDR"],time()+3600*24*7,'/');

	$_COOKIE["USER_ADGROUP"] = $adgroup;
	$_COOKIE["USER_KEYWORD"] = $keyword;
	$_COOKIE["USER_FROM_PPC"] = $ppc;
	$_COOKIE["USER_CAMPAIGN"] = $campaign;
	$_COOKIE["USER_IP"] = $_SERVER["REMOTE_ADDR"];
      }
  }
?>
