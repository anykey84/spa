export default (ngModule) => {
    ngModule.controller('ContractCtrl', ['$scope', '$window', '$http', 'contractService', 'profileService', 'Profile', 'Contract', 'Office', 
        function ($scope, $window, $http, contractService, profileService, Profile, Contract, Office) {

            if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabCard")) {
                $window.location.href = '/';
                return;
            }           

            $scope.messages = [];
            $scope.message = "";
            $scope.processing = {};
            $scope.contracts = [];

            var editTemplates = {
                'contractsearch': '/Contract/ContractSearch',
            };

            $scope.$watch('panelId', function (panelId) {
                $scope.contactPanelUrl = editTemplates[panelId];
            });

            $scope.loadRoles = function () {

                $scope.processing['getRoles'] = true;
                $scope.message = "загрузка интерфейсов";

                profileService
                   .getRoles()
                   .then(function (result) {
                       Profile.InitRoles(result.data);
                       $scope.panelId = 'contractsearch';

                       $scope.processing['getRoles'] = false;
                       $scope.find();
                   },
                   function () {
                       $scope.processing['getRoles'] = false;
                       $scope.messages.push({ color: 'red', message: 'ошибка загрузки ролей' });
                   });
            }
            $scope.loadRoles();


            if (Contract.GetContractFindText() != '') {
                $scope.findtext = Contract.GetContractFindText();
            }
            else {
                //$scope.findtext = "милаев";
                //$scope.findtext = "20130610026000880";
                //$scope.findtext = "20140113030125593";
                $scope.findtext = "";
            }

            $scope.contractopen = function (id) {
                //ContractId.Init(id);
            }

            $scope.find = function () {

                if ($scope.findtext != '') {
                    Contract.InitText($scope.findtext);

                    $scope.processing['find'] = true;
                    $scope.message = "поиск по договорам";

                    contractService
                        .getContract($scope.findtext)
                        .then(function (result) {
                            $scope.processing['find'] = false;
                            angular.copy(result.data, $scope.contracts);
                            //console.log($scope.contracts);
                        },
                        function () {
                            $scope.processing['find'] = false;
                            $scope.messages.push({ color: 'red', message: 'ошибка поиска по договорам' });
                        });
                }
                else {
                    $scope.contracts = [];
                    Contract.InitText('');
                }
            }

        }]);
}