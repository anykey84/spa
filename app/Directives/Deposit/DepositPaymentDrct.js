export default (ngModule) => {

    ngModule.directive('myDepositPayment', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./DepositPayment.html'),
            scope: {
                contract: '='
            },
            controller: (['$scope', '$routeParams', 'personFileService', 'reportService', 'paymentService', 'Person', 'Office', 'Profile',
               function ($scope, $routeParams, personFileService, reportService, paymentService, Person, Office, Profile) {

                   $scope.processing = {};

                   $scope.banks = [];
                   $scope.payments = [];
                   $scope.paymentsIsPKO = [];
                   $scope.paymentsIsRKO = [];

                   $scope.btnRKO_show = false;
                   $scope.btnBankRKO_show = false;
                   $scope.btnPKO_show = false;

                   $scope.VisibleButtonDeleteContractPayment = Profile.GetRolePropertyValue("VisibleButtonDeleteContractPayment");
                   $scope.VisibleButtonAddBankRKO = Profile.GetRolePropertyValue("VisibleButtonAddBankRKO");


                   $scope.initPayment = function () {

                       $scope.payment = {
                           sum: 0,
                           typePayment: '',
                           contractId: $scope.contract.id,
                           idOffice: Office.GetOfficeId()
                       }
                   }

                   $scope.initPayment();

                   $scope.loadBanks = function () {

                       $scope.processing['load'] = true;
                       $scope.message = 'загрузка списка банков';

                       paymentService
                           .getBank()
                               .then(function (result) {
                                   console.log($scope.banks);
                                   angular.copy(result.data, $scope.banks);
                                   $scope.processing['load'] = false;
                                   //console.log($scope.paymentaccounts);
                               },
                               function () {
                                   $scope.processing['load'] = false;
                                   swal("ошибка загрузка списка банков");
                               });
                   }
                   $scope.loadBanks();

                   $scope.createFilePayment = function (item) {
                       $scope.processing[item.id] = true;

                       var data = {
                           id: 0,
                           idOffice: Office.GetOfficeId(),
                           idContract: $scope.contract.id,
                           idPayment: item.id,
                           reportType: item.ispko ? 'credit' : 'debit',
                           dateReport: null
                       };

                       //console.log('lol');

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

                   $scope.addPayment = function (typePayment) {


                       if ($scope.payment.typePayment == 'rkobank' || $scope.payment.typePayment == 'pkobank') {

                           if (_.isNil($scope.selectedBank)) {
                               swal('НЕ ВЫБРАН БАНК!');
                               return;
                           }

                           $scope.payment.idBank = $scope.selectedBank.id;
                       }

                       //console.log($scope.payment);
                       //return;

                       $scope.processing['addPayment'] = true;

                       paymentService
                           .createPaymentDeposit($scope.payment)
                           .then(function (result) {
                               $scope.processing['addPayment'] = false;
                               $scope.initPayment();
                               $scope.loadPayments();
                           },
                           function () {
                               // error
                               $scope.processing['addPayment'] = false;
                               swal("ошибка сохранения платежа");
                           });
                   }

                   $scope.delPayment = function (id) {

                       $scope.processing['delPayment'] = true;

                       var p = {
                           id: id,
                           idOffice: Office.GetOfficeId(),
                           comment: ""
                       }

                       paymentService
                           .deletePayment(p)
                           .then(function (result) {
                               $scope.processing['delPayment'] = false;
                               $scope.loadPayments();
                           },
                           function () {
                               $scope.processing['delPayment'] = false;
                               swal("ошибка удаления платежа");
                           });
                   }

                   $scope.loadPayments = function () {

                       //if ($scope.processing['load']) {
                       //    console.log('уже идет')
                       //    return;
                       //}

                       $scope.payments = [];

                       $scope.processing['load'] = true;

                       paymentService
                           .getPayment($scope.contract.id)
                               .then(function (result) {

                                   angular.copy(result.data, $scope.payments);
                                   console.log($scope.payments);

                                   angular.forEach($scope.payments, function (p) {
                                       $scope.processing[p.id] = false;
                                   });

                                   $scope.paymentsIsPKO = $scope.payments.filter(function (item) {
                                       return item.ispko === true;
                                   });
                                   $scope.paymentsIsRKO = $scope.payments.filter(function (item) {
                                       return item.ispko === false;
                                   });

                                   $scope.btnPKO_show = true; // $scope.payments.some(function (item) { return item.ispko === false; });
                                   $scope.btnRKO_show = $scope.payments.some(function (item) { return item.ispko == true; });

                                   // показывать форму ввода суммы после того как был создан первый ПКО
                                   //$scope.showFormAddRko = ;

                                   console.log('$scope.btnPKO_show');
                                   console.log($scope.btnPKO_show);
                                   console.log('$scope.btnRKO_show');
                                   console.log($scope.btnRKO_show);

                                   $scope.btnBankRKO_show = !$scope.btnPKO_show;

                                   $scope.processing['load'] = false;
                               },
                               function () {
                                   $scope.processing['load'] = false;
                                   swal("ошибка загрузки платежей");
                               });
                   }

                   $scope.loadPayments();

               }])
        }
    })
}