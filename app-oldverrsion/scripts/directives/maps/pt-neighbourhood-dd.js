'use strict';

angular.module('serviceApp').directive('ptNeighbourhoodDd', ['$rootScope','LocalityService', function($rootScope,LocalityService) {

    return {
        restrict    :   'A',
        scope       :   {
            addNeighbourhood : '&',
            removeNeighbourhood :   '&',
            neighbourhoodItems :   '&',
            neighbourhoodValue :   '=',
            map :   '=',
        },
        templateUrl :   'views/directives/maps/pt-neighbourhood-dd.html',
        link        :   function(scope, element){
			scope.exit  =   function() {
                scope.removeNeighbourhood({'type':null, 'level':'locality', 'callback':function(){
                    if($('.neighbourhood-dd-wrap').hasClass('active-neighbour')){
                        element.find('a').removeClass('active-neighbour');
						$('.neighbourhood-dd-wrap').removeClass('active-neighbour');
                        scope.map.services.bounds([]);
                    }
                }});
            };

            scope.itemClicked   =   function(e, type) {
                var elem    =   angular.element(e.currentTarget);
                var elemObj = "";
                if(elem.hasClass('active-neighbour')){
                    scope.removeNeighbourhood({'type':type.split(','), 'level':'locality', 'callback':function(){
                        elem.removeClass('active-neighbour');    
                    }});
                } else {
					$("a.active-neighbour").each(function(key,element){
						elemObj = $(this);
						scope.removeNeighbourhood({'type':elemObj.attr("data-type").split(','), 'level':'locality', 'callback': function() {
							 elemObj.removeClass('active-neighbour');    
                        }});
					});
                    elem.addClass('active-neighbour');
                    scope.addNeighbourhood({'type':type.split(','), 'level':'locality'});
                }
                
                var isActive =   element.find('a.active-neighbour').length;
                if(isActive) {
					$('.neighbourhood-dd-wrap').addClass('active-neighbour');
                }
                else {
                    $('.neighbourhood-dd-wrap').removeClass('active-neighbour');
                    scope.map.services.bounds([]);
                }
                
                //Send GA/Mixpanel tracker event request on clicking any neighborhood type
                var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
                var itemsActive = [];
                var liElement = element.find('a.active-neighbour');
                for (var j=0; j<liElement.length;j++){
					 itemsActive.push(liElement[j].name);
				}               
				itemsActive = itemsActive.join(",")
                
                if(itemsActive.length > 0){
					$rootScope.TrackingService.sendGAEvent('map', 'clicked', 'localityNeighborhood-'+itemsActive+'-'+pageType);
					var neighborhoodObj = {};
					neighborhoodObj['Locality Neighbourhood Name'] = itemsActive;
					neighborhoodObj['Locality ID'] = $rootScope.currentLocality.localityId;
					neighborhoodObj['Page Name'] = pageType; 
					$rootScope.TrackingService.mixPanelTracking('Locality Neighbouhood Clicked', neighborhoodObj);
				}
				
            };
            
            //Send GA/Mixpanel tracker event request at the time mouseenter on Locality Neighborhood
            scope.tracking = function(e, type) {
				var neighborhoodObj = {}, pageType = $rootScope.CURRENT_ACTIVE_PAGE;
				$rootScope.TrackingService.sendGAEvent('map', 'show', 'localityNeighborhood-'+pageType);				
				neighborhoodObj['Locality ID'] = $rootScope.currentLocality.localityId;
				neighborhoodObj['Page Name'] = pageType;
				//Mixpanel will implement later for hover
				//$rootScope.TrackingService.mixPanelTracking('Locality Neighbouhood Opened', neighborhoodObj);
				
			};
			
          
        }
    };
}]);
