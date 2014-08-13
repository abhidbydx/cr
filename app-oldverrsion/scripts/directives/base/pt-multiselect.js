'use strict';
angular.module('serviceApp').directive('ptMultiselect', function($rootScope){

    return{
        restrict    :   'A',
        transclude  :   true,
        scope       :   {
                        any         :   '@',
                        data        :   '=',
                        selected    :   '=',
                        updateFilter:   '&'
            },
        templateUrl :   'views/directives/common/pt-multiselect.html',
        link        :   function(scope, element, attr){
            scope.Any = false;
            scope.keys = _.keys( scope.data );

            scope.updateAll = function(e){
                var i, elem = angular.element(e.currentTarget);
                if(scope.Any == true){
                    scope.Any = false;
                    elem.removeClass('active');
                } else {
                    scope.Any = true;
                    elem.addClass('active');
                }
                scope.selected['Any'] = scope.Any;
                for(i = 0; i < scope.data.length; i++){
                    scope.selected[scope.data[i]] = scope.Any;
                }
                
                  
                 
            };

            scope.$watch('selected', function(current, old){
                var k, data = [];  
                scope.checkedData = [];//Using in GA tracking  
                if(current && _.keys(current).length){ 
                    for(var k in current){ 
                        if(current[k] === true){  
							scope.checkedData.push(k);
                            if(scope.data[k] instanceof Array){
                                data = data.concat(scope.data[k]);                               
                            } else {
                                data = data.concat([scope.data[k]]);                                 
                            }
                            
                        }
                    }  
                    scope.updateFilter({'data': data});
                }
            }, true);
             
			 
			//Send GA/Mixpanel tracker event request on applying filter 
			scope.tracking = function(filterVal, type) {
				var subLabel = '';
				var filterObj = {};    
				var pageType = $rootScope.CURRENT_ACTIVE_PAGE
				subLabel = type+":"+filterVal+"-"+pageType; 
					
				filterObj['Filter Name'] = type;
				filterObj['Filter Value'] = filterVal
				filterObj['Page Name'] = pageType;
				 
				//GA tracker
				$rootScope.TrackingService.sendGAEvent('filter', 'filtered', subLabel); 	 
				//mixpanel tracker
				$rootScope.TrackingService.mixPanelTracking('Filter Used', filterObj); 
			  
			} 
			
			
			element.bind("click",function(e){   
				var dataStr = scope.checkedData.join(",");	
				var type 	= attr.name
				if(dataStr && dataStr != 'undefined' && type){
					scope.tracking(dataStr, type)
				}
			}); 
			
		 
        
        },
        controller  :   function($scope, $element){    
        }
    };
});
