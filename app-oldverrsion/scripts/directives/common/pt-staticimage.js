/**
  * Description: To display random static images
  * @author: [Swapnil Vaibhav]
  * Date: March 12, 2014
***/
'use strict';
angular.module( 'serviceApp' ).directive( 'ptStaticimage', function() {
	return {
		restrict : 'A',
		scope : { small : '=' },
		templateUrl: 'views/directives/common/pt-staticimage.html',
		controller : function( $scope ) {
			var imageList = [
				'promiseCard_01.jpg',
				'promiseCard_02.jpg',
				'promiseCard_03.jpg',
				'promiseCard_04.jpg',
				'promiseCard_05.jpg'
			],
			imageListSmall = [
				'loanCard_01.jpg',
				'loanCard_02.jpg'
			];
			
			var randomIndex = 0;
			if ( $scope.small ) {
				randomIndex = Math.floor( Math.random() * ( imageListSmall.length ) );
				$scope.imgName = imageListSmall[ randomIndex ];
			}
			else {
				randomIndex = Math.floor( Math.random() * ( imageList.length ) );
				$scope.imgName = imageList[ randomIndex ];
			}
		}
	}
});