
'use strict';
angular.module('serviceApp').directive('imageBlock',[ "Formatter", "$timeout", function(Formatter, $timeout) {
	return {
		restrict: 'A',
		scope: {
			imageSource: '=',
			altText: '=',
			type: '@',
			allowModal: '@',
			projectData: '=',
			fit: '@', 
			fitop: '@'
		},
		templateUrl: 'views/directives/common/pt-image-block.html',	
		link: function(scope, element, attrs) {
			
			var img = element.find('img'), modalElement; 

			scope.$watch("imageSource", function(newVal, oldVal){

				scope.imageLoaded = false;
				var imageSource = newVal ? newVal : "/images/default.png";	

				if(scope.type && newVal){
					imageSource = Formatter.getImagePath(imageSource, scope.type);
				}

				img.attr('src', imageSource).load(function() {
		            $timeout(function() {						
						scope.$apply(function(){
			            	scope.imageLoaded = true;
			            })
			        }, 0);

		    	}).each(function() {
		    		if(this.complete)
		    			$(this).load();
		    	});
			});

			scope.invokeModal = function(elem){	
				if(!modalElement){
					modalElement = element.find('.modal');
				}
				
				if(scope.imageSource && scope.allowModal){
					modalElement.modal();
				}
					
			}
		}
	};
}]);
