export default (ngModule) => {

    ngModule.factory('personFileService', [
            '$http',
            function ($http) {

                return {

                    getPerson_File: function (p) {
                        //console.log(p);
                        return $http({
                            method: 'POST',
                            url: '/api/files/get/0',
                            data: p
                        });
                    },

                    getFileTypes: function (id) {
                        return $http({
                            method: 'GET',
                            url: '/api/files/filetypes/' + id
                        });
                    },

                    delPerson_File: function (id) {
                        return $http({
                            method: 'GET',
                            url: '/api/files/deletefile/' + id,
                        });
                    }

                }
            }]);

}