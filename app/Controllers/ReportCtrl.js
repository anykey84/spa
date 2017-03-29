export default (ngModule) => {
    ngModule.controller('ReportCtrl', ['$scope', '$window', 'Office', 'Profile', function ($scope, $window, Office, Profile) {

        if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabReport")) {
            $window.location.href = '/';
            return;
        }

        $scope.name = "отчеты";

        $scope.VisibleReportSales = Profile.GetRolePropertyValue("VisibleReportSales");
        $scope.VisibleReportProfitOverdue = Profile.GetRolePropertyValue("VisibleReportProfitOverdue");
        $scope.VisibleReportSalesCall = Profile.GetRolePropertyValue("VisibleReportSalesCall");
        $scope.VisibleReportContractInWork = Profile.GetRolePropertyValue("VisibleReportContractInWork");
        $scope.VisibleReportManagerReturnsIssuance = Profile.GetRolePropertyValue("VisibleReportManagerReturnsIssuance");
        $scope.VisibleReportReestr = Profile.GetRolePropertyValue("VisibleReportReestr");
        $scope.VisibleReportAverageWeighted = Profile.GetRolePropertyValue("VisibleReportAverageWeighted");
        $scope.VisibleReportTimeControl = Profile.GetRolePropertyValue("VisibleReportTimeControl");

        $scope.VisibleReportInterestPaymentDeposit = Profile.GetRolePropertyValue("VisibleButtonReportInterestPaymentDeposit");
        $scope.VisibleReportDepositDebtDeposit = Profile.GetRolePropertyValue("VisibleButtonReportDepositDebtDeposit");
        $scope.VisibleReportInterestDebtDeposit = Profile.GetRolePropertyValue("VisibleButtonReportInterestDebtDeposit");


        //console.log($scope.VisibleReportInterestPaymentDeposit);
        //console.log($scope.VisibleReportDepositDebtDeposit);
        //console.log($scope.VisibleReportInterestDebtDeposit);
        $scope.VisibleReportInventory = Profile.GetRolePropertyValue("VisibleReportInventory");

        $scope.VisibleReportDetectedTerrorists = Profile.GetRolePropertyValue("VisibleReportDetectedTerrorists");
    }]);
}