'use strict';

appMain.directive('myPaymenttable', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Template/PaymentTable',
        scope: {
            payments: '=',
            deletePaymentVisible: '=',
            idContract: '='
        },
        controller: (['$scope', 'Office', 'reportService',
            function ($scope, Office, reportService) {

                $scope.createFilePayment = function (item) {
                    $scope.processing[item.id] = true;

                    var data = {
                        id: 0,
                        idOffice: Office.GetOfficeId(),
                        idContract: null,
                        idPayment: item.id,
                        reportType: item.ispko ? 'credit' : 'debit',
                        dateReport: null,
                        transfer: 'transfer'
                    };
                    console.log(data);
                    // return;

                    reportService
                        .generateReport(data)
                        .then(function (result) {
                            $scope.loadPayments();
                            $scope.processing[item.id] = false;
                        },
                        function () {
                            $scope.processing[item.id] = false;
                            swal("ошибка генерации файла на сервере", "", 'error');
                        });
                }
            }])
    }
})