'use strict';

angular.module('serviceApp')
.factory('BlockingInfo', ['Constants', function(Constants) {

	var max_zindex = Constants.GLOBAL.MAX_ZINDEX;
	var blockingElement = $('#blocking-info');
	var orig_zindexes = []
	var focElements;
	var invoke = function(fElements){
		focElements = fElements;
		_.each(fElements, function(fElement){
			orig_zindexes.push($(fElement).css('z-index'));
			$(fElement).css('z-index', max_zindex);

		});
		blockingElement.css('z-index', max_zindex - 1);
		blockingElement.fadeIn('fast');
	}

	var dismiss = function(){
		blockingElement.fadeOut('fast');
		_.each(orig_zindexes,function(zind, ind){
			$(focElements[ind]).css("z-index", zind);
		});
	}

	return {
		invoke: invoke,
		dismiss: dismiss
	}

}]);
