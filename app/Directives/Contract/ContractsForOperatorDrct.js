export default (ngModule) => {

    ngModule.directive('myContractsForOperator', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./ContractsForOperator.html'),
            scope: {
                contract: '='
            },
            controller: (['$scope', 'Profile', 'contractService', 'Office',
                function ($scope, Profile, contractService, Office) {

                    $scope.contracts = [];

                    $scope.messages = [];
                    $scope.message = "";
                    $scope.processing = {};

                    //$scope.VisibleFilterContractsForCheck = Profile.GetRolePropertyValue("VisibleFilterContractsForCheck");

                    $scope.loadContractsForOperator = function () {

                        $scope.processing['loadContractsForOperator'] = true;
                        $scope.message = "Загрузка договоров за текущий день";

                        var data = {
                            idOffice: Office.GetOfficeId()
                        };
                        $scope.contracts = [];

                        contractService
                            .getContractsForOperator(data)
                                .then(function (result) {
                                    $scope.processing['loadContractsForOperator'] = false;
                                    angular.copy(result.data, $scope.contracts);
                                    //console.log($scope.contracts);
                                },
                                function () {
                                    $scope.processing['loadContractsForOperator'] = false;
                                    swal("Ошибка загрузки договоров за текущий день", "Проверьте интернет-соединение");
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

                    $scope.$on('timer-tick', function (event, data) {
                        //console.log('загрузка таймера');
                        $scope.loadContractsForOperator();
                    });

                }])
        }
    })
}