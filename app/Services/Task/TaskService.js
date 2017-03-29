export default (ngModule) => {

    ngModule.factory('taskService', [
            '$http',
            function ($http) {
                return {
                    getTasks: function (p) {
                        return $http({
                            method: 'POST',
                            url: '/api/task/gettasks/0',
                            data: p
                        });
                    }

                   , getTaskTypes: function ( ) {
                       return $http({
                           method: 'GET',
                           url: '/api/task/gettasktypes/0' 
                       });
                   }

                   , getTaskResults: function (p) {
                       return $http({
                           method: 'POST',
                           url: '/api/task/gettaskresults/0',
                           data: p
                       });
                   }

                    , getTasksByTaskType: function (p) {
                        return $http({
                            method: 'POST',
                            url: '/api/task/gettasksbytasktype/0',
                            data: p
                        });
                    }

                    , getTaskTypesByType: function (id) {
                        return $http({
                            method: 'GET',
                            url: '/api/task/gettasktypesbytype/' + id
                        });
                    }

                    , addTaskResult: function (p) {
                        return $http({
                            method: 'POST',
                            url: '/api/task/addtaskresult/0',
                            data: p
                        });
                    }

                    , addTask: function (p) {
                        return $http({
                            method: 'POST',
                            url: '/api/task/addtask/0',
                            data: p
                        });
                    }

                    , deleteTaskResult: function (p) {
                        return $http({
                            method: 'POST',
                            url: '/api/task/deletetaskresult/0',
                            data: p
                        });
                    }

                     , deleteTask: function (p) {
                         return $http({
                             method: 'POST',
                             url: '/api/task/deletetask/0',
                             data: p
                         });
                     }
                    , successTask: function (p) {  // передача нового состояния задачи - успешна или нет (с датой)
                        return $http({
                            method: 'POST',
                            url: '/api/task/successtask/0',
                            data: p
                        });
                    }
                    , insertTaskReassigned(p){
                        //console.log(p);
                        return $http({
                            method: 'POST',
                            url: '/api/task/insertTaskReassigned/0',
                            data: p
                        });
                    }

                 
                }
            }]);
}