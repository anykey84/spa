export default (ngModule) => {

    ngModule.directive('myTimeControl', [function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./TimeControl.html'),
            scope: {
                isload: '=?'
            },
            controller: (['$scope', 'timeControlService', 'Office', 'Profile',
                function ($scope, timeControlService, Office, Profile) {

                    $scope.messages = [];
                    $scope.message = "";
                    $scope.processing = {};

                    $scope.isFirst = false;
                    $scope.isSecond = false;

                    $scope.isVisible = false;

                    $scope.timecontrols = [];

                    $scope.EnableCheckCashReportOnTimeControl = true; // по умолчанию включаем проверку
                    Profile.GetRolePropertyPromise("EnableCheckCashReportOnTimeControl") // только так, т.к. в этот момент времени роли могут быть не загружены в HomeCtrl
                        .then(function (result) {
                            $scope.EnableCheckCashReportOnTimeControl = result;
                        });
                    // Таким образом можно получить несколько свойств
                    //Profile.LoadRoles()
                    //    .then(function () {
                    //    $scope.EnableCheckCashReportOnTimeControl = Profile.GetRolePropertyValue();
                    //      блаблабла...
                    //});

                    $scope.$watch("isload", function (isload) {
                        if (isload == true) {
                            $scope.getTimeControls();
                            $scope.isVisible = true;
                        }
                    });

                    $scope.addTimeControl = function () {
                        // Сначала грузим ошибки.
                        // если ошибок нет, то отправляем запрос
                        if ($scope.EnableCheckCashReportOnTimeControl) {
                            var timeControlType = $scope.idTimeControlType;

                            loadTimeControlErrors(timeControlType)
                                .then(function (result) {                                
                                    if (!_.isNil(result.data) && result.data !== null) {
                                        if (result.data.length == 0
                                            || (result.data.length == 1 && result.data[0].isToday == 1 && timeControlType == 1)) { // если нет отчета только за сегодня, а юзер хочет зайти в прогу
                                            $scope.addTimeControlDirect(); // собсно отправляем
                                        }
                                    };
                                });
                        }
                        else {
                            $scope.addTimeControlDirect();
                        }
                    };

                    $scope.addTimeControlDirect = function () {
                        var data = {
                            idTimeControlType: $scope.idTimeControlType,
                            comment: $scope.comment
                        }

                        //console.log('save_pdp');
                        $scope.processing['load'] = true;
                        $scope.message = "сохранение";

                        timeControlService
                            .addTimeControl(data)
                            .then(function (result) {
                                $scope.processing['load'] = false;
                                //angular.copy($scope.address, $scope.address_old);

                                $scope.comment = '';

                                $scope.getTimeControls();
                            },
                            function () {
                                $scope.processing['load'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка сохранения' });
                            });
                    };

                    $scope.getCurrent = function () {

                        //console.log('save_pdp');
                        $scope.processing['load'] = true;
                        $scope.message = "загрузка";

                        timeControlService
                            .getCurrent()
                            .then(function (result) {
                                $scope.processing['load'] = false;

                                //console.log('asdasdasdasd');
                                //console.log(result.data);

                                var mas = [];
                                angular.copy(result.data, mas);
                                //console.log(mas);

                                var firstMain = _.find(mas, function (p) {
                                    return p.id_TimeControlType == 1;
                                });
                                //console.log(firstMain);

                                if (!_.isNil(firstMain)) {
                                    $scope.isFirst = false;
                                    $scope.isSecond = true;
                                }
                                else {
                                    $scope.isFirst = true;
                                    $scope.isSecond = false;
                                }

                                //var last = _.find(mas, function (p) {
                                //    return p.id_TimeControlType != 1;
                                //});
                                //console.log(last);

                                //angular.copy($scope.address, $scope.address_old);
                            },
                            function () {
                                $scope.processing['load'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                            });
                    };

                    $scope.getTimeControls = function () {

                        $scope.processing['load'] = true;
                        $scope.message = "загрузка";

                        timeControlService
                            .getTimeControls()
                            .then(function (result) {
                                $scope.processing['load'] = false;
                                angular.copy(result.data, $scope.timecontrols);
                                //console.log($scope.timecontrols);
                                $scope.getCurrent();
                            },
                            function () {
                                $scope.processing['load'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                            });
                    };

                    //$scope.getTimeControls();


                    //$scope.save_pdp = function () {

                    //    var p_dpTemp = {
                    //        id_Person_DocumentProperty: $scope.data, //$scope.pdp.id_Person_DocumentProperty,
                    //        propertyValue: '' + $scope.idaddress + '', //$scope.pdp.propertyValue + '',
                    //        idOffice: Office.GetOfficeId(),
                    //        address: $scope.address
                    //    }

                    //    //console.log('save_pdp');
                    //    $scope.processing['save_pdp'] = true;
                    //    $scope.message = "сохранение адреса";

                    //    personDocumentService
                    //        .updatePerson_DocumentProperty(p_dpTemp)
                    //        .then(function (result) {
                    //            $scope.processing['save_pdp'] = false;
                    //            angular.copy($scope.address, $scope.address_old);
                    //        },
                    //        function () {
                    //            $scope.processing['save_pdp'] = false;
                    //            swal("ошибка авто сохранения свойства");
                    //        });
                    //}

                    var loadTimeControlErrors = function (timeControlType) {

                        var idOffice = Office.GetOfficeId();
                        $scope.processing['loadTimeControlErrors'] = true;
                        $scope.message = 'Проверка отчетов по кассе';                    
                        $scope.messages.length = 0;

                        var result = timeControlService.getTimeControlErrors(idOffice); // Возвращаем Promise
                        result.then(function (result) {
                            console.log(result.data);
                            if (!_.isNil(result.data)
                                    && result.data !== null
                                    && result.data.length > 0) { // массив не пустой
                                if(result.data.length == 1 && result.data[0].isToday && timeControlType == 1) // если нет отчета только за сегодня, а юзер хочет зайти в прогу
                                {
                                    console.log('All OK');
                                } else{
                                    $scope.messages = result.data;
                                };
                            
                            }
                            $scope.processing['loadTimeControlErrors'] = false;
                        }, function () {
                            $scope.messages.push({ message: 'Не удалось проверить отчеты', color: 'red' });
                        });
                        return result;
                    };
                }])
        };
    }]);
}