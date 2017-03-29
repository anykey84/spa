export default (ngModule) => {
    ngModule.controller('PersonInfoAllCtrl', ['$scope', '$window', '$routeParams', 'Profile', 'profileService', 'officeService', 'Office', 'Person',
        function ($scope, $window, $routeParams, Profile, profileService, officeService, Office, Person) {

            //if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabPerson")) {
            //    $window.location.href = '/';
            //    return;
            //}

            $scope.person = {
                id: $routeParams.par
            }

            Person.Init($scope.person.id);


            $scope.messages = [];
            $scope.message = "";
            $scope.processing = {};

            $scope.VisibleTabPerson_Loan = false;
            $scope.VisibleTabPerson_Passport = false;
            $scope.VisibleTabPerson_Phone = false;
            $scope.VisibleTabPerson_Foto = false;
            $scope.VisibleTabPerson_Work = false;
            $scope.VisibleTabPerson_MaterialStatus = false;
            $scope.VisibleTabPerson_AdditionalInfo = false;
            $scope.VisibleTabPerson_AdditionalDoc = false;
            $scope.VisibleTabPerson_Bank = false;
            $scope.VisibleTabPerson_Questionnaire = false;
            $scope.VisibleTabPerson_PersonAllInfo = false;
            $scope.VisibleTabPerson_Task = false;
            $scope.VisibleTabPerson_CreditHistory = false;

            var editTemplates = {
                'infoalltemplate': '/Person/InfoAllTemplate',
            };

            $scope.InitVisible = function () {
                $scope.VisibleTabPerson_Loan = Profile.GetRolePropertyValue("VisibleTabPerson_Loan");
                $scope.VisibleTabPerson_Passport = Profile.GetRolePropertyValue("VisibleTabPerson_Passport");
                $scope.VisibleTabPerson_Phone = Profile.GetRolePropertyValue("VisibleTabPerson_Phone");
                $scope.VisibleTabPerson_Foto = Profile.GetRolePropertyValue("VisibleTabPerson_Foto");
                $scope.VisibleTabPerson_Work = Profile.GetRolePropertyValue("VisibleTabPerson_Work");
                $scope.VisibleTabPerson_MaterialStatus = Profile.GetRolePropertyValue("VisibleTabPerson_MaterialStatus");
                $scope.VisibleTabPerson_AdditionalInfo = Profile.GetRolePropertyValue("VisibleTabPerson_AdditionalInfo");
                $scope.VisibleTabPerson_AdditionalDoc = Profile.GetRolePropertyValue("VisibleTabPerson_AdditionalDoc");
                $scope.VisibleTabPerson_Bank = Profile.GetRolePropertyValue("VisibleTabPerson_Bank");
                $scope.VisibleTabPerson_Questionnaire = Profile.GetRolePropertyValue("VisibleTabPerson_Questionnaire");
                $scope.VisibleTabPerson_PersonAllInfo = Profile.GetRolePropertyValue("VisibleTabPerson_PersonAllInfo");
                $scope.VisibleTabPerson_Task = Profile.GetRolePropertyValue("VisibleTabPerson_Task");
                $scope.VisibleTabPerson_CreditHistory = Profile.GetRolePropertyValue("VisibleTabPerson_CreditHistory");
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
                $scope.personInfoAllPanelUrl = editTemplates[panelId];
            });


        }]);
}