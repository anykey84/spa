export default (ngModule) => {
    ngModule.controller('AdminCtrl',
    ['$scope', '$window', 'profileService', 'Office', 'Profile',
        function ($scope, $window, profileService, Office, Profile) {

            if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabAdmin")) {
                $window.location.href = '/';
                return;
            }

            $scope.messages = [];
            $scope.message = "";
            $scope.processing = {};

            var editTemplates = {
                'office': '/Admin/Office/Index',
                'role': '/Admin/Role/Index',
                'profile': '/Admin/Profile/Index',
                'profileoffice': '/Admin/ProfileOffice/Index',
                'profilerole': '/Admin/ProfileRole/Index',
                'roleproperty': '/Admin/RoleProperty/Index',
                'document': '/Admin/Document/Index',
                'route': '/Admin/Route/Index'
            };

            $scope.InitVisible = function () {
                $scope.VisibleTabAdmin_Role = Profile.GetRolePropertyValue("VisibleTabAdmin_Role");
                $scope.VisibleTabAdmin_RoleProperty = Profile.GetRolePropertyValue("VisibleTabAdmin_RoleProperty");
                $scope.VisibleTabAdmin_Office = Profile.GetRolePropertyValue("VisibleTabAdmin_Office");
                $scope.VisibleTabAdmin_Profile = Profile.GetRolePropertyValue("VisibleTabAdmin_Profile");
                $scope.VisibleTabAdmin_ProfileOffice = Profile.GetRolePropertyValue("VisibleTabAdmin_ProfileOffice");
                $scope.VisibleTabAdmin_ProfileRole = Profile.GetRolePropertyValue("VisibleTabAdmin_ProfileRole");
            }

            $scope.$watch('panelId', function (panelId) {
                $scope.adminPanelUrl = editTemplates[panelId];
            });

            $scope.loadRoles = function () {

                $scope.processing['getRoles'] = true;
                $scope.message = "загрузка ролей";

                profileService
                   .getRoles()
                   .then(function (result) {
                       Profile.InitRoles(result.data);
                       $scope.InitVisible();
                       $scope.panelId = 'office';
                       $scope.processing['getRoles'] = false;
                   },
                   function () {
                       $scope.processing['getRoles'] = false;
                       swal("ошибка загрузки ролей");
                   });
            }
            $scope.loadRoles();

        }]);
}