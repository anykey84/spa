export default (ngModule) => {

    ngModule.factory('contractPersonService', [
        '$http',
        function ($http) {

            return {

                getContractPerson: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/contractperson/contractpersons/' + id
                    });
                }
                 
                , addContractPerson: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contractperson/add/0',
                        data: p
                    });
                }

                , deleteContractPerson: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contractperson/del/' + p.id,
                        data: p
                    });
                }
            }
        }]);
}