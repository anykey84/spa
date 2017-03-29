export default (ngModule) => {

    ngModule.directive('myContractsByFilters', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./ContractsByFilters.html'),
            scope: {
            },
            controller: (['$scope', 'Profile', 'Office', 'officeService', 'contractService', 'taskService', 'contractStatusService', 'profileService',
                function ($scope, Profile, Office, officeService, contractService, taskService, contractStatusService, profileService) {

                    $scope.contracts = [];
                    $scope.tasktypes = [];
                    $scope.profiles = [];
                    $scope.statuses = [];
                    $scope.offices = [];

                    $scope.messages = [];
                    $scope.message = "";
                    $scope.processing = {};

                    $scope.VisibleContractsByFilters = Profile.GetRolePropertyValue("VisibleContractsByFilters");

                    $scope.getOffices = function () {

                        $scope.processing['getOffices'] = true;
                        $scope.message = "загрузка офисов";

                        officeService
                            .getOfficeByOfficeType(3)
                            .then(function (result) {
                                $scope.processing['getOffices'] = false;
                                angular.copy(result.data, $scope.offices);
                            },
                             function () {
                                 $scope.processing['getOffices'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка загрузки офисов' });
                             });
                    }
                    $scope.getOffices();

                    $scope.loadStatuses = function () {

                        $scope.processing['loadStatuses'] = true;
                        $scope.message = "загрузка статусов";

                        contractStatusService
                            .getStatuses()
                            .then(function (result) {
                                $scope.processing['loadStatuses'] = false;
                                angular.copy(result.data, $scope.statuses);
                            },
                            function () {
                                $scope.processing['loadStatuses'] = false;
                                //swal("ошибка загрузки");
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                            });
                    }
                    $scope.loadStatuses();

                    $scope.loadTaskTypes = function () {

                        $scope.processing['loadTaskTypes'] = true;
                        $scope.message = "загрузка типов";

                        taskService
                            .getTaskTypesByType(2)
                            .then(function (result) {
                                $scope.processing['loadTaskTypes'] = false;
                                angular.copy(result.data, $scope.tasktypes);
                            },
                            function () {
                                $scope.processing['loadTaskTypes'] = false;
                                //swal("ошибка загрузки");
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки типов задач' });
                            });
                    }
                    $scope.loadTaskTypes();

                    $scope.loadProfilesInWork = function () {

                        $scope.processing['loadProfilesInWork'] = true;
                        $scope.message = "загрузка профилей";

                        profileService
                            .getProfilesInWork()
                            .then(function (result) {
                                $scope.processing['loadProfilesInWork'] = false;
                                angular.copy(result.data, $scope.profiles);
                                //console.log($scope.profiles);
                            },
                            function () {
                                $scope.processing['loadProfilesInWork'] = false;
                                swal("ошибка загрузки");
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки профилей' });
                            });
                    }
                    $scope.loadProfilesInWork();

                    $scope.loadContracts = function () {

                        $scope.messages.length = 0;

                        if (!$scope.VisibleContractsByFilters) return;

                        if (_.isNil($scope.idTaskType) &&
                            _.isNil($scope.idProfile) &&
                            _.isNil($scope.idOffice)) {
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали ни одного фильтра!' });
                        }

                        if (_.isNil(new Date($scope.dateFrom)) ||
                           _.isNil(new Date($scope.dateTo))) {
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали отчетный период!' });
                        }

                        if ($scope.messages.length > 0) {
                            return;
                        }

                        $scope.processing['loadContracts'] = true;
                        $scope.message = "загрузка договоров";

                        var data = {
                            idOffice: Office.GetOfficeId()
                            , idTaskType: _.isNil($scope.idTaskType) ? '' : $scope.idTaskType //selectedTaskType.id
                            , idProfile: _.isNil($scope.idProfile) ? '' : $scope.idProfile   //selectedTaskType.id
                            , idStatus: _.isNil($scope.idStatus) ? '' : $scope.idStatus   //selectedStatus.id
                            , idOfficeSelect: _.isNil($scope.idOffice) ? '' : $scope.idOffice   //selectedStatus.id
                            , dateFrom: _.isNil(new Date($scope.dateFrom)) ? '' : new Date($scope.dateFrom).toDateString()   //selectedStatus.id
                            , dateTo: _.isNil(new Date($scope.dateTo)) ? '' : new Date($scope.dateTo).toDateString()   //selectedStatus.id
                        };

                        $scope.contracts = [];
                        console.log(data);

                        contractService
                            .getContractsByFilters(data)
                                .then(function (result) {
                                    $scope.processing['loadContracts'] = false;
                                    angular.copy(result.data, $scope.contracts);
                                    console.log($scope.contracts);
                                },
                                function () {
                                    $scope.processing['loadContracts'] = false;
                                    $scope.messages.push({ color: 'red', message: 'ошибка загрузки договоров' });
                                });
                    }


                }])
        }
    })
}