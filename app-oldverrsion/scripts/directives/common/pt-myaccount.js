/**
 * Name: My Account Sidebar Widget Directive
 * Description: My Account Sidebar Widget could be used to create My Account links in the sidebar.
 * @author: [Nimit Mangal]
 * Date: Sep 30, 2013
 **/
'use strict';
angular.module('serviceApp').directive('ptMyaccount',function(){
    return {
    restrict : 'A',
    //replace : true,
    templateUrl : 'views/directives/common/pt-myaccount.html',
    controller: function($rootScope, $scope, PortfolioService, WidgetConfig, $stateParams) {
        $scope.pList;
        $scope.myAccountWidgetName = 'My Account';
        
        var listData = WidgetConfig.propertyList.widgetData;    
        
        $scope.$on('portfolio.properties',function(event, data){
           populateDate(data);
        });
        
        function populateDate(propertyVal){
            // console.log(propertyVal);
            $scope.pList = [];
            $scope.$watch("$$childTail.tree", function (newVal, oldVal) {
                if (newVal) {
                $.each(propertyVal, function(item, attr){
                    var data = {};
                    data.title = attr.name;
                    data.url = 'portfolio/property/' + attr.listingId;
                    $scope.pList.push(data);
                    if($stateParams.propertyId == attr.listingId){
                    $scope.$$childTail.tree.selectNodeLabel(data);
                    }
                });
                }
            });
            
            //TODO: get strings from google sheet.
            $scope.$watch("pList", function (newVal, oldVal) {
                if (newVal) {
                $scope.data = [
                    {"name" : "index", "title" : $rootScope.labels.common.label.MY_PORTFOLIO, "url" : "portfolio/index", "children" : newVal},
                    {"name" : "savedsearches", "title" : $rootScope.labels.common.label.MY_SAVED_SEARCHES, "url" : "portfolio/savedsearches"},              
                    {"name" : "myfavorites", "title" : $rootScope.labels.common.label.MY_FAVORITES, "url" : "portfolio/myfavorites"},
                    {"name" : "recentlyviewed", "title" : $rootScope.labels.common.label.RECENTLY_VIEWED_PROP, "url" : "portfolio/recentlyviewed"},
                    {"name" : "enquiredproperty", "title" : $rootScope.labels.common.label.ENQUIRED_PROP, "url" : "portfolio/enquiredproperty"}
                ];
                }
            });
            
        }
        $scope.$watch("$$childTail.tree", function (newVal, oldVal) {
            if (newVal) {
                $scope.$watch("data", function (newVal, oldVal) {
                if (newVal) {
                    $.each($scope.data, function(item, attr){
                    if($stateParams.visibleModule == this.name){
                        $scope.$$childTail.tree.selectNodeLabel(this);
                    }
                    });
                }
                });
            }
        });
    },
    link:function(scope){
            
    }
    }
});
