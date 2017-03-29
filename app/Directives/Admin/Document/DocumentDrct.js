export default (ngModule) => {
    ngModule.directive('myDocument', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./Document.html'),
            scope: {
            },
            //['$scope', '$http', '$routeParams', 'personDocumentService', 'personService', 'contractService', 'Office', /*'Person',*/
            //function ($scope, $http, $routeParams, personDocumentService, personService, contractService, Office/*, Person*/) {
            controller: (['$scope', 'documentService', 'roleService', 'Office', 'Profile',
                function ($scope, documentService, roleService, Office, Profile) {


                    $scope.messages = [];
                    $scope.message = "";
                    $scope.processing = {};

                    $scope.finddocument = "";

                    $scope.documents = [];
                    $scope.documenttemplates = [];
                    $scope.typeparameters = [];
                    $scope.documentpropertyarrays = [];

                    $scope.allroleproperties = [];
                    $scope.roleproperties = [];

                    $scope.name = "";

                    $scope.initProperties = function () {

                        var diff = _.difference(_.map($scope.allroleproperties, "id"), _.map($scope.roletemplates, "id_RoleProperty"));
                        var result = _.filter($scope.allroleproperties, function (obj) { return diff.indexOf(obj.id) >= 0; });
                        angular.copy(result, $scope.roleproperties);
                    }

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
                    $scope.loadDocuments();

                    $scope.loadTypeParameters = function () {

                        $scope.processing['loadTypeParameters'] = true;
                        $scope.message = "загрузка типов";

                        documentService
                           .getTypeParameters()
                           .then(function (result) {
                               $scope.processing['loadTypeParameters'] = false;
                               angular.copy(result.data, $scope.typeparameters);
                               //console.log($scope.typeparameters);
                           },
                           function () {
                               $scope.processing['loadTypeParameters'] = false;
                               $scope.messages.push({ color: 'red', message: 'ошибка загрузки типов' });
                           });
                    }
                    $scope.loadTypeParameters();

                    $scope.loadDocumentPropertyArrays = function () {

                        $scope.processing['loadDocumentPropertyArrays'] = true;
                        $scope.message = "загрузка массивов";

                        documentService
                           .getDocumentPropertyArrays()
                           .then(function (result) {
                               $scope.processing['loadDocumentPropertyArrays'] = false;
                               angular.copy(result.data, $scope.documentpropertyarrays);
                               //console.log($scope.documentpropertyarrays);
                           },
                           function () {
                               $scope.processing['loadDocumentPropertyArrays'] = false;
                               $scope.messages.push({ color: 'red', message: 'ошибка загрузки массивов' });
                           });
                    }
                    $scope.loadDocumentPropertyArrays();


                    $scope.loadDocumentTemplates = function (idDocument) {
                        $scope.processing['loadDocumentTemplates'] = true;
                        $scope.message = "загрузка свойств ролей";

                        documentService
                           .getDocumentTemplates(idDocument)
                           .then(function (result) {
                               $scope.processing['loadDocumentTemplates'] = false;
                               angular.copy(result.data, $scope.documenttemplates);

                               _.each($scope.documenttemplates, function (item) {
                                   item.selectTypeParameter = _.find($scope.typeparameters, function (t) {
                                       return t.id == item.id_TypeParameter;
                                   });

                                   item.arrays = _.filter($scope.documentpropertyarrays, function (t1) {
                                       return t1.id_DocumentProperty == item.id_DocumentProperty;
                                   });
                               });
                               //console.log($scope.documenttemplates);
                               //$scope.initProperties();
                           },
                           function () {
                               $scope.processing['loadDocumentTemplates'] = false;
                               $scope.messages.push({ color: 'red', message: 'ошибка загрузки свойств ролей' });
                           });
                    }


                    $scope.addDocumentTemplate = function () {

                        $scope.messages.length = 0;

                        if (_.isNil($scope.idDocument)) {
                            $scope.messages.push({ color: 'red', message: 'не выбран документ' });
                        }

                        if (_.isNil($scope.newDocumentTemplate.idTypeParameter)) {
                            $scope.messages.push({ color: 'red', message: 'не выбран тип' });
                        }

                        if (_.isNil($scope.newDocumentTemplate.name)) {
                            $scope.messages.push({ color: 'red', message: 'не заполнено имя' });
                        }

                        if ($scope.messages.length != 0) {
                            return;
                        }

                        var data = {
                            name: $scope.newDocumentTemplate.name,
                            description: $scope.newDocumentTemplate.description,
                            idDocument: $scope.idDocument,
                            orderNumber: $scope.newDocumentTemplate.orderNumber,
                            idTypeParameter: $scope.newDocumentTemplate.idTypeParameter
                        };

                        //console.log(data);
                        //return;

                        $scope.processing['addDocumentTemplate'] = true;
                        $scope.message = "добавление свойства в шаблон";

                        documentService
                           .addDocumentTemplate(data)
                           .then(function (result) {
                               $scope.processing['addDocumentTemplate'] = false;
                               $scope.loadDocumentTemplates($scope.idDocument);
                           },
                           function () {
                               $scope.processing['addDocumentTemplate'] = false;
                               $scope.messages.push({ color: 'red', message: 'ошибка добавления свойства в шаблон' });
                           });
                    }



                    $scope.addDocument = function () {

                        $scope.messages.length = 0;

                        if (_.isNil($scope.newDocument.name)) {
                            $scope.messages.push({ color: 'red', message: 'не заполнено имя' });
                        }

                        if ($scope.messages.length != 0) {
                            return;
                        }

                        var data = {
                            name: $scope.newDocument.name,
                            count: $scope.newDocument.count,
                        };

                        //console.log(data);
                        //return;

                        $scope.processing['addDocument'] = true;
                        $scope.message = "добавление документа";

                        documentService
                           .addDocument(data)
                           .then(function (result) {
                               $scope.processing['addDocument'] = false;
                               $scope.loadDocuments();
                           },
                           function () {
                               $scope.processing['addDocument'] = false;
                               $scope.messages.push({ color: 'red', message: 'ошибка добавления документа' });
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
                               alert("ошибка удаления роли");
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
                               alert("ошибка удаления свойства роли из шаблона");
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
                               $scope.messages.push({ color: 'red', message: 'ошибка добавления свойства роли в шаблон' });
                           });
                    }

                }])
        }
    })
}