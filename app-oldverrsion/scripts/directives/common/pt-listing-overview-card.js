
'use strict';
angular.module('serviceApp').directive('ptListingOverviewCard',function($rootScope){
    return {
        restrict: 'A',
        scope: { meta: '='},
        templateUrl: 'views/directives/common/pt-listing-overview-card.html',
        controller: function($rootScope, $scope, CityService, CommonLocationService, LocalityService, LocalityParser, BuilderService, BuilderParser, CardService, GlobalService){
            var cardOpen = false;
            var card = CardService.getCard(),
                cardType = $scope.meta.cardType,
                typeId = $scope.meta.typeId,
                typeName = $scope.meta.typeName,

            addDetail = function (data) {
                card.detail = data;
                $scope.meta.listHeading = data.label;
                if (data.localityId) {
                    $rootScope.urlData.locality = data.label;
                }
                if (data.id && parseInt(data.id) == parseInt($rootScope.urlData.suburbId)) {
                    $rootScope.urlData.suburb = data.label;
                }
                if (data.suburb) {
                    $rootScope.urlData.suburb = data.suburb.label;
                    $rootScope.urlData.suburbId = data.suburb.id;
                }
            },

            handleNearbyLocalities = function(response){
                card.nearbyLocalities = LocalityParser.parseNearBy(response);
            },

            addTopBuilders = function (data) {
                card.topBuilders = data;
            },

            addTopLocalities = function (response){
                card.topLocalities = _.map(response, function(locality){
                    return LocalityParser.minimalLocality(locality);
                });
            };

            $scope.$on('DescExpand', function(){
                $scope.cardState = 'MAX';
            });

            if(!card){
                card = {};
            }
            if(cardType && cardType !== 'builder'){
                CommonLocationService.getBasicInfo(cardType, typeId, addDetail);
            }

            var cardOpened = function() {
                card.nearbyLocalities = {}, card.topLocalities = {}, card.topBuilders = {};
                var compositeObj = {};
                if(cardType && cardType !== 'builder') {
                    compositeObj[ BuilderService.getAllBuilder( cardType, typeId, 0, 4, true ) ] = addTopBuilders;
                }

                if(cardType === 'city' || cardType === 'suburb') {
                    compositeObj[ LocalityService.getTopLocality(cardType, typeId, 0, 4, true ) ] = addTopLocalities;
                }

                if(cardType === 'locality' && card.detail.longitude && card.detail.latitude){
                    compositeObj[ LocalityService.getNearbyLocality( card.detail.latitude, card.detail.longitude, 0, 0, 0, true ) ] = handleNearbyLocalities;
                }

                GlobalService.makeCompositeCall( _.keys( compositeObj ) ).then( function( bigData ) {
                    $.each( compositeObj, function( __url, __fn ) {
                        __fn( bigData[ __url ].data );
                    });
                });
            };

            $scope.card = card;

            CardService.setCard(card);

            if(cardType == 'builder'){
                var addDetail;
                
                //Get information for this builder
                addDetail = function (response) {
            
                $rootScope.urlData.builderId = response.id;
                $rootScope.urlData.builder = response.name;
                var detail = BuilderParser.parseBuilder(response);
                    card.detail = detail;
                };
                BuilderService.getCard(typeId, addDetail);

                card.projects = [];
            }

            var key = 'VIEWED_'+cardType+'_CARD', shortState,

            // Initialize the storage for card
            viewed = $.jStorage.get(key);
            if(viewed === null){
                $.jStorage.set(key, 0);
                viewed = 0;
            }

            // Identify card state based on how many times it is viewed
            $scope.cardState = viewed >= 3 ? 'MIN' : 'MED';

            // Save short state for toggle
            shortState = $scope.cardState;

            // Increment count as this card is seen
            $.jStorage.set(key, viewed+1);            

            $scope.changeCardState = function(){
                if ( !cardOpen ) {
                    cardOpen = true;
                    cardOpened();
                }
                if( $scope.cardState != 'MAX') {
                    $scope.cardState = 'MAX';
                    $scope.$broadcast('CardExpanded');
                } else{
                    $scope.cardState = shortState;
                    $scope.$broadcast('CardReduced');
                }
                //GA/MIXPANEL - when user change state of view more/less
                var eventName = ($scope.cardState == 'MAX') ? 'View More' : 'View Less';
                $scope.mainCartTracking(eventName);

            }
            //GA/MIXPANEL - when user clicked any locality/builder from top cart
            $scope.mainCartTracking = function(label, itemId){
                var cartObj = {}
                if(itemId)
                    cartObj[label+' ID']    = itemId
                cartObj['Link Name']    = label
                cartObj['Card Type']    = 'Main Card'
                cartObj['Page Name']    = $rootScope.CURRENT_ACTIVE_PAGE
                $rootScope.TrackingService.sendGAEvent('cart', 'clicked', label+'-'+$rootScope.CURRENT_ACTIVE_PAGE);
                $rootScope.TrackingService.mixPanelTracking('Link Clicked', cartObj);
            }
        }
    }
});
