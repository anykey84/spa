export default (ngModule) => {

    ngModule.factory('Contract', function () {
        var cId = '';
        var cNumber = '';
        var cOwner = '';
        var cDateCreate = '';
        var cLastStatus = '';

        var text = '';
        var contractService = {};

        contractService.Init = function (id, number, owner, dateCreate, lastStatus) {
            cId = id;
            cNumber = number;
            cOwner = owner;
            cDateCreate = dateCreate;
            cLastStatus = lastStatus;
        };

        contractService.InitText = function (item) {
            text = item;
        };

        contractService.GetContractId = function () {
            return cId;
        };
        contractService.GetContractNumber = function () {
            return cNumber;
        };
        contractService.GetContractOwner = function () {
            return cOwner;
        };
        contractService.GetContractDateCreate = function () {
            return cDateCreate;
        };
        contractService.GetContractLastStatus = function () {
            return cLastStatus;
        };
        contractService.GetContractFindText = function () {
            return text;
        };

        return contractService;
    })
}