'use strict';

appMain.directive('myAddress', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Address/Address',
        scope: {
            address: '=?',
            idaddress: '=',
            //pdp: '='
            data: '=',
            type: '@',
            visiblebutton: '='
        },
        //['$scope', '$http', '$routeParams', 'personDocumentService', 'personService', 'contractService', 'Office', /*'Person',*/
        //function ($scope, $http, $routeParams, personDocumentService, personService, contractService, Office/*, Person*/) {
        controller: (['$scope', 'personDocumentService', 'addressService', 'Office',
            function ($scope, personDocumentService, addressService, Office) {

                $scope.address_old = {};
                $scope.address = {};

                $scope.messages = [];
                $scope.message = "";
                $scope.processing = {};


                $scope.$watch('idaddress', function () {
                    //console.log(' $watch idaddress ');
                    //console.log($scope.idaddress);
                    $scope.load();
                });

                $scope.load = function () {
                    if ($scope.idaddress == 0) {
                        $scope.address = {
                            id_Address: 0,
                            postIndex: '',
                            country: '',
                            region: '',
                            city: '',
                            street: '',
                            house: '',
                            building: '',
                            flat: ''
                        }
                        angular.copy($scope.address, $scope.address_old);
                    }
                    else {

                        $scope.processing['getAddress'] = true;
                        $scope.message = "загрузка адреса";

                        addressService
                           .getAddress($scope.idaddress)
                           .then(function (result) {
                               $scope.processing['getAddress'] = false;
                               angular.copy(result.data, $scope.address);
                               angular.copy($scope.address, $scope.address_old);
                           },
                           function () {
                               $scope.processing['getAddress'] = false;
                               alert("ошибка загрузки адреса");
                           });
                    }
                }

                $scope.load();

                $scope.changedText = function () {
                    //$scope.pdp.isSaved = false;
                }

                $scope.save = function () {

                    // проверить были ли изменения в адресе
                    if ($scope.address.postIndex == $scope.address_old.postIndex
                        && $scope.address.country == $scope.address_old.country
                        && $scope.address.region == $scope.address_old.region
                        && $scope.address.city == $scope.address_old.city
                        && $scope.address.street == $scope.address_old.street
                        && $scope.address.house == $scope.address_old.house
                        && $scope.address.building == $scope.address_old.building
                        && $scope.address.flat == $scope.address_old.flat) {

                        console.log('адреса равны')
                        //$scope.pdp.isSaved = null;

                        return;
                    }

                    if ($scope.type == 'pdp') {
                        $scope.save_pdp();
                    }
                    //if ($scope.type == 'office') {
                    //    $scope.save_pdp();
                    //}
                }

                $scope.save_pdp = function () {
                    var p_dpTemp = {
                        id_Person_DocumentProperty: $scope.data, //$scope.pdp.id_Person_DocumentProperty,
                        propertyValue: '' + $scope.idaddress + '', //$scope.pdp.propertyValue + '',
                        idOffice: Office.GetOfficeId(),
                        address: $scope.address
                    }

                    console.log('save_pdp');
                    $scope.processing['save_pdp'] = true;
                    $scope.message = "сохранение адреса";

                    personDocumentService
                        .updatePerson_DocumentProperty(p_dpTemp)
                        .then(function (result) {
                            $scope.processing['save_pdp'] = false;
                            angular.copy($scope.address, $scope.address_old);
                        },
                        function () {
                            $scope.processing['save_pdp'] = false;
                            alert("ошибка авто сохранения свойства");
                        });
                }

            }])
    }
})