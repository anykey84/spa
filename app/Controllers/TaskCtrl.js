export default (ngModule) => {
    ngModule.controller('TaskCtrl', ['$scope', '$window', 'Office', 'Profile', function ($scope, $window, Office, Profile) {

        if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabTask")) {
            $window.location.href = '/';
            return;
        }

        $scope.name = "задачи";

        $scope.VisibleReportSales = Profile.GetRolePropertyValue("VisibleReportSales");
        $scope.VisibleReportProfitOverdue = Profile.GetRolePropertyValue("VisibleReportProfitOverdue");
        $scope.VisibleReportSalesCall = Profile.GetRolePropertyValue("VisibleReportSalesCall");
        $scope.VisibleReportContractInWork = Profile.GetRolePropertyValue("VisibleReportContractInWork");
        $scope.VisibleReportManagerReturnsIssuance = Profile.GetRolePropertyValue("VisibleReportManagerReturnsIssuance");
        $scope.VisibleReportReestr = Profile.GetRolePropertyValue("VisibleReportReestr");
        

    }]);
}