export default(ngModule) => {
    ngModule.controller('RegionalCtrl', ['$scope', 'profileService', 'Profile', 'taskService', function($scope, profileService, Profile, taskService){
        const vm = this;
        console.log('Regional controller');
        //console.log(profileService);
        vm.profiles = [];

        vm.updatePersonInWorkStatus = function(profile){
            let data = {
                id: profile.id,
                active: +(!profile.active)
            }
            profileService
                .updateProfileByRegionalStatus(data)
                .then(function(result){
                    //console.log(result);
                    if(result.status == 200 && result.statusText == 'OK'){
                        profile.active = +(!profile.active);
                    } else {
                        swal('Ошибка установки статуса', 'error');
                    }
                })
        }

        vm.updateTaskWorker = function(item){
            console.log(item);
            if(!item.newWorkerId){
                return swal('Не указан новый исполнитель', '', 'error');
            }
            if(!item.newTaskDate){
                return swal('Не указана дата перенаправления', '', 'error');
            }
            let data = {
                idTask: item.id_Task,
                newWorkerId: item.newWorkerId,
                dateNew: item.newTaskDate
            }
            taskService
                .insertTaskReassigned(data)
                .then(function(result){
                    //console.log(result);
                    if(result.status == 200 && result.statusText == 'OK'){
                        toastr.success('Задача обновлена');
                        vm.getTasks();
                    } else {
                        swal('Ошибка перенаправления задачи', '', 'error');
                    }
                })
        }

        vm.getTasks = function(){
            console.log('get tasks');
            profileService
                .getTasksByRegional()
                .then(function (result) {
                    //$scope.processing['loadProfilesInWork'] = false;
                    vm.tasks = _.clone(result.data);
                    console.log(vm.tasks);
                    //console.log($scope.profiles);
                },
                function () {
                    //$scope.processing['loadProfilesInWork'] = false;
                    $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                });
        }

        vm.getProfiles = function(){
            console.log('get profiles');
            profileService
                       .getProfilesByRegional()
                       .then(function(result){
                           vm.profiles = _.clone(result.data);
                           console.log(vm.profiles);
                       })
        }

        vm.dateDiff = function(date1, date2){
            let diff = new Date(date1).getTime() - new Date(date2).getTime();
            //console.log(diff);
            return 'date';
        }

        profileService
               .getRoles()
               .then(function (result) {
                   Profile.InitRoles(result.data);
                   vm.panelId = 'contractsearch';

                   toastr.success('Роли загружены');

                   //vm.getProfiles();

                   //vm.getTasks();
               },
               function () {
                   //vm.processing['getRoles'] = false;
                   vm.messages.push({ color: 'red', message: 'ошибка загрузки ролей' });
               });


        //if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabReport")) {
        //    $window.location.href = '/';
        //    return;
        //}
    }])
}