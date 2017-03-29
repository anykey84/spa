export default (ngModule) => {

    ngModule.directive('myServermessages', function () {
        return {
            restrict: 'E',
            replace: false,
            template: require('./ServerMessages.html'),
            scope: {
                messages: '=',
            },
            controller: (['$scope',
               function ($scope) {             
                   //console.log('server mesage');
               }
            ])
        }
    });
}