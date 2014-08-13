'use strict';
angular.module('serviceApp').directive('ptSingleselect', function($rootScope){

    return{
        restrict    :   'A',
        transclude  :   true,
        scope       :   {
                        data        :   '=',
                        selected    :   '=',
                        updateFilter:   '&'
            },
        templateUrl :   'views/directives/common/pt-singleselect.html',
        link        :   function(scope, element, attr){
            scope.keys = _.keys( scope.data );

            scope.$watch('selected.item', function(current, old){
                var curDate = new Date(), fromDate = new Date(), toDate = new Date(),
                    data, days;
                if(current && current != ''){
                    days = scope.data[current];
                    fromDate.setDate(curDate.getDate() + days.from);
                    toDate.setDate(curDate.getDate() + days.to);
                    data =  {   'from':    fromDate.getTime(),
                                'to'    :   toDate.getTime()
                            };
                    scope.updateFilter({'data':data});
                }
            });
 
            scope.btnClicked = function($event, key){
                var data = {};
                if(scope.selected.item == key){
                    $('.filter-radio').children().removeClass('active');
                    scope.selected.item = '';
                    scope.updateFilter({'data':data});
                } else {
                    $('.filter-radio').children().removeClass('active');
                    $($event.target).addClass('active');
                    scope.selected.item = key;
                }
                
                //Send GA/Mixpanel tracker event request on applying filter 
                var subLabel = '';
				var filterObj = {};
				var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
				subLabel = attr.name+":"+key+"-"+pageType; 
					
				filterObj['Filter Name'] = attr.name;
				filterObj['Filter Value'] = key
				filterObj['Page Name'] = pageType; 
				//GA tracker
				$rootScope.TrackingService.sendGAEvent('filter', 'filtered', subLabel); 	 
				//mixpanel tracker
				$rootScope.TrackingService.mixPanelTracking('Filter Used', filterObj); 
				//End GA/Mixpanel tracker
                 
           };
        },
        controller  :   function($scope, $element){
        }
    };
});
