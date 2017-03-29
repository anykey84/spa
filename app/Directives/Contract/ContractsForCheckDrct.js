export default (ngModule) => {

    ngModule.directive('myContractsForCheck', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./ContractsForCheck.html'),
            scope: {
                contract: '='
            },
            controller: (['$scope', 'Profile', 'contractService', 'Office',
                function ($scope, Profile, contractService, Office) {

                    $scope.contracts = [];

                    $scope.messages = [];
                    $scope.message = "";
                    $scope.processing = {};

                    $scope.VisibleFilterContractsForCheck = Profile.GetRolePropertyValue("VisibleFilterContractsForCheck");

                    $scope.loadContractsForCheck = function () {

                        if (!$scope.VisibleFilterContractsForCheck) return;

                        $scope.processing['loadContractsForCheck'] = true;
                        $scope.message = "загрузка договоров готовых к проверке СБ";

                        var data = {
                            idOffice: Office.GetOfficeId()
                        };
                        $scope.contracts = [];

                        contractService
                            .getContractsForCheck(data)
                                .then(function (result) {
                                    $scope.processing['loadContractsForCheck'] = false;
                                    angular.copy(result.data, $scope.contracts);
                                    //console.log($scope.contracts);
                                },
                                function () {
                                    $scope.processing['loadContractsForCheck'] = false;
                                    swal("ошибка загрузки договоров готовых к проверке СБ");
                                });
                    }

                    //$scope.timerRunning = true;

                    //console.log($scope.VisibleFilterContractsForCheck);
                    //if ($scope.VisibleFilterContractsForCheck) {
                    //    console.log('запуск таймера');
                    //    $scope.startTimer = function () {
                    //        $scope.$broadcast('timer-start');
                    //        $scope.timerRunning = true;
                    //    };
                    //}

                    //$scope.stopTimer = function () {
                    //    console.log('остановка таймера');
                    //    $scope.$broadcast('timer-stop');
                    //    $scope.timerRunning = false;
                    //};

                    //$scope.$on('timer-stopped', function (event, data) {
                    //    //console.log('Timer Stopped - data = ', data);
                    //});

                    if ($scope.VisibleFilterContractsForCheck) {
                        $scope.$on('timer-tick', function (event, data) {
                            //console.log('загрузка таймера');
                            $scope.loadContractsForCheck();
                        });
                    }

                }])
        }
    })
}