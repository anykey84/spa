export default (ngModule) => {

    ngModule.directive('myReportProfilePenalty', function () {
        return {
            restrict: 'E',
            replace: false,
            template: require('./ReportProfilePenalty.html'),
            scope: {
                isload: '=?'
            },
            controller: (['$scope', 'reportService', 'profileService', 'Profile',
               function ($scope, reportService, profileService, Profile) {

                   $scope.VisibleReportProfilePenalty = Profile.GetRolePropertyValue("VisibleReportProfilePenalty");

                   $scope.processing = {};
                   $scope.message = "";
                   $scope.messages = [];

                   $scope.profiles = [];

                   $scope.data = [];

                   $scope.$watch("isload", function (isload) {
                       if (isload == true) {
                           $scope.getDataForReport();
                       }
                   });

                   $scope.loadProfilesInWork = function () {

                       $scope.processing['loadProfilesInWork'] = true;
                       $scope.message = "загрузка профилей";

                       profileService
                           .getProfilesInWork()
                           .then(function (result) {
                               $scope.processing['loadProfilesInWork'] = false;
                               angular.copy(result.data, $scope.profiles);
                               //console.log($scope.profiles);
                           },
                           function () {
                               $scope.processing['loadProfilesInWork'] = false;
                               $scope.messages.push({ color: 'red', message: 'ошибка загрузки профилей' });
                           });
                   }
                   $scope.loadProfilesInWork();


                   $scope.getDataForReport = function () {

                       $scope.processing['getDataForReport'] = true;
                       $scope.message = "загрузка типов";

                       var data = {
                           reporttype: 'ReportProfilePenalty'
                           , idProfile: $scope.idProfile
                           , dateFrom: new Date($scope.dateFrom).toDateString()
                           , dateTo: new Date($scope.dateTo).toDateString()
                       }

                       console.log(data);

                       reportService
                           .getDataForReport(data)
                           .then(function (result) {
                               $scope.processing['getDataForReport'] = false;
                               angular.copy(result.data, $scope.data);
                               //console.log($scope.data);
                           },
                           function () {
                               $scope.processing['getDataForReport'] = false;
                               $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                           });
                   }
               }
            ])
        }
    });
}