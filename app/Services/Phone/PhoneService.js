export default (ngModule) => {

    ngModule.factory('phoneService', [
        '$http',
        function ($http) {

            return {
                phoneAnalysis: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/phone/phoneanalysis/' + id
                    });
                }
            }
        }]);
}