export default (ngModule) => {

    ngModule.factory('DictionaryTypes', function () {
        var dictionaryTypesService = {};

        var oCommentTypes = [];
        dictionaryTypesService.InitCommentTypes = function (item) {
            oCommentTypes = item;
        };
        dictionaryTypesService.GetCommentTypes = function () {
            return oCommentTypes;
        };


        var oPersonTypes = [];
        dictionaryTypesService.InitPersonTypes = function (item) {
            oPersonTypes = item;
        };
        dictionaryTypesService.GetPersonTypes = function () {
            return oPersonTypes;
        };

        return dictionaryTypesService;
    })
}