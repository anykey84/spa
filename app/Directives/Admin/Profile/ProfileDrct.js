export default (ngModule) => {

    ngModule.directive('myProfile', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./Profile.html'),
            scope: {
            },
            //['$scope', '$http', '$routeParams', 'personDocumentService', 'personService', 'contractService', 'Office', /*'Person',*/
            //function ($scope, $http, $routeParams, personDocumentService, personService, contractService, Office/*, Person*/) {
            controller: (['$scope', 'profileService', 'Office', 'Profile',
                function ($scope, profileService, Office, Profile) {


                    $scope.messages = [];
                    $scope.message = "";
                    $scope.findtext = "";
                    $scope.processing = {};

                    $scope.profiles = [];

                    $scope.loadProfiles = function () {

                        $scope.processing['loadProfiles'] = true;
                        $scope.message = "загрузка профилей";

                        var data = {
                            param: $scope.findtext
                        }

                        profileService
                           .getProfiles(data)
                           .then(function (result) {
                               $scope.processing['loadProfiles'] = false;
                               angular.copy(result.data, $scope.profiles);
                           },
                           function () {
                               $scope.processing['loadProfiles'] = false;
                               alert("ошибка загрузки ролей");
                           });
                    }
                    //$scope.loadProfiles();

                    $scope.loadDescription = function (item) {
                        $scope.processing[item.id_Profile] = true;
                        $scope.message = "обновление пароля";

                        var data = {
                            idProfile: item.id_Profile
                        }

                        profileService
                           .getDescription(data)
                           .then(function (result) {
                               $scope.processing[item.id_Profile] = false;
                               item.isDecs = true;
                               item.desc = result.data;
                               //console.log(result.data);
                           },
                           function () {
                               $scope.processing[item.id_Profile] = false;
                               alert("ошибка загрузки пароля");
                           });
                    }

                    $scope.deleteTrustDocuments = function (item, idTrustDocument) {
                    }

                    $scope.loadProfileRoles = function (item) {

                        $scope.processing[item.id_Profile] = true;
                        $scope.message = "загрузка ролей";

                        var data = {
                            idProfile: item.id_Profile
                        }

                        profileService
                           .getTrustDocuments(data)
                           .then(function (result) {
                               $scope.processing[item.id_Profile] = false;
                               item.profileroles = [];
                               angular.copy(result.data, item.profileroles);
                           },
                           function () {
                               $scope.processing[item.id_Profile] = false;
                               alert("ошибка загрузки ролей");
                           });
                    }

                    $scope.loadTrustDocuments = function (item) {

                        $scope.processing[item.id_Profile] = true;
                        $scope.message = "загрузка доверенностей";

                        var data = {
                            idProfile: item.id_Profile
                        }

                        console.log(item);

                        profileService
                           .getTrustDocuments(data)
                           .then(function (result) {
                               $scope.processing[item.id_Profile] = false;
                               item.trustdocuments = [];
                               angular.copy(result.data, item.trustdocuments);
                               console.log(result.data);
                               console.log(item.trustdocuments);
                           },
                           function () {
                               $scope.processing[item.id_Profile] = false;
                               alert("ошибка загрузки доверенностей");
                           });
                    }

                    $scope.saveTrustDocument = function (item) {

                        $scope.processing['saveTrustDocument'] = true;
                        $scope.message = "сохранение доверенности";

                        var data = {
                            idProfile: item.id_Profile,
                            number: item.newNumber,
                            dateStart: new Date(item.newDateStart).toDateString(),
                            dateEnd: new Date(item.newDateEnd).toDateString()
                        }

                        profileService
                           .addTrustDocument(data)
                           .then(function (result) {
                               $scope.processing['saveTrustDocument'] = false;
                               $scope.loadTrustDocuments(item);
                           },
                           function () {
                               $scope.processing['saveTrustDocument'] = false;
                               alert("ошибка сохранения доверенности");
                           });
                    }


                    $scope.initProfile = function (item) {
                        $scope.idProfile = item.id_Profile;
                        $scope.lastName = item.lastName;
                        $scope.firstName = item.firstName;
                        $scope.middleName = item.middleName;
                        $scope.birthDate = new Date(item.birthDate);
                        $scope.login = item.login;
                        $scope.phone = item.phone;
                    }

                    $scope.addProfile = function () {

                        $scope.processing['addProfile'] = true;
                        $scope.message = "добавление профиля";

                        var data = {
                            idProfile: $scope.idProfile,
                            lastName: $scope.lastName,
                            firstName: $scope.firstName,
                            middleName: $scope.middleName,
                            birthDate: new Date($scope.birthDate).toDateString(),
                            login: $scope.login,
                            phone: $scope.phone
                        }

                        profileService
                           .addProfile(data)
                           .then(function (result) {
                               $scope.processing['addProfile'] = false;
                               $scope.findtext = $scope.login;
                               $scope.loadProfiles();
                           },
                           function () {
                               $scope.processing['addProfile'] = false;
                               alert("ошибка добавления роли");
                           });
                    }

                    $scope.deleteProfile = function (idProfile) {

                        $scope.processing['deleteProfile'] = true;
                        $scope.message = "удаление профиля";

                        var data = {
                            idProfile: idProfile
                        }

                        profileService
                           .deleteProfile(data)
                           .then(function (result) {
                               $scope.processing['deleteProfile'] = false;
                               $scope.loadProfiles();
                           },
                           function () {
                               $scope.processing['deleteProfile'] = false;
                               alert("ошибка удаления профиля");
                           });
                    }

                    $scope.restoreProfile = function (idProfile) {

                        $scope.processing['restoreProfile'] = true;
                        $scope.message = "восстановления профиля";

                        var data = {
                            idProfile: idProfile
                        }

                        profileService
                           .restoreProfile(data)
                           .then(function (result) {
                               $scope.processing['restoreProfile'] = false;
                               $scope.loadProfiles();
                           },
                           function () {
                               $scope.processing['restoreProfile'] = false;
                               alert("ошибка восстановления профиля");
                           });
                    }


                }])
        }
    })
}