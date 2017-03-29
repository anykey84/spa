export default (ngModule) => {

    ngModule.factory('loaninfoService', [
        '$http',
        function ($http) {

            return {
                getLoanInfo: function (contractId) {
                    return $http({
                        method: 'GET',
                        url: '/api/contract/loaninfo/' + contractId
                    });
                }
            }
        }]);
}