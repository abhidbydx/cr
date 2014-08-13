/***
  * Name: Lead Service
  * Description: To open and submit lead form across website
  * @author: [Swapnil Vaibhav]
  * Date: Jan 22, 2014
***/
'use strict';
angular.module( 'serviceApp' )
.factory('FullScreenService', ['$modal','$timeout', function( $modal, $timeout ) {
    var initModal
    var openGallery = function(images, initialIndex, unique) {
        var initIndex, modalRef;
        
        if(initialIndex){
            initIndex = initialIndex;
        }
        if ( images.data ) {
            images = images.data;
        }
        modalRef = $modal.open({
            template: '<div><div pt-carouselfullscreen unique="unique" settings="optionsFullView" index="index" images="images" imagesfullview="images"></div></div><div ng-click="collapse()" class="caro-close-btn"><i class="fa fa-times"></i></div></div>',
            controller: 'commonfullscreenctrl',
            keyboard: true,
            windowClass:'photoModalGallery',
            backdrop: true,
            resolve: {
                images : function(){
                    return images;
                },
                index: function(){
                    return initIndex;
                },
                unique: function(){
                    return unique;
                }
            }
        });
        $timeout(function(){
            if(initModal){
                initModal.close();
            }
        },1000);        
        return modalRef;
    }

    var initGallery = function(){
        initModal = $modal.open({
            template: '<div></div>',
            keyboard: true,
            windowClass:'photoModalGallery',
            backdrop: true
        });
    }


return {
    openGallery : openGallery,
    initGallery : initGallery
};

}]);
