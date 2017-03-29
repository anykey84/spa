export default (ngModule) => {

    ngModule.directive('myPersonDeposit', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonDeposit.html'),
            scope: {
                person: '='
                , personinfo: '='
            },
            controller: (['$scope', '$routeParams', 'contractService', 'personService', 'Office', 'Profile',
                function ($scope, $routeParams, contractService, personService, Office, Profile) {

                    //$scope.isNew = _.isNil($routeParams.par);
                    //if ($scope.isNew) return;

                    //$scope.person = {
                    //    id: $routeParams.par
                    //}

                    $scope.idContractType = 4;

                    $scope.processing = {};
                    $scope.message = "";

                    //$scope.personInfo = [];

                    //$scope.VisibleButtonAddCard = true;
                    $scope.VisibleButtonAddCard = Profile.GetRolePropertyValue("VisibleButtonAddCard");

                    $scope.contracts = [];

                    $scope.inBlackList = false;

                    $scope.loadPerson = function () {
                        $scope.processing['loadPerson'] = true;
                        $scope.message = "загрузка информации о клиенте";

                        personService
                            .getPerson($scope.person.id)
                            .then(function (result) {
                                //console.log(result.data);
                                //angular.copy(result.data, $scope.personInfo)
                                $scope.processing['loadPerson'] = false;
                                $scope.inBlackList = result.data.inBlackList;
                                //console.log(result.data.inBlackList);
                            },
                            function () {
                                $scope.processing['loadPerson'] = false;
                                swal("ошибка загрузки списка займов");
                            });
                    }
                    $scope.loadPerson();

                    $scope.addContract = function () {
                        $scope.processing['addContract'] = true;
                        $scope.message = "добавление договора";

                        var data = {
                            idOffice: Office.GetOfficeId(),
                            idPerson: $scope.person.id,
                            idContractType: $scope.idContractType // займ
                        }

                        contractService
                            .addContract(data)
                            .then(function (result) {
                                $scope.processing['addContract'] = false;
                                $scope.loadPersonContract();
                            }, function () {
                                $scope.processing['addContract'] = false;
                                swal("ошибка добавления");
                            });
                    }

                    $scope.loadPersonContract = function () {
                        $scope.processing['loadPersonContract'] = true;
                        $scope.message = "загрузка списка договоров";

                        var data = {
                            idOffice: Office.GetOfficeId(),
                            idPerson: $scope.person.id,
                            idContractType: $scope.idContractType // займ
                        }

                        personService
                            .getPersonContract(data)
                            .then(function (result) {
                                console.log('contracts');
                                console.log(result.data);
                                angular.copy(result.data, $scope.contracts)
                                $scope.processing['loadPersonContract'] = false;
                            },
                            function () {
                                $scope.processing['loadPersonContract'] = false;
                                swal("ошибка загрузки списка займов");
                            });
                    }

                    $scope.loadPersonContract();

                }])
        }
    })
}