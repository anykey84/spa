export default (ngModule) => {

    ngModule.directive('myProgressbar', function () {
        return {
            restrict: 'E',
            replace: false,
            template: require('./ProgressBar.html'),
            scope: {
                visible: '=',
                error: '=',
                typebar: '@',
                message: '@'
            },
            controller: (['$scope',
               function ($scope) {

                   //console.log($scope.typebar);

                   $scope.check = false;

                   if ($scope.typebar === 'check') $scope.check = true;

                   $scope.changeHandler = function (visible) {
                       $scope.error = !visible;
                   }
               }
            ])
        }
    });
}