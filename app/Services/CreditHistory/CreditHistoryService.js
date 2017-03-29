export default (ngModule) => {

    ngModule.factory('creditHistoryService', [
    '$http',
    function ($http) {

        return {
            getCreditHistory: function (id) {
                return $http({
                    method: 'GET',
                    url: '/api/CHS/getcredithistory/' + id
                })
            }

            ,  getCreditHistory_v2: function (id) {
                return $http({
                    method: 'GET',
                    url: '/api/CHS/getcredithistory_v2/' + id
                })
            }
        }
    }]);
}