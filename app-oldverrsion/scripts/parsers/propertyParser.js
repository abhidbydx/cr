/**
   * Name: City Parser
   * Description: It will convert cities service response into format required by ui.    
   * @author: [Nakul Moudgil]
   * Date: Oct 06, 2013
**/
'use strict';
angular.module('serviceApp')
.factory('PropertyParser', function ( Formatter, $rootScope, $filter ) {
    return {
        parse: function(reqColumns, response){
            var property = response.data;
            var propertyTemp =  {};

            if ( reqColumns.length === 0 ) {
                propertyTemp = response.data;
            }
            else {
                $.each(property,function(item, attr){
                    if(reqColumns.indexOf(item) > -1){
                        if ( item == 'purchaseDate' || item == 'completionDate') {
                            if ( attr != null ) {
                                propertyTemp[item] = new Date(attr);
                            }
                            else {
                                propertyTemp[item] = 'NA';   
                            }
                        }
                        else if ( item == 'totalPrice' || item == 'currentPrice' ) {
                            if ( attr != null ) {
                                propertyTemp[item] = attr;
                                propertyTemp['formatted' + item] = Formatter.formatRs( attr );
                            }
                            else {
                                propertyTemp[item] = 'NA';   
                            }
                        }
                        else if ( item == 'listingSize' ) {
                            if ( attr ) {
                                propertyTemp[item] = attr;
                                propertyTemp.listingMeasure = ( typeof property.listingMeasure !== 'undefined' ) ? property.listingMeasure : 'sq ft';
                            }
                        }
                        else if ( item == 'goalAmount' ) {
                            if ( attr ) {
                                propertyTemp[item] = attr;
                                propertyTemp['formatted' + item] = Formatter.formatRs( attr );
                            }
                            else {
                                propertyTemp[item] = 'Not Specified';
                            }
                        }
                        else if ( item == 'listingMeasure' ) {
                            if ( property.listingSize == 0 || property.listingSize == '' ) {
                                propertyTemp.listingSize = 'Not Specified';
                                propertyTemp[item] = '';
                            }
                            else {
                                propertyTemp[item] = attr;
                            }
                        }
                        else if ( item == 'projectStatus' ) {
                            if ( attr ) {
                                propertyTemp[item] = Formatter.getProjectStatusKey(attr);
                                
                            }
                        }
                        else {
                            propertyTemp[item] = attr;
                        }
                    }
                });
            }            
            return propertyTemp;
        },

        createPostObject: function(property){
            var postObj = {};
            postObj.bankId = property.bank.id;
            postObj.typeId = property.unitDefault.propertyId;
            postObj.tower = property.tower;
            postObj.unitNo = property.unitNo;
            postObj.floorNo = property.floor; 
            if(property.purchaseDate && property.purchaseDate.getTime){
              postObj.purchaseDate = property.purchaseDate.getTime();
            }
            else{
              if ( property.purchaseDate.indexOf('/') ) {
                var tmpDate = property.purchaseDate.split('/');
                var tmpDateToCmp = new Date(tmpDate[1]+'/'+tmpDate[0]+'/'+tmpDate[2]);
                postObj.purchaseDate = new Date(tmpDateToCmp).getTime();
              }
              else {
                postObj.purchaseDate = new Date(property.purchaseDate).getTime();
              }
            }
            postObj.name = property.propertyName;
            postObj.basePrice = property.basePrice;
            postObj.listingSize = property.listingSize ? property.listingSize : property.unitDefault.size;
            postObj.otherPrices = [{amount : property.otherExpenses ? property.otherExpenses : 0}];
            postObj.totalPrice = property.totalPrice;
            postObj.goalAmount = property.goalAmount; 
            
            var purchasedForObj = {
                SELF : $rootScope.labels.portfolio.label.PURCHASED_FOR_SELF,
                INVESTMENT : $rootScope.labels.portfolio.label.PURCHASED_FOR_INVEST,
                OTHERS : $rootScope.labels.portfolio.label.PURCHASED_FOR_OTHER
            };
            var loanOptionsObj = {
                AVAILED : $rootScope.labels.portfolio.label.LOAN_STATUS_OPTION_1,
                NOT_AVAILED : $rootScope.labels.portfolio.label.LOAN_STATUS_OPTION_2,
                PAID : $rootScope.labels.portfolio.label.LOAN_STATUS_OPTION_3
            };

            if ( purchasedForObj[property.purchasedFor] !== 'undefined' ) {
                $.each(purchasedForObj, function(i,a){
                    if (a === property.purchasedFor){
                        postObj.purchasedFor = i;
                    }
                });
            }
            else {
                postObj.purchasedFor = property.purchasedFor;
            }

            if ( loanOptionsObj[property.loanStatus] !== 'undefined' ) {
                $.each(loanOptionsObj, function(i,a){
                    if (a === property.loanStatus){
                        postObj.loanStatus = i;
                    }
                });
            }
            else {
                postObj.loanStatus = property.loanStatus;
            }

            postObj.loanAmount = property.loanAmount;
            postObj.loanAvailedAmount = property.loanAvailedAmount;
            postObj.transactionType = property.transactionType;
            var response = angular.toJson(postObj);
            return response;
        },

        groupProperties : function(m_properties){
            
            var props = [],

            cat_props = _.groupBy(m_properties, function(property){
                return property.unitType;
            }),

            min_by = function(arr, key){
                return _.min(arr, function(item){
                    return item[key];
                });
            },

            max_by = function(arr, key){
                return _.max(arr, function(item){
                    return item[key];
                });
            };

            for(var pType in cat_props){
                var unit_cat_props = _.groupBy(cat_props[pType], function(property){
                    if(property.bedrooms == 0){
                        return 'Plot';
                    } else {
                        return property.bedrooms+ 'BHK';
                    }
                });
				pType = pType.toLowerCase();
                for(var type in unit_cat_props){
                    var properties = unit_cat_props[type], prop_obj;
                    if(properties && properties.length){            
                        prop_obj = properties.length > 1 ? {
                            TYPE: pType, 
                            properties: properties, 
                            label: type, 
                            measure: properties[0].measure,
                            minBudget: min_by(properties, 'budget').budget, 
                            minResalePrice: min_by(properties, 'resalePrice').resalePrice,
                            maxBudget: max_by(properties, 'budget').budget,
                            maxResalePrice: max_by(properties, 'resalePrice').resalePrice,
                            minSize: min_by(properties, 'size').size,
                            maxSize: max_by(properties, 'size').size,
                            isComposite: true
                        } : properties[0]; 
                        
                        props.push(prop_obj);                            
                    }

                    if(properties.length > 1){
                        prop_obj.hasSizes = _.some(properties, function(property){
                            return property.size;
                        });                        
                    }


                }
            }

            return props;
        }
    };
});
