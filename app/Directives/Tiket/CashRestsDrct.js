'use strict';

appMain.directive('myCashRests', function () {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: '/Ticket/CashRests',
        scope: {},
        controller: (['$scope', 'ticketService', 'Office', '$filter',
            function ($scope, ticketService, Office, $filter) {
                
                $scope.restsDate = new Date(); //$filter("date")(Date.now(), 'yyyy-MM-dd'); // текущая дата;
                
                $scope.regExpr = [];
                $scope.regExpr['money'] = new RegExp('^\\d+\.?(\\d*)?$'); // формат (N).NN

                $scope.rests = {};
                $scope.processing = [];
                $scope.serverMessages = [];
                $scope.serverMessages.length = 0;
                $scope.message='';

                //собирает данные об остатке на точке на отправку
                $scope.getDataFromItem = function (item, isPrepare) {

                    if (isPrepare) {
                        item.sum_CashRestMorning = item.sum_CashRestMorning.toString().replace(',', '.');
                    }
                    return {
                        idCashRest: item.idCashRest,
                        idOfficeRest: item.idOfficeRest,
                        dateRest: item.dateRest,
                        sumRest: item.sum_CashRestMorning
                    };
                }
                // для загрузки и полного пересчета
                $scope.getDataForAll = function() {
                    return {
                        dateRest: $scope.restsDate,
                        idOffice: Office.GetOfficeId(),
                        idOfficeRest: null
                    };
                }

                $scope.dateChecker = function(checkDate)
                {   
                    if (checkDate == "" || angular.isUndefinedOrNull(checkDate)) {                        
                        return false;
                    }
                    else {
                        return true;
                    }
                }

                //грузим с сервера данные
                $scope.loadCashRests = function () {
                    if (!angular.isUndefinedOrNull($scope.restsDate)) {
                        var data = $scope.getDataForAll();

                        $scope.rests = null;
                        $scope.serverMessages.length = 0;
                        $scope.processing['loadCashRests'] = true;
                        $scope.message = 'Загрузка остатков';
                        ticketService
                            .getCashRests(data)
                            .then(function (result) {
                                $scope.rests = result.data;
                                //console.log($scope.rests);
                                $scope.processing['loadCashRests'] = false;
                            }
                            , function () {
                                $scope.serverMessages.push({color: 'red', message: ('Ошибка получения остатков по кассе за ' + $scope.restsDate)});
                                $scope.processing['loadCashRests'] = false;
                            });
                    }
                };

                //обновляем значение остатка на точке
                $scope.updateCashRest = function (item) {

                    var dataCashRest = $scope.getDataFromItem(item, true);
                    //проверяем на "денежный" формат
                    if (!$scope.regExpr['money'].test(item.sum_CashRestMorning)) {
                        item.sum_CashRestMorning = '';
                        return;
                    }

                    $scope.serverMessages.length = 0;
                    item.updateCashRest = true;
                    item.updateMessage = 'обновление суммы';
                    $scope.message = '';
                    ticketService
                        .updateCashRest(dataCashRest)
                        .then(function (result) {
                            
                            if (result.data.length > 0) {
                                item.dateRest = result.data[0].dateRest;
                                item.idCashRest = result.data[0].idCashRest;
                                item.sum_CashRestMorning = result.data[0].sum_CashRestMorning;
                                item.sum_CashRestEvening = result.data[0].sum_CashRestEvening;
                                item.sum_PKO = result.data[0].sum_PKO;
                                item.sum_RKO = result.data[0].sum_RKO;
                                item.updateCashRest = false;
                                item.editSum_CashRest = !item.editSum_CashRest;
                            }
                            else {
                                item.updateMessage = 'Ошибка загрузки остатка';
                            }
                        }
                        , function () {
                            item.updateMessage = 'Ошибка сохранения остатка';
                            $scope.serverMessages.push({ color: 'red', message: item.updateMessage});
                        });
                }

                $scope.editSum_CashRest = function(item)
                {
                    item.editSum_CashRest = !item.editSum_CashRest;                    
                }

                //пересчет всех остатков
                $scope.recalcCashRestsAll = function()
                {                    
                    if ($scope.dateChecker($scope.restsDate))
                    {
                        var data = $scope.getDataForAll();
                        $scope.message = 'Выполняется пересчет всех остатков с ' + $scope.restsDate;
                        $scope.rests = null;                        
                        $scope.serverMessages.length = 0;
                        $scope.processing['loadCashRests'] = true;
                        //начинаем перерасчет
                        ticketService
                            .recalcCashRestsAll(data)
                            .then(function (result) {
                                //тут же получаем обновленные остатки
                                $scope.rests = result.data;
                                $scope.processing['loadCashRests'] = false;
                            }
                            , function () {
                                $scope.serverMessages.push({ color: 'red', message: 'Ошибка пересчета остатков' });
                                $scope.processing['loadCashRests'] = false;
                            });
                        
                    }
                    else {
                        $scope.serverMessages.length = 0;
                        $scope.serverMessages.push({ color: 'red', message: 'Укажите дату!' });
                    }
                }

                //пересчет конкретного остатка
                $scope.recalcCashRest = function(item)
                {                    
                    var dataCashRest = $scope.getDataFromItem(item, false);                   

                    $scope.serverMessages.length = 0;
                    item.updateCashRest = true;
                    item.updateMessage = 'пересчет';
                    $scope.message = '';
                    ticketService
                        .recalcCashRest(dataCashRest)
                        .then(function (result) {
                            item.updateCashRest = false;
                        }
                        , function () {
                            item.updateMessage = 'Ошибка перерасчета';
                            $scope.serverMessages.push({ color: 'red', message: item.updateMessage });
                        });
                    
                }

                $scope.restsTableVisible = function()
                {
                    if($scope.processing['loadCashRests'])
                        return false;
                    if(angular.isUndefinedOrNull($scope.rests))
                        return false;
                    if(angular.isUndefinedOrNull($scope.rests.length))
                        return false;
                    if($scope.rests.length == 0)
                        return false;

                    return true;
                }


            }])
    }
});