/**
 * Name: ptAvatar Directive
 * Description: pt-avatar is common Avatar for all the users with no personal AVATARS
 *
 * @author: [Satyajeet Parida]
 * Date: April 22, 2014
 **/
'use strict';

angular.module('serviceApp').directive('ptAvatar', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/directives/common/avatar.html',
        scope: { userInfo: '=', avatarType: '=' },
        controller: function ($scope) {
            var defaultAvatar = '/images/loc/avatar.png';
            var nameColor, headBgColor;
            var getUserName = function(userInfo) {
                var name = '';
                if (userInfo) {
                    if (userInfo.USERNAME) {
                        name = userInfo.USERNAME;
                    } else if (userInfo.EMAIL) {
                        name = userInfo.EMAIL.substr(0, userInfo.EMAIL.indexOf('@'));
                    }
                } else {
                    name = 'undefined name';
                }
                return name;
            };

            var getNameHash = function (userName) {
                var sum = 0;
                for (var i in userName) {
                    if (userName.hasOwnProperty(i)) {
                        sum += userName.charCodeAt(i);
                    }
                }
                return sum;
            };

            var makeNameAvatar = function (userName) {
                if (userName.trim().toLowerCase() == 'anonymous') {
                    $scope.anonymousUser = true;
                } else {
                    $scope.anonymousUser = false;
                    var nameHash = getNameHash(userName.trim());
                    var colorIndex = nameHash % 26;
                    $scope.nameAvatar = userName.trim().toUpperCase()[0];
                    $scope.nameAvatarColor = {'background-color': getUserAvatarColor(colorIndex)};
                    if ($scope.avatarType == 'header') {
                        $scope.nameTextColor = {'color': getUserAvatarColor(colorIndex)};
                        nameColor = $scope.nameTextColor;
                        headBgColor = $scope.nameAvatarColor;
                    }
                }
            };

            var getUserAvatarColor = function (index) {
                var colors = [ 'hsl(40, 100%, 60%)', 'hsl(83, 100%, 40%)', 'hsl(216, 100%, 60%)', 'hsl(350, 100%, 60%)',
                    'hsl(23, 100%, 40%)', 'hsl(5, 100%, 40%)', 'hsl(349, 100%, 40%)', 'hsl(272, 100%, 40%)', 'hsl(250, 100%, 40%)',
                    'hsl(211, 100%, 40%)', 'hsl(185, 100%, 40%)', 'hsl(91, 100%, 40%)', 'hsl(103, 100%, 60%)', 'hsl(32, 100%, 60%)',
                    'hsl(4, 100%, 60%)', 'hsl(343, 100%, 60%)', 'hsl(272, 100%, 60%)', 'hsl(206, 100%, 60%)', 'hsl(201, 100%, 60%)',
                    'hsl(174, 100%, 60%)', 'hsl(80, 100%, 60%)', 'hsl(46, 100%, 60%)', 'hsl(324, 100%, 60%)', 'hsl(180, 100%, 60%)',
                    'hsl(22, 100%, 60%)', 'hsl(22, 100%, 40%)' ];

                return colors[index];
            };

            if ($scope.avatarType == 'header') {
                $scope.$on('setBgColor', function (evt, data) {
                    $scope.$emit('avatarColor', headBgColor);
                    $scope.nameTextColor = {'color': '#fff'};
                });

                $scope.$on('unSetBgColor', function (evt, data) {
                    $scope.nameTextColor = nameColor;
                });
            }

            $scope.$watch('userInfo.USERNAME', function (newVal, oldVal) {
                if (newVal) {
                    if (!$scope.userInfo.AVATAR || $scope.userInfo.AVATAR == defaultAvatar) {
                        $scope.useAvatarOriginal = false;
                        makeNameAvatar(getUserName($scope.userInfo));
                    } else {
                        $scope.useAvatarOriginal = true;
                    }
                }
            });
        }
    };
});