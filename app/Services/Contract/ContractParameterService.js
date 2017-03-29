export default (ngModule) => {

    ngModule.factory('contractParameterService', [
        '$http',
        function ($http) {

            return {

                getContractParameter: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/contractparameter/contractparameters/' + id
                    });
                }

                , getContractParameterTypes: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/contractparameter/contractparametertypes/1'
                    });
                }

                , getContractParameterInfo: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/contractparameter/getcontractparameterinfo/' + id
                    });
                }

                , addContractParameter: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contractparameter/add/' + p.id,
                        data: p
                    });
                }

                , deleteContractParameter: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contractparameter/del/' + p.id,
                        data: p
                    });
                }

                , getGenerateSchedule: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contractparameter/generateschedule_temp/' + p.id,
                        data: p
                    });
                }

                , getSchedule: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/contractparameter/schedule/' + id
                    });
                }

                , canProlongation: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/contractparameter/canprolongation/' + id
                    });
                }

                , canRestructuring: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/contractparameter/canrestructuring/' + id
                    });
                }

                , addProlongation: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contractparameter/addprolongation/' + p.id,
                        data: p
                    });
                }

                 , addRestructuring: function (p) {
                     //console.log(p);
                     return $http({
                         method: 'POST',
                         url: '/api/contractparameter/addrestructuring/' + p.id,
                         data: p
                     });
                 }

                , addEearlyRepayment: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/contractparameter/addeearlyrepayment/0',
                        data: p
                    });
                }

                //, generateContract: function (d) {
                //    return $http({
                //        method: 'POST',
                //        url: '/api/contractparameter/generatereport/' + d.id,
                //        //url: '/api/contractparameter/generatecontract/' + d.id,
                //        data: d
                //    });
                //}
            }
        }]);
}