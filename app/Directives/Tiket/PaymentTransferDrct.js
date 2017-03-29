'use strict';

appMain.directive('myPaymenttransfer', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Template/PaymentTransfer',
        scope: {            
        },
        controller: (['$scope', 'paymentService', 'reportService', 'officeService', 'Office', 'Profile',
            function ($scope, paymentService, reportService, officeService, Office, Profile) {

                $scope.sum = 0;
                $scope.idOfficeDestination = 0;

                $scope.selected = {};
                $scope.processing = {};
                $scope.payments = [];
                $scope.offices = [];

                $scope.VisibleButtonDeletePayment = Profile.GetRolePropertyValue("VisibleButtonDeletePayment");

                $scope.init = function () {
                    $scope.sum = 0;
                    $scope.idOfficeDestination = 0;
                    $scope.selected = {};
                }
                $scope.init();
                
                $scope.officeChanged = function (item) {
                    $scope.idOfficeDestination = item.id;
                }

                $scope.createFilePayment = function (item) {
                    $scope.processing[item.id] = true;

                    var data = {
                        id: 0,
                        idOffice: Office.GetOfficeId(),
                        idContract: null,
                        idPayment: item.id,
                        reportType: item.ispko ? 'credit' : 'debit',
                        dateReport: null
                    };
                    console.log(data);
                   // return;

                    reportService
                        .generateReport(data)
                        .then(function (result) {
                            $scope.loadPayments();
                            $scope.processing[item.id] = false;
                        },
                        function () {
                            $scope.processing[item.id] = false;
                            swal("ошибка генерации файла на сервере");
                        });
                }


                $scope.transferPayment = function () {

                    $scope.processing['transferPayment'] = true;

                    var p = {
                        sum: $scope.sum,
                        idOfficeSource: Office.GetOfficeId(),
                        idOfficeDestination: $scope.idOfficeDestination
                    }

                    paymentService
                        .transferPayment(p)
                        .then(function (result) {
                            $scope.processing['transferPayment'] = false;
                            $scope.loadPayments();
                            $scope.init();
                        },
                        function () {
                            // error
                            swal("ошибка переноса платежа");
                            $scope.processing['transferPayment'] = false;
                        });
                }

                $scope.confirmPayment = function (id) {

                    $scope.processing['confirmPayment'] = true;

                    var p = {                        
                        idOffice: Office.GetOfficeId(),
                        idPayment: id
                    }

                    paymentService
                        .confirmPayment(p)
                        .then(function (result) {
                            $scope.processing['confirmPayment'] = false;
                            $scope.loadPayments();
                            $scope.init();
                        },
                        function () {
                            // error
                            swal("ошибка подтверждения платежа");
                            $scope.processing['confirmPayment'] = false;
                        });
                }

                $scope.delPayment = function (id) {

                    var p = {
                        id: id,
                        idOffice: Office.GetOfficeId(),
                        comment: ""
                    }

                    paymentService
                        .deletePayment(p)
                        .then(function (result) {
                            $scope.loadPayments();
                        },
                        function () {
                            swal("ошибка удаления платежа");
                        });
                }

                $scope.loadOffices = function () {

                    if ($scope.processing['loadOffices']) {
                        console.log('уже идет');
                        return;
                    }

                    $scope.offices = [];

                    $scope.processing['loadOffices'] = true;

                    officeService
                        .getOffices()
                            .then(function (result) {
                                angular.copy(result.data, $scope.offices);
                                $scope.processing['loadOffices'] = false;
                            },
                            function () {
                                $scope.processing['loadOffices'] = false;
                                swal("ошибка загрузки офисов");
                            });
                }
                $scope.loadOffices();

                $scope.loadPayments = function () {

                    if ($scope.processing['loadPayments']) {
                        console.log('уже идет')
                        return;
                    }

                    $scope.payments = [];

                    $scope.processing['loadPayments'] = true;

                    paymentService
                        .getPaymentTransfers(Office.GetOfficeId())
                            .then(function (result) {
                                angular.copy(result.data, $scope.payments);
                                //console.log($scope.payments);   
                                $scope.processing['loadPayments'] = false;
                            },
                            function () {
                                $scope.processing['loadPayments'] = false;
                                swal("ошибка загрузки платежей");
                            });
                }

                $scope.loadPayments();
            }])
    }
})