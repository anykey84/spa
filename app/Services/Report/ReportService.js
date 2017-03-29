export default (ngModule) => {

    ngModule.factory('reportService', [
        '$http',
        function ($http) {

            return {
                generateReport: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/report/generatereport/0',
                        data: p
                    });
                }

                , getDataForReport: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/report/getdataforreport/0',
                        data: p
                    });
                }
            }
        }]);
}