export default (ngModule) => {

    ngModule.factory('timeControlService', [
        '$http',
        function ($http) {
            return {
                // оно же тут не нужно
                //getTasks: function (p) {
                //    //console.log(p);
                //    return $http({
                //        method: 'POST',
                //        url: '/api/task/gettasks/0',
                //        data: p
                //    });
                //}

                getTimeControls: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/timecontrol/gettimecontrols/0'
                    });
                }

                , getCurrent: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/timecontrol/getcurrent/0'
                    });
                }

                , addTimeControl: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/timecontrol/addtimecontrol/0',
                        data: p
                    });
                }                

                , getTimeControlErrors: function (idOffice) {
                    return $http({
                        method: 'GET',
                        url: '/api/timecontrol/timecontrolerrors/' + idOffice
                    });
                }

            }
        }]);
}