export default (ngModule) => {
    ngModule.directive('myRoute', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./Route.html'),
            scope: {
            },
            //['$scope', '$http', '$routeParams', 'personDocumentService', 'personService', 'contractService', 'Office', /*'Person',*/
            //function ($scope, $http, $routeParams, personDocumentService, personService, contractService, Office/*, Person*/) {
            controller: (['$scope', 'roleService', 'Office', 'Profile',
                function ($scope, roleService, Office, Profile) {

                    
                    console.log('myRoute directive');
                    

                    $scope.loadDocuments = function () {

                        $scope.processing['loadDocuments'] = true;
                        $scope.message = "загрузка документов";

                        documentService
                           .getDocuments()
                           .then(function (result) {
                               $scope.processing['loadDocuments'] = false;
                               angular.copy(result.data, $scope.documents);
                           },
                           function () {
                               $scope.processing['loadDocuments'] = false;
                               $scope.messages.push({ color: 'red', message: 'ошибка загрузки ролей' });
                           });
                    }
                    

                }])
        }
    })
}