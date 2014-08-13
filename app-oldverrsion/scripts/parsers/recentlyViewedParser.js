/**
   * Name: Recently Viewed Parser
   * Description: It will convert projects service response into format required by ui.
   * @author: [Hemendra Srivastava]
   * Date: Dec 03, 2013
**/
'use strict';
angular.module('serviceApp')
.factory('RecentlyViewedParser', function () {
	return {
		parse: function(res, order,pagelimit){
			var cleanPrice = function (priceName) {
				var price;
				if(priceName >= 10000000 || priceName <= -10000000){
					price = Math.round(priceName*100/10000000) / 100 + 'Cr';
				}
				else if(priceName >= 100000 || priceName <= -100000){
					price = Math.round(priceName * 100 /100000) / 100+ 'L';
				}
				else {
					price = priceName;
				}
				return price;
			};

			var unsorted = {}, sorted = [], tmp;
			for( tmp = 0; tmp < res.length; tmp++ ) {
				var val = res[ tmp ];
				unsorted[ res[ tmp ].projectId ] = {
					'projectId': val.projectId,
					'projectName': val.builder.name + ', ' + val.name,
					'projectLocation': val.address,
					'pricePerSqft': ( val.minPricePerUnitArea == null || val.maxPricePerUnitArea == null ) ? 'Price on Request' : val.minPricePerUnitArea + " / sq ft" + " - " + val.maxPricePerUnitArea + " / sq ft",
					'price': ( val.minPrice == null || val.maxPrice == null ) ? 'Price on Request' : cleanPrice(val.minPrice) + " - " + cleanPrice(val.maxPrice),
					'projectUrl': val.URL
				};
			}	
			if(pagelimit>order.length)	pagelimit=order.length;	
			for( tmp = 0; tmp < pagelimit; tmp++ ) {
				sorted.push( unsorted[ order[ tmp ] ] );
			}
			return sorted;
		}
	};
});
