export default (ngModule) => {

    ngModule.factory('profileService', [
        '$http',
        function ($http) {

            return {

                getRoles: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/profile/getroles/0'
                    });
                }

                , getProfilesInWork: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/profile/profilesinwork/0'
                    });
                }

                , getProfilesInWorkOnOffice: function () {
                    console.log('получение задач по точке или региону с сервера');
                    return $http({
                        method: 'GET',
                        url: '/api/profile/profilesinworkonoffice/0'
                    });
                }

                , getProfiles: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/profile/getprofiles/0',
                        data: p
                    });
                }


                , getProfileRoles: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/profile/getprofileroles/0',
                        data: p
                    });
                }

                , delProfileRole: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/profile/delprofilerole/0',
                        data: p
                    });
                }

                , addProfileRole: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/profile/addprofilerole/0',
                        data: p
                    });
                }

                , getProfileOffices: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/profile/getprofileoffices/0',
                        data: p
                    });
                }

                 , delProfileOffice: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/profile/delprofileoffice/0',
                         data: p
                     });
                 }

                , addProfileOffice: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/profile/addprofileoffice/0',
                        data: p
                    });
                }

                 , getProfilesActive: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/profile/getprofilesactive/0',
                         data: p
                     });
                 }


                , addProfile: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/profile/addprofile/0',
                        data: p
                    });
                }

                 , deleteProfile: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/profile/deleteprofile/0',
                         data: p
                     });
                 }

                 , restoreProfile: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/profile/restoreprofile/0',
                         data: p
                     });
                 }

                 , getTrustDocuments: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/profile/gettrustdocuments/0',
                         data: p
                     });
                 }

                 , getDescription: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/profile/getdescription/0',
                         data: p
                     });
                 }

                , addTrustDocument: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/profile/addtrustdocument/0',
                        data: p
                    });
                }

                 , getPersonsProfileInWork: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/profile/getpersonsprofileinwork/0',
                         data: p
                     });
                 }

                , getTasksByRegional: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/profile/getTasksByRegional/0',
                        data: p
                    });
                }

                 , getContractsProfileInWork: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/profile/getcontractsprofileinwork/0',
                         data: p
                     });
                 }
                , getProfilesByRegional: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/profile/getprofilesbyregional/0',
                        data: p
                    });
                }
                , updateProfileByRegionalStatus: function(p){
                    return $http({
                        method: 'POST',
                        url: '/api/profile/updateProfileByRegionalStatus/0',
                        data: p
                    });
                }
            }
        }]);
}