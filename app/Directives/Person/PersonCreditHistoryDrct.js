export default (ngModule) => {

    ngModule.directive('myCredithistory', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonCreditHistory.html'),
            scope: {
                person: '='
            },
            controller: (['$scope', '$sce', 'creditHistoryService', '$rootElement', 'Profile',
                function ($scope, $sce, creditHistoryService, $rootElement, Profile) {

                    $scope.creditHistoryResult = "";
                    $scope.processing = {};
                    $scope.message = "";

                    $scope.VisibleButtonGetCreditHistoryNew = Profile.GetRolePropertyValue("VisibleButtonGetCreditHistoryNew");

                    $scope.getCreditHistory = function () {
                        $scope.processing['getCreditHistory'] = true;
                        $scope.message = "Получение кредитной истории";
                        creditHistoryService
                            .getCreditHistory($scope.person.id)
                            .then(function (result) {
                                //console.log(result.data);
                                $scope.processing['getCreditHistory'] = false;
                                $scope.creditHistoryResult = result.data;
                            }, function () { });
                    }

                    $scope.getCreditHistoryNew = function () {
                        $scope.processing['getCreditHistory'] = true;
                        $scope.message = "Получение кредитной истории";
                        creditHistoryService
                            .getCreditHistory_v2($scope.person.id)
                            .then(function (result) {
                                //console.log(result.data);
                                $scope.processing['getCreditHistory'] = false;
                                $scope.creditHistoryResult = result.data;
                            }, function () { });
                    }
                }
            ])
        }
    })
}