export default (ngModule) => {

    angular
        .module('app')
        .directive('myAlertMessagesNewTasks', function () {
        return {
            restrict: 'E',
            replace: false,
            template: require('./AlertMessagesNewTasks.html'),
            scope: {
                issmall: '=?',
                isload: '=?'
            },
            controller: (['$scope', 'alertMessagesService', 'Office',
               function ($scope, alertMessagesService, Office) {


                   $scope.$watch("isload", function (isload) {
                       //console.log('изменение isload в myAlertMessagesNewTasks');
                       //console.log(isload);
                       if (isload == true) {
                           $scope.loadNewTasks();
                       }
                   });

                   $scope.$on('timer-tick', function (event, data) {
                       if ($scope.isload == true) {
                           $scope.loadNewTasks();
                       }
                   });

                   $scope.messages = [];
                   $scope.message = "";
                   $scope.processing = {};

                   $scope.alltasks = [];
                   $scope.newtasks = [];
                   $scope.oldtasks = [];

                   $scope.loadNewTasks = function () {

                       $scope.processing['loadNewTasks'] = true;
                       $scope.message = "загрузка закрепленных дел";

                       var data = {
                           idOffice: Office.GetOfficeId()
                       }

                       alertMessagesService
                           .getNewTasks(data)
                           .then(function (result) {
                               $scope.processing['loadNewTasks'] = false;
                               angular.copy(result.data, $scope.alltasks);

                               $scope.newtasks = _.filter($scope.alltasks, function (item) { return item.dateCreateFirstResult == null && item.isOverdue == 0; });
                               $scope.oldtasks = _.filter($scope.alltasks, function (item) { return item.dateCreateFirstResult == null && item.isOverdue == 1; });

                               ////console.log('loadNewTasks');
                               //console.log($scope.alltasks);
                               //console.log($scope.newtasks);
                           },
                           function () {
                               $scope.processing['loadNewTasks'] = false;
                               $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                           });
                   }

               }
            ])
        }
    });
}