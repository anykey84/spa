'use strict';

appMain.directive('myProgressbar', function () {
    return {
        restrict: 'E',
        replace: false,
        templateUrl: '/Template/ProgressBar',
        scope: {
            visible: '=',
            error: '=',
            typebar: '@',
            message: '@'
        },
        controller: (['$scope',
           function ($scope) {

               //console.log($scope.typebar);

               $scope.visiblecircle = false;
               $scope.visibleline = false;
               $scope.visiblecheck = false;
               $scope.visibleLeonardo = false;

               switch ($scope.typebar) {
                   case "circle":
                       $scope.visiblecircle = true;
                       break;
                   case "line":
                       $scope.visibleline = true;
                       break;
                   case "check":
                       $scope.visiblecheck = true;
                       break;
                   case "Leonardo":
                   default:
                       $scope.visibleLeonardo = true;
               }

               $scope.changeHandler = function (visible) {
                   $scope.error = !visible;
               }
           }
        ])
    }
});
