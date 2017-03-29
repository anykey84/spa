'use strict';

appMain.directive('myServermessages', function () {
    return {
        restrict: 'E',
        replace: false,
        templateUrl: '/Template/ServerMessages',
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
