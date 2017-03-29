export default (ngModule) => {

    ngModule.directive('myDepositContractparameter', function () {
        return {
            restrict: 'E',
            replace: false,
            template: require('./DepositContractParameter.html'),
            scope: {
                contract: '=',
                office: '='
            },
            controller: (['$scope', '$filter', 'Profile', 'Guid', 'Office', 'Contract',
                            'contractParameterService', 'productService', 'reportService', 'contractService', 'contractStatusService', 'personFileService',
                function ($scope, $filter, Profile, Guid, Office, Contract,
                            contractParameterService, productService, reportService, contractService, contractStatusService, personFileService) {

                    $scope.processing = {};
                    $scope.message = "";
                    $scope.messages = [];
                    $scope.schedule = [];
                

                    //$scope.refresh = {
                    //    guid: Guid.NewGuid()
                    //}

                    //console.log('myContractparameter - ')
                    //console.log($scope.refresh)
                    //console.log('**************************** - ')

                    $scope.contractLoanInfo = {};
                    $scope.contractRecalcInfo = {};
                    //$scope.contractParameterInfo = {};

                    $scope.contractParameter = {
                        id: 0,
                        idContract: $scope.contract.id,
                        sum: 0,
                        periodCount: 0,
                        periodProlongation: 0,
                        periodRestructuring: 3
                    }

                    // выбранный продукт
                    $scope.selectproduct = {
                        idProduct: 0,
                        minSpan: 0,
                        maxSpan: 0,
                        minSum: 0,
                        maxSum: 0,
                        periodName: 'дней (или месяцев)'
                    };

                    $scope.contractparameters = [];
                    $scope.products = [];

                    $scope.schedule_temp = [];

                    $scope.init = function () {
                        $scope.btnEditContractParameter = false;
                        $scope.isContractIssue = false;
                        $scope.contractCodeLastStatus = -1;
                        $scope.addProlongationVisible = false;
                        $scope.VisibleButtonAddContractParameter = false;
                        $scope.VisibleButtonEditContractParameter = false;
                        $scope.VisibleButtonEditSumContractParameter = false;
                        $scope.VisibleButtonEditSumNONContractParameter = false;

                        $scope.addRestructuringVisible = false;

                        $scope.deleteContractParameterVisible = false;

                        $scope.сontractParameterVisible = false;
                        $scope.VisibleButtonAddContractParameter = false;
                        $scope.addContractParameterVisible = false;
                        $scope.formSchedulePaymentVisible = false;
                        $scope.sumCurrent = -1;

                        $scope.formEditContractParameter = false;
                    }

                    $scope.init();

                    $scope.VisibleButtonAddProlongation = Profile.GetRolePropertyValue("VisibleButtonAddProlongation");
                    //console.log('VisibleButtonAddProlongation');
                    //console.log($scope.VisibleButtonAddProlongation);

                    $scope.VisibleButtonAddRestructuring = Profile.GetRolePropertyValue("VisibleButtonAddRestructuring");

                    //$scope.VisibleButtonDeleteFileContract = Profile.GetRolePropertyValue("VisibleButtonDeleteFileContract");
                    //$scope.VisibleButtonDownloadFileContract = Profile.GetRolePropertyValue("VisibleButtonDownloadFileContract");
                    ////$scope.VisibleButtonGenerateFileContract = Profile.GetRolePropertyValue("VisibleButtonGenerateFileContract");


                    $scope.$watch("contract.refresh", function () {
                        //console.log('contract.refresh');
                        //console.log($scope.isactive);
                        $scope.loadContractParameter();
                    });

                    $scope.loadProduct = function () {
                        $scope.processing['loadProduct'] = true;
                        $scope.message = "обновление списка продуктов";

                        //console.log('внимание! изменить адрес!!');
                        var data = {
                            idOffice: Office.GetOfficeId(),
                            idProductType: 9
                        }
                        productService
                            .getProduct(data)
                            .then(function (result) {
                                //console.log(result.data);
                                angular.copy(result.data, $scope.products);
                                $scope.processing['loadProduct'] = false;

                                $scope.loadContractParameter();
                            },
                            function () {
                                $scope.processing['loadProduct'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки списка продуктов' });
                            });
                    }

                    $scope.loadProduct();


                    $scope.loadContractParameter = function () {

                        //console.log('$scope.loadContractParameter');
                        $scope.сontractParameterVisible = false;
                        $scope.VisibleButtonAddContractParameter = false;

                        $scope.processing['loadContractParameter'] = true;
                        $scope.message = "обновление данных о продукте";

                        contractParameterService
                            .getContractParameter($scope.contract.id)
                                .then(function (result) {
                                    angular.copy(result.data, $scope.contractparameters);
                                    console.log($scope.contractparameters);
                                    if ($scope.contractparameters.length != 0) {

                                        $scope.contractParameterVisible = true;
                                    

                                        if ($scope.contractparameters.length == 1) {
                                            //console.log('можно проверять кнопку редактирования , так как $scope.contractparameters.length == 1');
                                            $scope.loadContractIssue();
                                        }

                                        $scope.canProlongation();
                                    }
                                    else {
                                        $scope.formEditContractParameter = true;
                                        $scope.VisibleButtonEditSumContractParameter = true;
                                        $scope.VisibleButtonEditContractParameter = true;
                                        $scope.VisibleButtonAddContractParameter = true;
                                    }

                                    $scope.processing['loadContractParameter'] = false;
                                },
                                function () {
                                    $scope.processing['loadContractParameter'] = false;
                                    $scope.messages.push({ color: 'red', message: 'ошибка загрузки данных о продукте' });
                                });
                    }

                    $scope.getContractParameterInfo = function (item) {

                        $scope.processing['getContractParameterInfo'] = true;
                        $scope.message = "загрузка данных о параметрах займа";

                        contractParameterService
                            .getContractParameterInfo(item.id)
                                .then(function (result) {
                                    console.log(result);
                                    item.contractParameterInfo = {};
                                    angular.copy(result.data, item.contractParameterInfo);
                                    console.log(item.contractParameterInfo);
                                    $scope.processing['getContractParameterInfo'] = false;
                                },
                                function () {
                                    $scope.processing['getContractParameterInfo'] = false;
                                    $scope.messages.push({ color: 'red', message: 'ошибка загрузки данных о параметрах займа' });
                                });
                    }


                    $scope.initContractParameter = function () {

                        var cP = $scope.contractparameters[0];
                        //console.log('initContractParameter');
                        //console.log(cP);

                        //var first = products[0]; // поиск по idProduct
                        var first = null;
                        first = _.find($scope.products, function (doc) {
                            return doc.id == cP.id_Product;
                        });
                        //console.log($scope.products);
                        //console.log('найден продукт');
                        //console.log(first);

                        if (_.isNil(first)) {

                            $scope.messages.push({ color: 'red', message: 'продукт в карточке устарел и был удален из системы! выберите новый продукт!' });

                            //$scope.VisibleButtonEditSumNONContractParameter = true;
                            //$scope.VisibleButtonEditSumContractParameter = true;
                            //return;
                        } // вывести сообщение что продукт устаревший

                        $scope.selected = first;

                        $scope.contractParameter = {
                            id: cP.id,
                            sum: cP.sum,
                            periodCount: cP.periodCount
                        }

                        // обязательно запомнить текущую сумму - для проверки на повышение
                        $scope.sumCurrent = cP.sum;

                        if (!_.isNil(first)) {
                            $scope.selectproduct = {
                                idProduct: first.id,
                                minSpan: first.minSpan,
                                maxSpan: first.maxSpan,
                                minSum: first.minSum,
                                maxSum: first.maxSum,
                                periodName: 'дней (или месяцев)'
                            };
                        }

                        if (!$scope.VisibleButtonEditContractParameter &&
                            $scope.VisibleButtonEditSumContractParameter) {

                            $scope.selectproduct.maxSum = cP.sum;
                            _.each($scope.products, function (item) { item.maxSum = cP.sum; });
                        }

                        if (cP.sum == $scope.selectproduct.minSum &&
                            $scope.VisibleButtonEditSumContractParameter &&
                            !$scope.VisibleButtonEditContractParameter) {
                            // невозможно изменить сумму в меньшую сторону - так как она уже минимальна
                            $scope.VisibleButtonEditSumNONContractParameter = true;
                            $scope.VisibleButtonEditSumContractParameter = false;
                        }
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
                                        Contract.Init(result.data.id, result.data.number, result.data.owner, new Date(result.data.dateCreate), result.data.lastStatus)

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

                    //$scope.loadContractInfo();
                    //$scope.getContractRecalcInfo();

                    // получить последний статус и признак есть ли расходник
                    $scope.loadContractIssue = function () {
                        $scope.processing['loadContractIssue'] = true;
                        $scope.message = "получение статуса займа";

                        contractService
                            .getContractIssue($scope.contract.id)
                                .then(function (result) {
                                    $scope.processing['loadContractIssue'] = false;
                                    //console.log('loadContractIssue');
                                    $scope.isContractIssue = result.data;
                                    console.log($scope.isContractIssue);

                                    // если есть расходник - то НИЧТО НЕЛЬЗЯ МЕНЯТЬ
                                    if (!$scope.isContractIssue) {
                                        console.log('access edit product');
                                        $scope.loadContractCodeLastStatus();
                                    }
                                    else {
                                        //console.log('dont access edit product');
                                    }
                                },
                                function () {
                                    $scope.processing['loadContractIssue'] = false;
                                });
                    }

                    $scope.loadContractIssue();

                    $scope.loadContractCodeLastStatus = function () {
                        $scope.processing['loadContractCodeLastStatus'] = true;
                        $scope.message = "получение кода статуса займа";

                        contractStatusService
                            .getContractCodeLastStatus($scope.contract.id)
                                .then(function (result) {
                                    //console.log('loadContractCodeLastStatus');
                                    $scope.contractCodeLastStatus = result.data;
                                    //console.log($scope.contractCodeLastStatus);
                                    $scope.processing['loadContractCodeLastStatus'] = false;

                                    if ($scope.contractCodeLastStatus == -1) {
                                        return;
                                    }

                                    // если расходника нет то проверяю 
                                    // если статус в обработке(5), ободрена(2) или на корректировке(16) - то доступны все поля для редактирования
                                    if ($scope.contractCodeLastStatus == 5
                                        || $scope.contractCodeLastStatus == 2
                                        || $scope.contractCodeLastStatus == 16) {

                                        //console.log('доступно редактирование всего продукта');
                                        $scope.VisibleButtonEditContractParameter = true;
                                        $scope.VisibleButtonEditSumContractParameter = true;
                                    }
                                    else if ($scope.contractCodeLastStatus == 15 // закрыт
                                            || $scope.contractCodeLastStatus == 3 // отказано
                                            || $scope.contractCodeLastStatus == 11) { // архив

                                        //console.log('не доступно редактирование продукта');
                                        $scope.VisibleButtonEditContractParameter = false;
                                        $scope.VisibleButtonEditSumContractParameter = false;
                                    }
                                        // если другой какой либо статус то тогда доступно только сумма
                                    else {
                                        //console.log('доступно редактирование только суммы');
                                        $scope.VisibleButtonEditSumContractParameter = true;
                                    }

                                    $scope.initContractParameter();

                                    if ($scope.VisibleButtonEditContractParameter || $scope.VisibleButtonEditSumContractParameter) {
                                        $scope.btnEditContractParameter = true;
                                    }
                                },
                                function () {
                                    $scope.processing['loadContractCodeLastStatus'] = false;
                                });
                    }

                    $scope.canProlongation = function () {
                        $scope.processing['canProlongation'] = true;
                        $scope.message = "обновление пролонгации";
                        //console.log('обновление пролонгации');

                        contractParameterService
                            .canProlongation($scope.contract.id)
                                .then(function (result) {
                                    $scope.addProlongationVisible = result.data;
                                    $scope.processing['canProlongation'] = false;

                                    //console.log('addProlongationVisible');
                                    //console.log($scope.addProlongationVisible);
                                },
                                function () {
                                    $scope.processing['canProlongation'] = false;
                                });
                    }

                    $scope.canRestructuring = function () {
                        $scope.processing['canRestructuring'] = true;
                        $scope.message = "обновление реструктуризации";

                        contractParameterService
                            .canRestructuring($scope.contract.id)
                                .then(function (result) {
                                    $scope.addRestructuringVisible = result.data;
                                    $scope.processing['canRestructuring'] = false;

                                    $scope.refresh = angular.identity();
                                },
                                function () {
                                    $scope.processing['canRestructuring'] = false;
                                });
                    }
                    //$scope.canRestructuring();

                

                    $scope.editContractParameter = function () {
                        $scope.initContractParameter();
                    }             

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
                    //$scope.getSchedule();

                    $scope.getContractRecalcInfo = function () {

                        $scope.processing['getContractRecalcInfo'] = true;
                        $scope.message = "обновление сведений о займе";
                        $scope.formContractLoanInfoVisible = false;
                        var data = {
                            idContract: $scope.contract.id,
                            dateNow: new Date().toDateString()
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

                    $scope.addEearlyRepayment = function (idFormula) {

                        $scope.processing['addEearlyRepayment'] = true;
                        $scope.message = "досрочное погашение";

                        var data = {
                            idContract: $scope.contract.id,
                            idFormula: idFormula,
                            idOffice: Office.GetOfficeId()
                        }

                        //console.log('sssssssssss');
                        //console.log(data);

                        contractParameterService
                            .addEearlyRepayment(data)
                            .then(function (result) {
                                $scope.processing['addEearlyRepayment'] = false;
                                //angular.copy(result.data, $scope.contractRecalcInfo);
                                //angular.copy($scope.contractRecalcInfo.сontractinfo, $scope.contractLoanInfo);
                                //$scope.formContractLoanInfoVisible = true;
                                //console.log($scope.contractRecalcInfo);
                                //$scope.messages.length = 0;
                                //angular.copy(result.data, $scope.messages);
                                //console.log($scope.messages);

                                $scope.loadContractInfo();
                                $scope.getContractRecalcInfo();
                                $scope.getSchedule();
                                $scope.loadContractParameter();

                            }, function () {
                                $scope.processing['addEearlyRepayment'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка досрочного погашения' });
                            });
                    }

                

                    // событие изменения выбора продукта
                    $scope.contractparameterTypeChanged = function (item) {
                        $scope.selectproduct.idProduct = item.id;
                        $scope.selectproduct.minSpan = item.minSpan;
                        $scope.selectproduct.maxSpan = item.maxSpan;
                        $scope.selectproduct.minSum = item.minSum;
                        $scope.selectproduct.maxSum = item.maxSum;
                        $scope.selectproduct.periodName = item.periodName;

                        $scope.contractParameter.periodCount = item.minSpan;
                    }

                

                    $scope.addContractParameter = function () {

                        if ($scope.contractParameter.sum > $scope.selectproduct.maxSum) {
                            $scope.messages.push({ color: 'red', message: 'вы не можете устанавливать сумму больше максимальной!' });
                            return;
                        }

                        if ($scope.contractParameter.sum < $scope.selectproduct.mixSum) {
                            $scope.messages.push({ color: 'red', message: 'вы не можете устанавливать сумму меньше минимальной!' });
                            return;
                        }

                        var data = {
                            id: $scope.contractParameter.id,
                            idContract: $scope.contract.id,
                            idOffice: $scope.office.id,
                            idProduct: $scope.selectproduct.idProduct,
                            periodCount: $scope.contractParameter.periodCount,
                            sum: $scope.contractParameter.sum,
                            periodProlongation: 0
                        };
                        //console.log(data);

                        //return;

                        $scope.processing['addContractParameter'] = true;
                        $scope.message = "обновление сведений о займе на сервере";

                        $scope.addContractParameterVisible = false;
                        $scope.formSchedulePaymentVisible = false;

                        $scope.init();

                        contractParameterService
                            .addContractParameter(data)
                            .then(function (result) {
                                //console.log('addContractParameter');
                                //console.log(result.data);
                                //angular.copy(result.data, $scope.messages);

                                $scope.contract.refresh = $scope.getRandomSpan();

                                $scope.processing['addContractParameter'] = false;
                                $scope.loadContractParameter();
                            },
                            function () {
                                $scope.processing['addContractParameter'] = false;
                                $scope.addContractParameterVisible = true;
                                $scope.messages.push({ color: 'red', message: 'ошибка сохранения продукта на сервере' });
                            });
                    }

                    $scope.getRandomSpan = function(){
                        return Math.floor((Math.random()*6)+1);
                    }

                    $scope.addProlongation = function () {
                        $scope.addProlongationVisible = false;

                        $scope.processing['addProlongation'] = true;
                        $scope.message = "сохранение пролонгации";

                        var data = {
                            id: 0,
                            idContract: $scope.contract.id,
                            idOffice: $scope.office.id,
                            periodProlongation: 30 //$scope.contractParameter.periodProlongation
                        };

                        contractParameterService
                            .addProlongation(data)
                            .then(function (result) {

                                angular.copy(result.data, $scope.messages);
                                //console.log('$scope.messages');
                                //console.log($scope.messages);

                                $scope.processing['addProlongation'] = false;
                                $scope.loadContractParameter();
                                $scope.addProlongationVisible = true;
                            },
                            function () {
                                $scope.processing['addProlongation'] = false;
                                $scope.addProlongationVisible = true;
                                $scope.messages.push({ color: 'red', message: 'ошибка сохранения пролонгации' });
                            });
                    }

                    $scope.addRestructuring = function () {
                        $scope.addRestructuringVisible = false;

                        $scope.processing['addRestructuring'] = true;
                        $scope.message = "сохранение реструктуризации";

                        var data = {
                            id: 0,
                            idContract: $scope.contract.id,
                            idOffice: $scope.office.id,
                            periodRestructuring: $scope.contractParameter.periodRestructuring
                        };

                        contractParameterService
                            .addRestructuring(data)
                            .then(function (result) {

                                angular.copy(result.data, $scope.messages);

                                $scope.processing['addRestructuring'] = false;
                                $scope.loadContractParameter();
                                $scope.addRestructuringVisible = true;
                            },
                            function () {
                                $scope.processing['addRestructuring'] = false;
                                $scope.addRestructuringVisible = true;
                                $scope.messages.push({ color: 'red', message: 'ошибка сохранения реструктуризации' });
                            });
                    }


                    $scope.totalInterestF = function () {
                        var total = 0;
                        for (var i = 0; i < $scope.schedule_temp.length; i++) {
                            var product = $scope.schedule_temp[i];
                            total += product.sumInterest;
                        }
                        return total; //Math.round(total * 100) / 100;
                    }
                    $scope.totalNdflF = function () {
                        var total = 0;
                        for (var i = 0; i < $scope.schedule_temp.length; i++) {
                            var product = $scope.schedule_temp[i];
                            total += product.ndfl;
                        }
                        return total; //Math.round(total * 100) / 100;
                    }
                    $scope.totalAllF = function () {
                        var total = 0;
                        for (var i = 0; i < $scope.schedule_temp.length; i++) {
                            var product = $scope.schedule_temp[i];
                            total += product.sumInterest - product.ndfl;
                        }
                        return total; //Math.round(total * 100) / 100;
                    }

                    $scope.generateSchedule = function () {

                        $scope.formSchedulePaymentVisible = false;
                        $scope.processing['generateSchedule'] = true;
                        $scope.message = "обновление графика платежей на сервере";

                        var data = {
                            id: 0,
                            idOffice: $scope.office.id,
                            idProduct: $scope.selectproduct.idProduct,
                            periodCount: $scope.contractParameter.periodCount,
                            sum: $scope.contractParameter.sum,
                        };

                        $scope.totalInterest = 0;
                        $scope.totalNdfl = 0;
                        $scope.totalAll = 0;

                        //console.log(data);
                        contractParameterService
                            .getGenerateSchedule(data)
                            .then(function (result) {
                                angular.copy(result.data, $scope.schedule_temp);

                                $scope.totalInterest = $scope.totalInterestF();
                                $scope.totalNdfl = $scope.totalNdflF();
                                $scope.totalAll = $scope.totalAllF();

                                $scope.formSchedulePaymentVisible = true;
                                $scope.addContractParameterVisible = true;

                                $scope.processing['generateSchedule'] = false;
                            },
                            function () {
                                $scope.formSchedulePaymentVisible = false;
                                $scope.addContractParameterVisible = false;

                                $scope.processing['generateSchedule'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка генерации графика на сервере' });
                            });
                    }
                }])
        }
    })

}