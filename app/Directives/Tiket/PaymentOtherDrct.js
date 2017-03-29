'use strict';

appMain.directive('myPaymentother', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Template/PaymentOther',
        scope: {           
        },
        controller: (['$scope', 'paymentService', 'Office',
            function ($scope, paymentService, Office) {

                $scope.sum = 0;

                $scope.selected = {};
                $scope.processing = {};
                $scope.paymentaccounts = [];

                $scope.init = function () {
                    $scope.sum = 0;
                    $scope.selected = {};
                }
                $scope.init();

                $scope.paymentAccountChanged = function (item) {
                }

                $scope.addPayment = function () {

                    $scope.processing['addPayment'] = true;

                    var p = {
                        sum: $scope.sum,
                        idOffice: Office.GetOfficeId(),
                        isPKO: $scope.selected.ispko,
                        idPaymentAccount: $scope.selected.id
                    }
                    //console.log(p);
                    
                    paymentService
                        .otherPayment(p)
                        .then(function (result) {
                            $scope.processing['addPayment'] = false;
                            $scope.init();
                        },
                        function () {
                            // error
                            swal("ошибка сохранения платежа");
                            $scope.processing['addPayment'] = false;
                        });
                }

                $scope.loadPaymentAccounts = function () {

                    if ($scope.processing['loadPaymentAccounts']) {
                        console.log('уже идет')
                        return;
                    }

                    $scope.paymentaccounts = [];

                    $scope.processing['loadPaymentAccounts'] = true;

                    paymentService
                        .getPaymentAccount()
                            .then(function (result) {
                                angular.copy(result.data, $scope.paymentaccounts);
                                $scope.processing['loadPaymentAccounts'] = false;
                                //console.log($scope.paymentaccounts);
                            },
                            function () {
                                $scope.processing['loadPaymentAccounts'] = false;
                                swal("ошибка загрузки типов платежей");
                            });
                }

                $scope.loadPaymentAccounts();

            }])
    }
})