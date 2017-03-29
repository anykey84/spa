export default (ngModule) => {

    ngModule.directive('myPersonInputStream', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonInputStream.html'),
            scope: {
            },
            controller: (['$scope', '$filter', 'personService', 'communicationService', 'adwareChannelService', 'officeService', 'productService', 'taskService', 'Office', 'Person', 'Profile', 'PeopleFindText',
                function ($scope, $filter, personService, communicationService, adwareChannelService, officeService, productService, taskService, Office, Person, Profile, PeopleFindText) {

                    $scope.sexs = [{ sex: true, name: 'мужской' }, { sex: false, name: 'женский' }];

                    $scope.messages = [];
                    $scope.message = "";
                    $scope.processing = {};
                    $scope.people = [];
                    $scope.productservices = [];
                    $scope.regions = [];
                    $scope.officesall = [];
                    $scope.officesall2 = [];

                    $scope.tasktypes = [];
                    $scope.communicationtypes = [];
                    $scope.adwarechannels = [];

                    $scope.checkfind = false;

                    $scope.person = {
                        id: 0,
                        lastName: '',
                        firstName: '',
                        middleName: '',
                        seria: '',
                        number: '',
                        phone: '',
                        birthDate: '',
                        sex: true,
                        idOffice: Office.GetOfficeId()
                    };
                    
                    $scope.personEdited = {
                        id: 0,
                        lastName: '',
                        firstName: '',
                        middleName: '',
                        seria: '',
                        number: '',
                        phone: '',                        
                        sex: true,
                        idOffice: Office.GetOfficeId()
                    };

                    $scope.personopen = function (id) {
                        Person.Init(id);
                    }


                    $scope.getTaskTypesByType = function () {

                        $scope.processing['getTaskTypesByType'] = true;
                        $scope.message = "загрузка задач";

                        taskService
                            .getTaskTypesByType(1)
                            .then(function (result) {
                                $scope.processing['getTaskTypesByType'] = false;
                                angular.copy(result.data, $scope.tasktypes);
                            },
                             function () {
                                 $scope.processing['getTaskTypesByType'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка загрузки задач' });
                             });
                    }
                    $scope.getTaskTypesByType();


                    $scope.getOfficeRegions = function () {

                        $scope.processing['getOfficeRegions'] = true;
                        $scope.message = "загрузка регионов";

                        officeService
                            .getOfficeByOfficeType(1)
                            .then(function (result) {
                                $scope.processing['getOfficeRegions'] = false;
                                angular.copy(result.data, $scope.regions);
                            },
                             function () {
                                 $scope.processing['getOfficeRegions'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка загрузки регионов' });
                             });
                    }
                    $scope.getOfficeRegions();
                    
                    //+РЖ Добавление данных для списка торговых точек
                    $scope.getOfficesAll = function () {

                        $scope.processing['getOfficesall'] = true;
                        $scope.message = "загрузка торговых точек";

                        officeService
                            .getOffices()
                            .then(function (result) {
                                $scope.processing['getOfficesAll'] = false;
                                angular.copy(result.data, $scope.officesall);
                                                                
                                console.log($scope.officesall);
                            },
                             function () {
                                 $scope.processing['getOfficesAll'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка загрузки офисов' });
                             });
                    }
                    $scope.getOfficesAll();
                    //-РЖ Добавление данных для списка торговых точек


                    $scope.getProductServices = function () {

                        $scope.processing['getProductServices'] = true;
                        $scope.message = "загрузка типов продуктов";

                        var data = {
                            idOffice: Office.GetOfficeId()
                        }
                        //console.log(data);

                        productService
                            .getProductServices(data)
                            .then(function (result) {
                                $scope.processing['getProductServices'] = false;
                                angular.copy(result.data, $scope.productservices);
                            },
                             function () {
                                 $scope.processing['getProductServices'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка загрузки типов продуктов' });
                             });
                    }
                    $scope.getProductServices();

                    //+РЖ Добавление данных для списка типов обращения
                    $scope.getCommunicationServices = function () {
                        //$scope.communicationtypes = [{ id: 1, name: 'Вид обращения1' }, { id: 2, name: 'Вид обращения2' }];
                        $scope.processing['getCommunicationServices'] = true;
                        $scope.message = "загрузка типов обращения";
                        var data = {
                            idOffice: Office.GetOfficeId()
                        }
                        //console.log(data);
                        communicationService
                            .getCommunicationServices(data)
                            .then(function (result) {
                                $scope.processing['getCommunicationServices'] = false;
                                angular.copy(result.data, $scope.communicationtypes);
                            },
                             function () {
                                 $scope.processing['getCommunicationServices'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка загрузки типов обращения' });
                             });
                    }
                    $scope.getCommunicationServices();
                    //-РЖ Добавление данных для списка типов обращения

                    //+РЖ Добавление данных для списка источников рекламы
                    $scope.getAdwareChannelServices = function () {
                        //$scope.adwarechannels = [{ id: 1, name: 'Вид рекламы1' }, { id: 2, name: 'Вид рекламы2' }];
                        $scope.processing['getAdwareChannelServices'] = true;
                        $scope.message = "загрузка списка каналов рекламы";
                        var data = {
                            idOffice: Office.GetOfficeId()
                        }
                        //console.log(data);
                        adwareChannelService
                            .getAdwareChannelServices(data)
                            .then(function (result) {
                                $scope.processing['getAdwareChannelServices'] = false;
                                angular.copy(result.data, $scope.adwarechannels);
                            },
                             function () {
                                 $scope.processing['getAdwareChannelServices'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка загрузки списка источников рекламы' });
                             });
                    }
                    $scope.getAdwareChannelServices ();
                    //-РЖ Добавление данных для списка источников рекламы


                    $scope.getPersonInputStream = function () {

                        $scope.processing['getPersonInputStream'] = true;
                        $scope.message = "поиск по реестру физических лиц";

                        var data = {
                            lastName: $scope.person.lastName,
                            firstName: $scope.person.firstName,
                            middleName: $scope.person.middleName,
                            seria: $scope.person.seria,
                            number: $scope.person.number,
                            phone: $scope.person.phone
                        }
                        //console.log(data);

                        personService
                            .getPersonInputStream(data)
                            .then(function (result) {
                                $scope.processing['getPersonInputStream'] = false;
                                angular.copy(result.data, $scope.people);
                                //console.log($scope.people);
                                if ($scope.checkfind && $scope.people.length !== 0) {
                                    $scope.formcheckfind = true;
                                }
                                // только после поиска показыаем кнопку добаления

                                //console.log($scope.person);
                                // проверка на пустые значения
                                if ($scope.person.lastName !== '' ||
                                    $scope.person.firstName !== '' ||
                                    $scope.person.middleName !== '' ||
                                    $scope.person.seria !== '' ||
                                    $scope.person.number !== '' ||
                                    $scope.person.phone !== '') {

                                    $scope.addPersonVisible = true;

                                    $scope.personNew.lastName = $scope.person.lastName; /*Добавлено для переноса из поиска входного потока*/
                                    $scope.personNew.firstName = $scope.person.firstName; 
                                    $scope.personNew.middleName = $scope.person.middleName; 
                                    $scope.personNew.phone = $scope.person.phone;                                     
                                }
                            },
                             function () {
                                 $scope.processing['getPersonInputStream'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка поиска по реестру физических лиц' });
                             });
                    }

                    $scope.addPersonInputStream = function () {

                        // добавить проверки на валидность фио и даты рождения и пола, 
                        // телефона а так же выбранные продукт задача и регион

                        $scope.messages.length = 0;
                        //console.log($scope.personNew);

                         //if (_.isNil($scope.personNew.lastName) ||
                         //    _.isNil($scope.personNew.firstName) ||
                         //    _.isNil($scope.personNew.middleName)) {
                         //    $scope.messages.push({ color: 'red', message: 'не заполнено ФИО' });
                         //}
                    
                        //if (_.isNil($scope.personNew.lastName)) {
                        //    $scope.messages.push({ color: 'red', message: 'не заполнена фамилия' });
                        //}
                        
                        if (_.isNil($scope.personNew.firstName)) { //Во входном потоке принципиальны только имя и телефон
                            $scope.messages.push({ color: 'red', message: 'не заполнено имя' });
                        }

                        //if (_.isNil($scope.personNew.middleName)) {
                        //    $scope.messages.push({ color: 'red', message: 'не заполнено отчество' });
                        //}

                        if ((_.isNil($scope.personNew.phone))||($scope.personNew.phone==="")) {
                            $scope.messages.push({ color: 'red', message: 'не заполнен телефон' });
                        }
                        
                        if (!(/(^([8][0-9]{7,11})$)/.test($scope.personNew.phone))) {
                            $scope.messages.push({ color: 'red', message: 'неправильный формат телефона' });
                        }
                                                
                        if (_.isNil($scope.personNew.selectSex)) {
                            $scope.messages.push({ color: 'red', message: 'не указан пол' });
                        }

                        if (_.isNil($scope.personNew.idTaskType)) {
                            $scope.messages.push({ color: 'red', message: 'не указана задача' });
                        }

                        if ((_.isNil($scope.personNew.dateBirth))||($scope.personNew.dateBirth===null)) {
                            //$scope.messages.push({ color: 'red', message: 'не указана дата рождения' });
                            $scope.personNew.dateBirth = '1800-01-01'
                        }


                        if (_.isNil($scope.personNew.idRegion)) {
                            $scope.messages.push({ color: 'red', message: 'не указан регион обслуживания' });
                        }

                        if (_.isNil($scope.personNew.idOffice)) {
                            $scope.messages.push({ color: 'red', message: 'не указан населенный пункт' });
                        }

                        if (_.isNil($scope.personNew.idProductService)) {
                            $scope.messages.push({ color: 'red', message: 'не указан продукт' });
                        }                        
                        
                        if (_.isNil($scope.personNew.idCommunication)) {
                            $scope.messages.push({ color: 'red', message: 'не указан вид обращения' });   //РЖ
                        }

                        if (_.isNil($scope.personNew.idAdwareChannel)) {
                            $scope.messages.push({ color: 'red', message: 'не указан источник рекламы' });   //РЖ
                        }

                        if ($scope.messages.length > 0) {
                            return;
                        }

                        var data = {
                            idOffice: Office.GetOfficeId(),
                            lastName: $scope.personNew.lastName,
                            firstName: $scope.personNew.firstName,
                            middleName: $scope.personNew.middleName,
                            sex: $scope.personNew.sex,
                            dateBirth: new Date($scope.personNew.dateBirth).toDateString(),
                            phone: $scope.personNew.phone,
                            comment: $scope.personNew.comment,
                            idTaskType: $scope.personNew.idTaskType,
                            idRegion: $scope.personNew.idOffice,                            
                            idProductService: $scope.personNew.idProductService,
                            idCommunication: $scope.personNew.idCommunication,
                            idAdwareChannel: $scope.personNew.idAdwareChannel,
                            person: $scope.personNew
                        }
                        console.log(data);
                        //return

                        $scope.processing['addPersonInputStream'] = true;
                        $scope.message = "добавление физ лица";

                        personService
                            .addPersonInputStream(data)
                            .then(function (result) {
                                $scope.processing['addPersonInputStream'] = false;

                                $scope.person.lastName = $scope.personNew.lastName;
                                $scope.person.firstName = $scope.personNew.firstName;
                                $scope.person.middleName = $scope.personNew.middleName;
                                $scope.person.phone = $scope.personNew.phone;


                                // обнулить поля в personNew
                                $scope.personNew.lastName = '';
                                $scope.personNew.firstName = '';
                                $scope.personNew.middleName = '';
                                $scope.personNew.sex = null;
                                $scope.personNew.dateBirth = '';
                                $scope.personNew.phone = '';
                                $scope.personNew.comment = '';
                                $scope.personNew.idTaskType = null;
                                $scope.personNew.idRegion = null;
                                $scope.personNew.idOffice = null;
                                $scope.personNew.idProductService = null;
                                $scope.personNew.idCommunicationService = 1;
                                $scope.personNew.idAdwareChannelService = 1;

                                $scope.formAddPersonVisible = false;

                                $scope.getPersonInputStream();
                            },
                             function () {
                                 $scope.processing['addPersonInputStream'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка добавление физ лица' });
                             });

                    }


                    $scope.formEditPersonVisible = false;

                    $scope.getPersonEditedData = function (item) {

                        $scope.personEdited.id = item.id;
                        $scope.personEdited.lastName = item.lastName;
                        $scope.personEdited.firstName = item.firstName;
                        $scope.personEdited.middleName = item.middleName;
                        $scope.personEdited.dateBirth = new Date(item.dateBirth); 
                        //sex: $scope.personNew.sex = item.sex;
                        $scope.personEdited.sex = item.sex;
                    }

                    
                    $scope.updatePersonInputStream = function () { //Обновление ФИО. ДР и пола по "карандашу"
                        console.log('personupdate РЖ directive');
                        console.log($scope.personEdited);


                        $scope.checkfind = false;
                        $scope.processing['updatePersonInputStream'] = true;
                        $scope.message = "обновление ФИО, ДР и пола клиента";
                        personService
                            .updatePersonInputStream($scope.personEdited)
                            .then(function (result) {
                                $scope.processing['updatePersonInputStream'] = false;
                                angular.copy(result.data, $scope.people);

                                $scope.formEditPersonVisible = false;
                                //$scope.getPersonInputStream();
                            },
                            function () {
                                $scope.processing['updatePersonInputStream'] = false;
                                swal("ошибка обновления клиента");
                            });
                    }


                    $scope.savePerson = function () {
                        //перед сохранением человека сделать поиск
                        //$scope.find();

                        $scope.getPersonInputStream();

                        if (!$scope.checkfind) {
                            $scope.checkfind = true;
                            return;
                        }

                        $scope.checkfind = false;

                        $scope.processing['savePerson'] = true;
                        $scope.message = "сохранение клиента";

                        personService
                            .addPerson($scope.person)
                            .then(function (result) {
                                $scope.processing['savePerson'] = false;
                                angular.copy(result.data, $scope.people);

                                $scope.formEditPersonVisible = false;
                                $scope.getPersonInputStream();
                            },
                            function () {
                                $scope.processing['savePerson'] = false;
                                swal("ошибка обновления клиента");
                            });
                    }


                    //function filterById_Parent(obj) {
                    //    //console.log("Выбран регион №");console.log($scope.personNew.idRegion);                            
                    //    //console.log("Выбран объект: ");console.log(obj);                            
                    //    if (obj.Id_Parent === $scope.personNew.idRegion) {
                    //        return true;
                    //    } else {                            
                    //        return false;
                    //    }
                    //}

                    //+При изменении выбранного региона
                    $scope.onOfficeRegionsChange = function () {                       
                                                
                        var $Id_Region2 = _.isNil($scope.personNew.selectRegion.id) ? "0" : $scope.personNew.selectRegion.id;
                        $scope.personNew.idRegion = _.isNil($scope.personNew.selectRegion.id) ? "0" : $scope.personNew.selectRegion.id;
                        console.log("Выбран регион "+ $Id_Region2);                            
                                                
                        //$scope.personNew.idRegion = $scope.personNew.selectRegion.id;
                        //console.log("Выбран регион "+ $scope.personNew.idRegion);                            
                        var $z=0;   
                        $scope.officesall2=[];
                            
                        angular.forEach($scope.officesall, function(s){
                            console.log("Рассмотреть объект: ");console.log(s);                            
                            if (s.id_Parent === $Id_Region2){
                                $scope.officesall2.push(s);
                                $z++;
                                console.log("Добавлен объект: ");console.log(s);                            
                            }
                            return;
                        });                          
                        
                        console.log($scope.officesall2);
                        console.log($z);
                        
                        //$scope.officesall2 = $scope.officesall.filter(filterById_Parent);                            
                        
                    }

                    //$scope.onOfficeRegionsChange();
                    //-При изменении выбранного региона

                    $scope.cancelPerson = function () {
                        $scope.formAddPersonVisible = false;
                        $scope.checkfind = false;

                        $scope.initperson();
                    }

                    $scope.savePersonEdited = function () {
                        console.log(item);    
                    }

                }])
        }
    })
}