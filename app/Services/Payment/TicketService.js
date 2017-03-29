export default (ngModule) => {

    ngModule.factory('ticketService', [
        '$http',
        function ($http) {

            return {
                createReport: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/report/generatereport/' + p.id,
                        data: p
                    });
                }

                , getPayments: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/ticket/payments/0',
                        data: p
                    });
                }

                , updatePayment: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/ticket/updatepayment/0',
                        data: p
                    });
                }

                //остатки по кассе
                , getCashRests: function (p) { // все
                    return $http({
                        method: 'POST',
                        url: '/api/ticket/getcashrests/0',
                        data: p
                    });
                }

                , getCashRest: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/ticket/getcashrest/0',
                        data: p
                    });
                }

                , updateCashRest: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/ticket/updatecashrest/0',
                        data: p
                    });
                }

                , recalcCashRest: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/ticket/recalccashrest/0',
                        data: p
                    });
                }

                , recalcCashRestsAll: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/ticket/recalccashrestsall/0',
                        data: p
                    });
                }


            }
        }]);
}