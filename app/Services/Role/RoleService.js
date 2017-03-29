export default (ngModule) => {

    ngModule.factory('roleService', [
        '$http',
        function ($http) {

            return {
                getRoles: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/role/getroles/0'
                    });
                }

                , addRole: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/role/addrole/0',
                        data: p
                    });
                }

                , delRole: function (p) {
                    console.log(p);
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
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/role/getroletemplates/0',
                        data: p
                    });
                }

                , addRoleProperty: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/role/addroleproperty/0',
                        data: p
                    });
                }

                , addRoleTemplate: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/role/addroletemplate/0',
                        data: p
                    });
                }

                 , delRoleTemplate: function (p) {
                     console.log(p);
                     return $http({
                         method: 'POST',
                         url: '/api/role/delroletemplate/0',
                         data: p
                     });
                 }

                
            }
        }]);
}