export default (ngModule) => {
    ngModule.controller('ContractInfoCtrl', ['$scope', '$window', '$routeParams', 'Profile', 'profileService', 'personService', 'Office',
        function ($scope, $window, $routeParams, Profile, profileService, personService, Office) {

            //если офис не определен, перенаправление на главную страницу
            if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabCard")) {
                //$window.location.href = '/';
                //return;
            }


            $scope.isNew = _.isNil($routeParams.par);   // True if value is undefined

            $scope.contract = {
                id: $routeParams.par,
                number: 0,
                owner: 0,
                dateCreate: '',
                lastStatus: 0
            };

            console.log($scope.contract);

            $scope.office = {
                id: Office.GetOfficeId()
            }

            $scope.VisibleButtonDeleteFileContract = false;
            $scope.VisibleButtonDownloadFileContract = false;

            $scope.VisibleTabContract_Status = false;
            $scope.VisibleTabContract_Payment = false;
            $scope.VisibleTabContract_LoanInfo = false;
            $scope.VisibleTabContract_Person = false;
            $scope.VisibleTabContract_ContractParameter = false;
            $scope.VisibleTabContract_Task = false;

            $scope.InitVisible = function () {
                $scope.VisibleButtonDeleteFileContract = Profile.GetRolePropertyValue("VisibleButtonDeleteFileContract");
                $scope.VisibleButtonDownloadFileContract = Profile.GetRolePropertyValue("VisibleButtonDownloadFileContract");

                $scope.VisibleTabContract_Status = Profile.GetRolePropertyValue("VisibleTabContract_Status");
                $scope.VisibleTabContract_Payment = Profile.GetRolePropertyValue("VisibleTabContract_Payment");
                $scope.VisibleTabContract_LoanInfo = Profile.GetRolePropertyValue("VisibleTabContract_LoanInfo");
                $scope.VisibleTabContract_Person = Profile.GetRolePropertyValue("VisibleTabContract_Person");
                $scope.VisibleTabContract_ContractParameter = Profile.GetRolePropertyValue("VisibleTabContract_ContractParameter");
                $scope.VisibleTabContract_Task = Profile.GetRolePropertyValue("VisibleTabContract_Task");
                
            }

            var editTemplates = {
                'status': '/Contract/ContractStatus',
                'phoneanalysis': '/Contract/ContractPhoneAnalysis',
                'payment': '/Contract/ContractPayment',
                'loaninfo': '/Contract/ContractLoanInfo',
                'person': '/Contract/ContractPerson',
                'contractparameter': '/Contract/ContractParameter',
                'task': '/Contract/ContractTask'
            };
            //getContractInSB
            $scope.$watch('panelId', function (panelId) {
                $scope.contactInfoPanelUrl = editTemplates[panelId];
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
                    $scope.panelId = 'loaninfo';
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