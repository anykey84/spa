export default (ngModule) => {

    ngModule.directive('myPersonAllInfo', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonAllInfo.html'),
            scope: {
                person: '='
            },
            controller: (['$scope', '$routeParams', 'contractService', 'personService', 'Office', 'Profile',
                function ($scope, $routeParams, contractService, personService, Office, Profile) {                

                    $scope.processing = {};
                    $scope.message = "";
                    $scope.messages = [];

                    $scope.personphones = [];
                    $scope.contactphones = [];
                    $scope.documents = [];

                    $scope.VisibleButtonAddCard = Profile.GetRolePropertyValue("VisibleButtonAddCard");                              

                    $scope.loadPerson = function () {
                        $scope.processing['loadPerson'] = true;
                        $scope.message = "загрузка информации о клиенте";

                        personService
                            .getPerson($scope.person.id)
                            .then(function (result) {
                                angular.copy(result.data, $scope.person);
                                $scope.processing['loadPerson'] = false;
                            },
                            function () {
                                $scope.processing['loadPerson'] = false;
                                swal("ошибка загрузки информации о клиенте");
                            });
                    }
                    $scope.loadPerson();

                    $scope.loadContactPhone = function () {

                        $scope.processing['loadContactPhone'] = true;
                        $scope.message = "загрузка контактных телефонов";

                        var data = {
                            idPerson: $scope.person.id,
                            isDeleted: true
                        };

                        personService
                            .getPersonContactPhone(data)
                            .then(function (result) {
                                $scope.processing['loadContactPhone'] = false;
                                angular.copy(result.data, $scope.contactphones)
                            },
                            function () {
                                $scope.processing['loadContactPhone'] = false;
                                swal("ошибка загрузки телефонов");
                            });
                    }

                    $scope.loadContactPhone();

                    $scope.loadPersonPhone = function () {

                        $scope.processing['loadPersonPhone'] = true;
                        $scope.message = "загрузка личных телефонов";

                        var data = {
                            idPerson: $scope.person.id,
                            isDeleted: true
                        };

                        personService
                            .getPersonPhone(data)
                            .then(function (result) {
                                $scope.processing['loadPersonPhone'] = false;
                                angular.copy(result.data, $scope.personphones);
                            },
                            function () {
                                $scope.processing['loadPersonPhone'] = false;
                                swal("ошибка загрузки телефонов");
                            });
                    }

                    $scope.loadPersonPhone();

                    $scope.loadDocumentsToString = function () {

                        $scope.processing['loadDocumentsToString'] = true;
                        $scope.message = "загрузка документов";

                        personService
                            .getDocumentsToString($scope.person.id)
                            .then(function (result) {
                                $scope.processing['loadDocumentsToString'] = false;
                                angular.copy(result.data, $scope.documents);
                                //console.log($scope.documents);
                            },
                            function () {
                                $scope.processing['loadDocumentsToString'] = false;
                                swal("ошибка загрузки документов");
                            });
                    }

                    $scope.loadDocumentsToString();

                }])
        }
    })
}