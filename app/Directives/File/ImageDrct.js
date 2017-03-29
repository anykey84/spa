export default (ngModule) => {

    ngModule.directive('myImage', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./Image.html'),
            scope: {
                file: '='
            },
            controller: (['$scope', 
                function ($scope) {

                    //console.log($scope.file);

                    $scope.processing = {};
                    $scope.message = "";
                    $scope.messages = [];
                 

                }])
        }
    })
}