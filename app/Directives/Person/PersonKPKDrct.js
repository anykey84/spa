export default (ngModule) => {

    ngModule.directive('myPersonKpk', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonKPK.html'),
            scope: {
                person: '='
            },
            controller: (['$scope', '$filter', '$routeParams', 'reportService', 'personKPKService', 'paymentService', 'Office', 'Profile',
                function ($scope, $filter, $routeParams, reportService, personKPKService, paymentService, Office, Profile) {

                    //$scope.isNew = _.isNil($routeParams.par);
                    //if ($scope.isNew) return;

                    //$scope.person = {
                    //    id: $routeParams.par
                    //}

                    $scope.processing = {};

                    $scope.sumNecessary = 0;
                    $scope.sumEntrance = 100;

                    $scope.messages = [];
                    $scope.message = "";

                    $scope.dateOperation = new Date() //$filter("date")(Date.now(), 'yyyy-MM-dd');

                    $scope.personKPKInfo = {};
                    $scope.kpks = [];

                    $scope.paymentkpks = [];

                    $scope.VisibleFormInKPK = false; //Profile.GetRolePropertyValue("VisibleButtonAddCard");
                    $scope.VisibleFormOutKPK = false; //Profile.GetRolePropertyValue("VisibleButtonAddCard");
                    $scope.VisibleButtonDeleteKPKPayment = false; //Profile.GetRolePropertyValue("VisibleButtonAddCard");

                    $scope.VisibleButtonExpelledFromKPK = Profile.GetRolePropertyValue("VisibleButtonExpelledFromKPK");

                    $scope.loadKPKInfo = function () {
                        $scope.processing['loadKPKInfo'] = true;
                        $scope.message = "загрузка данных о КПК";

                        personKPKService
                            .getKPKInfo($scope.person.id)
                            .then(function (result) {

                                $scope.personKPKInfo = {};

                                angular.copy(result.data.list, $scope.kpks);

                                console.log($scope.kpks)

                                if (_.isNil(result.data.current)) {
                                    //$scope.personKPKInfo = null;
                                    angular.copy(result.data.list[0], $scope.personKPKInfo);
                                }
                                else {
                                    angular.copy(result.data.current, $scope.personKPKInfo);
                                }

                                let inKPK = _.isNil($scope.personKPKInfo.dateInKPK);
                                let outKPK = !inKPK;
                                $scope.VisibleFormInKPK = inKPK;
                                $scope.VisibleFormOutKPK = outKPK;

                                //console.log($scope.VisibleFormOutKPK);

                                $scope.processing['loadKPKInfo'] = false;

                                $scope.loadPaymentKPKs();
                            },
                            function () {
                                $scope.processing['loadKPKInfo'] = false;
                                swal("ошибка загрузки");
                            });
                    }

                    $scope.loadKPKInfo();

                    $scope.loadPaymentKPKs = function () {
                        $scope.processing['loadPaymentKPKs'] = true;
                        $scope.message = "загрузка паевых взносов";

                        personKPKService
                            .paymentkpks($scope.person.id)
                            .then(function (result) {

                                console.log(result.data);
                                angular.copy(result.data.list, $scope.paymentkpks);

                                if (_.isNil($scope.personKPKInfo)) {
                                    $scope.VisibleButtonPKONecessary = false;
                                    $scope.VisibleButtonPKOEntrance = false;
                                }
                                else {

                                    if (_.isNil(result.data.necessary)) {
                                        $scope.VisibleButtonPKONecessary = true;
                                        $scope.VisibleButtonPKOEntrance = false;
                                    }
                                    else {
                                        // получить данные о обязательном 
                                        // получить данные о вступительном

                                        if (_.isNil(result.data.entrance)) {
                                            $scope.VisibleButtonPKONecessary = false;
                                            $scope.VisibleButtonPKOEntrance = true;
                                        }
                                        else {
                                            $scope.VisibleButtonPKONecessary = false;
                                            $scope.VisibleButtonPKOEntrance = false;
                                        }
                                    }
                                }

                                $scope.processing['loadPaymentKPKs'] = false;
                            },
                            function () {
                                $scope.processing['loadPaymentKPKs'] = false;
                                swal("ошибка загрузки");
                            });
                    }

                    $scope.inKPK = function () {
                    
                        let data = {
                            idPerson: $scope.person.id,
                            dateOperation: ($scope.dateOperation).toDateString(),
                            idOffice: Office.GetOfficeId()
                        }
                        console.log(data.dateOperation);
                        //return;

                        $scope.processing['inKPK'] = true;
                        $scope.message = "вступление в КПК";

                        personKPKService
                            .inKPK(data)
                            .then(function (result) {
                                if (!_.isNil(result)
                                    && !_.isNil(result.data)
                                    && Array.isArray(result.data)
                                    && result.data.length > 0) {
                                    $scope.messages = result.data;
                                }

                                $scope.loadKPKInfo();

                                $scope.processing['inKPK'] = false;
                            },
                            function () {
                                $scope.processing['inKPK'] = false;
                                swal("ошибка загрузки");
                            });
                    }

                    $scope.outKPK = function () {

                        let data = {
                            idPerson: $scope.person.id,
                            dateOperation: new Date($scope.dateOperation).toDateString(),
                            idOffice: Office.GetOfficeId()
                        }

                        $scope.processing['outKPK'] = true;
                        $scope.message = "выход из КПК";

                        personKPKService
                            .outKPK(data)
                            .then(function (result) {

                                $scope.loadKPKInfo();

                                $scope.processing['outKPK'] = false;
                            },
                            function () {
                                $scope.processing['outKPK'] = false;
                                swal("ошибка загрузки");
                            });
                    }

                    $scope.addPaymentNecessary = function () {

                        let data = {
                            idPerson: $scope.person.id,
                            dateOperation: ($scope.personKPKInfo.dateInKPK), // $scope.dateOperation,
                            idOffice: Office.GetOfficeId(),
                            sum: $scope.sumNecessary,
                            isPKO: true
                        }

                        $scope.processing['addPaymentNecessary'] = true;
                        $scope.message = "добавление обязательного паевого взноса";
                        //console.log(data);

                        paymentService
                            .addPaymentNecessary(data)
                            .then(function (result) {

                                $scope.loadPaymentKPKs();

                                $scope.processing['addPaymentNecessary'] = false;
                            },
                            function () {
                                $scope.processing['addPaymentNecessary'] = false;
                                swal("ошибка загрузки", "", "error");
                            });
                    }

                    $scope.addPaymentRKONecessary = function () {

                        let data = {
                            idPerson: $scope.person.id,
                            dateOperation: new Date($scope.dateOperation).toDateString(),
                            idOffice: Office.GetOfficeId(),
                            isPKO: false
                        }

                        $scope.processing['addPaymentRKONecessary'] = true;
                        $scope.message = "добавление возврата обязательного паевого взноса";

                        paymentService
                            .addPaymentNecessary(data)
                            .then(function (result) {

                                $scope.outKPK();

                                $scope.processing['addPaymentRKONecessary'] = false;
                            },
                            function () {
                                $scope.processing['addPaymentRKONecessary'] = false;
                                swal("ошибка загрузки");
                            });
                    }

                    $scope.addPaymentEntrance = function () {

                        let data = {
                            idPerson: $scope.person.id,
                            dateOperation: ($scope.personKPKInfo.dateInKPK), // $scope.dateOperation,
                            idOffice: Office.GetOfficeId(),
                            sum: $scope.sumEntrance,
                            isPKO: true
                        }

                        console.log(data);

                        $scope.processing['addPaymentEntrance'] = true;
                        $scope.message = "добавление вступительного паевого взноса";

                        paymentService
                            .addPaymentEntrance(data)
                            .then(function (result) {

                                $scope.loadPaymentKPKs();

                                $scope.processing['addPaymentEntrance'] = false;
                            },
                            function () {
                                $scope.processing['addPaymentEntrance'] = false;
                                swal("ошибка загрузки");
                            });
                    }

                    $scope.createFilePayment = function (item) {
                        $scope.processing[item.id] = true;
                        $scope.processing['loadPaymentKPKs'] = true;
                        $scope.message = "загрузка паевых взносов";

                        let data = {
                            id: 0,
                            idOffice: Office.GetOfficeId(),
                            idContract: null,
                            idPayment: item.id,
                            reportType: item.ispko ? 'credit' : 'debit',
                            dateReport: null
                        };
                        //console.log(moment(new Date()).format('YYYY-MM-DD'));
                        reportService
                            .generateReport(data)
                            .then(function (result) {
                                $scope.loadPaymentKPKs();
                                $scope.processing['loadPaymentKPKs'] = false;
                                $scope.processing[item.id] = false;
                            },
                            function () {
                                $scope.processing['loadPaymentKPKs'] = false;
                                $scope.processing[item.id] = false;
                                swal("ошибка генерации файла на сервере", '', 'error');
                            });
                    }


                    $scope.expelledfromkpkmessages = [];
                
                    $scope.expelledFromKPK = function () {

                        let data = {
                            idPerson: $scope.person.id,
                            dateOperation: new Date($scope.dateExpelledFromKPK).toDateString(), // $scope.dateOperation,
                            idOffice: Office.GetOfficeId(),
                            sum: $scope.sumExpelledFromKPK,
                            isPKO: true
                        }

                        $scope.processing['expelledFromKPK'] = true;
                        $scope.message = "добавление вступительного паевого взноса";

                        personKPKService
                            .expelledFromKPK(data)
                            .then(function (result) {

                                angular.copy(result.data, $scope.expelledfromkpkmessages);
                                let errors = _.where($scope.expelledfromkpkmessages, { isError: true });

                                //console.log($scope.expelledfromkpkmessages);
                                //console.log(errors);
                                //console.log(errors.length);
                                //console.log(errors.length == 0);

                                if (errors.length == 0) {
                                    $scope.dateExpelledFromKPK = '';
                                    $scope.sumExpelledFromKPK = null;
                                    $scope.loadPaymentKPKs();
                                }


                                $scope.processing['expelledFromKPK'] = false;
                            },
                            function () {
                                $scope.processing['expelledFromKPK'] = false;
                                swal("ошибка загрузки");
                            });
                    }

                    $scope.paydobrokpkmessages = [];

                    $scope.clickPayDobro = function (isPKO) {

                        let data = {
                            idPerson: $scope.person.id,
                            dateOperation: new Date($scope.datePayDobro).toDateString(), // $scope.dateOperation,
                            idOffice: Office.GetOfficeId(),
                            sum: $scope.sumPayDobro,
                            isPKO: isPKO
                        }

                        $scope.processing['clickPayDobro'] = true;
                        $scope.message = "добавление добровольного паевого взноса";

                        personKPKService
                            .payDobro(data)
                            .then(function (result) {

                                angular.copy(result.data, $scope.paydobrokpkmessages);
                                let errors = _.where($scope.paydobrokpkmessages, { isError: true });

                                //console.log($scope.expelledfromkpkmessages);
                                //console.log(errors);
                                //console.log(errors.length);
                                //console.log(errors.length == 0);

                                if (errors.length == 0) {
                                    $scope.sumPayDobro = null;
                                    $scope.datePayDobro = '';
                                    $scope.loadPaymentKPKs();
                                }


                                $scope.processing['clickPayDobro'] = false;
                            },
                            function () {
                                $scope.processing['clickPayDobro'] = false;
                                swal("ошибка загрузки");
                            });
                    }

                }])
        }
    })
}