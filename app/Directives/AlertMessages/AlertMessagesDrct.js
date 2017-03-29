export default (ngModule) => {

    ngModule.directive('myAlertMessages', function () {
        return {
            restrict: 'E',
            replace: false,
            template: require('./AlerMessages.html'),
            scope: {
                isload: '=?'
            },
            controller: (['$scope',
               function ($scope) {

                   //$scope.$watch("isload", function (isload) {
                   //    console.log('изменение isload в myAlertMessages');
                   //    console.log(isload);
                   //});

               }
            ])
        }
    });
}