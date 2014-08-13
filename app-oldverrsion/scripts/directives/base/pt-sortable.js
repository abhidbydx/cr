/**
   * Name: Sortable Directive
   * Description: pt-sortable could be used as an attribute on any html element to make it sortable.
   * @author: [Nakul Moudgil]
   * Date: Sep 17, 2013 
**/
'use strict';
angular.module('serviceApp').directive('ptSortable',['$rootScope', function($rootScope){
    return{
	restrict : 'A',
	scope: true,
	replace : true,
	link : function(scope, element, attrs){
            element.sortable({
		handle: '.widgetHeader',
		stop:function(event, ui){
		    //Following code will send the new positions for all the items in the container.
		    var list = _.map($(this).find('.propSortable'), function(el) {
			return $(el).attr('id') + ' = ' + $(el).index();
                    });
		    $rootScope.$broadcast("sortable",list);
		}
            });
            element.disableSelection();
	}
    }
}]);