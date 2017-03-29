export default (ngModule) => {

    ngModule.factory('personService', [
        '$http',
        function ($http) {

            return {
                getPeople: function (findtext) {
                    return $http({
                        method: 'GET',
                        url: '/api/person/people/' + findtext
                    });
                }

                , getPerson: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/person/person/' + id
                    });
                }

                , getPersonTypes: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/person/persontypes/1'
                    });
                }

                , getPersonContract: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/contracts/0',
                        data: p
                    });
                }

                , getPersonPassport: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/person/passport/' + id
                    });
                }

                , getPersonWork: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/person/work/' + id
                    });
                }

                , getPersonAddress: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/person/getaddress/' + id
                    });
                }

                , getPersonContactPhone: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/contactphone/0',
                        data: p
                    });
                }

                , getPersonPhone: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/personphone/0',
                        data: p
                    });
                }
                , getCheckTerrorist: function (id) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/terroristschecklog/' + id,
                    });
                }

                , getDocumentsToString: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/person/getdocumentstostring/' + id
                    });
                }

                , addPassport: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/person/addpassport/' + id
                    });
                }

                , addPerson: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/add/0',
                        data: p
                    });
                }

                , updatePassport: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/updatepassport/' + p.idPerson,
                        data: p
                    });
                }

                , addContactPhone: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/addcontactphone/' + p.idPerson,
                        data: p
                    });
                }

                , deleteContactPhone: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/deletecontactphone/' + p.idPerson,
                        data: p
                    });
                }

                , addPersonPhone: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/addpersonphone/' + p.idPerson,
                        data: p
                    });
                }

                , deletePersonPhone: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/deletepersonphone/' + p.idPerson,
                        data: p
                    });
                }

                , confirmPersonPhone: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/sms/sendsms/0',
                        data: p
                    });
                }

                ,  sendSaleMemoryNote: function (p) {
                    console.log("проверка сервиса1");
                    return $http({
                        method: 'POST',
                        url: '/api/sms/sendsms/0',
                        data: p
                    });                    
                }


                , checkPersonPhone: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/sms/checkpersonphone/' + p.idPhone,
                        data: p
                    });
                }

                , searchPersonByPhone: function (findphone) {
                    return $http({
                        method: 'POST',
                        url: 'api/person/phonesearch/' + findphone
                    });
                }

                , attachPersonsInWork: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/attachpersonsinwork/0',
                        data: p
                    });
                }

                , detachPersonsInWork: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/person/detachpersonsinwork/0',
                        data: p
                    });
                }

                 , getPersonInputStream: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/person/getpersoninputstream/0',
                         data: p
                     });
                 }

                 , updatePersonInputStream: function (p) {
                     console.log('personupdate РЖ service');
                     console.log(p);

                     return $http({
                         method: 'POST',
                         url: '/api/person/updatePersonInputStream/0',
                         data: p
                     });
                    
                 }

                 , addPersonInputStream: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/person/addPersonInputStream/0',
                         data: p
                     });
                 }

                , getPersonsByFilters: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/person/personsbyfilters/' + 0,
                        data: p
                    });
                }

            }
        }]);


}