export default (ngModule) => {

    ngModule.directive('myOffice', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./Office.html'),
            scope: {
            },
            controller: (['$scope', 'Office', 'officeService',
                function ($scope, Office, officeService) {

                    $scope.messages = [];
                    $scope.message = "";
                    $scope.processing = {};

                    $scope.selectParent = {};
                    $scope.selectOfficeType = {};

                    $scope.officetypes = [];
                    $scope.findoffices = [];
                    $scope.find = "";

                    $scope.offices = [];
                    $scope.officeregions = [];
                
                    $scope.address = {};
                    $scope.address.id_Address = 0;

                    $scope.idOffice = null;

                    $scope.init = function (item) {

                        //console.log('инициализация');
                        //console.log(item);

                        $scope.address = {};
                        $scope.address.id_Address = 0;
                        $scope.address.country = "";
                        $scope.address.region = "";
                        $scope.address.city = "";
                        $scope.address.postIndex = "";
                        $scope.address.street = "";
                        $scope.address.building = "";
                        $scope.address.flat = "";
                        $scope.address.house = "";

                        if (item == null) {
                            $scope.idOffice = 0;
                            $scope.name = "";
                            $scope.judgeNumber = "";
                            $scope.juridicalRegion = "";
                            $scope.selectParent = null;
                            $scope.selectOfficeType = null;
                        }
                        else {
                            $scope.idOffice = item.id;
                            $scope.name = item.name;
                            $scope.judgeNumber = item.judgeNumber;
                            $scope.juridicalRegion = item.juridicalRegion;

                            $scope.address.id_Address = item.id_Address;

                            $scope.selectParent = _.find($scope.offices, function (i) {
                                return i.id == item.id_Parent;
                            });

                            $scope.selectOfficeType = _.find($scope.officetypes, function (i) {
                                return i.id == item.id_OfficeType;
                            });
                        }
                    }


                    $scope.loadOfficeTypes = function () {

                        $scope.processing['loadOfficeTypes'] = true;
                        $scope.message = "загрузка типов офисов";

                        officeService
                             .getOfficeTypes()
                             .then(function (result) {
                                 angular.copy(result.data, $scope.officetypes);
                                 //console.log($scope.officetypes);
                                 $scope.processing['loadOfficeTypes'] = false;
                             },
                             function () {
                                 $scope.processing['loadOfficeTypes'] = false;
                                 swal("ошибка при загрузке типов офисов");
                             });

                    };
                    $scope.loadOfficeTypes();

                    $scope.loadFindOffices = function () {

                        var data = {
                            find: $scope.find,
                            isDeleted: 0
                        }

                        $scope.processing['loadFindOffices'] = true;
                        $scope.message = "загрузка офисов";

                        officeService
                             .getOfficesAll(data)
                             .then(function (result) {
                                 angular.copy(_.filter(result.data, function (c) { return c.id_OfficeType == 3; }), $scope.findoffices);
                                 $scope.processing['loadFindOffices'] = false;
                             },
                             function () {
                                 $scope.processing['loadFindOffices'] = false;
                                 swal("ошибка при загрузке офисов");
                             });
                    };
                    $scope.loadFindOffices();

                    $scope.loadOffices = function () {

                        var data = {
                            find: "",
                            isDeleted: 0
                        }

                        $scope.processing['loadOffices'] = true;
                        $scope.message = "загрузка офисов";

                        officeService
                             .getOfficesAll(data)
                             .then(function (result) {
                                 angular.copy(result.data, $scope.offices);
                                 angular.copy(_.filter($scope.offices, function (c) { return c.id_OfficeType == 1 || c.id_OfficeType == 4; }), $scope.officeregions);
                                 //var regions = 
                                 $scope.processing['loadOffices'] = false;
                             },
                             function () {
                                 $scope.processing['loadOffices'] = false;
                                 swal("ошибка при загрузке офисов");
                             });
                    };
                    $scope.loadOffices();

                    $scope.saveOffice = function () {

                        var data = {
                            idOffice: Office.GetOfficeId(),

                            id: $scope.idOffice,
                            name: $scope.name,
                            idParent: $scope.selectParent.id,
                            idOfficeType: $scope.selectOfficeType.id,
                            judgeNumber: $scope.judgeNumber,
                            juridicalRegion: $scope.juridicalRegion,

                            country: $scope.address.country,
                            region: $scope.address.region,
                            city: $scope.address.city,
                            postIndex: $scope.address.postIndex,
                            street: $scope.address.street,
                            building: $scope.address.building,
                            flat: $scope.address.flat,
                            house: $scope.address.house
                        }

                        //console.log(data);
                        //return;

                        // $scope.find = ""; //$scope.name;

                        $scope.processing['saveOffice'] = true;
                        $scope.message = "сохранение офиса";

                        officeService
                            .saveOffice(data)
                            .then(function (result) {
                                $scope.processing['saveOffice'] = false;
                                $scope.loadFindOffices();
                                $scope.loadOffices();
                            },
                            function () {
                                $scope.processing['saveOffice'] = false;
                                swal("ошибка при сохранении офиса");
                            });
                    }

                    $scope.deleteOffice = function (id) {

                        var data = {
                            idOffice: id
                        }

                        $scope.processing['deleteOffice'] = true;
                        $scope.message = "удаление офиса";

                        officeService
                            .deleteOffice(data)
                            .then(function (result) {
                                $scope.processing['deleteOffice'] = false;
                                $scope.loadFindOffices();
                            },
                            function () {
                                $scope.processing['deleteOffice'] = false;
                                swal("ошибка при удалении офиса");
                            });
                    }


                }])
        }
    })
}