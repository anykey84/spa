export default (ngModule) => {
    ngModule.controller('PersonInfoCtrl', ['$scope', '$window', '$http', '$routeParams', 'profileService', 'personDocumentService', 'personService', 'contractService', 'Profile', 'Office', 'Person',
        function ($scope, $window, $http, $routeParams, profileService, personDocumentService, personService, contractService, Profile, Office, Person) {

            //if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabPeople")) {
            //    $window.location.href = '/';
            //    return;
            //}

            $scope.isNew = _.isNil($routeParams.par);
            if ($scope.isNew) return;

            $scope.person = {
                id: $routeParams.par
            }

            $scope.toggleDropdown = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };

            $scope.personinfo = {};

            Person.Init($scope.person.id);

            //$scope.refreshPersonInfo = function () {
            //    console.log('refresh');
            //    console.log('$scope.personinfo');
            //    console.log($scope.personinfo);
            //    //$scope.VisibleTabPerson_Deposit = $scope.personinfo.isJuridical;
            //    //$scope.VisibleTabPerson_Loan = !$scope.personinfo.isJuridical;

            //    if ($scope.personinfo.isJuridical) {
            //        //$scope.panelId = 'deposit';
            //        $scope.loanName = 'Вклады';
            //    }
            //    else {
            //        //$scope.panelId = 'loan';
            //        $scope.loanName = 'Займы';
            //    }
            //}

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
                $scope.VisibleTabPerson_KPK = true; //Profile.GetRolePropertyValue("VisibleTabPerson_KPK");
            }

            var editTemplates = {
                'loan': '/Person/Loan',//
                'document': '/Person/Document',//
                'phone': '/Person/Phone',//
                'foto': '/Person/Foto', //
                'work': '/Person/Work',//
                'partner': '/Person/Partner',//
                'materialstatus': '/Person/MaterialStatus',
                'additionalinfo': '/Person/AdditionalInfo',//
                'additionaldoc': '/Person/AdditionalDoc',//
                'bank': '/Person/Bank',//
                'questionnaire': '/Person/Questionnaire',
                'personallinfo': '/Person/PersonAllInfo',//
                'credithistory': '/Person/CreditHistory',//
                'kpk': '/Person/KPK',//
                'deposit': '/Person/PersonDeposit',//
                'task': '/Person/Task',//
                'checkTerroristsList': '/Person/PersonCheckTerroristsList'//
            };

            profileService
              .getRoles()
              .then(function (result) {
                  Profile.InitRoles(result.data);
                  $scope.InitVisible();

                  $scope.panelId = 'loan';
              },
              function () {
                  alert("ошибка загрузки ролей");
              });

            $scope.$watch('panelId', function (panelId) {
                $scope.contactInfoPanelUrl = editTemplates[panelId];

                console.log('$scope.personinfo');
                console.log($scope.personinfo);

                if (panelId == 'document') {
                    $scope.doc = { type: panelId, id: 1, idfiletype: 1 };
                }

                if (panelId == 'inn') {

                    $scope.doc = { type: panelId, id: 22, idfiletype: 10 };
                }

                if (panelId == 'foto') {

                    $scope.doc = { type: panelId, id: 20, idfiletype: 16 };
                }

                if (panelId == 'additionalinfo') {
                    $scope.doc = { type: panelId, id: 5, idfiletype: null };
                }

                if (panelId == 'materialstatus') {
                    $scope.doc = { type: panelId, id: 6, idfiletype: 37 };
                }

                if (panelId == 'work') {
                    $scope.doc = { type: panelId, id: 7, idfiletype: 38 };
                }

                if (panelId == 'bank') {
                    $scope.doc = { type: panelId, id: 25, idfiletype: 13 };
                }

                if (panelId == 'questionnaire') {
                    // $scope.doc = 
                }

                if (panelId == 'additionaldoc') {
                    $scope.doc = { type: panelId, id: -1, idfiletype: null };
                }

                if (panelId == 'checkTerroristsList') {
                    $scope.doc = { type: panelId, id: -1, idfiletype: null };
                }
            });



        }]);
}