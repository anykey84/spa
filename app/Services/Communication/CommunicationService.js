export default (ngModule) => {

ngModule.factory('communicationService', [
        '$http',
        function ($http) {
            return {
                getCommunicationServices: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/communication/getcommunicationservices/0',
                        data: p
                    }
                     );
                }

            }
        }]);
}