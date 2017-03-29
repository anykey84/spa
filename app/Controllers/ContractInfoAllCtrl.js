export default (ngModule) => {
    ngModule.controller('ContractInfoAllCtrl', ['$scope', '$window', '$routeParams', 'Profile', 'profileService', 'officeService', 'Office',
        function ($scope, $window, $routeParams, Profile, profileService, officeService, Office) {

            //if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabCard")) {
            //    $window.location.href = '/';
            //    return;
            //}

            $scope.contract = {
                id: $routeParams.par,
                number: 0,
                owner: 0,
                dateCreate: '',
                lastStatus: 0
            };

            $scope.messages = [];
            $scope.message = "";
            $scope.processing = {};

            $scope.VisibleButtonDeleteFileContract = false;
            $scope.VisibleButtonDownloadFileContract = false;

            $scope.VisibleTabContract_Status = false;
            $scope.VisibleTabContract_Payment = false;
            $scope.VisibleTabContract_LoanInfo = false;
            $scope.VisibleTabContract_Person = false;
            $scope.VisibleTabContract_ContractParameter = false;
            $scope.VisibleTabContract_Task = false;

            var editTemplates = {
                'infoalltemplate': '/Contract/InfoAllTemplate',
            };

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

            $scope.loadRoles = function () {

                $scope.processing['loadRoles'] = true;
                $scope.message = "загрузка текущего офиса";

                profileService
                   .getRoles()
                   .then(function (result) {
                       $scope.processing['loadRoles'] = false;
                       Profile.InitRoles(result.data);

                       $scope.InitVisible();

                       $scope.loadCurrentOffice();
                   },
                   function () {
                       $scope.processing['loadRoles'] = false;
                       alert("ошибка загрузки");
                   });
            }
            $scope.loadRoles();


            $scope.visibleselectoffice = false;
            $scope.loadCurrentOffice = function () {

                $scope.processing['loadCurrentOffice'] = true;
                $scope.message = "загрузка текущего офиса";

                officeService
                     .getCurrentOffice()
                     .then(function (result) {

                         $scope.processing['loadCurrentOffice'] = false;

                         Office.Init(result.data);

                         if (Office.IsInit()) {
                             $scope.visibleselectoffice = false;
                             $scope.panelId = 'infoalltemplate';
                             return;
                         }
                         $scope.visibleselectoffice = true;
                     },
                     function () {
                         $scope.processing['loadCurrentOffice'] = false;
                         alert("ошибка при загрузке офисов");
                     });
            };

            $scope.$watch('panelId', function (panelId) {
                $scope.contactInfoAllPanelUrl = editTemplates[panelId];
            });
        }]);
}