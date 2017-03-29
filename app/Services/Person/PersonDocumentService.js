export default (ngModule) => {

    ngModule.factory('personDocumentService', [
        '$http',
        function ($http) {

            return {
                getPersonPassport: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/persondocument/passport/' + id
                    });
                }

                , getPersonDocument: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/persondocument/getdocuments/' + p.idPerson,
                        data: p
                    });
                }


                , addPassport: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/persondocument/addpassport/' + id
                    });
                }

                , updatePassport: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/persondocument/updatepassport/' + p.idPerson,
                        data: p
                    });
                }

                , delPerson_Document: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/persondocument/del/' + p.id,
                        data: p
                    });
                }

                , addPerson_Document: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/persondocument/add/' + p.idPerson,
                        data: p
                    });
                }

                , addPerson_DocumentProperty: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/persondocument/addpersondocumentproperty/' + p.idPerson_Document,
                        data: p
                    });
                }

                , updatePerson_DocumentProperty: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/persondocument/updatepersondocumentproperty/' + p.id_Person_DocumentProperty,
                        data: p
                    });
                }

                , delPerson_DocumentProperty: function (p) {
                    console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/persondocument/delpersondocumentproperty/' + p.id_Person_DocumentProperty,
                        data: p
                    });
                }

                , validatePerson_DocumentProperty: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/persondocument/validatepersondocumentproperty/' + p.id_Person_DocumentProperty,
                        data: p
                    });
                }

            }
        }]);

}