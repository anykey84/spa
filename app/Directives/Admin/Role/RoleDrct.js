export default (ngModule) => {

    ngModule.directive('myRole', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./Role.html'),
            scope: {
            },
            //['$scope', '$http', '$routeParams', 'personDocumentService', 'personService', 'contractService', 'Office', /*'Person',*/
            //function ($scope, $http, $routeParams, personDocumentService, personService, contractService, Office/*, Person*/) {
            controller: (['$scope', 'roleService', 'Office', 'Profile',
                function ($scope, roleService, Office, Profile) {


                    $scope.messages = [];
                    $scope.message = "";
                    $scope.processing = {};

                    $scope.findrole = "";


                    $scope.roles = [];
                    $scope.allroleproperties = [];
                    $scope.roleproperties = [];
                    $scope.roletemplates = [];
                
                    $scope.name = "";

                    $scope.initProperties = function () {

                        var diff = _.difference(_.map($scope.allroleproperties, "id"), _.map($scope.roletemplates, "id_RoleProperty"));
                        var result = _.filter($scope.allroleproperties, function (obj) { return diff.indexOf(obj.id) >= 0; });
                        angular.copy(result, $scope.roleproperties);
                    }

                    $scope.loadRoles = function () {

                        $scope.processing['loadRoles'] = true;
                        $scope.message = "загрузка интерфейсов";

                        roleService
                           .getRoles()
                           .then(function (result) {
                               $scope.processing['loadRoles'] = false;
                               angular.copy(result.data, $scope.roles);
                           },
                           function () {
                               $scope.processing['loadRoles'] = false;
                               swal("ошибка загрузки ролей");
                           });
                    }
                    $scope.loadRoles();


                    $scope.loadRoleTemplates = function (idRole) {
                        $scope.processing['loadRoleTemplates'] = true;
                        $scope.message = "загрузка свойств ролей";

                        var data = {
                            idRole: idRole
                        }

                        roleService
                           .getRoleTemplates(data)
                           .then(function (result) {
                               $scope.processing['loadRoleTemplates'] = false;
                               angular.copy(result.data, $scope.roletemplates);
                               //console.log($scope.roletemplates);
                               $scope.initProperties();
                           },
                           function () {
                               $scope.processing['loadRoleTemplates'] = false;
                               swal("ошибка загрузки свойств ролей");
                           });
                    }

                    $scope.loadRoleProperties = function () {

                        $scope.processing['loadRoleProperties'] = true;
                        $scope.message = "загрузка свойств ролей";

                        roleService
                           .getRoleProperties()
                           .then(function (result) {
                               $scope.processing['loadRoleProperties'] = false;
                               angular.copy(result.data, $scope.allroleproperties);
                               //console.log($scope.allroleproperties);
                           },
                           function () {
                               $scope.processing['loadRoleProperties'] = false;
                               swal("ошибка загрузки свойств ролей");
                           });
                    }
                    $scope.loadRoleProperties();


                    $scope.addRole = function () {

                        $scope.processing['addRole'] = true;
                        $scope.message = "добавление роли";

                        var data = {
                            name: $scope.name
                        }

                        roleService
                           .addRole(data)
                           .then(function (result) {
                               $scope.processing['addRole'] = false;
                               angular.copy(result.data, $scope.roles);
                           },
                           function () {
                               $scope.processing['addRole'] = false;
                               swal("ошибка добавления роли");
                           });
                    }

                    $scope.delRole = function (idRole) {

                        $scope.processing['delRole'] = true;
                        $scope.message = "удаление роли";

                        var data = {
                            idRole: idRole
                        }

                        roleService
                           .delRole(data)
                           .then(function (result) {
                               $scope.processing['delRole'] = false;
                               angular.copy(result.data, $scope.roles);
                           },
                           function () {
                               $scope.processing['delRole'] = false;
                               swal("ошибка удаления роли");
                           });
                    }

                    $scope.delRoleTemplate = function (item) {

                        var data = {
                            idRole: item.id_Role,
                            idRoleTemplate: item.id_RoleTemplate
                        }

                        //console.log(item);
                        //return;

                        $scope.processing['delRoleTemplate'] = true;
                        $scope.message = "удаление свойства роли из шаблона";

                        roleService
                           .delRoleTemplate(data)
                           .then(function (result) {
                               $scope.processing['delRoleTemplate'] = false;
                               angular.copy(result.data, $scope.roletemplates);
                               $scope.initProperties();
                           },
                           function () {
                               $scope.processing['delRoleTemplate'] = false;
                               swal("ошибка удаления свойства роли из шаблона");
                           });
                    }

                    $scope.addRoleTemplate = function (idRoleProperty) {

                        $scope.processing['addRoleTemplate'] = true;
                        $scope.message = "добавление свойства роли в шаблон";

                        var data = {
                            idRole: $scope.idRole,
                            idRoleProperty: idRoleProperty
                        }

                        roleService
                           .addRoleTemplate(data)
                           .then(function (result) {
                               $scope.processing['addRoleTemplate'] = false;
                               angular.copy(result.data, $scope.roletemplates);
                               $scope.initProperties();
                           },
                           function () {
                               $scope.processing['addRoleTemplate'] = false;
                               swal("ошибка добавления свойства роли в шаблон");
                           });
                    }

                }])
        }
    })
}