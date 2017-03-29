export default (ngModule) => {

    ngModule.directive('myContractInWork', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./ContractInWork.html'),
            scope: {
            },
            controller: (['$scope', 'contractService', 'profileService', 'Profile', 'Office',
                function ($scope, contractService, profileService, Profile, Office) {

                    $scope.messages = [];
                    $scope.processing = {};
                    $scope.message = "";

                    $scope.VisibleContractInWork = Profile.GetRolePropertyValue("VisibleContractInWork");

                    $scope.countFrom = 0;
                    $scope.countTo = 0;
                    $scope.contractNumber = null;

                    $scope.contracts = [];
                    //$scope.profiles = [];
                    //$scope.selectedProfile = null;

                    //$scope.profileChanged = function (item) {
                    //    $scope.selectedProfile = item;
                    //}

                    //$scope.loadProfilesInWork = function () {

                    //    $scope.processing['loadProfilesInWork'] = true;
                    //    $scope.message = "загрузка профилей";

                    //    profileService
                    //        .getProfilesInWork()
                    //        .then(function (result) {
                    //            $scope.processing['loadProfilesInWork'] = false;
                    //            angular.copy(result.data, $scope.profiles);
                    //            //console.log($scope.profiles);
                    //        },
                    //        function () {
                    //            $scope.processing['loadProfilesInWork'] = false;
                    //            swal("ошибка загрузки");
                    //        });
                    //}
                    //$scope.loadProfilesInWork();

                    //$scope.detachContractsInWork = function () {

                    //    var selectedContracts = _.filter($scope.contracts, function (c) { return c.isSelected == true; });

                    //    var str = "";
                    //    _.each(selectedContracts, function (c) { str = str + c.id + '#'; });

                    //    if (angular.isUndefined(str)) {
                    //        swal("вы не выбрали ни одной карточки для открепления!!!!");
                    //        return;
                    //    }

                    //    var data = { 
                    //        idOffice: Office.GetOfficeId(),
                    //        contracts: str
                    //    }

                    //    console.log(data);

                    //    $scope.processing['detachContractsInWork'] = true;
                    //    $scope.message = "открепление";

                    //    contractService
                    //        .detachContractsInWork(data)
                    //        .then(function (result) {
                    //            $scope.processing['detachContractsInWork'] = false;
                    //            $scope.loadContractsInWork();
                    //        },
                    //        function () {
                    //            $scope.processing['detachContractsInWork'] = false;
                    //            swal("ошибка открепления");
                    //        });

                    //}

                    //$scope.attachContractsInWork = function () {

                    //    var selectedContracts = _.filter($scope.contracts, function (c) { return c.isSelected == true; });

                    //    var str = "";
                    //    _.each(selectedContracts, function (c) { str = str + c.id + '#'; });

                    //    if (angular.isUndefined(str)) {
                    //        $scope.messages.push({ color: 'red', message: 'вы не выбрали ни одной карточки для закрепления!!!!' });
                    //        return;
                    //    }

                    //    if (angular.isUndefined($scope.selectedProfile)) {
                    //        $scope.messages.push({ color: 'red', message: 'вы не выбрали сотрудника для закрепления!!!!' });
                    //        return;
                    //    }

                    //    var data = {
                    //        idProfile: $scope.selectedProfile.id,
                    //        idOffice: Office.GetOfficeId(),
                    //        contracts: str
                    //    }

                    //    console.log(data);

                    //    $scope.processing['attachContractsInWork'] = true;
                    //    $scope.message = "закрепление";

                    //    contractService
                    //        .attachContractsInWork(data)
                    //        .then(function (result) {
                    //            $scope.processing['attachContractsInWork'] = false;
                    //            $scope.loadContractsInWork();
                    //        },
                    //        function () {
                    //            $scope.processing['attachContractsInWork'] = false;
                    //            swal("ошибка закрепления");
                    //        });

                    //}

                    //$scope.selectAll = function (isSelectAll) {
                    //    _.each($scope.contracts, function (item) { item.isSelected = isSelectAll; });
                    //}

                    $scope.loadContractsInWork = function () {

                        var data = {
                            idOffice: Office.GetOfficeId(),
                            countFrom: $scope.countFrom,
                            countTo: $scope.countTo,
                            contractNumber: $scope.contractNumber
                        };

                        if ($scope.contractNumber == "") {
                            data.contractNumber = null;
                        }

                        $scope.processing['loadContractsInWork'] = true;
                        $scope.message = "загрузка договоров";

                        contractService
                            .getContractsInWork(data)
                            .then(function (result) {
                                $scope.processing['loadContractsInWork'] = false;
                                angular.copy(result.data, $scope.contracts);
                                _.each($scope.contracts, function (item) { item.isSelected = false; });
                                console.log('sdasdasdas');
                                console.log($scope.contracts);
                            },
                            function () {
                                $scope.processing['loadContractsInWork'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                            });
                    }

                }])
        }
    })
}