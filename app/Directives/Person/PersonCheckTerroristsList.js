export default (ngModule) => {

    ngModule.directive('myPersonCheckTerroristsList', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonCheckTerroristsList.html'),
            scope: {
                person: '='
            },
            controller: (['$scope', '$filter', '$routeParams', 'reportService', 'personKPKService', 'paymentService', 'Office', 'Profile', 'personService',
                function ($scope, $filter, $routeParams, reportService, personKPKService, paymentService, Office, Profile, personService) {

                    console.log('myPersonCheckTerroristsList directive')

                    $scope.date = new Date();

                    $scope.processing = {};
                    $scope.messages = [];
                    $scope.message = "";

                    $scope.checkterrorist = [];

                    $scope.loadCheckTerrorist = function () {

                        $scope.processing['loadCheckTerrorist'] = true;
                        $scope.message = "загрузка протокола проверки";

                        //console.log($scope.person.id)

                        personService
                           .getCheckTerrorist($scope.person.id)
                           .then(function (result) {
                               $scope.processing['loadCheckTerrorist'] = false;
                               angular.copy(result.data, $scope.checkterrorist);
                               console.log(result.data);
                           },
                           function () {
                               $scope.processing['loadCheckTerrorist'] = false;
                               swal("ошибка загрузки протокола проверки");
                           });

                    }
                    $scope.loadCheckTerrorist();

                }])
        }
    })
}