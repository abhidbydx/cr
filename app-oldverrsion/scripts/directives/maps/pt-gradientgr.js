/**
   * Name: pt-gradientgr
   * Description: Gradient green red
   * @author: [Yugal Jindle]
   * Date: Feb 3, 2013
**/

angular.module('serviceApp').directive('ptGradientgr', ['$filter', function($filter) {
    'use strict';

    return {
        restrict: 'A',
        scope: {
            range       :   '=',
            selected    :   '=',
            type        :   '@'
        },
        template: '<div class="gradient-bar"></div><div class="min-text"></div><div class="max-text"></div>',
        link: function(scope, element) {
            var min, max, diff, show, hide,
                format, selectionChanged,
                getSliderValue, updateMinMax,
                $spoke, $element = $(element),
                $minText = $element.find('.min-text'),
                $maxText = $element.find('.max-text'),
                $gradient = $element.find('.gradient-bar'),
				priceFormat = $filter('priceFormat');

            /**
             * Formats the value as per scope.type
             * @return {Function} Format function
             */
            format = (function() {
                var filter;
                if(scope.type === 'rate') {
                    filter = function(val) {return priceFormat(val,undefined,undefined,undefined,-1)};
                }
                else if(scope.type === 'date') {
                    filter = $filter('dateFormat');
                }
                return filter;
            })();

            /**
             * Get slider value
             * @param  {Number} val   Actual value
             * @return {Number} Value Between 0 & 100
             */
            getSliderValue = function(val) {
                min = parseInt(scope.range[0]),
                max = parseInt(scope.range[1]),
                diff = max - min;
                return (val-min)*100.0/diff;
            };

            /**
             * Updates the min, max labels
             */
            updateMinMax = function() {
                if(scope.range) {
                    if(scope.range.length) {
                        min = format(scope.range[0]);
                        max = format(scope.range[1]);
                        $minText.text(min);
                        $maxText.text(max);
                    } else {
                        $minText.text('');
                        $maxText.text('');
                    }
                }
            };

            /**
             * Displays value in the spoke
             * @param  {String} val Value to show
             */
            show = function(val) {
                if(!$spoke) {
                    $spoke = $gradient.find('a.ui-slider-handle');
                    // Fix spoke
                    $spoke.addClass('displaySpoke');
                }
                $spoke.show();
                $spoke.text(val);
            };

            /**
             * Hide the display spoke
             */
            hide = function() {
                if(!$spoke) {
                    $spoke = $gradient.find('a.ui-slider-handle');
                    // Fix spoke
                    $spoke.addClass('displaySpoke');
                }
                $spoke.hide();
            };

            // Slider
            $gradient.slider({
                step    :   1,
                min     :   0,
                max     :   100,
                animate :   true,
                create  :   function(event, ui) {
                    updateMinMax();
                }
            });

            // Range updated
            scope.$watch('range', function(newVal) {
                if(newVal) {
                    updateMinMax();
                    hide();
                }
            }, true);

            // Change selection ( Slider value )
            selectionChanged = function(newVal) {
                newVal = parseInt(newVal);
                if(newVal || newVal === 0) {
                    $gradient.slider('option', 'value', newVal);
                } else {
                    hide();
                }
            };
            scope.$watch('selected', selectionChanged);

            // Selection by events
            $('.body_map').bind('gradient-show', function(event, data) {
                var value;
                if(scope.type === 'rate' && data.minPricePerUnitArea) {
                    value = data._rateColor;
                    show(data.minPricePerUnitArea);
                }
                else if(scope.type === 'date' && data.possessionDate) {
                    value = data._dateColor;
                    show(format(data.possessionDate));
                }
                selectionChanged(value);
            });
            $('.body_map').bind('gradient-hide', function(event) {
                selectionChanged(undefined);
            });
        }
    }
}]);
