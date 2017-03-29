export default (ngModule) => {

    ngModule.factory('officeService', [
        '$http',
        function ($http) {

            return {
                getOffices: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/office/get/0'
                    });
                }

                , getOfficesAll: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/office/getall/0',
                        data: p
                    });
                }

                , getOfficeByOfficeType: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/office/getofficebyofficetype/' + id
                    });
                }

                 , saveOffice: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/office/add/0',
                         data: p
                     });
                 }

                , deleteOffice: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/office/del/0',
                        data: p
                    });
                }

               , getOfficeTypes: function () {
                   return $http({
                       method: 'GET',
                       url: '/api/office/gettypes/0'
                   });
               }

                , getOfficeUsers: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/office/getofficeusers/0'
                    });
                }

                , getCurrentOffice: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/office/getcurrentoffice/0'
                    });
                }

                 , selectOffice: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/office/selectoffice/0',
                         data: p
                     });
                 }
                , currentOffice: function (p) {
                    return {
                        currentOffice: {}
                    };
                }
            }
        }]);
};

