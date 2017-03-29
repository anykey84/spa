export default (ngModule) => {

    ngModule.factory('personKPKService', [
        '$http',
        function ($http) {

            return {

                getKPKInfo: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/person/getkpkinfo/' + id
                    });
                }

                , inKPK: function (d) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/inkpk/0',
                        data: d
                    });
                }

                , outKPK: function (d) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/outkpk/0',
                        data: d
                    });
                }

                  , expelledFromKPK: function (d) {
                      return $http({
                          method: 'POST',
                          url: '/api/person/expelledfromkpk/0',
                          data: d
                      });
                  }

                , paymentkpks: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/payment/personpaymentskpk/' + id
                    });
                }

                , payDobro: function (d) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/paydobro/0',
                        data: d
                    });
                }
            }
        }]);


}