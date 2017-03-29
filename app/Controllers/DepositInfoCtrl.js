export default (ngModule) => {
    ngModule.controller('DepositInfoCtrl', ['$scope', '$window', '$routeParams', 'Profile', 'profileService', 'personService', 'Office',
        function ($scope, $window, $routeParams, Profile, profileService, personService, Office) {

            if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabCard")) {
                $window.location.href = '/';
                return;
            }

            $scope.isNew = _.isNil($routeParams.par);
            if ($scope.isNew) return;

            $scope.contract = {
                id: $routeParams.par,
                number: 0,
                owner: 0,
                dateCreate: null,
                lastStatus: 0
            };

            //console.log('внимание! изменить адрес!!');
            $scope.office = {
                id: Office.GetOfficeId()
            }

            $scope.VisibleButtonDeleteFileContract = false;
            $scope.VisibleButtonDownloadFileContract = false;

            $scope.VisibleTabDeposit_Status = true;
            $scope.VisibleTabDeposit_Payment = true;
            $scope.VisibleTabDeposit_LoanInfo = true;
            $scope.VisibleTabDeposit_Task = true;

            $scope.InitVisible = function () {
                $scope.VisibleButtonDeleteFileContract = Profile.GetRolePropertyValue("VisibleButtonDeleteFileContract");
                $scope.VisibleButtonDownloadFileContract = Profile.GetRolePropertyValue("VisibleButtonDownloadFileContract");

                //$scope.VisibleTabDeposit_LoanInfo = Profile.GetRolePropertyValue("VisibleTabContract_Status");
                //$scope.VisibleTabDeposit_Payment = Profile.GetRolePropertyValue("VisibleTabContract_Payment");
                //$scope.VisibleTabDeposit_LoanInfo = Profile.GetRolePropertyValue("VisibleTabContract_LoanInfo");
                //$scope.VisibleTabContract_Person = Profile.GetRolePropertyValue("VisibleTabContract_Person");
                //$scope.VisibleTabContract_ContractParameter = Profile.GetRolePropertyValue("VisibleTabContract_ContractParameter");
                //$scope.VisibleTabContract_Task = Profile.GetRolePropertyValue("VisibleTabContract_Task");
            }

            var editTemplates = {
                'status': '/Deposit/DepositStatus',
                'payment': '/Deposit/DepositPayment',
                'depositinfo': '/Deposit/DepositInfo',
                'task': '/Deposit/DepositTask'
            };
            //getContractInSB
            $scope.$watch('panelId', function (panelId) {
                $scope.depositInfoPanelUrl = editTemplates[panelId];
                if (panelId == 'task') {
                }
            });

            profileService
                .getRoles()
                .then(function (result) {
                    Profile.InitRoles(result.data);
                    $scope.InitVisible();
                    //console.log(result.data);
                    //$scope.loadCurrentOffice();
                    $scope.panelId = 'depositinfo';
                },
                function () {
                    //swal("ошибка загрузки ролей");
                });



            //$scope.loadCurrentOffice = function () {
            //    $scope.processing['loadCurrentOffice'] = true;
            //    $scope.message = "загрузка текущего офиса";

            //    officeService
            //         .getCurrentOffice()
            //         .then(function (result) {
            //             Office.Init(result.data);
            //             //console.log(Office.GetOfficeId());
            //             $scope.processing['loadCurrentOffice'] = false;
            //         },
            //         function () {
            //             $scope.processing['loadCurrentOffice'] = false;
            //             swal("ошибка при загрузке офисов");
            //         });

            //};

        }]);
}