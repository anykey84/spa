export default (ngModule) => {

    ngModule.directive('myPersonPhoneAnalysis', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonPhoneAnalysis.html'),
            scope: {
            },
            controller: (['$scope', 'Office', 'phoneService', 'Person',
               function ($scope, Office, phoneService, Person) {

                   $scope.messages = [];
                   $scope.message = "";
                   $scope.processing = {};

                   $scope.phoneanalysis = [];

                   $scope.phoneAnalysis = function () {

                       $scope.processing['phoneAnalysis'] = true;
                       $scope.message = "анализ телефонов";

                       console.log(Person.GetPersonId());
                       phoneService
                       .phoneAnalysis(Person.GetPersonId())
                       .then(function (result) {
                           angular.copy(result.data, $scope.phoneanalysis);
                           //console.log($scope.phoneanalysis);
                           $scope.processing['phoneAnalysis'] = false;
                       },
                       function () {
                           $scope.processing['phoneAnalysis'] = false;
                           swal("ошибка анализа");
                       });
                   }

                   //$scope.loadPersonTypes = function () {

                   //    var countPersonTypes = DictionaryTypes.GetPersonTypes().length;

                   //    if (countPersonTypes === 0) {
                   //        $scope.processing['loadPersonTypes'] = true;
                   //        $scope.message = "загрузка типов заемщиков";

                   //        personService
                   //           .getPersonTypes()
                   //               .then(function (result) {
                   //                   angular.copy(result.data, $scope.persontypes);
                   //                   DictionaryTypes.InitPersonTypes(result.data);
                   //                   $scope.processing['loadPersonTypes'] = false;
                   //               },
                   //                function () {
                   //                    $scope.processing['loadPersonTypes'] = false;
                   //                    swal("ошибка загрузки типы заемщиков");
                   //                });
                   //    }
                   //    else {
                   //        angular.copy(DictionaryTypes.GetPersonTypes(), $scope.persontypes);
                   //    }
                   //};

                   //$scope.loadPersonTypes();

               }])
        }
    })
}