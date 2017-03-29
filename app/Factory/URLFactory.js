export default (ngModule) => {

    ngModule.factory('UrlFactory', [
    function () {
        // Хранит адреса и их псевдонимы
        var UrlFactory = {};
        var isInit = false;
        var urls = [];

        // возвращает нужный путь по его псевдониму
        var GetUrlByAlias = function (alias) {
            if (!isInit)
                InitURLFactory();

            return _.isNil(urls[alias]) ? "" : urls[alias].url;
        }

        function InitURLFactory() {
            urls = {
                //'report80' : {url: '/Report/ReportPlanFactAdditionalInfo'} // пример из Моменто.
                'report78': { url: '/Report/ReportDetectedTerroristsAdditionalInfo' }
            };
        }
        
        UrlFactory.GetUrlByAlias = GetUrlByAlias;

        return UrlFactory;
    }
    ]);
}