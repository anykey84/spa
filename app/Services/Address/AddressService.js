export default (ngModule) => {

    ngModule.factory('addressService', [
        '$http',
        function ($http) {

            return {
                addAddress: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/address/add/' + p.id_Person_DocumentProperty,
                        data: p
                    });
                }

                , getAddress: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/address/get/' + id
                    });
                }
            }
        }]);
}