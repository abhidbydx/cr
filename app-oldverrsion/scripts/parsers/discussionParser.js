/**
   * Name: Discussions Parser
   * Description: It will convert discussion API response into hierarchical format.    
   * @author: [Hemendra Srivastava]
   * Date: Feb 05, 2014
**/
'use strict';

angular.module('serviceApp')
    .factory('DiscussionParser', function () {

	var parse = function(res){
            var cleanData = function (val, depth) {
		var obj = {
                    "id" : val.id,
                    "parentId" : val.parentId,
                    "adminUserName" :  val.adminUserName || "Anonymous",
                    "projectId" : val.projectId,
                    "level" : val.level,
                    "comment" : val.comment,
                    "numLikes" : val.numLikes,
                    "isReplied" : val.isReplied,
                    "createdDate" : val.createdDate,
                    "status" : val.status,
                    "title" : val.title,
                    "url" : val.url,
                    "user" : {
                        AVATAR: val.imageUrl,
                        USERNAME: val.adminUserName || 'Anonymous'
                    },
                    "depth" : depth
		};

		if (val.childDiscussions) {
                    obj.replies = _.map(val.childDiscussions, function (ele) {
			return cleanData(ele, depth+1);
                    });
		}
		return obj;
            };

	    var discussions;
	    var total;
	    if (res.data.data) {
		total = res.data.totalCount;
		discussions = _.map(res.data.data, function (val) {
		    return cleanData(val, 0);
		});
	    }
	    else {
		total = 0;
		discussions = [];
	    }
            
            //return discussions;
            return {"data":discussions, "count":total};
	};

	return {
            parse : parse
	};
    });