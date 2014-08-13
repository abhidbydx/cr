/**
 * portfolioHelper.js
 * Provide helper functions for Portfolio
 * Developer: Satyajeet Parida
 * Date: Jun 05, 2013
 */
'use strict';
angular.module('serviceApp').factory('PortfolioHelper', function (Formatter){
    var cleanAssessmentData = function (assessmentData) {
        if (assessmentData.overallReturnType) {
            assessmentData['Overall Return'] = Math.abs(assessmentData['Overall Return']);
            if (assessmentData.overallReturnType == 'DECLINE') {
                return {
                    'Overall Return': { data: (assessmentData['Overall Return'] * -1), color: "#f84000", legendIndex: 1 },
                    'Initial Investment': {"data": assessmentData["Purchase Price"], color: '#0CC4E5', legendIndex: 0},
                    'Current Value': {"data": (assessmentData["Current Price"] * -1), color: '#2166E3', legendIndex: 2}
                };
            } else if (assessmentData.overallReturnType == 'NOCHANGE') {
                return {
                    'Overall Return': { data: assessmentData['Overall Return'], color: "#ffffff", legendIndex: 1 },
                    'Initial Investment': {"data": assessmentData["Purchase Price"], color: '#0CC4E5', legendIndex: 0},
                    'Current Value': {"data": (assessmentData["Current Price"] * -1), color: '#2166E3', legendIndex: 2}
                };
            } else {
                return {
                    'Overall Return': { data: assessmentData['Overall Return'], color: "#88D116", legendIndex: 1 },
                    'Initial Investment': {"data": assessmentData["Purchase Price"], color: '#0CC4E5', legendIndex: 0},
                    'Current Value': {"data": (assessmentData["Current Price"] * -1), color: '#2166E3', legendIndex: 2}
                };
            }
        } else {
            return assessmentData;
        }
    };

    var makeToolTip = function (propSet) {
        return {
            formatter: function () {
                var prop_string = '', VALID_KEYS = ['Initial Investment', 'Overall Gain', 'Overall Decline', 'Current Value'];
                if (VALID_KEYS.indexOf(this.key) > -1 ) {
                    if (propSet && propSet.length) {
                        for (var curr_prop_index in propSet) {
                            if (propSet.hasOwnProperty(curr_prop_index)) {
                                var current_property = propSet[curr_prop_index];
                                prop_string = prop_string + current_property.name + '<br/>\u20B9 ';
                                if (this.key == 'Initial Investment') {
                                    prop_string = prop_string + Formatter.formatPrice(current_property.totalPrice) + ' (' + ((current_property.totalPrice * 100) / this.y).toFixed(2) + '%)' + '<br/><br/>';
                                } else if (this.key.indexOf('Overall') > -1) {
                                    var return_amount = current_property.totalPrice - current_property.currentPrice;
                                    prop_string = prop_string + Formatter.formatPrice(Math.abs(return_amount)) + ' (' + ((return_amount * 100 * -1) / current_property.totalPrice).toFixed(2) + '%)' + '<br/><br/>';
                                } else {
                                    prop_string = prop_string + Formatter.formatPrice(current_property.currentPrice) + ' (' + ((current_property.currentPrice * 100) / Math.abs(this.y)).toFixed(2) + '%)' + '<br/><br/>';
                                }
                            }
                        }
                    } else {
                        prop_string = prop_string + propSet.name + '<br/>\u20B9 ';
                        if (this.key == 'Initial Investment') {
                            prop_string = prop_string + Formatter.formatPrice(propSet.totalPrice);
                        } else if (this.key.indexOf('Overall') > -1) {
                            prop_string = prop_string + Formatter.formatPrice(Math.abs(propSet.changeAmount)) + ' (' + (propSet.changeAmount * 100 / propSet.totalPrice).toFixed(2) + '%)';
                        } else {
                            prop_string = prop_string + Formatter.formatPrice(propSet.currentPrice);
                        }
                    }
                }
                return prop_string;
            }
        };
    };

    return {
        cleanAssessmentData: cleanAssessmentData,
        makeToolTip: makeToolTip
    };
});