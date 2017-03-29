export default (ngModule) => {

    ngModule.directive('myTask', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./Task.html'),
            scope: {
                person: '=',
                contract: '='
            },
            controller: (['$scope', '$filter', 'officeService', 'taskService', 'productService', 'Office', 'Profile',
                function ($scope, $filter, officeService, taskService, productService, Office, Profile) {

                    $scope.idPerson = null; //17893; //null;
                    $scope.idContract = null; //143773; //null;

                    if ($scope.person) {
                        $scope.idPerson = $scope.person.id;
                    }
                    if ($scope.contract) {
                        $scope.idContract = $scope.contract.id;
                    }

                    $scope.processing = {};
                    $scope.message = "";
                    $scope.messages = [];

                    $scope.productservices = [];
                    $scope.regions = [];
                    $scope.tasktypes = [];
                    $scope.tasks = [];

                    $scope.today = new Date();
                    $scope.tomorrow = new Date();
                    $scope.tomorrow.setDate($scope.tomorrow.getDate() + 7);
                    //$scope.declineDate = new Date();

                    $scope.initTask = function () {

                        $scope.task = {
                            dateDayPlan: 0,
                            taskTypeSelected: null,
                            idProductService: null,
                            idRegion: null,
                            regionSelected: null,
                            selectProductService: null,
                            description: ""
                        }
                        $scope.taskTypeChanged();
                    }

                    $scope.VisibleButtonAddTaskResult = Profile.GetRolePropertyValue("VisibleButtonAddTaskResult");
                    $scope.VisibleButtonAddTask = Profile.GetRolePropertyValue("VisibleButtonAddTask");

                    //******************************************
                    $scope.minDate = 0; // new Date();

                    $scope.maxDate = 365; // new Date();
                    //$scope.maxDate.setDate($scope.maxDate.getDate() + 365);

                    //$scope.open = function ($event) {
                    //    $event.preventDefault();
                    //    $event.stopPropagation();
                    //    $scope.opened = true;
                    //};
                    //******************************************

                    //console.log('myTask');
                    //console.log($scope.person);
                    //console.log($scope.contract);

                    $scope.taskTypeChanged = function () {

                    

                        if (_.isNil($scope.task.taskTypeSelected)) {
                            $scope.visibledateplan = false;
                            $scope.visibleregion = false;
                            return;
                        }

                        let id = _.isNil($scope.task.taskTypeSelected)? 0 : $scope.task.taskTypeSelected.id;

                        if (id == 15 || id == 16 || id == 36 || id == 4 || id == 5 || id == 35) {
                            $scope.visibledateplan = true;
                            $scope.visibleregion = false;
                            $scope.readonlydateplan = false;

                            $scope.task.idRegion = null;
                            $scope.task.idProductService = null;
                            $scope.task.regionSelected = null;
                            $scope.task.selectProductService = null;
                        }
                        else if (id == 34 || id == 4 || id == 5 || id == 37 || id == 38) {
                            $scope.visibleregion = true;
                            $scope.visibledateplan = true;
                            $scope.readonlydateplan = true;
                        }
                        else {
                            $scope.visibledateplan = false;
                            $scope.visibleregion = false;

                            $scope.task.idRegion = null;
                            $scope.task.idProductService = null;
                            $scope.task.regionSelected = null;
                            $scope.task.selectProductService = null;
                        }
                    }

                    $scope.initTask();

                    $scope.getOfficeByOfficeType = function () {

                        $scope.processing['getOfficeByOfficeType'] = true;
                        $scope.message = "загрузка типов";

                        officeService
                            .getOfficeByOfficeType(1)
                            .then(function (result) {
                                $scope.processing['getOfficeByOfficeType'] = false;
                                angular.copy(result.data, $scope.regions);
                            },
                            function () {
                                $scope.processing['getOfficeByOfficeType'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                            });
                    }
                    $scope.getOfficeByOfficeType();

                    $scope.getProductServices = function () {

                        $scope.processing['getProductServices'] = true;
                        $scope.message = "загрузка типов продуктов";

                        let data = {
                            idOffice: Office.GetOfficeId()
                        }
                        //console.log(data);

                        productService
                            .getProductServices(data)
                            .then(function (result) {
                                $scope.processing['getProductServices'] = false;
                                angular.copy(result.data, $scope.productservices);
                                //console.log('dddddddd');
                                //console.log($scope.productservices);
                            },
                             function () {
                                 $scope.processing['getProductServices'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка загрузки типов продуктов' });
                             });
                    }
                    $scope.getProductServices();


                    $scope.loadTaskTypes = function () {

                        $scope.processing['loadTaskTypes'] = true;
                        $scope.message = "загрузка типов";

                        taskService
                            .getTaskTypes()
                            .then(function (result) {
                                $scope.processing['loadTaskTypes'] = false;
                                angular.copy(result.data, $scope.tasktypes);
                                console.log(result.data);
                            },
                            function () {
                                $scope.processing['loadTaskTypes'] = false;
                                swal("ошибка загрузки");
                            });
                    }
                    $scope.loadTaskTypes();

                    $scope.loadTasks = function () {

                        $scope.processing['loadTasks'] = true;
                        $scope.message = "загрузка задач";

                        let data = {
                            idPerson: $scope.idPerson,
                            idContract: $scope.idContract
                        };

                        taskService
                            .getTasks(data)
                            .then(function (result) {
                                $scope.processing['loadTasks'] = false;
                                console.log(result.data);
                                angular.copy(result.data, $scope.tasks);
                            },
                            function () {
                                $scope.processing['loadTasks'] = false;
                                swal("ошибка загрузки");
                            });
                    }

                    $scope.loadTasks();

                    $scope.loadTaskResults = function (item) {
                        //console.log(item);
                        if (!item.isSelected) {
                            return;
                        }

                        let data = {
                            idTask: item.task.id_Task
                        };

                        $scope.processing[item.task.id_Task] = true;
                        $scope.message = "загрузка результов";

                        taskService
                            .getTaskResults(data)
                            .then(function (result) {
                                console.log(result.data);
                                angular.copy(result.data, item.taskresults);
                                $scope.processing[item.task.id_Task] = false;
                            },
                            function () {
                                $scope.processing[item.task.id_Task] = false;
                                swal("ошибка загрузки");
                            });
                    }

                    $scope.saveTaskResult = function (item) {

                        let data = {
                            idTask: item.task.id_Task,
                            idOffice: Office.GetOfficeId(),
                            comment: item.newComment
                        }

                        taskService
                            .addTaskResult(data)
                            .then(function (result) {
                                $scope.loadTaskResults(item);
                            },
                            function () {
                                swal("ошибка сохранения результата");
                            });
                    }

                    $scope.saveTask = function () {

                        let id = $scope.task.taskTypeSelected.id;


                        //if ((id == 34 || id == 4 || id == 5 || id == 37 || id == 38) && angular.isUndefined($scope.task.idRegion)) {
                        if ((id == 34 || id == 4 || id == 37 || id == 38) && _.isNil($scope.task.idRegion)) {
                            $scope.messages.push({ color: 'red', message: 'не выбран регион назначения консультации!!!!!!!' });
                            return;
                        }

                        //if ((id == 34 || id == 4 || id == 5 || id == 37 || id == 38) && angular.isUndefined($scope.task.idProductService)) {
                        if ((id == 34 || id == 4 || id == 37 || id == 38) && _.isNil($scope.task.idProductService)) {
                            $scope.messages.push({ color: 'red', message: 'не выбрана услуга!!!!!!!' });
                            return;
                        }

                        if (id == 34) {
                            $scope.dateDayPlan = 1;
                        }
                        console.log($scope.task.taskTypeSelected.dateDayPlan);
                        let data = {
                            idTaskType: id,
                            idOffice: Office.GetOfficeId(),
                            idPerson: $scope.idPerson,
                            idProductService: $scope.task.idProductService,
                            idRegion: $scope.task.idRegion,
                            idContract: $scope.idContract,
                            description: $scope.task.description,
                            dateDayPlan: $scope.task.taskTypeSelected.dateDayPlan
                        }
                        //console.log(data);
                        //return;

                        $scope.processing['saveTask'] = true;
                        $scope.message = "сохранение";

                        taskService
                            .addTask(data)
                            .then(function (result) {
                                $scope.isNewTask = !$scope.isNewTask;
                                $scope.initTask();
                                $scope.loadTasks();
                                $scope.processing['saveTask'] = false;
                            },
                            function () {
                                $scope.processing['saveTask'] = false;
                                swal("ошибка сохранения задачи");
                            });
                    }

                    $scope.deleteTaskResult = function (item, idTaskResult) {

                        let data = {
                            idTaskResult: idTaskResult,
                            idOffice: Office.GetOfficeId()
                        }

                        taskService
                            .deleteTaskResult(data)
                            .then(function (result) {
                                $scope.loadTaskResults(item);
                            },
                            function () {
                                swal("ошибка сохранения результата");
                            });
                    }

                    $scope.deleteTask = function (idTask) {

                        $scope.processing['deleteTask'] = true;
                        $scope.message = "удаление задачи";

                        let data = {
                            idTask: idTask,
                            idOffice: Office.GetOfficeId()
                        }

                        taskService
                            .deleteTask(data)
                            .then(function (result) {
                                $scope.processing['deleteTask'] = false;
                                $scope.loadTasks();
                            },
                            function () {
                                $scope.processing['deleteTask'] = false;
                                swal("ошибка удаления");
                            });
                    }

                    $scope.showDateDecline = function(){

                    }

                    $scope.submitDecline = function(idTask, id_Result){
                        console.log($scope.declineDate);
                        if ($scope.declineDate < $scope.today || $scope.declineDate > $scope.tomorrow){
                            swal('Допустимая дата - не более 7 дней от сегодняшней')
                        }
                        let data = {
                            idTask: idTask,
                            id_Result: id_Result,
                            dateNew: $scope.declineDate
                        }
                        console.log(data);
                        taskService
                            .successTask(data)
                            .then(function (result) {
                                $scope.processing['deleteTask'] = false;
                                $scope.loadTasks();
                                $scope.visibleDateDecline = 0;
                            },
                            function () {
                                $scope.processing['deleteTask'] = false;
                                swal("ошибка");
                            });

                    }

                }])
        }
    })
}