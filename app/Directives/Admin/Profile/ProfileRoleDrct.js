export default (ngModule) => {

    ngModule.directive('myProfileRole', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./ProfileRole.html'),
            scope: {
            },
            //['$scope', '$http', '$routeParams', 'personDocumentService', 'personService', 'contractService', 'Office', /*'Person',*/
            //function ($scope, $http, $routeParams, personDocumentService, personService, contractService, Office/*, Person*/) {
            controller: (['$scope', 'roleService', 'profileService', 'Office', 'Profile',
                function ($scope, roleService, profileService, Office, Profile) {

                    $scope.messages = [];
                    $scope.message = "";

                    $scope.findprofile = "";
                    $scope.findprofilerole = "";
                    $scope.findrole = "";
                    $scope.processing = {};

                    $scope.profiles = [];
                    $scope.profileroles = [];
                    $scope.allroles = [];
                    $scope.roles = [];

                    $scope.loadRoles = function () {

                        $scope.processing['loadRoles'] = true;
                        $scope.message = "загрузка ролей";

                        roleService
                             .getRoles()
                             .then(function (result) {
                                 angular.copy(result.data, $scope.allroles);
                                 $scope.processing['loadRoles'] = false;
                                 //console.log($scope.allroles);
                             },
                             function () {
                                 $scope.processing['loadRoles'] = false;
                                 swal("ошибка при загрузке ролей");
                             });
                    };
                    $scope.loadRoles();

                    $scope.initRole = function () {

                        var diff = _.difference(_.map($scope.allroles, "id"), _.map($scope.profileroles, "id_Role"));
                        var result = _.filter($scope.allroles, function (obj) { return diff.indexOf(obj.id) >= 0; });
                        angular.copy(result, $scope.roles);
                    }

                    $scope.loadProfiles = function () {

                        $scope.processing['loadProfiles'] = true;
                        $scope.message = "загрузка профилей";

                        var data = {
                            param: $scope.findprofile
                        }

                        profileService
                           .getProfilesActive(data)
                           .then(function (result) {
                               $scope.processing['loadProfiles'] = false;
                               angular.copy(result.data, $scope.profiles);
                               //console.log($scope.profiles);
                           },
                           function () {
                               $scope.processing['loadProfiles'] = false;
                               swal("ошибка загрузки ролей");
                           });
                    }
                    $scope.loadProfiles();

                    $scope.loadProfileRoles = function (idProfile) {

                        $scope.processing['loadProfileRoles'] = true;
                        $scope.message = "загрузка доступных ролей";

                        var data = {
                            idProfile: idProfile
                        }

                        profileService
                             .getProfileRoles(data)
                             .then(function (result) {
                                 angular.copy(result.data, $scope.profileroles);
                                 $scope.processing['loadProfileRoles'] = false;
                                 //console.log($scope.profileoffices);
                                 $scope.initRole();
                             },
                             function () {
                                 $scope.processing['loadProfileRoles'] = false;
                                 swal("ошибка при загрузке закрепенных ролей");
                             });
                    };

                    $scope.addProfileRole = function (idRole) {

                        $scope.processing['addProfileRole'] = true;
                        $scope.message = "добавление роли";

                        var data = {
                            idProfile: $scope.idProfile,
                            idRole: idRole
                        }

                        if (_.isNil($scope.idProfile)) {
                            swal('не выбран пользователь');
                            return;
                        }

                        profileService
                             .addProfileRole(data)
                             .then(function (result) {
                                 $scope.processing['addProfileRole'] = false;
                                 angular.copy(result.data, $scope.profileroles);
                                 //console.log($scope.profileoffices);
                                 $scope.initRole();
                             },
                             function () {
                                 $scope.processing['addProfileRole'] = false;
                                 swal("ошибка при добавлении роли");
                             });
                    };

                    $scope.delProfileRole = function (item) {

                        $scope.processing['delProfileRole'] = true;
                        $scope.message = "удаление роли";

                        var data = {
                            idProfile: item.id_User,
                            id_Profile_Role: item.id_Profile_Role
                        }

                        profileService
                             .delProfileRole(data)
                             .then(function (result) {
                                 $scope.processing['delProfileRole'] = false;
                                 angular.copy(result.data, $scope.profileroles);
                                 //console.log($scope.profileoffices);
                                 $scope.initRole();
                             },
                             function () {
                                 $scope.processing['delProfileRole'] = false;
                                 swal("ошибка при удалении роли");
                             });
                    };


                }])
        }
    })
}