export default (ngModule) => {

    ngModule.factory('documentService', [
        '$http',
        function ($http) {

            return {
                getDocuments: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/document/getdocuments/0'
                    });
                }

                , getTypeParameters: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/document/gettypeparameters/0'
                    });
                }

                , getDocumentPropertyArrays: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/document/getdocumentpropertyarrays/0'
                    });
                }

                , getDocumentTemplates: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/document/getdocumenttemplates/' + id
                    });
                }

                , addDocumentTemplate: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/document/adddocumenttemplate/0',
                        data: p
                    });
                }

                , addDocument: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/document/adddocument/0',
                        data: p
                    });
                }

                , delRole: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/role/delrole/0',
                        data: p
                    });
                }

                , getRoleProperties: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/role/getroleproperties/0'
                    });
                }

                , getRoleTemplates: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/role/getroletemplates/0',
                        data: p
                    });
                }

                , addRoleProperty: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/role/addroleproperty/0',
                        data: p
                    });
                }

                , addRoleTemplate: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/role/addroletemplate/0',
                        data: p
                    });
                }

                , delRoleTemplate: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/role/delroletemplate/0',
                        data: p
                    });
                }


            }
        }]);
}