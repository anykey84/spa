export default (ngModule) => {

    ngModule.factory('reportFactory', [ 'personFileService', '$interval',
        function (personFileService, $interval) {
            var reportFactory = {};
            var fileTypes = []; //имена отчетов и id
            var isInitializedFileTypes = false;
            var isInitializedVisibilityElements = false;
        

            // собсно сама выдача имени по id
            var GetFileName = function(id)
            {
                var f = _.find(fileTypes, function (r) {
                    return r.id == id;
                });
            
                var result;
                if (_.isNil(f))
                    result = "";
                else
                    result = _.isNil(f.name) ? "" : f.name;
                return result;
            }

            // 
            var InitFileTypes = function (item) {
                fileTypes = item;            
                isInitializedFileTypes = true;
            };

            var InitVisibilityElements = function () {
                visibleElements = [
                    { 80: { DateFrom: true, DateTo: true } } // отчет план/факт
                ];

            }

            // подгружает нужные FileTypes и вызывает пользовательский сеттер найденного значения
            var InitFileTypesAuto = function (id_Search, setterCallBack) { // callBack для установки значения по id_Search в вызывающем коде
                //console.log(setterCallBack);
                personFileService
                    .getFileTypes("2") // 2 - грузим все типы файлов
                        .then(
                            function (result) {
                                InitFileTypes(result.data);
                                if ( // если переданы оба параметров
                                    !(_.isNil(setterCallBack) || _.isNil(id_Search))
                                    )
                                {
                                    if(setterCallBack) setterCallBack(GetFileName(id_Search));
                                    console.log('Не передан setterCallBack в InitFileTypesAuto (reportFactory)');
                                }   
                            }
                            ,
                            function () {
                                console.log("Ошибка при загрузке FileTypes");
                                // ошибка
                            }
                        );
            }
        
            // ручная инициализация
            reportFactory.InitFileTypesAuto = function()
            {
                InitFileTypesAuto(null, null);
            }

            // при желании вторым параметром можно передать колбек setterCallBack(string reportNamename)
            // но лучше setterCallBack не использовать дновременно несколько раз
            reportFactory.GetFileNameById = function (id, setterCallBack) { 
                if (!_.isNil(setterCallBack)) 
                {
                    if (!isInitializedFileTypes) { // если не инициализирован массив FileTypes
                        InitFileTypesAuto(id, setterCallBack);
                    }
                    else {
                        setterCallBack(GetFileName(id));
                    }
                }
                else // если не указан коллбек, то просто ищем
                {
                    return GetFileName(id);
                }
            }

        
        

            reportFactory.GetVisibilityElementsById = function (id)
            {
                if (!isInitializedVisibilityElements)
                    InitVisibilityElements();

                var result = visibleElements[id];
                if (_.isNil(result))
                {
                    result = { DateFrom: false, DateTo: false };
                }

                return result;
            }


            return reportFactory;
        }
    ])
}