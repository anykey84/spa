export default (ngModule) => {

    ngModule.factory('depositService', [
        '$http',
        function ($http) {

            return {

                getDepositInfo: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/deposit/depositinfo/0',
                        data: p
                    });
                }

                , depositEarlyApply: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/deposit/depositearlyapply/0',
                        data: p
                    });

                }

                , calcDepositEarly: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/deposit/calcdepositearly/0',
                        data: p
                    });
                }

                , depositCapitalization: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/deposit/depositcapitalization/0',
                        data: p
                    });
                }
                 , depositCapitalizationCalc: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/deposit/depositcapitalizationcalc/0',
                         data: p
                     });
                 }

                , depositProlongation: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/deposit/depositprolongation/0',
                        data: p
                    });
                }

                , depositSumRefill: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/deposit/depositsumrefill/0',
                        data: p
                    });
                }

                 , depositReturn: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/deposit/depositReturn/0',
                         data: p
                     });
                 }
                
            }
        }]);
}