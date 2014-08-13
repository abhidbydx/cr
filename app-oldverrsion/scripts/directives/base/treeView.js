/*
    angular.treeview.js

(function(l){l.module("angularTreeview",[]).directive("treeModel",function($compile){return{restrict:"A",link:function(a,g,c){var e=c.treeModel,h=c.nodeLabel||"label",d=c.nodeChildren||"children",k='<ul><li data-ng-repeat="node in '+e+'"><i class="collapsed" data-ng-show="node.'+d+'.length && node.collapsed" data-ng-click="selectNodeHead(node, $event)"></i><i class="expanded" data-ng-show="node.'+d+'.length && !node.collapsed" data-ng-click="selectNodeHead(node, $event)"></i><i class="normal" data-ng-hide="node.'+
d+'.length"></i> <span data-ng-class="node.selected" data-ng-click="selectNodeLabel(node, $event)">{{node.'+h+'}}</span><div data-ng-hide="node.collapsed" data-tree-model="node.'+d+'" data-node-id='+(c.nodeId||"id")+" data-node-label="+h+" data-node-children="+d+"></div></li></ul>";e&&e.length&&(c.angularTreeview?(a.$watch(e,function(m,b){g.empty().html($compile(k)(a))},!1),a.selectNodeHead=a.selectNodeHead||function(a,b){b.stopPropagation&&b.stopPropagation();b.preventDefault&&b.preventDefault();b.cancelBubble=
!0;b.returnValue=!1;a.collapsed=!a.collapsed},a.selectNodeLabel=a.selectNodeLabel||function(c,b){b.stopPropagation&&b.stopPropagation();b.preventDefault&&b.preventDefault();b.cancelBubble=!0;b.returnValue=!1;a.currentNode&&a.currentNode.selected&&(a.currentNode.selected=void 0);c.selected="selected";a.currentNode=c}):g.html($compile(k)(a)))}}})})(angular);

*/
/*
        @license Angular Treeview version 0.1.6
        ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
        License: MIT


        [TREE attribute]
        angular-treeview: the treeview directive
        tree-id : each tree's unique id.
        tree-model : the tree model on $scope.
        node-id : each node's id
        node-label : each node's label
        node-children: each node's children

        <div
                data-angular-treeview="true"
                data-tree-id="tree"
                data-tree-model="roleList"
                data-node-id="roleId"
                data-node-label="roleName"
                data-node-children="children" >
        </div>
*/

(function ( angular ) {
  'use strict';

  angular.module( 'angularTreeview', [] ).directive( 'treeModel', ['$compile', '$rootScope', function( $compile, $rootScope ) {
    return {
      restrict: 'A',
      link: function ( scope, element, attrs ) {
        //tree id
        var treeId = attrs.treeId;

        //tree model
        var treeModel = attrs.treeModel;

        //node id
        var nodeId = attrs.nodeId || 'id';

        //node label
        var nodeLabel = attrs.nodeLabel || 'label';

        //children
        var nodeChildren = attrs.nodeChildren || 'children';

        //tree template
        var template =
          '<ul>' +
            '<li data-ng-repeat="node in ' + treeModel + '">' +
                '<a data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node,' +treeId +')" href={{node.'+ nodeId +'}}>' +
                '<span>{{node.' + nodeLabel + '}}</span></a>' +
                '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && '+treeId+'.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"><span class="fa fa-chevron-down"></span></i>' +
                '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !'+treeId+'.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"><span class="fa fa-chevron-up"></span></i>' +
                '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
                '<div data-ng-hide="'+treeId+'.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '></div>' +
            '</li>' +
          '</ul>';

        //check tree id, tree model
        if( treeId && treeModel ) {

          //root node
          if( attrs.angularTreeview ) {
          
            //create tree object if not exists
            scope[treeId] = scope[treeId] || {};
            //Set default Collapse 
            scope[treeId].collapsed = false;

            //if node head clicks,
            scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

              //Collapse or Expand
              scope[treeId].collapsed = !scope[treeId].collapsed;              
            };

            //if node label clicks,
            scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode,clicked_left){
				
			  if(typeof clicked_left!='undefined')	
			  {
				  //mix panel
				  var sidebarObj = {};              
				  var pageType = $rootScope.CURRENT_ACTIVE_PAGE;              
				  sidebarObj['Link Name'] = selectedNode.title;
				  sidebarObj['Page Name'] = pageType;								
				  $rootScope.TrackingService.mixPanelTracking('Left Sidebar Clicked', sidebarObj); 	
		      }
              //remove highlight from previous node
              if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
                      scope[treeId].currentNode.selected = undefined;
              }

              //set highlight to selected node
              selectedNode.selected = 'selected';

              //set currentNode
              scope[treeId].currentNode = selectedNode;          
              
            };
          }

          //Rendering template.
          element.html('').append( $compile( template )( scope ) );
        }
        
       
      }
    };
  }]);
})( angular );
