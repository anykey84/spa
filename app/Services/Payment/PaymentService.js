export default (ngModule) => {

    ngModule.factory('paymentService', [
        '$http',
        function ($http) {

            return {
                getPayment: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/payment/payments/' + id
                    });
                }

                , getBank: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/payment/banks/' + 0
                    });
                }

                , getPaymentAccount: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/payment/paymentaccounts/' + 0
                    });
                }

                , getPaymentTransfers: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/payment/transferpayments/' + id
                    });
                }

                , createPayment: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/payment/add/0',
                        data: p
                    });
                }

                , createPaymentDeposit: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/payment/adddeposit/0',
                        data: p
                    });
                }

                , transferPayment: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/payment/addtransferpayment/' + 0,
                        data: p
                    });
                }

                , otherPayment: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/payment/addotherpayment/' + 0,
                        data: p
                    });
                }

                , bankPayment: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/payment/addbankpayment/' + 0,
                        data: p
                    });
                }

                , confirmPayment: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/payment/confirmpayment/' + 0,
                        data: p
                    });
                }

                , deletePayment: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/payment/del/' + p.id,
                        data: p
                    });
                }

                , addPaymentNecessary: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/payment/addpaymentnecessary/' + 0,
                        data: p
                    });
                }

                , addPaymentEntrance: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/payment/addpaymententrance/' + 0,
                        data: p
                    });
                }

                 , payInterestDeposit: function (p) {
                     //console.log(p);
                     return $http({
                         method: 'POST',
                         url: '/api/payment/payinterestdeposit/' + 0,
                         data: p
                     });
                 }

                // выдача зарплаты
                , addPaymentSalary: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/payment/addpaymentsalary/' + 0,
                        data: p
                    });
                }

            }
        }]);
}