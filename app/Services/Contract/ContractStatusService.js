export default (ngModule) => {

    ngModule.factory('contractStatusService', [
        '$http',
        function ($http) {

            return {

                getContractStatus: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/contractstatus/contractstatuses/' + id
                    });
                }

                , getStatuses: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/contractstatus/statuses/0'
                    });
                }

                , getCommentTypes: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/contractstatus/commenttypes/0'
                    });
                }

                , addStatusContract: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contractstatus/add/0',
                        data: p
                    });
                }               

                , deleteStatus: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contractstatus/del/0',
                        data: p
                    });
                }

                ,getContractCodeLastStatus: function (idContract) {
                    return $http({
                        method: 'GET',
                        url: '/api/contractstatus/contractcodelaststatus/' + idContract
                    });
                }
            }
        }]);
}