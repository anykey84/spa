export default (ngModule) => {

    ngModule.directive('myProfileOffice', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./ProfileOffice.html'),
            scope: {
            },
            //['$scope', '$http', '$routeParams', 'personDocumentService', 'personService', 'contractService', 'Office', /*'Person',*/
            //function ($scope, $http, $routeParams, personDocumentService, personService, contractService, Office/*, Person*/) {
            controller: (['$scope', 'officeService', 'profileService', 'Office', 'Profile',
                function ($scope, officeService, profileService, Office, Profile) {

                    $scope.messages = [];
                    $scope.message = "";
                    $scope.findprofile = "";
                    $scope.findprofileoffice = "";
                    $scope.findoffice = "";
                    $scope.processing = {};

                    $scope.profiles = [];
                    $scope.profileoffices = [];
                    $scope.alloffices = [];
                    $scope.offices = [];

                    $scope.loadOffices = function () {

                        var data = {
                            find: "",
                            isDeleted: 0
                        }

                        $scope.processing['loadOffices'] = true;
                        $scope.message = "загрузка офисов";

                        officeService
                             .getOfficesAll(data)
                             .then(function (result) {
                                 //angular.copy(result.data, $scope.alloffices);
                                 angular.copy(_.filter(result.data, function (c) { return c.id_OfficeType == 3; }), $scope.alloffices);
                                 $scope.processing['loadOffices'] = false;
                                 //console.log($scope.alloffices);
                             },
                             function () {
                                 $scope.processing['loadOffices'] = false;
                                 swal("ошибка при загрузке офисов");
                             });
                    };
                    $scope.loadOffices();

                    $scope.initOffice = function () {

                        var diff = _.difference(_.map($scope.alloffices, "id"), _.map($scope.profileoffices, "id_Office"));
                        var result = _.filter($scope.alloffices, function (obj) { return diff.indexOf(obj.id) >= 0; });
                        angular.copy(result, $scope.offices);
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

                    $scope.loadProfileOffices = function (idProfile) {

                        $scope.processing['loadProfileOffices'] = true;
                        $scope.message = "загрузка доступных офисов";

                        var data = {
                            idProfile: idProfile
                        }

                        profileService
                             .getProfileOffices(data)
                             .then(function (result) {
                                 angular.copy(result.data, $scope.profileoffices);
                                 $scope.processing['loadProfileOffices'] = false;
                                 //console.log($scope.profileoffices);
                                 $scope.initOffice();
                             },
                             function () {
                                 $scope.processing['loadProfileOffices'] = false;
                                 swal("ошибка при загрузке закрепенных офисов");
                             });
                    };

                    $scope.addProfileOffice = function (idOffice) {

                        $scope.processing['addProfileOffice'] = true;
                        $scope.message = "добавление офиса";

                        var data = {
                            idProfile: $scope.idProfile,
                            idOffice: idOffice
                        }
                        console.log(data);

                        if (_.isNil($scope.idProfile)) {
                            swal('не выбран пользователь');
                            return;
                        }

                        profileService
                             .addProfileOffice(data)
                             .then(function (result) {
                                 $scope.processing['addProfileOffice'] = false;
                                 angular.copy(result.data, $scope.profileoffices);
                                 //console.log($scope.profileoffices);
                                 $scope.initOffice();
                             },
                             function () {
                                 $scope.processing['addProfileOffice'] = false;
                                 swal("ошибка при добавлении офиса");
                             });
                    };

                    $scope.delProfileOffice = function (item) {

                        $scope.processing['delProfileOffice'] = true;
                        $scope.message = "удаление офиса";

                        var data = {
                            idProfile: item.id_User,
                            id_Office_User: item.id_Office_User,
                            idOffice: Office.GetOfficeId()
                        }

                        profileService
                             .delProfileOffice(data)
                             .then(function (result) {
                                 $scope.processing['delProfileOffice'] = false;
                                 angular.copy(result.data, $scope.profileoffices);
                                 //console.log($scope.profileoffices);
                                 $scope.initOffice();
                             },
                             function () {
                                 $scope.processing['delProfileOffice'] = false;
                                 swal("ошибка при удалении офиса");
                             });
                    };


                }])
        }
    })
}