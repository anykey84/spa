export default (ngModule) => {

    ngModule.directive('myOfficeSelect', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./OfficeSelect.html'),
            scope: {
                isload: '=?'
            },
            controller: (['$scope', '$route', 'Office', 'officeService',
                function ($scope, $route, Office, officeService) {

                    //$scope.$watch("isload", function (isload) {
                    //    //console.log('изменение isload в myOfficeSelect');
                    //    //console.log(isload);
                    //    //if ()
                    //});
                    //$scope.click = function () {
                    //    $scope.isload = true;
                    //};

                    $scope.messages = [];
                    $scope.officeusers = [];
                    $scope.currentoffice = {};
                    $scope.message = "";
                    $scope.processing = {};

                    $scope.selectIdOffice = null;
                    $scope.selectIdOffice_User = null;

                    $scope.selectOffice = {
                        index: null
                    }

                    $scope.officeChanged = function ($index) {
                        $scope.selectOffice.index = $index;
                        $scope.selectIdOffice = this.item.id_Office;
                        $scope.selectIdOffice_User = this.item.id_Office_User;
                    };

                    $scope.selectOffice = function () {

                        var data = {
                            id_Office: $scope.selectIdOffice,
                            id_Office_User: $scope.selectIdOffice_User
                        };

                        $scope.processing['selectOffice'] = true;
                        $scope.message = "сохранение текущего офиса";
                        officeService
                             .selectOffice(data)
                             .then(function (result) {
                                 $scope.processing['selectOffice'] = false;

                                 $route.reload();
                                 $scope.$emit('changeOffice', 'Офис изменен');

                             },
                             function () {
                                 $scope.processing['selectOffice'] = false;
                                 swal("ошибка при сохранении текущего офиса");
                             });
                    };

                    $scope.loadCurrentOffice = function () {

                        $scope.processing['loadCurrentOffice'] = true;
                        $scope.message = "загрузка текущего офиса";

                        officeService
                             .getCurrentOffice()
                             .then(function (result) {
                                 angular.copy(result.data, $scope.currentoffice);
                                 Office.Init($scope.currentoffice);
                                 $scope.isload = true;
                                 $scope.processing['loadCurrentOffice'] = false;
                                 if ($scope.currentoffice.id_Office !== undefined) {
                                     $scope.$emit('syncOffice', $scope.currentoffice);
                                 } else {
                                     toastr.error("Не выбрана торговая точка!");
                                     swal('Не выбрана торговая точка!', 'Укажите текущую торговую точку', 'warning');
                                     $location.path('/#/');
                                 }
                             },
                             function () {
                                 $scope.processing['loadCurrentOffice'] = false;
                                 swal("ошибка при загрузке офисов");
                             });

                    };
                    $scope.loadCurrentOffice();

                    $scope.loadOfficeUsers = function () {

                        $scope.processing['loadOfficeUsers'] = true;
                        $scope.message = "загрузка доступных офисов";

                        officeService
                             .getOfficeUsers()
                             .then(function (result) {
                                 console.log(result.data);
                                 angular.copy(result.data, $scope.officeusers);
                                 $scope.processing['loadOfficeUsers'] = false;
                             },
                             function () {
                                 $scope.processing['loadOfficeUsers'] = false;
                                 swal("ошибка при загрузке офисов");
                             });

                    };
                    $scope.loadOfficeUsers();


                }])
        }
    })
}