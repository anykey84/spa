export default (ngModule) => {

    ngModule.directive('myPaymentbank', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PaymentBank.html'),
            scope: {
            },
            controller: (['$scope', 'contractService', 'paymentService', 'Office',
                function ($scope, contractService, paymentService, Office) {

                    $scope.sum = 0;
                    $scope.datePay = '';
                    $scope.contractNumberIsCorrect = false;
                    $scope.contractNumber = '';
                    $scope.idContract = 0;
                    $scope.ownerContractFullName = '';

                    $scope.selected = {};
                    $scope.processing = {};
                    $scope.message = '';
                    $scope.messages = [];

                    $scope.init = function () {
                        $scope.sum = 0;
                        $scope.contractNumber = '';
                        $scope.ownerContractFullName = '';
                        $scope.idContract = 0;
                        $scope.datePay = '';
                        $scope.selected = {};
                        $scope.contractNumberIsCorrect = false;
                    }
                    $scope.init();

                    $scope.checkContract = function () {

                        $scope.processing['checkContract'] = true;
                        $scope.message = 'проверка номера договора';

                        contractService
                            .checkContract($scope.contractNumber)
                            .then(function (result) {

                                if (result.data !== 'null') {
                                    $scope.contractNumberIsCorrect = true;
                                    $scope.ownerContractFullName = result.data.ownerContractFullName;
                                    $scope.idContract = result.data.idContract;
                                }
                                else {
                                    $scope.contractNumberIsCorrect = false;
                                }
                                $scope.processing['checkContract'] = false;
                            },
                            function () {
                                swal("ошибка проверки номера договор");
                                $scope.processing['checkContract'] = false;
                            });
                    }

                    $scope.addPayment = function () {

                        $scope.processing['addPayment'] = true;
                        $scope.message = 'добавление платежа';

                        var p = {
                            sum: +$scope.sum,
                            idContract: $scope.idContract,
                            idOffice: Office.GetOfficeId(),
                            idBank: $scope.selected.id,
                            datePay: new Date($scope.datePay).toDateString()
                        }
                        //console.log(p);
                        //return;

                        paymentService
                            .bankPayment(p)
                            .then(function (result) {
                                //swal("Готово!",  "Платеж добавлен", "success");
                                $scope.processing['addPayment'] = false;
                                $scope.init();
                            },
                            function () {
                                // error
                                swal("Ошибка сохранения платежа", "Проверьте введенные данные", "error");
                                //$scope.processing['addPayment'] = false;
                            });
                    }

                    $scope.loadBanks = function () {

                        $scope.banks = [];

                        $scope.processing['loadBanks'] = true;
                        $scope.message = 'загрузка списка банков';

                        paymentService
                            .getBank()
                                .then(function (result) {
                                    angular.copy(result.data, $scope.banks);
                                    $scope.processing['loadBanks'] = false;
                                    //console.log($scope.paymentaccounts);
                                },
                                function () {
                                    $scope.processing['loadBanks'] = false;
                                    swal("ошибка загрузка списка банков");
                                });
                    }

                    $scope.loadBanks();

                }])
        }
    })
}