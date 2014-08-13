'use strict';

angular.module('serviceApp')
.factory('CardService', ['$rootScope', function($rootScope) {

	var card,

	setCard = function(overviewCard){
		card = overviewCard;
	},

	getCard = function(){
		return card;
	};

	return {
		setCard: setCard,
		getCard: getCard
	};

}]);

