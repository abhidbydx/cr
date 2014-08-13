//angular.module('ui.bootstrap.dropdownHover', []).directive('dropdownHover', ['$document', '$location', function ($document, $location) {
angular.module('serviceApp').directive('ptHover', function ($document, $location) {
    var openElement = null,
    closeMenu   = angular.noop;
    return {
	restrict: 'A',
	link: function(scope, element, attrs) {
	    scope.$watch('$location.path', function() { closeMenu(); });
	    element.parent().bind('mouseleave', function() { closeMenu(); });
	    element.bind('mouseenter', function (event) {

		var elementWasOpen = (element === openElement);

		event.preventDefault();
		event.stopPropagation();

		if (!!openElement) {
		    closeMenu();
		}

		if (!elementWasOpen) {
		    element.parent().addClass('open');
		    openElement = element;
		    closeMenu = function (event) {
			if (event) {
			    event.preventDefault();
			    event.stopPropagation();
			}
			$document.unbind('mouseleave', closeMenu);
			element.parent().removeClass('open');
			closeMenu = angular.noop;
			openElement = null;
		    };
		    $document.bind('click', closeMenu);
		}
	    });
	}
    };
});
