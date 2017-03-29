export default (ngModule) => {

    ngModule.factory('Person', function () {
        var pId = '';
        var personService = {};

        personService.Init = function (item) {
            //console.log(' personService.Init');
            pId = item;
        };
        personService.GetPersonId = function () {
            console.log(' personService.GetPersonId');
            return pId;
        };
        return personService;
    });

    ngModule.factory('PeopleFindText', function () {
            var text = '';
            var peopleFindTextService = {};

            peopleFindTextService.Init = function (item) {
                text = item;
            };
            peopleFindTextService.GetPeopleFindText = function () {
                return text;
            };
            return peopleFindTextService;
        })
}