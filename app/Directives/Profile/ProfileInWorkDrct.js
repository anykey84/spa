export default (ngModule) => {

    ngModule.directive('myProfileInWork', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./ProfileInWork.html'),
            scope: {
            },
            controller: (['$scope', 'contractService', 'personService', 'profileService', 'Profile', 'Office', 'moment',
                function ($scope, contractService, personService, profileService, Profile, Office, moment) {

                    $scope.messages = [];
                    $scope.processing = {};
                    $scope.message = "";

                    $scope.VisibleProfileInWork = Profile.GetRolePropertyValue("VisibleProfileInWork");
                    $scope.VisibleAttachContractsProfileInWork = Profile.GetRolePropertyValue("VisibleAttachContractsProfileInWork");

                    $scope.contractNumber = null;

                    $scope.contracts = [];
                    $scope.persons = [];
                    $scope.profiles = [];
                    $scope.profilesOnOffice = [];
                    $scope.selectedProfile = null;

                    $scope.profileChanged = function (item) {
                        $scope.selectedProfile = item;
                    }

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
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                            });
                    }
                    $scope.loadProfilesInWork();


                    // загрузка задач по точке или региону
                    $scope.loadProfilesInWorkOnOffice = function () {

                        $scope.processing['loadProfilesInWorkOnOffice'] = true;
                        $scope.message = "загрузка задач по точке";

                        profileService
                            .getProfilesInWorkOnOffice()
                            .then(function (result) {
                                $scope.processing['loadProfilesInWorkOnOffice'] = false;
                                angular.copy(result.data, $scope.profilesOnOffice);
                                //console.log($scope.profilesOnOffice);
                            },
                            function () {
                                $scope.processing['loadProfilesInWorkOnOffice'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                            });
                    }
                    $scope.loadProfilesInWorkOnOffice();

                    $scope.selectPersonsAll = function (isSelectPersonsAll) {
                        _.each($scope.persons, function (item) { item.isSelected = isSelectPersonsAll; });
                    }

                    $scope.selectContractsAll = function (isSelectContractsAll) {
                        _.each($scope.contracts, function (item) { item.isSelected = isSelectContractsAll; });
                    }

                    $scope.loadPersonsProfileInWork = function () {

                        var data = {
                            idOffice: Office.GetOfficeId()
                        };

                        $scope.processing['loadPersonsProfileInWork'] = true;
                        $scope.message = "загрузка физ лиц";

                        profileService
                            .getPersonsProfileInWork(data)
                            .then(function (result) {
                                $scope.processing['loadPersonsProfileInWork'] = false;
                                result.data.map(function(item){
                                    let datePlanned = moment(item.taskDatePlanned);
                                    let today = moment();
                                    //console.log(datePlanned.format('YYYY-MM-DD'), today.format('YYYY-MM-DD'));
                                    item.isOverdue = !datePlanned.isAfter(today, 'day');
                                    //console.log(item);
                                });
                                angular.copy(result.data, $scope.persons);
                                //_.each($scope.contracts, function (item) { item.isSelected = false; });
                                //console.log($scope.persons);
                            },
                            function () {
                                $scope.processing['loadPersonsProfileInWork'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                            });
                    }

                    $scope.loadPersonsProfileInWork();

                    $scope.loadContractsProfileInWork = function () {

                        var data = {
                            idOffice: Office.GetOfficeId()
                        };

                        $scope.processing['loadContractsProfileInWork'] = true;
                        $scope.message = "загрузка договоров";

                        profileService
                            .getContractsProfileInWork(data)
                            .then(function (result) {
                                $scope.processing['loadContractsProfileInWork'] = false;
                                angular.copy(result.data, $scope.contracts);
                                //_.each($scope.contracts, function (item) { item.isSelected = false; });
                                //console.log($scope.contracts);
                            },
                            function () {
                                $scope.processing['loadContractsProfileInWork'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                            });
                    }

                    $scope.loadContractsProfileInWork();

                    $scope.detachContractsProfileInWork = function () {

                        var selectedContracts = _.filter($scope.contracts, function (c) { return c.isSelected == true; });

                        var str = "";
                        _.each(selectedContracts, function (c) { str = str + c.id_Contract + '#'; });

                        if (_.isNil(str)) {
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали ни одной карточки для открепления!!!!' });
                            return;
                        }

                        var data = {
                            idOffice: Office.GetOfficeId(),
                            comment: $scope.commentContract,
                            contracts: str
                        }

                        //console.log(data);

                        $scope.processing['detachContractsProfileInWork'] = true;
                        $scope.message = "открепление";

                        contractService
                            .detachContractsInWork(data)
                            .then(function (result) {
                                $scope.processing['detachContractsProfileInWork'] = false;
                                $scope.loadContractsProfileInWork();
                            },
                            function () {
                                $scope.processing['detachContractsProfileInWork'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка открепления' });
                            });

                    }

                    $scope.attachContractsProfileInWork = function () {

                        var selectedContracts = _.filter($scope.contracts, function (c) { return c.isSelected == true; });

                        var str = "";
                        _.each(selectedContracts, function (c) { str = str + c.id_Contract + '#'; });

                        if (_.isNil(str)) {
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали ни одной карточки для закрепления!!!!' });
                            return;
                        }

                        if (_.isNil($scope.selectedContractProfile)) {
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали сотрудника для закрепления!!!!' });
                            return;
                        }

                        var data = {
                            idProfile: $scope.selectedContractProfile.id,
                            idOffice: Office.GetOfficeId(),
                            comment: $scope.commentContract,
                            contracts: str
                        }

                        //console.log(data);

                        $scope.processing['attachContractsProfileInWork'] = true;
                        $scope.message = "закрепление";

                        contractService
                            .attachContractsInWork(data)
                            .then(function (result) {
                                $scope.processing['attachContractsProfileInWork'] = false;
                                $scope.loadContractsProfileInWork();
                            },
                            function () {
                                $scope.processing['attachContractsProfileInWork'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка закрепления' });
                            });

                    }

                    $scope.detachPersonsProfileInWork = function () {

                        var selectedpersons = _.filter($scope.persons, function (c) { return c.isSelected == true; });

                        var str = "";
                        _.each(selectedpersons, function (c) { str = str + c.id_Person + '#'; });

                        if (_.isNil(str)) {
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали ни одной карточки для открепления!!!!' });
                            return;
                        }

                        var data = {
                            idOffice: Office.GetOfficeId(),
                            comment: $scope.commentPerson,
                            persons: str
                        }

                        //console.log(data);

                        $scope.processing['detachPersonsProfileInWork'] = true;
                        $scope.message = "открепление";

                        personService
                             .detachPersonsInWork(data)
                             .then(function (result) {
                                 $scope.processing['detachPersonsProfileInWork'] = false;
                                 $scope.loadPersonsProfileInWork();
                             },
                             function () {
                                 $scope.processing['detachPersonsProfileInWork'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка открепления' });
                             });

                    }

                    $scope.attachPersonsProfileInWork = function () {

                        var selectedpersons = _.filter($scope.persons, function (c) { return c.isSelected == true; });

                        var str = "";
                        _.each(selectedpersons, function (c) { str = str + c.id_Person + '#'; });

                        if (_.isNil(str)) {
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали ни одной карточки для закрепления!!!!' });
                            return;
                        }

                        if (_.isNil($scope.selectedPersonProfile)) {
                            swal("");
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали сотрудника для закрепления!!!!' });
                            return;
                        }

                        var data = {
                            idProfile: $scope.selectedPersonProfile.id,
                            idOffice: Office.GetOfficeId(),
                            comment: $scope.commentPerson,
                            persons: str
                        }

                        //console.log(data);

                        $scope.processing['attachPersonsProfileInWork'] = true;
                        $scope.message = "закрепление";

                        personService
                            .attachPersonsInWork(data)
                            .then(function (result) {
                                $scope.processing['attachPersonsProfileInWork'] = false;
                                $scope.loadPersonsProfileInWork();
                            },
                            function () {
                                $scope.processing['attachPersonsProfileInWork'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка закрепления' });
                            });

                    }



                    /*  $scope.loadPersonsProfileInWorkResults = function (item) {
      
                          if (!item.isSelected) {
                              return;
                          }
      
                          var data = {
                              idPersonInWork: item.task.id_Task
                          };
      
                          $scope.processing[item.task.id_Task] = true;
                          $scope.message = "загрузка результов";
      
                          profileService
                              .getPersonsProfileInWork(data)
                              .then(function (result) {
                                  $scope.processing['loadPersonsProfileInWork'] = false;
                                  angular.copy(result.data, item.taskresults);
                                  $scope.processing[item.task.id_Task] = false;
                                  //_.each($scope.contracts, function (item) { item.isSelected = false; });
                                  // console.log($scope.persons);
                              },
                              function () {
                                  $scope.processing[item.task.id_Task] = false;
                                  $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                              });
       
                      }
      
                      $scope.saveTaskResult = function (item) {
      
                          var data = {
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
                                  $scope.messages.push({ color: 'red', message: 'ошибка сохранения результата' });
                              });
                      }*/

                }])
        }
    })
}