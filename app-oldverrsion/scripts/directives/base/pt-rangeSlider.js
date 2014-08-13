/**
   * Name: pt-rangeSlider
   * Description: Range slider for price range
   * @author: [Amit Sagar, Yugal Jindle]
   * Date: Dec 26, 2013
**/


'use strict';

// Slider to select range ( 2 spokes )
angular.module('serviceApp').directive('ptRangeslider', ['$filter', '$rootScope', function($filter, $rootScope) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
                range         :   '=',
                selected      :   '=',
                name          :   '@',
                updateFilter  :   '&'
            },
        link: function(scope, element, attr) {
            var getY, getX, getValues, 
                priceFormat, updateSliderLabels, updateFilter;

            // filter
            priceFormat = $filter('priceFormat');
            // Wrapper for updating filter
            updateFilter = function(obj) {
				console.log(obj);
                scope.updateFilter({ data : obj });
            };

            // Value <-> y <-> x
            getX = {
                budget : function(y){
                    var x;
                    x = (Math.log(y)-Math.log(799400))/0.05889;
                    return x;
                },
                area : function(y){
                    var x;
                    x = (Math.log(y)-Math.log(78.4768))/0.048475;
                    return x;
                }
            };

            // Value <-> y <-> x
            getY = {
                budget : function(x){
                    var y;
                    y =  799400 * Math.exp(0.05889*x);
                    return y;
                },
                area : function(x){
                    var y;
                    y =  78.4768 * Math.exp(0.048475*x);
                    return y;
                }
            };

            scope.defaultX = {
                budget : [3.81, 100.66],
                area : [5, 100]
            };

            scope.initialX = {
                budget : [3.81, 100.66],
                area : [5, 100]
            };
            
            scope.updateValues = function(newVal){
                var vals = scope.defaultX[scope.name], min, max;
                min = Math.floor(getX[scope.name](scope.selected[0]))+vals[0]-parseInt(vals[0]);
                max = Math.floor(getX[scope.name](scope.selected[1]))+vals[1]-parseInt(vals[1]);
                min = min <= vals[0] ? vals[0] : min;
                max = max >= vals[1] ? vals[1] : max;
                vals = [min, max];
                return vals;
            };
            // Update slider labels
            updateSliderLabels = function(vals) {
        		var sufix = '',
                    scopeName = scope.name,
                    scopeDefaultX = scope.defaultX[scopeName],
                    minVal = getY[scopeName](scopeDefaultX[0]),
                    maxVal = getY[scopeName](scopeDefaultX[1]),
                    low = getY[scopeName](vals[0]),
                    high = getY[scopeName](vals[1]);
                low = (low <= minVal) ? minVal : low;
                high = (high >= maxVal) ? maxVal : high;

        		if(vals[1] >= scopeDefaultX[1]){
        			sufix = '+';
        		}
        		if(high >= 10000000){
        			sufix += ' Cr';
                }

                var lowPrice = priceFormat(low,undefined,undefined,undefined,-1),
                    highPrice = priceFormat(high, undefined,'',undefined,-1)+sufix;	
                $('.'+scopeName+'-min-size').text(lowPrice);
                $('.'+scopeName+'-max-size').text(highPrice);
            };

            // `range` for the slider [Called on initialization]
            scope.$watch('range', function(newVal, oldVal) {
                // Reset values on `range` update
                var vals = scope.defaultX[scope.name];
                if(newVal && newVal.length === 2 && scope.selected && scope.selected.length === 2) {
                    vals = scope.updateValues(newVal);
                    scope.initialX[scope.name] = vals;
                }
                updateSliderLabels(vals);
                element.slider('option', 'values', vals);
            }, true);

            element.slider({
                step    :   1,
                min     :   scope.initialX[scope.name][0],
                max     :   scope.initialX[scope.name][1],
                range   :   true,
                values  :   scope.initialX[scope.name],
                stop: function(event, ui) {
                    var obj = {},
                        val = [getY[scope.name](ui.values[0]), getY[scope.name](ui.values[1])];
                    if(ui.values[0] > scope.initialX[scope.name][0] || ui.values[1] < scope.initialX[scope.name][1]) {
                        obj = {
                            from: val[0],
                            to:   val[1]
                        };
                    }
                    
                    //Send GA/Mixpanel tracker event request on applying filter 
                    var l = priceFormat(val[0]),
                    h = priceFormat(val[1]), type = attr.name, subLabel = '', filterVal = '', filterObj = {}; 
                    var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
                    filterVal = l+'-'+h;
					subLabel = type+":"+filterVal+"-"+pageType;  
					
					filterObj['Filter Name'] = type;
					filterObj['Filter Value'] = filterVal
					filterObj['Page Name'] = pageType; 
					//GA tracker
					$rootScope.TrackingService.sendGAEvent('filter', 'filtered', subLabel); 	 
					//mixpanel tracker
					$rootScope.TrackingService.mixPanelTracking('Filter Used', filterObj);  
					//End GA/Mixpanel tracker
                    scope.$apply(function () {
                        // If moved from default position ( Filter applied )                    
                        updateFilter(obj);
                    });                    
                     
                },
                slide:  function(event, ui) {
                    updateSliderLabels(ui.values);
                }
            });

            // `selected` values [Called when user drags slider]
            // If user changes values in `url` (To be reflected in slider)
            // Values between actual L to H
            scope.$watch('selected', function(newVal, oldVal) {
                var vals;
                if(newVal && newVal.length === 2) {
                    vals = scope.updateValues(newVal);
                    updateSliderLabels(vals);
                    element.slider('option', 'values', vals);
                }
            }, true);
        }
    };
}]);
