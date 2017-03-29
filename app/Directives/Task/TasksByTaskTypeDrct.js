export default (ngModule) => {

    ngModule.directive('myTasksByTaskType', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./TasksByTaskType.html'),
            scope: {
                isinwork: '=',
                idtasktype: '='
            },
            controller: (['$scope', 'taskService', 'profileService', 'personService', 'Office', 'Profile',
                function ($scope, taskService, profileService, personService, Office, Profile) {

                    $scope.processing = {};
                    $scope.message = "";
                    $scope.messages = [];

                    $scope.profiles = [];
                    $scope.tasktypes = [];
                    $scope.tasks = [];

                    /*$scope.VisibleButtonAddTaskResult = Profile.GetRolePropertyValue("VisibleButtonAddTaskResult");
                    $scope.VisibleButtonAddTask = Profile.GetRolePropertyValue("VisibleButtonAddTask");*/

                    /*console.log('myTask');
                    console.log($scope.person);
                    console.log($scope.contract);*/

                    $scope.loadTaskTypes = function () {

                        $scope.processing['loadTaskTypes'] = true;
                        $scope.message = "загрузка типов";

                        taskService
                            .getTaskTypes()
                            .then(function (result) {
                                $scope.processing['loadTaskTypes'] = false;
                                angular.copy(result.data, $scope.tasktypes);
                            },
                            function () {
                                $scope.processing['loadTaskTypes'] = false;
                                swal("ошибка загрузки");
                            });
                    }
                    $scope.loadTaskTypes();

                    $scope.getTasksByTaskType = function () {

                        $scope.processing['getTasksByTaskType'] = true;
                        $scope.message = "загрузка задач";

                        var data = {
                            isInWork: $scope.isinwork,
                            idTaskType: $scope.idtasktype
                        };

                        taskService
                            .getTasksByTaskType(data)
                            .then(function (result) {
                                $scope.processing['getTasksByTaskType'] = false;
                                //console.log(result.data);
                                angular.copy(result.data, $scope.tasks);
                            },
                            function () {
                                $scope.processing['getTasksByTaskType'] = false;
                                swal("ошибка загрузки");
                            });
                    }

                    $scope.getTasksByTaskType();


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
                            });
                    }
                    $scope.loadProfilesInWork();

                    $scope.detachPersonsInWork = function () {

                        var selectedpersons = _.filter($scope.tasks, function (c) { return c.isSelected == true; });

                        var str = "";
                        _.each(selectedpersons, function (c) { str = str + c.id_Person + '#'; });

                        if (_.isNil(str)) {
                            swal("вы не выбрали ни одной карточки для открепления!!!!");
                            return;
                        }

                        var data = {
                            idOffice: Office.GetOfficeId(),
                            persons: str
                        }

                        //console.log(data);

                        $scope.processing['detachPersonsInWork'] = true;
                        $scope.message = "открепление";

                        personService
                             .detachPersonsInWork(data)
                             .then(function (result) {
                                 $scope.processing['detachPersonsInWork'] = false;
                                 $scope.getTasksByTaskType();
                             },
                             function () {
                                 $scope.processing['detachPersonsInWork'] = false;
                                 swal("ошибка открепления");
                             });

                    }

                    $scope.attachPersonsInWork = function () {

                        var selectedpersons = _.filter($scope.tasks, function (c) { return c.isSelected == true; });

                        var str = "";
                        _.each(selectedpersons, function (c) { str = str + c.id_Person + '#'; });

                        if (_.isNil(str)) {
                            swal("вы не выбрали ни одной карточки для закрепления!!!!");
                            return;
                        }

                        if (_.isNil($scope.selected)) {
                            swal("вы не выбрали сотрудника для закрепления!!!!");
                            return;
                        }

                        var data = {
                            idProfile: $scope.selected.id,
                            idOffice: Office.GetOfficeId(),
                            persons: str
                        }

                        //console.log(data);

                        $scope.processing['attachPersonsInWork'] = true;
                        $scope.message = "закрепление";

                        personService
                            .attachPersonsInWork(data)
                            .then(function (result) {
                                $scope.processing['attachPersonsInWork'] = false;
                                $scope.getTasksByTaskType();
                            },
                            function () {
                                $scope.processing['attachPersonsInWork'] = false;
                                swal("ошибка закрепления");
                            });

                    }

                    $scope.selectAll = function (isSelectAll) {
                        _.each($scope.tasks, function (item) { item.isSelected = isSelectAll; });
                    }

                }])
        }
    })
}