export default (ngModule) => {
    ngModule.controller('TicketCtrl', ['$scope', '$window', 'ticketService', 'Office', 'reportService', 'paymentService', 'Profile',
        function ($scope, $window, ticketService, Office, reportService, paymentService, Profile) {

            if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabTicket")) {
                $window.location.href = '/';
                return;
            }

            $scope.name = "касса";

            $scope.VisibleButtonDeletePayment = Profile.GetRolePropertyValue("VisibleButtonDeletePayment");
            $scope.VisibleButtonAddBankPayment = Profile.GetRolePropertyValue("VisibleButtonAddBankPayment");
            $scope.VisibleButtonEditPayment = Profile.GetRolePropertyValue("VisibleButtonEditPayment");
            $scope.VisibleButtonCashGroupOfficeReport = Profile.GetRolePropertyValue("VisibleButtonCashGroupOfficeReport");
            $scope.VisibleButtonCashByOfficeReport = Profile.GetRolePropertyValue("VisibleButtonCashByOfficeReport");
            $scope.VisibleButtonCashRests = Profile.GetRolePropertyValue("VisibleButtonCashRests"); // остатки по кассе
            $scope.VisibleButtonCashRestsReport = Profile.GetRolePropertyValue("VisibleButtonCashRestsReport"); // отчет остатки по кассе
            $scope.VisibleButtonPaymentSalary = Profile.GetRolePropertyValue("VisibleButtonPaymentSalary"); // Выдача зарплаты

            $scope.payments = [];

            $scope.messages = [];
            $scope.processing = {};
            $scope.message = "";

            $scope.filterDateTo = "";
            $scope.filterNumber = null;

            $scope.delPayment = function (id) {

                var p = {
                    id: id,
                    idOffice: Office.GetOfficeId(),
                    comment: ""
                }

                paymentService
                    .deletePayment(p)
                    .then(function (result) {
                        $scope.loadTicket();
                    },
                    function () {
                        $scope.messages.push({ color: 'red', message: 'ошибка удаления платежа' });
                    });
            }

            $scope.savePayment = function (item) {
                //console.log(item);

                var fSum = null;
                if (!_.isNil(this.newSum)) {
                    fSum = this.newSum;
                }

                var fDatePay = null;
                if (!_.isNil(this.newDatePay)) {
                    fDatePay = this.newDatePay.toDateString()
                }

                var idBank = null;
                if (angular.isDefined(item.bank)) {
                    idBank = item.bank.id;
                }

                var data = {
                    idOffice: Office.GetOfficeId(),
                    idPayment: item.id,
                    sum: fSum,
                    idBank: idBank,
                    datePay: fDatePay
                };

                console.log(data.datePay);

                $scope.processing[item.id] = true;

                ticketService
                    .updatePayment(data)
                    .then(function (result) {
                        $scope.processing[item.id] = false;

                        //console.log(result.data);

                        if (result.data !== 0) {
                            $scope.filterNumber = result.data;
                            $scope.loadTicket();
                            // item.id = result.data;
                        }
                        else {
                            $scope.messages.push({ color: 'red', message: 'ошибка обновления платежа' });
                        }

                        /*if (!angular.isUndefined(fSum)) {
                            item.sum = data.sum;
                        }
                        if (!angular.isUndefined(fDatePay)) {
                            item.datePay = data.datePay;
                        }
                        item.id_Person_File = null;*/
                    },
                    function () {
                        $scope.processing[item.id] = false;
                        $scope.messages.push({ color: 'red', message: 'ошибка обновления платежа' });
                    });
            }

            $scope.createFilePayment = function (item) {
                $scope.processing[item.id] = true;

                var data = {
                    id: 0,
                    idOffice: Office.GetOfficeId(),
                    idContract: null,
                    idPayment: item.id,
                    reportType: item.ispko ? 'credit' : 'debit',
                    dateReport: null
                };
                console.log(data);

                reportService
                    .generateReport(data)
                    .then(function (result) {
                        $scope.loadTicket();
                        $scope.processing[item.id] = false;
                    },
                    function () {
                        $scope.processing[item.id] = false;
                        $scope.messages.push({ color: 'red', message: 'ошибка генерации файла на сервере!' });
                    });
            }

            $scope.loadTicket = function () {

                var fdateTo = null;
                if (!_.isNil($scope.filterDateTo)) {
                    fdateTo = new Date($scope.filterDateTo).toDateString();
                }

                var fNumber = null;
                if (!_.isNil($scope.filterNumber))
                    fNumber = $scope.filterNumber;

                if (_.isNil(fNumber) && _.isNil(new Date(fdateTo))) {
                    $scope.messages.push({ color: 'red', message: 'укажите условия поиска!' });
                    return;
                }


                var data = {
                    id: 0,
                    dateTo: fdateTo,
                    number: fNumber,
                    idOffice: Office.GetOfficeId()
                };

                $scope.processing['loadTicket'] = true;
                $scope.message = "загрузка платежей";

                ticketService
                    .getPayments(data)
                    .then(function (result) {
                        $scope.processing['loadTicket'] = false;
                        angular.copy(result.data, $scope.payments);
                        console.log($scope.payments);
                    }, function () {
                        $scope.processing['loadTicket'] = false;
                        $scope.messages.push({ color: 'red', message: 'ошибка на сервере!' });
                    });
            }


            $scope.loadBanks = function () {

                $scope.banks = [];

                $scope.processing['loadBanks'] = true;
                $scope.message = 'загрузка списка банков';

                paymentService
                    .getBank()
                        .then(function (result) {
                            angular.copy(result.data, $scope.banks);
                            $scope.processing['loadBanks'] = false;
                            //console.log($scope.paymentaccounts);
                        },
                        function () {
                            $scope.processing['loadBanks'] = false;
                            $scope.messages.push({ color: 'red', message: 'ошибка загрузка списка банков' });
                        });
            }
            $scope.loadBanks();
        }]);
}