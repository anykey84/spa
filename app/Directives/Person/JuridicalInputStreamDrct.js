export default (ngModule) => {

    ngModule.directive('myJuridicalInputStream', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./JuridicalInputStream.html'),
            scope: {
            },
            controller: (['$scope', '$filter', 'personService', 'officeService', 'productService', 'Office', 'Person', 'Profile', 'PeopleFindText',
                function ($scope, $filter, personService, officeService, productService, Office, Person, Profile, PeopleFindText) {

                    $scope.messages = [];
                    $scope.message = "";
                    $scope.processing = {};

                    $scope.people = [];
                    //$scope.productservices = [];
                    $scope.regions = [];
                    //$scope.tasktypes = [];

                    $scope.checkfind = false;

                    $scope.person = {
                        id: 0,
                        name: '',
                        inn: '',
                        kpp: '',
                        ogrn: '',
                        address: '',
                        comment: '',
                        phone: '',
                        idRegion: null,
                        idOffice: Office.GetOfficeId()
                    };

                    $scope.personopen = function (id) {
                        Person.Init(id);
                    }


                    //$scope.getTaskTypesByType = function () {

                    //    $scope.processing['getTaskTypesByType'] = true;
                    //    $scope.message = "загрузка задач";

                    //    taskService
                    //        .getTaskTypesByType(1)
                    //        .then(function (result) {
                    //            $scope.processing['getTaskTypesByType'] = false;
                    //            angular.copy(result.data, $scope.tasktypes);
                    //        },
                    //         function () {
                    //             $scope.processing['getTaskTypesByType'] = false;
                    //             $scope.messages.push({ color: 'red', message: 'ошибка загрузки задач' });
                    //         });
                    //}
                    //$scope.getTaskTypesByType();


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

                    //$scope.getProductServices = function () {

                    //    $scope.processing['getProductServices'] = true;
                    //    $scope.message = "загрузка типов продуктов";

                    //    var data = {
                    //        idOffice: Office.GetOfficeId()
                    //    }
                    //    //console.log(data);

                    //    productService
                    //        .getProductServices(data)
                    //        .then(function (result) {
                    //            $scope.processing['getProductServices'] = false;
                    //            angular.copy(result.data, $scope.productservices);
                    //        },
                    //         function () {
                    //             $scope.processing['getProductServices'] = false;
                    //             $scope.messages.push({ color: 'red', message: 'ошибка загрузки типов продуктов' });
                    //         });
                    //}
                    //$scope.getProductServices();


                    $scope.getPersonInputStream = function () {

                        $scope.processing['getPersonInputStream'] = true;
                        $scope.message = "поиск по реестру юридических лиц";

                        var data = {
                            isJuridical: 1,
                            name: $scope.person.name,
                            inn: $scope.person.inn,
                            ogrn: $scope.person.ogrn
                        }
                        console.log(data);

                        personService
                            .getPersonInputStream(data)
                            .then(function (result) {
                                $scope.processing['getPersonInputStream'] = false;
                                angular.copy(result.data, $scope.people);
                                //console.log($scope.people);
                                if ($scope.checkfind && $scope.people.length != 0) {
                                    $scope.formcheckfind = true;
                                }
                                // только после поиска показыаем кнопку добаления

                                //console.log($scope.person);
                                // проверка на пустые значения
                                if ($scope.person.name != '' ||
                                    $scope.person.inn != '' ||
                                    $scope.person.ogrn != '') {

                                    $scope.addPersonVisible = true;
                                }
                            },
                             function () {
                                 $scope.processing['getPersonInputStream'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка поиска по реестру юридических лиц' });
                             });

                    }

                    $scope.addPersonInputStream = function () {

                        // добавить проверки на фалидность фио и даты рождения и пола, 
                        // телефона а так же выбранные продукт задача и регион

                        $scope.messages.length = 0;
                        //console.log($scope.personNew);

                        /* if (_.isNil($scope.personNew.lastName) ||
                             _.isNil($scope.personNew.firstName) ||
                             _.isNil($scope.personNew.middleName)) {
                             $scope.messages.push({ color: 'red', message: 'не заполнено ФИО' });
                         }*/
                    
                        if (_.isNil($scope.personNew.name)) {
                            $scope.messages.push({ color: 'red', message: 'не заполнено наименование' });
                        }

                        if (_.isNil($scope.personNew.address)) {
                            $scope.messages.push({ color: 'red', message: 'не заполнен юридический (почтовый) адрес' });
                        }

                        if (_.isNil($scope.personNew.inn)) {
                            $scope.messages.push({ color: 'red', message: 'не заполнен ИНН' });
                        }

                        if (_.isNil($scope.personNew.ogrn)) {
                            $scope.messages.push({ color: 'red', message: 'не указан ОГРН' });
                        }

                        if (_.isNil($scope.personNew.kpp)) {
                            $scope.messages.push({ color: 'red', message: 'не указана КПП' });
                        }

                        if (_.isNil($scope.personNew.phone)) {
                            $scope.messages.push({ color: 'red', message: 'не указан основной номер телефона' });
                        }

                        if (_.isNil($scope.personNew.idRegion)) {
                            $scope.messages.push({ color: 'red', message: 'не указан регион' });
                        }

                        if ($scope.messages.length > 0) {
                            return;
                        }
                        //name: '',
                        //inn: '',
                        //kpp: '',
                        //ogrn: '',
                        //address: '',
                        //comment: '',
                        //phone: '',
                        //idRegion: null,
                        //return;
                        var data = {
                            isJuridical: 1,
                            idOffice: Office.GetOfficeId(),
                            name: $scope.personNew.name,
                            kpp: $scope.personNew.kpp,
                            ogrn: $scope.personNew.ogrn,
                            inn: $scope.personNew.inn,
                            address: $scope.personNew.address,
                            phone: $scope.personNew.phone,
                            comment: $scope.personNew.comment,
                            idRegion: $scope.personNew.idRegion,
                            person: $scope.personNew
                        }
                        //console.log(data);
                        //return

                        $scope.processing['addPersonInputStream'] = true;
                        $scope.message = "добавление юридического лица";

                        personService
                            .addPersonInputStream(data)
                            .then(function (result) {
                                $scope.processing['addPersonInputStream'] = false;

                                $scope.person.name = $scope.personNew.name;
                                $scope.person.inn = $scope.personNew.inn;
                                $scope.person.ogrn = $scope.personNew.ogrn;


                                // облунить поля в personNew
                                $scope.personNew.name = '';
                                $scope.personNew.inn = '';
                                $scope.personNew.ogrn = '';
                                $scope.personNew.kpp = '';
                                $scope.personNew.address = '';
                                $scope.personNew.phone = '';
                                $scope.personNew.comment = '';
                                $scope.personNew.idRegion = null;

                                $scope.formAddPersonVisible = false;

                                $scope.getPersonInputStream();
                            },
                             function () {
                                 $scope.processing['addPersonInputStream'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка добавление юридического лица' });
                             });

                    }


                    $scope.formEditPersonVisible = false;

                    $scope.personupdate = function (item) {

                        $scope.person.id = item.id;
                        $scope.person.lastName = item.lastName;
                        $scope.person.firstName = item.firstName;
                        $scope.person.middleName = item.middleName;
                        $scope.person.birthDate = new Date(item.dateBirth);// item.dateBirth;

                        $scope.selectedSex = _.find($scope.sexs, function (p) {
                            return p.sex == item.sex;
                        });

                        console.log('personupdate');
                        console.log($scope.person);
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

                    $scope.cancelPerson = function () {
                        $scope.formAddPersonVisible = false;
                        $scope.checkfind = false;

                        $scope.initperson();
                    }
                }])
        }
    })
}