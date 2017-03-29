export default (ngModule) => {
    ngModule.controller('ArchiveCtrl', ['$scope', '$window', 'Office', 'Profile', function ($scope, $window, Office, Profile) {

            if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabArchive")) {
                $window.location.href = '/';
                return;
            }

            $scope.name = "архив";

        }]);
}