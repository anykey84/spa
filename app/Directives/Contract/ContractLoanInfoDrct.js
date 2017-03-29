export default (ngModule) => {

    ngModule.directive('myContractloaninfo', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./ContractLoanInfo.html'),
            scope: {
                contract: '='
            },
            controller: (['$scope', '$filter', 'personDocumentService', 'contractService', 'contractParameterService', 'Office', 'Contract',
                function ($scope, $filter, personDocumentService, contractService, contractParameterService, Office, Contract) {

                    $scope.schedule = [];
                    $scope.debt = [];

                    $scope.processing = {};
                    $scope.message = "";
                    $scope.messages = [];

                    $scope.contractLoanInfo = {};
                    $scope.contractRecalcInfo = {};

                    $scope.formContractLoanInfoVisible = false;

                    $scope.getContractRecalcInfo = function () {

                        $scope.processing['getContractRecalcInfo'] = true;
                        $scope.message = "обновление сведений о займе";
                        $scope.formContractLoanInfoVisible = false;
                        var data = {
                            idContract: $scope.contract.id,
                            dateNow: new Date()
                        }

                        contractService
                            .getContractRecalcInfo(data)
                            .then(function (result) {
                                $scope.processing['getContractRecalcInfo'] = false;
                                angular.copy(result.data, $scope.contractRecalcInfo);
                                angular.copy($scope.contractRecalcInfo.сontractinfo, $scope.contractLoanInfo);
                                $scope.formContractLoanInfoVisible = true;
                                //console.log($scope.contractRecalcInfo);

                            }, function () {
                                $scope.processing['getContractRecalcInfo'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка получения сведений о займе' });
                            });
                    }

              

                    //$scope.getContractLoanInfo = function () {

                    //    $scope.formContractLoanInfoVisible = false;
                    //    $scope.processing['loadContractLoanInfo'] = true;
                    //    $scope.message = "обновление сведений о займе";
                    //    //console.log($scope.message);

                    //    contractService
                    //        .getContractLoanInfo($scope.contract.id)
                    //        .then(function (result) {
                    //            angular.copy(result.data, $scope.contractLoanInfo);
                    //            $scope.formContractLoanInfoVisible = true;
                    //            $scope.processing['loadContractLoanInfo'] = false;
                    //        }, function () {
                    //            $scope.processing['loadContractLoanInfo'] = false;
                    //            $scope.messages.push({ color: 'red', message: 'ошибка получения сведений о займе' });
                    //        });
                    //}

                    $scope.getSchedule = function () {

                        $scope.processing['loadSchedule'] = true;
                        $scope.message = "обновление графика платежей";
                        //console.log($scope.message);

                        contractParameterService
                            .getSchedule($scope.contract.id)
                            .then(function (result) {
                                //console.log(result.data);
                                angular.copy(result.data, $scope.schedule);
                                $scope.processing['loadSchedule'] = false;
                            }, function () {
                                $scope.processing['loadSchedule'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка получения графика платежей' });
                            });
                    }

                    $scope.loadContractInfo = function () {

                        $scope.processing['loadContractInfo'] = true;
                        $scope.message = "обновление информации о карточке";
                        //console.log($scope.message);

                        contractService
                            .readContract($scope.contract.id)
                                .then(function (result) {
                                    //console.log(result.data);

                                    $scope.isLoadContractInfo = _.isNil(result.data);
                                    if (!$scope.isLoadContractInfo) {
                                        //console.log("загрузка contract info");
                                        Contract.Init(result.data.id, result.data.number, result.data.owner, result.data.dateCreate, result.data.lastStatus)

                                        //$scope.contract.id = Contract.GetContractId();
                                        $scope.contract.number = Contract.GetContractNumber();
                                        $scope.contract.owner = Contract.GetContractOwner();
                                        $scope.contract.dateCreate = Contract.GetContractDateCreate();
                                        $scope.contract.lastStatus = Contract.GetContractLastStatus();
                                    }
                                    $scope.processing['loadContractInfo'] = false;
                                },
                                function () {
                                    $scope.processing['loadContractInfo'] = false;
                                    $scope.messages.push({ color: 'red', message: 'ошибка загрузки информации о карточке' });
                                });
                    }

                    $scope.loadContractInfo();
                    $scope.getContractRecalcInfo();
                    $scope.getSchedule();
                }])
        }
    })
}