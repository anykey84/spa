export default (ngModule) => {

    ngModule.directive('myDepositInfo', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./DepositInfo.html'),
            scope: {
                contract: '='
            },
            controller: (['$scope', '$window', '$filter', 'personDocumentService', 'depositService', 'contractParameterService', 'Office', 'Contract', 'paymentService',
                function ($scope, $window, $filter, personDocumentService, depositService, contractParameterService, Office, Contract, paymentService) {

                    $scope.processing = {};
                    $scope.message = "";
                    $scope.messages = [];
                    $scope.schedule = [];

                    $scope.depositInfo = {};
                    $scope.depositInfoMain = {};
                    $scope.depositInfoPart = [];
                    $scope.sumCap = 0;
                    $scope.penaltySum = 0;
                    $scope.periodProl = 0;

                    $scope.bankDepositReturn = {};
                    $scope.bankDepositEarlyApply = {};
                    $scope.bankDepositCapitalization = {};


                    $scope.formContractLoanInfoVisible = false;

                    $scope.$watch("contract.refresh", function () {
                        //console.log('contract.refresh');
                        $scope.loadDepositInfo();
                        $scope.getSchedule();
                    });

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
                                    $scope.messages.push({ color: 'red', message: 'ошибка загрузка списка банков' });
                                });
                    }
                    $scope.loadBanks();

                    $scope.payInterest = function () {

                        //console.log('внимание! изменить адрес!!');
                        var data = {
                            contractId: $scope.contract.id
                            , typePayment: 'rko'
                            , sum: $scope.depositInfo.interestLeft
                            , sumForOrder: $scope.depositInfo.interestLeft - $scope.depositInfo.ndfl
                            , idOffice: Office.GetOfficeId()
                        }

                        if (data.sum <= 0) {
                            $scope.messages.push({ color: 'red', message: 'ошибка добавления ордера на выплату процентов' });
                            return;
                        }

                        $scope.processing['payInterest'] = true;
                        $scope.message = "добавление ордера на выплату процентов";

                        //console.log($scope.message);
                        paymentService
                            .createPaymentDeposit(data) //payInterestDeposit(data)
                            .then(function (result) {
                                //console.log(result.data);
                                //angular.copy(result.data, $scope.schedule);
                                $scope.loadDepositInfo();
                                $scope.processing['payInterest'] = false;
                            }, function () {
                                $scope.processing['payInterest'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка добавления ордера на выплату процентов' });
                            });
                    }

                    $scope.totalInterestF = function () {
                        var total = 0;
                        for (var i = 0; i < $scope.schedule.length; i++) {
                            var product = $scope.schedule[i];
                            total += product.sumInterest;
                        }
                        return total; //Math.round(total * 100) / 100;
                    }
                    $scope.totalNdflF = function () {
                        var total = 0;
                        for (var i = 0; i < $scope.schedule.length; i++) {
                            var product = $scope.schedule[i];
                            total += product.ndfl;
                        }
                        return total; //Math.round(total * 100) / 100;
                    }
                    $scope.totalAllF = function () {
                        var total = 0;
                        for (var i = 0; i < $scope.schedule.length; i++) {
                            var product = $scope.schedule[i];
                            total += product.sumInterest - product.ndfl;
                        }
                        return total; //Math.round(total * 100) / 100;
                    }

                    $scope.getSchedule = function () {

                        $scope.processing['getSchedule'] = true;
                        $scope.message = "обновление графика платежей";
                        //console.log($scope.message);



                        contractParameterService
                            .getSchedule($scope.contract.id)
                            .then(function (result) {
                                angular.copy(result.data, $scope.schedule);

                                $scope.totalInterest = $scope.totalInterestF();
                                $scope.totalNdfl = $scope.totalNdflF();
                                $scope.totalAll = $scope.totalAllF();

                                //console.log('$scope.schedule');
                                //console.log($scope.schedule);
                                $scope.processing['getSchedule'] = false;
                            }, function () {
                                $scope.processing['getSchedule'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка получения графика платежей' });
                            });
                    }
                    $scope.getSchedule();

                    $scope.depositReturn = function () {

                        var idBank = null;
                        if (angular.isDefined($scope.bankDepositReturn)) {
                            idBank = $scope.bankDepositReturn.id;
                        }

                        var data = {
                            idDeposit: $scope.contract.id,
                            idBank: idBank,
                            idOffice: Office.GetOfficeId()
                        };

                        $scope.processing['depositReturn'] = true;
                        $scope.message = "досрочное изьятие";

                        depositService
                            .depositReturn(data)
                                .then(function (result) {
                                    $scope.contract.refresh = result.data.refreshcode;

                                    if (result.data.messages.length > 0) {
                                        angular.copy(result.data.messages, $scope.messages);
                                    }
                                    //console.log(result.data);
                                    //angular.copy(result.data.depositinfo, $scope.depositInfo);
                                    $scope.processing['depositReturn'] = false;
                                },
                                function () {
                                    $scope.processing['depositReturn'] = false;
                                    $scope.messages.push({ color: 'red', message: 'ошибка возврата вклада' });
                                });
                    }

                    $scope.depositEarlyApply = function () {

                        var idBank = null;
                        if (angular.isDefined($scope.bankDepositEarlyApply)) {
                            idBank = $scope.bankDepositEarlyApply.id;
                        }

                        //console.log('внимание! изменить адрес!!');
                        var data = {
                            idDeposit: $scope.contract.id,
                            idOffice: Office.GetOfficeId(),
                            idBank: idBank,
                            dateEarly: new Date($scope.dateEarly).toDateString(), //$filter("date")(Date.now(), 'yyyy-MM-dd'),
                            sumEarly: $scope.sumEarly,
                            isMin: $scope.isMin
                        };
                        //console.log(data);
                        //return;

                        $scope.processing['depositEarlyApply'] = true;
                        $scope.message = "досрочное изьятие";

                        depositService
                            .depositEarlyApply(data)
                                .then(function (result) {
                                    $scope.contract.refresh = result.data.refreshcode;
                                    if (result.data.messages.length > 0) {
                                        angular.copy(result.data.messages, $scope.messages);
                                    }
                                    //console.log(result.data);
                                    //angular.copy(result.data.depositinfo, $scope.depositInfo);
                                    $scope.processing['depositEarlyApply'] = false;
                                },
                                function () {
                                    $scope.processing['depositEarlyApply'] = false;
                                    $scope.messages.push({ color: 'red', message: 'ошибка досрочного изьятия' });
                                });
                    }

                    $scope.depositCapitalization = function () {

                        var idBank = null;
                        if (angular.isDefined($scope.bankDepositCapitalization)) {
                            idBank = $scope.bankDepositCapitalization.id;
                        }

                        var data = {
                            idDeposit: $scope.contract.id,
                            idBank: idBank,
                            dateNow: new Date($scope.dateCap).toDateString(), //$filter("date")(Date.now(), 'yyyy-MM-dd'),
                            idOffice: Office.GetOfficeId()
                        };
                        //console.log(data);
                        //return;

                        $scope.processing['depositCapitalization'] = true;
                        $scope.message = "обновление информации о карточке";

                        depositService
                            .depositCapitalization(data)
                                .then(function (result) {
                                    //console.log(result.data);
                                    $scope.contract.refresh = result.data;

                                    $scope.loadDepositInfo();
                                    $scope.getSchedule();
                                    //angular.copy(result.data.depositinfo, $scope.depositInfo);
                                    $scope.processing['depositCapitalization'] = false;
                                },
                                function () {
                                    $scope.processing['depositCapitalization'] = false;
                                    $scope.messages.push({ color: 'red', message: 'ошибка вычисления досрочного изьятия' });
                                });
                    }

                    $scope.depositCapitalizationCalc = function () {

                        var data = {
                            idDeposit: $scope.contract.id,
                            dateNow: new Date().toDateString(), //$filter("date")(Date.now(), 'yyyy-MM-dd'),
                            idOffice: Office.GetOfficeId()
                        };
                        console.log('depositCapitalizationCalc');
                        console.log(data);
                        //return;

                        $scope.processing['depositCapitalizationCalc'] = true;
                        $scope.message = "обновление информации о карточке";

                        depositService
                            .depositCapitalizationCalc(data)
                                .then(function (result) {
                                    //console.log('depositCapitalizationCalc');
                                    //console.log(result.data);
                                    $scope.sumCap = result.data;
                                    $scope.processing['depositCapitalizationCalc'] = false;
                                },
                                function () {
                                    $scope.processing['depositCapitalizationCalc'] = false;
                                    $scope.messages.push({ color: 'red', message: 'ошибка вычисления суммы капитализации' });
                                });
                    }

                    $scope.calcDepositEarly = function () {

                        var data = {
                            idDeposit: $scope.contract.id,
                            dateNow: new Date($scope.dateEarly).toDateString(), //$filter("date")(Date.now(), 'yyyy-MM-dd'),
                            //dateNow:  $filter("date")(Date.now(), 'yyyy-MM-dd'),
                            sumEarly: $scope.sumEarly,
                            isMin: $scope.isMin
                        };
                        //console.log(data);
                        //return;

                        $scope.processing['calcDepositEarly'] = true;
                        $scope.message = "обновление информации о карточке";

                        depositService
                            .calcDepositEarly(data)
                                .then(function (result) {
                                    //console.log('calcDepositEarly');
                                    //console.log(result.data.penaltySum);
                                    $scope.penaltySum = result.data.penaltySum;
                                    //angular.copy(result.data.penaltySum, $scope.depositInfo);
                                    $scope.processing['calcDepositEarly'] = false;
                                },
                                function () {
                                    $scope.processing['calcDepositEarly'] = false;
                                    $scope.messages.push({ color: 'red', message: 'ошибка вычисления досрочного изьятия' });
                                });
                    }

                    $scope.loadDepositInfo = function () {

                        $scope.processing['loadDepositInfo'] = true;
                        $scope.message = "обновление информации о карточке";
                        //console.log($scope.message);

                        //console.log('внимание! изменить дату!!');
                        var data = {
                            idDeposit: $scope.contract.id,
                            dateNow: new Date().toDateString(), //$filter("date")(Date.now(), 'yyyy-MM-dd'), //'2016-08-19',//
                            idFormula: 0
                        };
                        //console.log(data);

                        depositService
                            .getDepositInfo(data)
                                .then(function (result) {

                                    console.log(result.data);

                                    angular.copy(result.data.depositinfo, $scope.depositInfo);
                                    angular.copy(result.data.depositinfomain, $scope.depositInfoMain);
                                    angular.copy(result.data.depositinfopart, $scope.depositInfoPart);

                                    Contract.Init(
                                        result.data.depositinfomain.id,
                                        result.data.depositinfomain.number,
                                        result.data.depositinfomain.owner,
                                        result.data.depositinfomain.dateCreate,
                                        result.data.depositinfomain.lastStatus)

                                    $scope.contract.number = Contract.GetContractNumber();
                                    $scope.contract.owner = Contract.GetContractOwner();
                                    $scope.contract.dateCreate = Contract.GetContractDateCreate();
                                    $scope.contract.lastStatus = Contract.GetContractLastStatus();
                                    $scope.processing['loadDepositInfo'] = false;
                                },
                                function () {
                                    $scope.processing['loadDepositInfo'] = false;
                                    $scope.messages.push({ color: 'red', message: 'ошибка загрузки информации о карточке' });
                                });
                    }

                    $scope.depositProlongation = function () {

                        var data = {
                            idDeposit: $scope.contract.id,
                            periodProl: $scope.periodProl,
                            dateNow: new Date().toDateString(), //$filter("date")(Date.now(), 'yyyy-MM-dd'),
                            idOffice: Office.GetOfficeId()
                        };
                        //console.log(data);
                        //return;

                        $scope.processing['depositProlongation'] = true;
                        $scope.message = "обновление информации о карточке";

                        depositService
                            .depositProlongation(data)
                                .then(function (result) {
                                    //console.log(result.data);
                                    $scope.contract.refresh = result.data.refreshcode;

                                    if (result.data.messages.length > 0) {
                                        angular.copy(result.data.messages, $scope.messages);
                                    }

                                    $scope.loadDepositInfo();
                                    $scope.getSchedule();
                                    //angular.copy(result.data.depositinfo, $scope.depositInfo);
                                    $scope.processing['depositProlongation'] = false;
                                },
                                function () {
                                    $scope.processing['depositProlongation'] = false;
                                    $scope.messages.push({ color: 'red', message: 'ошибка пролонгации' });
                                });
                    }

                    $scope.depositSumRefill = function () {

                        //bankDepositSumRefill
                        var idBank = null;
                        if (angular.isDefined($scope.bankDepositSumRefill)) {
                            idBank = $scope.bankDepositSumRefill.id;
                        }

                        var data = {
                            idDeposit: $scope.contract.id,
                            sumRefill: $scope.sumRefill,
                            dateRefill: new Date($scope.dateRefill).toDateString(),
                            idBank: idBank,
                            idOffice: Office.GetOfficeId()
                        };
                        //console.log(data);
                        //return;

                        $scope.processing['depositSumRefill'] = true;
                        $scope.message = "обновление информации о карточке";
                        $scope.messages.length = 0;

                        depositService
                            .depositSumRefill(data)
                                .then(function (result) {
                                    //console.log(result.data);

                                    $scope.contract.refresh = result.data.refresh;

                                    if (result.data.messages.length > 0) {
                                        angular.copy(result.data.messages, $scope.messages);
                                    }

                                    $scope.loadDepositInfo();
                                    $scope.getSchedule();

                                    $scope.processing['depositSumRefill'] = false;
                                },
                                function () {
                                    $scope.processing['depositSumRefill'] = false;
                                    $scope.messages.push({ color: 'red', message: 'ошибка пополнения' });
                                });
                    }


                    $scope.loadDepositInfo();
                    // console.log('dddddddddddddddddddddddddd');
                    //$scope.getContractRecalcInfo();
                    //$scope.getSchedule();
                }])
        }
    })
}