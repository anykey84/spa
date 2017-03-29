export default (ngModule) => {

    ngModule.directive('myImagelist', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./ImageList.html'),
            scope: {
                files: '='
            },
            controller: (['$scope',
                function ($scope) {

                    //console.log($scope.files);

                    $scope.processing = {};
                    $scope.message = "";
                    $scope.messages = [];


                }])
        }
    })
}