/**
   * Name: Add Property
   * Description: pt-addproperty will be used on portfolio page to add new property.
   * 
   * @author: [Nakul Moudgil]
   * Date: Sep 27, 2013
**/
'use strict';
angular.module('serviceApp').controller('addpropertyCtrl',function($rootScope, $scope, $modalInstance,
  UnitInfoService, BanksService, CityService, LocalityService, ProjectService, PropertyService,
  WidgetConfig,$timeout, CommonValidators, Formatter){
  var purchasedForObj;
  var loanOptionsObj;
  var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
    function initializeAddEditProperty(){
    $scope.listing = {};
    $scope.listing.city = '';
    $scope.listing.locality = '';
    $scope.listing.project = undefined;
    $scope.listing.builder = '';
    $scope.listing.units = [];
    $scope.listing.unit = {};
    $scope.listing.unit.type = '';
    $scope.listing.listingSize = '';
    $scope.listing.unitNo = '';
    $scope.listing.tower = '';
    $scope.listing.floor = '';
    $scope.listing.propertyName = '';
    $scope.listing.purchaseDate = new Date();
    $scope.listing.basePrice = '';
    $scope.listing.otherExpenses = '';
    $scope.listing.totalPrice = 0;
    $scope.listing.goalAmount = '';
    $scope.listing.loanAmount = '';
    $scope.listing.loanAvailedAmount = '';
    $scope.listing.bank = '';
    $scope.listing.saveUpdate = $rootScope.labels.common.items.SAVE_BUTTON;
    
    $scope.loanAvailedFlag = false;
    $scope.selection ='';
    $scope.showBack = 'true';
    $scope.isUpdating = 0;
    $scope.banks = [];
    
    $scope.cancelMsg = $rootScope.labels.common.message.CONFIRM_CANCEL;
    $scope.existingProject = false;
    $scope.valErrMsg = '';
    $scope.purchasedForOptions = [$rootScope.labels.portfolio.label.PURCHASED_FOR_SELF,
                                $rootScope.labels.portfolio.label.PURCHASED_FOR_INVEST
                               ];
    $scope.listing.purchasedFor = $scope.purchasedForOptions[0];

    $scope.loanOptions = [
    $rootScope.labels.portfolio.label.LOAN_STATUS_OPTION_1,
    $rootScope.labels.portfolio.label.LOAN_STATUS_OPTION_2,
    $rootScope.labels.portfolio.label.LOAN_STATUS_OPTION_3
    ];

    $scope.listing.loanStatus = '';

    $scope.transactionTypeOptions = [$rootScope.labels.portfolio.label.TRANSACTION_TYPE_OPTION_1,
      $rootScope.labels.portfolio.label.TRANSACTION_TYPE_OPTION_2
    ];

    //$scope.listing.transactionType = $scope.transactionTypeOptions[0];
    $scope.listing.transactionType = 'PRIMARY';

    purchasedForObj = {
        SELF : $rootScope.labels.portfolio.label.PURCHASED_FOR_SELF,
        INVESTMENT : $rootScope.labels.portfolio.label.PURCHASED_FOR_INVEST,
        OTHERS : $rootScope.labels.portfolio.label.PURCHASED_FOR_OTHER
    };
    loanOptionsObj = {
        AVAILED : $rootScope.labels.portfolio.label.LOAN_STATUS_OPTION_1,
        NOT_AVAILED : $rootScope.labels.portfolio.label.LOAN_STATUS_OPTION_2,
        PAID : $rootScope.labels.portfolio.label.LOAN_STATUS_OPTION_3
    };
    
  }

  function setAddPropertyFormAttributes(){
    //mixpanel tracker
    $rootScope.TrackingService.mixPanelTracking('Step 1 - Add Property', {'Page Name': pageType});
    $scope.selection ='step1';
    $scope.headerText = $rootScope.labels.portfolio.label.ADD_PROP_STEP_1;
      CityService.getMainCities().then(function (data) {
    $scope.cities = data;
      });
    $scope.localities = LocalityService.getLocalities;
      $scope.projects = ProjectService.getProjects;
  }
    
function setEditPropertyAttributes(resp){
      //mixpanel tracker
      $rootScope.TrackingService.mixPanelTracking('Step 1 - Edit Property', {'Page Name': pageType});
      $scope.headerText = 'Update ' + resp.name;
      if ( !$scope.listing.locality ) {
        $scope.listing.locality = {label:resp.locality};
        $scope.listing.localityName = resp.locality;
      }
      if ( !$scope.listing.city ) {
        $scope.listing.city = {label:resp.cityName};
      }
      if ( !$scope.listing.project ) {
        $scope.listing.project = {coreText:resp.builderName + ' ' + resp.projectName};
      }

    UnitInfoService.getUnitInfo(resp.projectId).then(function (data) {
	$scope.unitInfo = data;
    });
      $scope.$watch('unitInfo',function(newVal, oldVal){
        if(newVal !== oldVal){
          $scope.listing.units = newVal.properties;
          $scope.listing.builder = newVal.builderName;
          $.each( newVal.properties, function( item, attr ) {
            if ( attr.propertyId === resp.propertyId ) {
              $scope.listing.unit.listingSize = attr.size;
              if ( !attr.size ) {
                attr.size = 'NA';
                attr.measure = '';
                $scope.listing.unit.listingSize = 'NA';
              }
              $scope.listing.unitDefault = attr;
            }
          });
        }
      });
      $scope.listing.listingSize = resp.listingSize;
      $scope.listing.propertyName = resp.name;
    $scope.oldPropertyName = resp.name;
      $scope.listing.unitNo = resp.unitNo;
      $scope.listing.floor = resp.floorNo;
      $scope.listing.tower = resp.tower;
      if ( resp.purchaseDate ) {
        $scope.listing.purchaseDate = Formatter.convertToIST( resp.purchaseDate );
      }
      $scope.listing.basePrice = resp.basePrice;
      $scope.listing.otherExpenses = ( resp.otherPrices && resp.otherPrices.length > 0 ) ? resp.otherPrices[0].amount : 0;
      $scope.listing.totalPrice = resp.totalPrice;
      $scope.listing.goalAmount = resp.goalAmount;
      $scope.listing.loanAmount = resp.loanAmount;
      $scope.listing.loanAvailedAmount = resp.loanAvailedAmount;
      if(resp.loanStatus){
        $scope.listing.loanStatus = resp.loanStatus.replace('_', ' ');
      }
      $scope.listing.transactionType = 'PRIMARY';

      if ( purchasedForObj[resp.purchasedFor] !== 'undefined' ) {
        $scope.listing.purchasedFor = purchasedForObj[resp.purchasedFor];
      }
      else {
          $scope.listing.purchasedFor = resp.purchasedFor;
      }

      if ( loanOptionsObj[resp.loanStatus] !== 'undefined' ) {
        $scope.listing.loanStatus = loanOptionsObj[resp.loanStatus];
      }
      else {
          $scope.listing.loanStatus = resp.loanStatus;
      }

      updateBankList();
      $scope.$watch('banks', function( newBank, oldBank ) {
        if ( newBank !== oldBank ) {
          $.each(newBank, function( count, attr ) {
            if ( attr.id === resp.bankId ) {
              $scope.listing.bank = attr;
            }
          });
        }
      }); 
}

function setEditPropertyFormAttributes(){
  var listIdToEdit = $rootScope.updatePropertyId;
  $scope.isUpdating = 1;
  $rootScope.updatePropertyId = 0;
  $scope.listing.saveUpdate = $rootScope.labels.common.items.UPDATE_BUTTON;
  $scope.showBack = 'false';
  $scope.selection = 'step2';

  PropertyService.getProperty([], listIdToEdit)
    .then( function(resp) {
      setEditPropertyAttributes(resp);
    });
  }

  // function setEditProperty(){}

  var updateBankList = function() {
    BanksService.getBanksList().then( function( bankData ) {
      $scope.banks = bankData;
    });
  };

  var validateForm = function(step){
    switch(step){
      case 'step1':
        if(!$scope.listing.city){
          $scope.valErrMsg = $rootScope.labels.common.message.SELECT_CITY;
          return false;
        }
        else if(!$scope.listing.project){
          $scope.valErrMsg = $rootScope.labels.common.message.SELECT_PROJECT;
          return false;
        }
        else {
          $scope.listing.propertyName = $scope.listing.propertyName ? $scope.listing.propertyName : $scope.listing.project.coreText ? $scope.listing.project.coreText+' - 1' : '' ;
        }
      break;
      case 'step2':
        //Validate Configuration selection
        if(!($scope.listing.unitDefault) || !($scope.listing.unitDefault.unitName)){
          $scope.valErrMsg = $rootScope.labels.common.message.SELECT_CONFIGURATION;
          return false;
        }
        //Validate Size
        if(!$scope.listing.listingSize){
          $scope.valErrMsg = $rootScope.labels.common.message.SELECT_SIZE;
          return false;
        }
        else{
          if(!CommonValidators.isInteger($scope.listing.listingSize) || $scope.listing.listingSize <= 0){
            $scope.valErrMsg = $rootScope.labels.common.message.SELECT_SIZE;
            return false;
          }
        }
        //Validate Property Name
        if(!$scope.listing.propertyName){
          $scope.valErrMsg = $rootScope.labels.common.message.SELECT_NAME;
          return false;
        }
        else{
          if(!CommonValidators.haveTags($scope.listing.propertyName)){
            $scope.valErrMsg = $rootScope.labels.common.message.SELECT_NAME;
            return false;
          }
	    
	    if(!$scope.isUpdating){
		if (propertyNames.indexOf($scope.listing.propertyName) >= 0) {
		    $scope.valErrMsg = $rootScope.labels.common.message.EXISTS_NAME;
		    return false;
		}
	    }
	    else {
		if (($scope.oldPropertyName !== $scope.listing.propertyName) && (propertyNames.indexOf($scope.listing.propertyName) >= 0)) {
		    $scope.valErrMsg = $rootScope.labels.common.message.EXISTS_NAME;
		    return false;
		}
	    }
        }
        //Validate Purchased Dated
        if(!$scope.listing.purchaseDate){
          $scope.valErrMsg = $rootScope.labels.common.message.SELECT_DATEOFPURCHASE;
          return false;
        }
        if($scope.listing.purchaseDate){
          var today = new Date();
          var tmpDateToCmp;
          if ($scope.listing.purchaseDate instanceof Date) {
            tmpDateToCmp = $scope.listing.purchaseDate;
          }
          else if ( $scope.listing.purchaseDate.indexOf('/') ) {
            var tmpDate = $scope.listing.purchaseDate.split('/');
            tmpDateToCmp = new Date(tmpDate[1]+'/'+tmpDate[0]+'/'+tmpDate[2]);
          }
          else {
            console.log('Something wrong with Purchased Date. This should never happen');
          }
          if(tmpDateToCmp > today){
            $scope.valErrMsg = $rootScope.labels.common.message.WRONG_DATEOFPURCHASE;
            return false;
          }
        }
        //Validate Unit Floor
        if($scope.listing.floor){
          if(!CommonValidators.isInteger($scope.listing.floor)){
            $scope.valErrMsg = $rootScope.labels.common.message.SELECT_FLOOR;
            return false;
          }
        }
        //Validate Unit Tower
        if($scope.listing.tower){
          if(!CommonValidators.haveTags($scope.listing.tower)){
            $scope.valErrMsg = $rootScope.labels.common.message.SELECT_TOWER;
            return false;
          }
        }
      break;
      case 'step3':
        if(!$scope.listing.basePrice){
          $scope.valErrMsg = $rootScope.labels.common.message.SELECT_BASEPRICE;
          return false;
        }
        else{
          if(!CommonValidators.isNumeric($scope.listing.basePrice) || $scope.listing.basePrice <= 0){
            $scope.valErrMsg = $rootScope.labels.common.message.SELECT_BASEPRICE;
            return false;
          }  
        }
        if($scope.listing.otherExpenses){
          if(!CommonValidators.isNumeric($scope.listing.otherExpenses)){
            $scope.valErrMsg = $rootScope.labels.common.message.SELECT_OTHEREXPENSES;
            return false;
          }
        }
        if($scope.listing.goalAmount){
          if(!CommonValidators.isNumeric($scope.listing.goalAmount)){
            $scope.valErrMsg = $rootScope.labels.common.message.SELECT_GOALAMOUNT;
            return false;
          }
        }
        if($scope.listing.loanAmount){
          if(!CommonValidators.isNumeric($scope.listing.loanAmount)){
            $scope.valErrMsg = $rootScope.labels.common.message.SELECT_LOANAMOUNT;
            return false;
          }
        }
        if(parseInt($scope.listing.loanAmount, 10) > parseInt($scope.listing.totalPrice, 10)){
          $scope.valErrMsg = $rootScope.labels.common.message.WRONG_LOANAMOUNT;
            return false;
        }
        if($scope.listing.loanAvailedAmount){
          if(!CommonValidators.isNumeric($scope.listing.loanAvailedAmount)){
            $scope.valErrMsg = $rootScope.labels.common.message.SELECT_LOANAVAILED;
            return false;
          }
          if(parseInt($scope.listing.loanAvailedAmount, 10) > parseInt($scope.listing.loanAmount, 10)){
            $scope.valErrMsg = $rootScope.labels.common.message.WRONG_LOANAVAILED;
            return false;
          }
        }
      break;
    }
    return true;
  };

  initializeAddEditProperty();

  if(!$rootScope.updatePropertyId){
    setAddPropertyFormAttributes();
  }
  else{  
    setEditPropertyFormAttributes();
  }  

  var propertyNames = [];
  $scope.$parent.$watch('pgData', function (newVal) {
    if (newVal){
      propertyNames = _.map(newVal, function (val) {
        return val.name;
      });
    }
  });
  
  $scope.parseInteger = function(value){
    if(isNaN(parseInt(value, 10))){
      return 0;
    }
    else{
      return parseInt(value, 10);
    }
  };

  $scope.priceChange = function(){
    $scope.listing.totalPrice = ($scope.parseInteger($scope.listing.basePrice) + $scope.parseInteger($scope.listing.otherExpenses) + $scope.parseInteger($scope.listing.otherExpenses2));
  };

  $scope.loanStatusChange = function(){
    if($scope.listing.loanStatus === $rootScope.labels.portfolio.label.LOAN_STATUS_OPTION_1){
      $scope.loanAvailedFlag = false;
    }
    else{
     $scope.loanAvailedFlag = true; 
    }
  };

  $scope.updateSize = function(u) {
    $scope.listing.listingSize = u.size;
  };

  $scope.onCitySelected = function(){
    $scope.listing.project = '';
  };
  
  $scope.onProjectSelected = function(){
    if($scope.listing.project.label !== ''){
      $scope.existingProject = true;
      $scope.listing.locality = $scope.listing.project.locality;
      $scope.listing.localityName = $scope.listing.project.locality;
      var unit = $scope.listing.project.id.split('TYPEAHEAD-PROJECT-').pop();
      if(unit){
          UnitInfoService.getUnitInfo(unit).then(function (data) {
	      $scope.unitInfo = data;
	  });
        $scope.$watch('unitInfo',function(newVal, oldVal){
          if(newVal !== oldVal){
            $scope.listing.units = newVal.properties;
            $scope.listing.builder = newVal.builderName;
          }
        });
      }
      updateBankList();
    }
  };
  
  $scope.stepOneNext = function () {
    if(validateForm('step1') && $scope.listing.city){
      if($scope.listing.project && $scope.listing.project.id){
        $scope.valErrMsg = '';
        $scope.selection = 'step2';
        $scope.headerText = $rootScope.labels.portfolio.label.ADD_PROP_STEP_2;
        $scope.projDetailSummary = $scope.listing.project.label;
        $rootScope.TrackingService.sendGAEvent('portfolio', 'clicked', 'addProperty-step1');
        $rootScope.TrackingService.mixPanelTracking('Step 2 - Project Selected', {'Page Name': pageType});
      }
      else if($scope.listing.project){
        $scope.valErrMsg = '';
        $scope.selection = 'step4';
        $scope.headerText = $rootScope.labels.portfolio.label.ADD_PROP_STEP_4;
      }
      else{
        $scope.valErrMsg = $rootScope.labels.common.message.SELECT_PROJECT;
      }
    }
    else{
      //$scope.existingProject = false;
	//$scope.valErrMsg = $rootScope.labels.common.message.SELECT_CITY;
    }
  };

  $scope.sendNewRequest = function () {
    $modalInstance.close($scope.listing);
  };

  $scope.stepTwoNext = function () {
    if(validateForm('step2')){
        $scope.valErrMsg = '';
        $scope.selection = 'step3';
        if ( $scope.isUpdating === 0 ) {
          $scope.headerText = $rootScope.labels.portfolio.label.ADD_PROP_STEP_3;
          $rootScope.TrackingService.sendGAEvent('portfolio', 'clicked', 'addProperty-step2');
          $rootScope.TrackingService.mixPanelTracking('Step 3 - Property Details', {'Page Name': pageType});
        }
        else {
          $rootScope.TrackingService.sendGAEvent('portfolio', 'clicked', 'edit-step1');
          $rootScope.TrackingService.mixPanelTracking('Step 2 - Updated Property Details', {'Page Name': pageType});
        }
    }
    $scope.loanStatusChange();
  };

  $scope.save = function () {
    if(validateForm('step3')){
        $modalInstance.close($scope.listing);
        if ( $scope.isUpdating === 0 ) {
            $rootScope.TrackingService.mixPanelTracking('Step 4 - Property Added', {'Page Name': pageType});
        }
        else {  
            $rootScope.TrackingService.mixPanelTracking('Step 3 - Property Updated', {'Page Name': pageType});
        }
    }
  };

  $scope.stepTwoBack = function () {
    $scope.selection = 'step1';
    $scope.valErrMsg = '';
    $scope.headerText = $rootScope.labels.portfolio.label.ADD_PROP_STEP_1;
    if ( $scope.isUpdating === 0 ) {
      $rootScope.TrackingService.sendGAEvent('portfolio', 'clicked', 'addProperty-back2');
      $rootScope.TrackingService.mixPanelTracking('Back Clicked', {'Step Number' : 2, 'Page Name': pageType});
    }
    else {
      $rootScope.TrackingService.sendGAEvent('portfolio', 'clicked', 'edit-back1');
      $rootScope.TrackingService.mixPanelTracking('Back Clicked', {'Step Number' : 1, 'Page Name': pageType});
    }
  };

  $scope.stepThreeBack = function () {
    $scope.selection = 'step2';
    $scope.valErrMsg = '';
    $scope.headerText = $rootScope.labels.portfolio.label.ADD_PROP_STEP_2;
    if ( $scope.isUpdating === 0 ) {
      $rootScope.TrackingService.sendGAEvent('portfolio', 'clicked', 'addProperty-back3');
      $rootScope.TrackingService.mixPanelTracking('Back Clicked', {'Step Number' : 3, 'Page Name': pageType});
    }
    else {
      $rootScope.TrackingService.sendGAEvent('portfolio', 'clicked', 'edit-back2');
      $rootScope.TrackingService.mixPanelTracking('Back Clicked', {'Step Number' : 2, 'Page Name': pageType});
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
    var gaString = '', step = '';
    if ( $scope.selection === 'step1' ) {
      step = 1;
    }
    else if ( $scope.selection === 'step2' ) {
      step = 2;
    }
    else if ( $scope.selection === 'step3' ) {
      step = 3;
    }
    else if ( $scope.selection === 'step4' ) {
      step = 4;
    }
    if ( $scope.isUpdating === 0 ) {
      gaString = 'addProperty-cancel'+step;
    }
    else {
      step = step - 1;
      gaString = 'editProperty-cancel'+step;
    }
    if ( gaString !== '' ) {
      $rootScope.TrackingService.sendGAEvent('portfolio', 'clicked', gaString);
      $rootScope.TrackingService.mixPanelTracking('Cancel Clicked', {'Step Number' : step, 'Page Name': pageType});
    }
  };

  $scope.update = function () {
    //  for now same as add
    if(validateForm('step3')){    
      $scope.selection = 'step1';
      $modalInstance.close($scope.listing);
    }
  };
});
