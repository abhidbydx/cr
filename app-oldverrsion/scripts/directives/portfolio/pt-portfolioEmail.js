/**
   * Name: Portfolio Others Directive
   * Description: pt-propertylist is curently shown on portfolio page to show all property listings of user
   * in grid format.
   * @author: [Nakul Moudgil]
   * Date: Oct 25, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptPortfolioemail',function(){
    return{
      restrict : 'A',
      templateUrl : 'views/directives/portfolio/pt-portfolioEmail.html',
      //replace : true,
      link: function(){
      }     
    }
});