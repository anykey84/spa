export default (ngModule) => {

    ngModule.directive('myPersonsByFilters', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonsByFilters.html'),
            scope: {
            },
            controller: (['$scope', 'Profile', 'Office', 'officeService', 'personService', 'taskService', 'profileService',
                function ($scope, Profile, Office, officeService, personService, taskService, profileService) {

                    $scope.persons = [];
                    $scope.tasktypes = [];
                    $scope.profiles = [];
                    $scope.offices = [];

                    $scope.messages = [];
                    $scope.message = "";
                    $scope.processing = {};

                    $scope.VisiblePersonsByFilters = Profile.GetRolePropertyValue("VisiblePersonsByFilters");

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

                    $scope.loadTaskTypes = function () {

                        $scope.processing['loadTaskTypes'] = true;
                        $scope.message = "загрузка типов";

                        taskService
                            //.getTaskTypes()
                            .getTaskTypesByType(2)
                            .then(function (result) {
                                $scope.processing['loadTaskTypes'] = false;
                                angular.copy(result.data, $scope.tasktypes);
                            },
                            function () {
                                $scope.processing['loadTaskTypes'] = false;
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
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки профилей' });
                            });
                    }
                    $scope.loadProfilesInWork();

                    $scope.loadPersons = function () {

                        $scope.messages.length = 0;

                        if (!$scope.VisiblePersonsByFilters) {
                            return;
                        }

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

                        $scope.processing['loadPersons'] = true;
                        $scope.message = "загрузка физ лиц";

                        var data = {
                            idOffice: Office.GetOfficeId()
                            , idTaskType: _.isNil($scope.idTaskType) ? '' : $scope.idTaskType //selectedTaskType.id
                            , idProfile: _.isNil($scope.idProfile) ? '' : $scope.idProfile   //selectedTaskType.id
                            , idOfficeSelect: _.isNil($scope.idOffice) ? '' : $scope.idOffice   //selectedStatus.id
                            , dateFrom: _.isNil(new Date($scope.dateFrom)) ? '' : new Date($scope.dateFrom).toDateString()   //selectedStatus.id
                            , dateTo: _.isNil(new Date($scope.dateTo)) ? '' : new Date($scope.dateTo).toDateString()   //selectedStatus.id
                        };
                        $scope.persons = [];
                        //console.log(data);

                        personService
                            .getPersonsByFilters(data)
                                .then(function (result) {
                                    $scope.processing['loadPersons'] = false;
                                    angular.copy(result.data, $scope.persons);
                                    //console.log($scope.persons);
                                },
                                function () {
                                    $scope.processing['loadPersons'] = false;
                                    $scope.messages.push({ color: 'red', message: 'ошибка загрузки физ лиц' });
                                });
                    }




                }])
        }
    })
}