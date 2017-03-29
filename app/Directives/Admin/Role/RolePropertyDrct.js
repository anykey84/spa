export default (ngModule) => {

    ngModule.directive('myRoleProperty', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./RoleProperty.html'),
            scope: {
            },
            //['$scope', '$http', '$routeParams', 'personDocumentService', 'personService', 'contractService', 'Office', /*'Person',*/
            //function ($scope, $http, $routeParams, personDocumentService, personService, contractService, Office/*, Person*/) {
            controller: (['$scope', 'roleService', 'Office', 'Profile',
                function ($scope, roleService, Office, Profile) {


                    $scope.messages = [];
                    $scope.message = "";
                    $scope.processing = {};

                    $scope.roleproperties = [];

                    $scope.name = "";

                    $scope.loadRoleProperties = function () {

                        $scope.processing['loadRoleProperties'] = true;
                        $scope.message = "загрузка свойств ролей";

                        roleService
                           .getRoleProperties()
                           .then(function (result) {
                               $scope.processing['loadRoleProperties'] = false;
                               angular.copy(result.data, $scope.roleproperties);
                           },
                           function () {
                               $scope.processing['loadRoleProperties'] = false;
                               swal("ошибка загрузки свойств ролей");
                           });
                    }
                    $scope.loadRoleProperties();


                    $scope.addRoleProperty = function () {

                        $scope.processing['addRoleProperty'] = true;
                        $scope.message = "добавление свойства роли";

                        var data = {
                            name: $scope.name,
                            description: $scope.description
                        }

                        roleService
                           .addRoleProperty(data)
                           .then(function (result) {
                               $scope.processing['addRoleProperty'] = false;
                               $scope.loadRoleProperties();
                           },
                           function () {
                               $scope.processing['addRoleProperty'] = false;
                               swal("ошибка добавления свойства роли");
                           });
                    }

                }])
        }
    })
}