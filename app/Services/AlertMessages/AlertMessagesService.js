export default (ngModule) => {

    ngModule.factory('alertMessagesService', [
            '$http',
            function ($http) { 

                return {

                    getNewTasks: function (d) {
                        return $http({
                            method: 'POST',
                            url: '/api/alertmessages/getnewtasks/0',
                            data: d
                        });
                    }

                }
            }]);
}