export default (ngModule) => {

    ngModule.directive('myContractparameter', function () {
        return {
            restrict: 'E',
            replace: false,
            template: require('./ContractParameter.html'),
            scope: {
                contract: '=',
                office: '='
            },
            controolerAs: 'vm',
            controller: (['$scope', '$filter', 'Profile', 'Guid', 'contractParameterService', 'productService',
                'reportService', 'contractService', 'contractStatusService', 'Office', 'Contract', 'personFileService', '$routeParams', 'officeService',
                function (vm, $filter, Profile, Guid, contractParameterService, productService, reportService, contractService, contractStatusService, Office, Contract, personFileService, $routeParams, officeService) {


                    vm.processing = {};
                    vm.message = "";
                    vm.messages = [];
                    vm.schedule = [];
                    vm.contractRecalcInfo = {};

                    vm.contractParameter = {
                        id: 0,
                        idContract: vm.contract.id || $routeParams.par,
                        sum: 1000,
                        periodCount: 1,
                        periodProlongation: 0,
                        periodRestructuring: 3
                    }

                    // выбранный продукт
                    vm.selectproduct = {
                        idProduct: 0,
                        minSpan: 0,
                        maxSpan: 0,
                        minSum: 0,
                        maxSum: 0,
                        periodName: 'дней (или месяцев)'
                    };

                    vm.contractparameters = [];
                    vm.products = [];

                    vm.schedule_temp = [];

                    (vm.init = function () {
                        console.log('vm.init');
                        vm.btnEditContractParameter = false;
                        vm.isContractIssue = false;
                        vm.contractCodeLastStatus = -1;
                        vm.addProlongationVisible = false;
                        vm.VisibleButtonAddContractParameter = false;
                        vm.VisibleButtonEditContractParameter = false;
                        vm.VisibleButtonEditSumContractParameter = false;
                        vm.VisibleButtonEditSumNONContractParameter = false;
                        vm.addRestructuringVisible = false;
                        vm.deleteContractParameterVisible = false;
                        vm.сontractParameterVisible = false;
                        vm.VisibleButtonAddContractParameter = false;
                        vm.addContractParameterVisible = false;
                        vm.formSchedulePaymentVisible = false;
                        vm.sumCurrent = -1;
                    })()

                    vm.VisibleButtonAddProlongation = Profile.GetRolePropertyValue("VisibleButtonAddProlongation");
                    vm.VisibleButtonAddRestructuring = Profile.GetRolePropertyValue("VisibleButtonAddRestructuring");

                    vm.initContractParameter = function () {
                        console.log('vm.initContractParameter');
                        if (vm.contractparameters.length > 0) {
                            var cP = vm.contractparameters[vm.contractparameters.length-1];
                            console.log(cP.id_Product);
                            //console.log(vm.products);
                            let first = _.findIndex(vm.products, {
                                id: cP.id_Product
                            });
                            console.log(first, vm.products);
                            if (first < 0) {
                                vm.messages.push({ color: 'red', message: 'продукт в карточке устарел и был удален из системы! выберите новый продукт!' });
                            } // вывести сообщение что продукт устаревший

                            vm.selected = first;

                            vm.contractParameter = {
                                id: cP.id,
                                sum: cP.sum,
                                periodCount: cP.periodCount
                            }

                            // обязательно запомнить текущую сумму - для проверки на повышение
                            vm.sumCurrent = cP.sum;

                            if (!_.isNil(first)) {
                                vm.selectproduct = {
                                    idProduct: first.id,
                                    minSpan: first.minSpan,
                                    maxSpan: first.maxSpan,
                                    minSum: first.minSum,
                                    maxSum: first.maxSum,
                                    periodName: 'дней (или месяцев)'
                                };
                            }

                            if (!vm.VisibleButtonEditContractParameter &&
                                vm.VisibleButtonEditSumContractParameter) {

                                vm.selectproduct.maxSum = cP.sum;
                                _.each(vm.products, function (item) { item.maxSum = cP.sum; });
                            }

                            if (cP.sum == vm.selectproduct.minSum &&
                                vm.VisibleButtonEditSumContractParameter &&
                                !vm.VisibleButtonEditContractParameter) {
                                // невозможно изменить сумму в меньшую сторону - так как она уже минимальна
                                vm.VisibleButtonEditSumNONContractParameter = true;
                                vm.VisibleButtonEditSumContractParameter = false;
                            }
                        }
                    
                    }

                    vm.loadProduct = function () {
                        console.log('vm.loadProduct');
                        vm.processing['loadProduct'] = true;
                        vm.message = "обновление списка продуктов";
                        officeService.getCurrentOffice()
                         .then(function (result) {
                             var data = {
                                 idOffice: result.data.id_Office,
                                 idProductType: 0
                             }
                             productService
                                 .getProduct(data)
                                 .then(function (result) {
                                     vm.products = result.data;
                                     vm.processing['loadProduct'] = false;
                                     console.log('products loaded');
                                     vm.initContractParameter();
                                 },
                                 function () {
                                     vm.processing['loadProduct'] = false;
                                     vm.messages.push({ color: 'red', message: 'ошибка загрузки списка продуктов' });
                                 });
                         })
                    
                    }

                    vm.loadProduct();

                    vm.loadContractParameter = function () {

                        //console.log('vm.loadContractParameter');
                        vm.сontractParameterVisible = false;
                        vm.VisibleButtonAddContractParameter = false;

                        vm.processing['loadContractParameter'] = true;
                        vm.message = "обновление данных о продукте";

                        contractParameterService
                            .getContractParameter(vm.contract.id)
                                .then(function (result) {
                                    angular.copy(result.data, vm.contractparameters);
                                    if (vm.contractparameters.length != 0) {

                                        vm.contractParameterVisible = true;

                                        if (vm.contractparameters.length == 1) {
                                            //console.log('можно проверять кнопку редактирования , так как vm.contractparameters.length == 1');
                                            vm.loadContractIssue();
                                        }

                                        vm.canProlongation();
                                    }
                                    else {
                                        vm.formEditContractParameter = true;
                                        vm.VisibleButtonEditSumContractParameter = true;
                                        vm.VisibleButtonEditContractParameter = true;
                                        vm.VisibleButtonAddContractParameter = true;
                                    }

                                    vm.processing['loadContractParameter'] = false;
                                },
                                function () {
                                    vm.processing['loadContractParameter'] = false;
                                    vm.messages.push({ color: 'red', message: 'ошибка загрузки данных о продукте' });
                                });
                    }

                    vm.loadContractParameter();

                

                    vm.editContractParameter = function () {
                        console.log('vm.editContractParameter');
                        vm.initContractParameter();
                    }

                    vm.getSchedule = function () {
                        vm.processing['loadSchedule'] = true;
                        vm.message = "обновление графика платежей";

                        contractParameterService
                            .getSchedule(vm.contract.id)
                            .then(function (result) {
                                angular.copy(result.data, vm.schedule);
                                vm.processing['loadSchedule'] = false;
                            }, function () {
                                vm.processing['loadSchedule'] = false;
                                vm.messages.push({ color: 'red', message: 'ошибка получения графика платежей' });
                            });
                    }
                    vm.getSchedule();

                    vm.getContractRecalcInfo = function () {

                        vm.processing['getContractRecalcInfo'] = true;
                        vm.message = "обновление сведений о займе";
                        vm.formContractLoanInfoVisible = false;
                        var data = {
                            idContract: vm.contract.id,
                            dateNow: new Date().toDateString()
                        }

                        contractService
                            .getContractRecalcInfo(data)
                            .then(function (result) {
                                vm.processing['getContractRecalcInfo'] = false;
                                angular.copy(result.data, vm.contractRecalcInfo);
                                vm.contractLoanInfo = result.data.сontractinfo;
                                vm.formContractLoanInfoVisible = true;

                            }, function () {
                                vm.processing['getContractRecalcInfo'] = false;
                                vm.messages.push({ color: 'red', message: 'ошибка получения сведений о займе' });
                            });
                    }

                    vm.addEearlyRepayment = function (idFormula) {

                        vm.processing['addEearlyRepayment'] = true;
                        vm.message = "досрочное погашение";

                        var data = {
                            idContract: vm.contract.id,
                            idFormula: idFormula,
                            idOffice: Office.GetOfficeId() || vm.office
                        }

                        contractParameterService
                            .addEearlyRepayment(data)
                            .then(function (result) {
                                vm.processing['addEearlyRepayment'] = false;

                                vm.loadContractInfo();
                                vm.getContractRecalcInfo();
                                vm.getSchedule();
                                vm.loadContractParameter();

                            }, function () {
                                vm.processing['addEearlyRepayment'] = false;
                                vm.messages.push({ color: 'red', message: 'ошибка досрочного погашения' });
                            });
                    }

                    vm.loadContractInfo = function () {

                        vm.processing['loadContractInfo'] = true;
                        vm.message = "обновление информации о карточке";

                        contractService
                            .readContract(vm.contract.id)
                                .then(function (result) {

                                    vm.isLoadContractInfo = _.isNil(result.data);
                                    if (!vm.isLoadContractInfo) {
                                        Contract.Init(result.data.id, result.data.number, result.data.owner, result.data.dateCreate, result.data.lastStatus)

                                        //vm.contract.id = Contract.GetContractId();
                                        vm.contract.number = Contract.GetContractNumber();
                                        vm.contract.owner = Contract.GetContractOwner();
                                        vm.contract.dateCreate = Contract.GetContractDateCreate();
                                        vm.contract.lastStatus = Contract.GetContractLastStatus();
                                    }
                                    vm.processing['loadContractInfo'] = false;
                                },
                                function () {
                                    vm.processing['loadContractInfo'] = false;
                                    vm.messages.push({ color: 'red', message: 'ошибка загрузки информации о карточке' });
                                });
                    }

                    vm.loadContractInfo();
                    vm.getContractRecalcInfo();

                    // получить последний статус и признак есть ли расходник
                    vm.loadContractIssue = function () {
                        vm.processing['loadContractIssue'] = true;
                        vm.message = "получение статуса займа";

                        contractService
                            .getContractIssue(vm.contract.id)
                                .then(function (result) {
                                    vm.processing['loadContractIssue'] = false;
                                    //console.log('loadContractIssue');
                                    vm.isContractIssue = result.data;
                                    //console.log(vm.isContractIssue);

                                    // если есть расходник - то НИЧТО НЕЛЬЗЯ МЕНЯТЬ
                                    if (vm.isContractIssue == 'false') {
                                        //console.log('access edit product');
                                        vm.loadContractCodeLastStatus();
                                    }
                                    else {
                                        //console.log('dont access edit product');
                                    }
                                },
                                function () {
                                    vm.processing['loadContractIssue'] = false;
                                });
                    }

                    vm.loadContractCodeLastStatus = function () {
                        vm.processing['loadContractCodeLastStatus'] = true;
                        vm.message = "получение кода статуса займа";

                        contractStatusService
                            .getContractCodeLastStatus(vm.contract.id)
                                .then(function (result) {
                                    //console.log('loadContractCodeLastStatus');
                                    vm.contractCodeLastStatus = result.data;
                                    console.log(vm.contractCodeLastStatus);
                                    vm.processing['loadContractCodeLastStatus'] = false;

                                    if (vm.contractCodeLastStatus == -1) {
                                        return;
                                    }

                                    // если расходника нет то проверяю 
                                    // если статус в обработке(5), ободрена(2) или на корректировке(16) - то доступны все поля для редактирования
                                    if (vm.contractCodeLastStatus == 5
                                        || vm.contractCodeLastStatus == 2
                                        || vm.contractCodeLastStatus == 16) {

                                        //console.log('доступно редактирование всего продукта');
                                        vm.VisibleButtonEditContractParameter = true;
                                        vm.VisibleButtonEditSumContractParameter = true;
                                    }
                                    else if (vm.contractCodeLastStatus == 15 // закрыт
                                            || vm.contractCodeLastStatus == 3 // отказано
                                            || vm.contractCodeLastStatus == 8 // согласовано
                                            || vm.contractCodeLastStatus == 11) { // архив

                                        //console.log('не доступно редактирование продукта');
                                        vm.VisibleButtonEditContractParameter = false;
                                        vm.VisibleButtonEditSumContractParameter = false;
                                    }
                                        // если другой какой либо статус то тогда доступно только сумма
                                    else {
                                        //console.log('доступно редактирование только суммы');
                                        vm.VisibleButtonEditSumContractParameter = true;
                                    }

                                    //vm.initContractParameter();

                                    if (vm.VisibleButtonEditContractParameter || vm.VisibleButtonEditSumContractParameter) {
                                        vm.btnEditContractParameter = true;
                                    }
                                },
                                function () {
                                    vm.processing['loadContractCodeLastStatus'] = false;
                                });
                    }()

                    vm.canProlongation = function () {
                        vm.processing['canProlongation'] = true;
                        vm.message = "обновление пролонгации";
                        //console.log('обновление пролонгации');

                        contractParameterService
                            .canProlongation(vm.contract.id)
                                .then(function (result) {
                                    vm.addProlongationVisible = result.data;
                                    vm.processing['canProlongation'] = false;
                                    //console.log(vm.contract.id);

                                    //////////////// [21.10.2016] убрана проверка на наличие конкактного телефона по просьбе Хусаиновой для продукта Займ Классический
                                    if (vm.contractparameters[0]['id_Product'] == 86 || vm.contractparameters[0]['id_Product'] == 85 || vm.contractparameters[0]['id_Product'] == 82) {
                                        vm.addProlongationVisible = true;
                                    }
                                    //console.log(vm.addProlongationVisible);
                                },
                                function () {
                                    vm.processing['canProlongation'] = false;
                                });
                    }

                    vm.canRestructuring = function () {
                        vm.processing['canRestructuring'] = true;
                        vm.message = "обновление реструктуризации";

                        contractParameterService
                            .canRestructuring(vm.contract.id)
                                .then(function (result) {
                                    vm.addRestructuringVisible = result.data;
                                    vm.processing['canRestructuring'] = false;

                                    vm.refresh = angular.identity();
                                },
                                function () {
                                    vm.processing['canRestructuring'] = false;
                                });
                    }
                    //vm.canRestructuring();

                    // событие изменения выбора продукта
                    vm.contractparameterTypeChanged = function (item) {
                        vm.selectproduct.idProduct = item.id;
                        vm.selectproduct.minSpan = item.minSpan;
                        vm.selectproduct.maxSpan = item.maxSpan;
                        vm.selectproduct.minSum = item.minSum;
                        vm.selectproduct.maxSum = item.maxSum;
                        vm.selectproduct.periodName = item.periodName;

                        vm.contractParameter.periodCount = item.minSpan;
                    }

                

                    vm.getContractParameterInfo = function (item) {

                        vm.processing['getContractParameterInfo'] = true;
                        vm.message = "загрузка данных о параметрах займа";

                        contractParameterService
                            .getContractParameterInfo(item.id)
                                .then(function (result) {
                                    item.contractParameterInfo = {};
                                    angular.copy(result.data, item.contractParameterInfo);
                                    //console.log(item.contractParameterInfo);
                                    vm.processing['getContractParameterInfo'] = false;
                                },
                                function () {
                                    vm.processing['getContractParameterInfo'] = false;
                                    vm.messages.push({ color: 'red', message: 'ошибка загрузки данных о параметрах займа' });
                                });
                    }

                    vm.addContractParameter = function () {

                        if (vm.contractParameter.sum > vm.selectproduct.maxSum) {
                            vm.messages.push({ color: 'red', message: 'вы не можете устанавливать сумму больше максимальной!' });
                            return;
                        }

                        if (vm.contractParameter.sum < vm.selectproduct.mixSum) {
                            vm.messages.push({ color: 'red', message: 'вы не можете устанавливать сумму меньше минимальной!' });
                            return;
                        }

                        var data = {
                            id: vm.contractParameter.id,
                            idContract: vm.contract.id,
                            idOffice: vm.office.id,
                            idProduct: vm.selectproduct.idProduct,
                            periodCount: vm.contractParameter.periodCount,
                            sum: vm.contractParameter.sum,
                            periodProlongation: 0
                        };
                        //console.log(data);

                        //return;

                        vm.processing['addContractParameter'] = true;
                        vm.message = "обновление сведений о займе на сервере";

                        vm.addContractParameterVisible = false;
                        vm.formSchedulePaymentVisible = false;

                        vm.init();

                        contractParameterService
                            .addContractParameter(data)
                            .then(function (result) {
                                //angular.copy(result.data, vm.messages);s
                                vm.processing['addContractParameter'] = false;
                                vm.loadContractParameter();
                            },
                            function () {
                                vm.processing['addContractParameter'] = false;
                                vm.addContractParameterVisible = true;
                                vm.messages.push({ color: 'red', message: 'ошибка сохранения продукта на сервере' });
                            });
                    }

                    vm.addProlongation = function () {
                        vm.addProlongationVisible = false;

                        vm.processing['addProlongation'] = true;
                        vm.message = "сохранение пролонгации";

                        var data = {
                            id: 0,
                            idContract: vm.contract.id,
                            idOffice: vm.office.id,
                            periodProlongation: 30 //vm.contractParameter.periodProlongation
                        };

                        contractParameterService
                            .addProlongation(data)
                            .then(function (result) {

                                angular.copy(result.data, vm.messages);
                                //console.log('vm.messages');
                                //console.log(vm.messages);

                                vm.processing['addProlongation'] = false;
                                vm.loadContractParameter();
                                vm.addProlongationVisible = true;
                            },
                            function () {
                                vm.processing['addProlongation'] = false;
                                vm.addProlongationVisible = true;
                                vm.messages.push({ color: 'red', message: 'ошибка сохранения пролонгации' });
                            });
                    }

                    vm.addRestructuring = function () {
                        vm.addRestructuringVisible = false;

                        vm.processing['addRestructuring'] = true;
                        vm.message = "сохранение реструктуризации";

                        var data = {
                            id: 0,
                            idContract: vm.contract.id,
                            idOffice: vm.office.id,
                            periodRestructuring: vm.contractParameter.periodRestructuring
                        };

                        contractParameterService
                            .addRestructuring(data)
                            .then(function (result) {

                                angular.copy(result.data, vm.messages);

                                vm.processing['addRestructuring'] = false;
                                vm.loadContractParameter();
                                vm.addRestructuringVisible = true;
                            },
                            function () {
                                vm.processing['addRestructuring'] = false;
                                vm.addRestructuringVisible = true;
                                vm.messages.push({ color: 'red', message: 'ошибка сохранения реструктуризации' });
                            });
                    }

                

                    vm.generateSchedule = function () {

                        vm.formSchedulePaymentVisible = false;
                        vm.processing['generateSchedule'] = true;
                        vm.message = "обновление графика платежей на сервере";

                        var data = {
                            id: 0,
                            idOffice: vm.office.id,
                            idProduct: vm.selectproduct.idProduct,
                            periodCount: vm.contractParameter.periodCount,
                            sum: vm.contractParameter.sum,
                        };

                        //console.log(data);
                        contractParameterService
                            .getGenerateSchedule(data)
                            .then(function (result) {
                                angular.copy(result.data, vm.schedule_temp);

                                vm.formSchedulePaymentVisible = true;
                                vm.addContractParameterVisible = true;

                                vm.processing['generateSchedule'] = false;
                            },
                            function () {
                                vm.formSchedulePaymentVisible = false;
                                vm.addContractParameterVisible = false;

                                vm.processing['generateSchedule'] = false;
                                vm.messages.push({ color: 'red', message: 'ошибка генерации графика на сервере' });
                            });
                    }
                }])
        }
    })
}