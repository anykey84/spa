'use strict';

appMain.directive('myPaymentsalary', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Ticket/PaymentSalary',
        scope: {
        },
        controller: (['$scope', 'paymentService', 'Office', 'profileService', '$filter',
            function ($scope, paymentService, Office, profileService, $filter) {

                $scope.selectedProfile;
                $scope.profiles = []
                $scope.message = '';
                $scope.messages = [];
                $scope.processing = [];
                $scope.sum = 0;
                //$scope.datePay = $filter('date')(new Date(), 'yyyy-MM-dd');
                $scope.datePay = ''

                $scope.loadProfiles = function () {

                    $scope.message = 'Загрузка профилей сотрудников';
                    $scope.processing['loadProfiles'] = true;

                    profileService
                        .getProfilesInWork().
                        then(function (result) {
                            $scope.profiles = result.data;
                            $scope.processing['loadProfiles'] = false;

                        }, function () {

                            $scope.message = 'Ошибка загрузки профилей!';
                        });
                };

                $scope.addPaymentSalary = function () {
                    $scope.messages.length = 0;

                    if (angular.isUndefinedOrNull($scope.selectedProfile) || angular.isUndefinedOrNull($scope.selectedProfile.id))
                    {
                        $scope.messages.push({message:'Не выбран сотрудник', color:'red'});
                        return;
                    }
                    var data = {
                        sum: $scope.sum,
                        idOffice: Office.GetOfficeId(),
                        isPKO: 0,
                        idTargetUser: $scope.selectedProfile.id,
                        datePay: new Date($scope.datePay)
                    };

                    console.log('data for sending to api: ', data);
                    $scope.processing['addPaymentSalary'] = true;
                    $scope.message = 'Добавление платежа';

                    paymentService
                        .addPaymentSalary(data).
                        then(function (result) {
                            console.log('Вернулось:', result.data);
                            $scope.processing['addPaymentSalary'] = false;

                        }, function () {
                            $scope.messages.push({ message: 'Ошибка при добавлении платежа', color: 'red' });
                            $scope.processing['addPaymentSalary'] = false;
                        });

                };


                $scope.profileSelect = function () {
                    //console.log('Выбрано: ', $scope.selectedProfile);
                };

                $scope.loadProfiles();
                 

        }])
    };
});