export default (ngModule) => {

    ngModule.factory('contractService', [
        '$http',
        function ($http) {

            return {
                getContract: function (findtext) {
                    return $http({
                        method: 'GET',
                        url: '/api/contract/contracts/' + findtext
                        //url: '/api/contract?par=' + findtext
                    });
                }

                , readContract: function (contractId) {
                    return $http({
                        method: 'GET',
                        url: '/api/contract/contract/' + contractId
                    });
                }

                , getContractsForCheck: function (p) {
                    //console.log(p);e
                    return $http({
                        method: 'POST',
                        url: '/api/contract/contractsforcheck/' + 0,
                        data: p
                    });
                }

                , getContractsInWork: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contract/contractsinwork/' + 0,
                        data: p
                    });
                }

                , getContractsByFilters: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contract/contractsbyfilters/' + 0,
                        data: p
                    });
                }

                , getContractsForOperator: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contract/contractsforoperator/' + 0,
                        data: p
                    });
                }

                , getContractLoanInfo: function (id) {
                    return $http({
                        method: 'GET',
                        url: '/api/contract/contractinfo/' + id
                    });
                }

                , getContractRecalcInfo: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/contract/contractrecalcinfo/0',
                        data: p
                    });
                }

                , checkContract: function (contractnumber) {
                    //console.log(contractnumber);
                    return $http({
                        method: 'GET',
                        url: '/api/contract/checkcontract/' + contractnumber
                    });
                }

                //, getContractDebt: function (id) {
                //    return $http({
                //        method: 'GET',
                //        url: '/api/contract/contractdebt/' + id
                //    });
                //}

                , addContract: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contract/add/0',
                        data: p
                    });
                }

                , attachContractsInWork: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contract/attachcontractsinwork/0',
                        data: p
                    });
                }

                , detachContractsInWork: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/contract/detachcontractsinwork/0',
                        data: p
                    });
                }

                , getContractIssue: function (idContract) {
                    return $http({
                        method: 'GET',
                        url: '/api/contract/contractissue/' + idContract
                    });
                }


            }
        }]);
}