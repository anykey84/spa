export default (ngModule) => {

    ngModule.directive('myPerson', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./Person.html'),
            scope: {
                idperson: '='
                , personinfo: '='
                , refresh: '&'
            },
            controller: (['$scope', 'personService', 'Office', 'Profile',
                function ($scope, personService, Office, Profile) {

                    $scope.processing = {};
                    $scope.message = "";

                    //$scope.personInfo = [];

                    //$scope.person = {};

                    $scope.$watch("idperson", function (idperson) {
                        console.log('изменение выбраного idperson');
                        //console.log(person);
                        $scope.loadPerson();
                    });


                    $scope.loadPerson = function () {
                        $scope.processing['loadPerson'] = true;
                        $scope.message = "загрузка информации";
                        //console.log('4444444444444444');

                        personService
                            .getPerson($scope.idperson)
                            .then(function (result) {
                                //console.log('7777777777777777');
                                console.log(result.data);
                                $scope.processing['loadPerson'] = false;
                                angular.copy(result.data, $scope.personinfo)
                                $scope.inBlackList = result.data.inBlackList;
                                $scope.refresh();
                            },
                            function () {
                                $scope.processing['loadPerson'] = false;
                                swal("ошибка загрузки");
                            });
                    }
                    //$scope.loadPerson();

                }])
        }
    })
}