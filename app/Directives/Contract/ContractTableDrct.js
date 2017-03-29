export default (ngModule) => {

    ngModule.directive('myContracttable', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./ContractTable.html'),
            scope: {
                contracts: '=contracts',
                loadcontracts: '&',
                isvisibleattach: '=?'
            },
            controller: (['$scope', 'Profile', 'Office', 'contractService', 'profileService',
                function ($scope, Profile, Office, contractService, profileService) {

                    $scope.profiles = [];
                    $scope.messages = [];
                    $scope.message = "";
                    $scope.processing = {};
                    $scope.isvisible = true;

                    $scope.VisibleAttachContractsProfileInWork = Profile.GetRolePropertyValue("VisibleAttachContractsProfileInWork") && $scope.isvisibleattach;

                    $scope.selectContractsAll = function (isSelectContractsAll) {
                        _.each($scope.contracts, function (item) { item.isSelected = isSelectContractsAll; });
                    }

                    $scope.loadProfilesInWork = function () {

                        $scope.processing['loadProfilesInWork'] = true;
                        $scope.message = "загрузка профилей";

                        profileService
                            .getProfilesInWork()
                            .then(function (result) {

                                $scope.processing['loadProfilesInWork'] = false;
                                angular.copy(result.data, $scope.profiles);
                                //console.log($scope.profiles);
                            },
                            function () {
                                $scope.processing['loadProfilesInWork'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                            });
                    }
                    $scope.loadProfilesInWork();

                    $scope.detachContractsProfileInWork = function () {

                        $scope.messages.length = 0;

                        var selectedcontracts = _.filter($scope.contracts, function (c) { return c.isSelected == true; });

                        var str = "";
                        _.each(selectedcontracts, function (c) { str = str + c.id_Contract + '#'; });

                        if (_.isNil(str)) {
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали ни одной карточки для открепления!!!!' });
                            return;
                        }

                        var data = {
                            idOffice: Office.GetOfficeId(),
                            comment: $scope.commentContract,
                            contracts: str
                        }

                        $scope.processing['detachContractsProfileInWork'] = true;
                        $scope.message = "открепление";

                        contractService
                             .detachContractsInWork(data)
                             .then(function (result) {
                                 $scope.visibleFormAttach = false;
                                 $scope.processing['detachContractsProfileInWork'] = false;
                                 $scope.loadcontracts();
                             },
                             function () {
                                 $scope.processing['detachContractsProfileInWork'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка открепления' });
                             });

                    }

                    $scope.attachContractsProfileInWork = function () {

                        $scope.messages.length = 0;

                        var selectedcontracts = _.filter($scope.contracts, function (c) { return c.isSelected == true; });

                        var str = "";
                        _.each(selectedcontracts, function (c) { str = str + c.id_Contract + '#'; });

                        if (_.isNil(str)) {
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали ни одной карточки для закрепления!!!!' });
                        }

                        if (_.isNil($scope.selectedContractProfile)) {
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали сотрудника для закрепления!!!!' });
                        }

                        if ($scope.messages.length > 0) {
                            return;
                        }

                        var data = {
                            idProfile: $scope.selectedContractProfile.id,
                            idOffice: Office.GetOfficeId(),
                            comment: $scope.commentContract,
                            contracts: str
                        }

                        //console.log(data);

                        $scope.processing['attachContractsProfileInWork'] = true;
                        $scope.message = "закрепление";

                        contractService
                            .attachContractsInWork(data)
                            .then(function (result) {
                                $scope.visibleFormAttach = false;
                                $scope.processing['attachContractsProfileInWork'] = false;
                                $scope.loadcontracts();
                            },
                            function () {
                                $scope.processing['attachContractsProfileInWork'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка закрепления' });
                            });

                    }

                }])
        }
    })
}