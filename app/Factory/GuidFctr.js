export default (ngModule) => {

    ngModule.factory('Guid', function () {
        var guidService = {};

        function G() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }

        //var guid = (G() + G() + "-" + G() + "-" + G() + "-" + G() + "-" + G() + G() + G()).toUpperCase();

        guidService.NewGuid = function () {
            return (G() + G() + "-" + G() + "-" + G() + "-" + G() + "-" + G() + G() + G()).toUpperCase();
        };


        return guidService;
    })
}