export default (ngModule) => {

    ngModule.directive('myPersonphone', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonPhone.html'),
            scope: {
                person: '='
            },
            controller: (['$scope', 'personService', 'Office', 'Profile',
                function ($scope, personService, Office, Profile) {

                    $scope.personphones = [];
                    $scope.contactphones = [];

                    $scope.processing = {};
                    $scope.message = "";
                    $scope.messages = [];


                    $scope.currentPhone = '';
                    $scope.currentIdPhone = 0;
                    $scope.confirmcode = '';
                    $scope.confirmresult = '';

                    $scope.phone = {
                        idPerson: $scope.person.id,
                        idOffice: Office.GetOfficeId(),

                        lastName: '',
                        firstName: '',
                        middleName: '',
                        birthDate: '',
                        sex: false,

                        phone: '',
                        comment: ''
                    }

                    $scope.initPhone = function () {
                        $scope.phone.lastName = '';
                        $scope.phone.firstName = '';
                        $scope.phone.middleName = '';
                        $scope.phone.birthDate = '';
                        $scope.phone.sex = false;
                        $scope.phone.phone = '';
                        $scope.phone.comment = '';
                    }

                    //$scope.VisibleButtonAddPhone = false;
                    //$scope.VisibleButtonDeletePhone = false;
                    $scope.VisibleButtonAddPhone = Profile.GetRolePropertyValue("VisibleButtonAddPhone");
                    $scope.VisibleButtonDeletePhone = Profile.GetRolePropertyValue("VisibleButtonDeletePhone");
                    $scope.VisibleTabPerson_PhoneAnalysis = Profile.GetRolePropertyValue("VisibleTabPerson_PhoneAnalysis");
                    $scope.VisibleDeletedPhone = Profile.GetRolePropertyValue("VisibleDeletedPhone");

                    //$scope.VisibleButtonConfirmPhone = $scope.phone.isConfirmed;

                    $scope.propertyPhoneChanged = function ($index) {
                    };

                    $scope.saveContactPhone = function () {
                        $scope.processing['saveContactPhone'] = true;
                        $scope.message = "добавление телефона";

                        var newPhone = {
                            lastName : $scope.phone.lastName,
                            firstName : $scope.phone.firstName,
                            middleName : $scope.phone.middleName,
                            birthDate: ($scope.phone.birthDate) ? ($scope.phone.birthDate).toDateString() : null,
                            sex : $scope.phone.sex,
                            phone : $scope.phone.phone,
                            comment: $scope.phone.comment,
                            idPerson: $scope.person.id,
                            idOffice: $scope.phone.idOffice

                        }

                        //console.log(newPhone);

                        personService
                            .addContactPhone(newPhone)
                            .then(function (result) {
                                //console.log(result.data);
                                $scope.processing['saveContactPhone'] = false;
                                $scope.initPhone();
                                $scope.loadContactPhone();
                            },
                            function () {
                                $scope.processing['saveContactPhone'] = false;
                                swal("ошибка добавления телефона");
                            });
                    }

                    $scope.deleteContactPhone = function (item) {
                        $scope.processing['deleteContactPhone'] = true;
                        $scope.message = "удаление телефона";

                        var delphone = {
                            idPerson: $scope.person.id,
                            idOffice: Office.GetOfficeId(),
                            idPerson_Contact: item.id_Person_Contact
                        }

                        personService
                           .deleteContactPhone(delphone)
                           .then(function (result) {
                               //console.log(result.data);
                               $scope.processing['deleteContactPhone'] = false;
                               $scope.loadContactPhone();
                           },
                           function () {
                               $scope.processing['deleteContactPhone'] = false;
                               swal("ошибка удаления телефона");
                           });
                    }

                    $scope.savePersonPhone = function () {
                        var $myPhone = _.isNil($scope.phone.phone) ? "" : $scope.phone.phone; 
                        //console.log($myPhone);
                        var $phoneCorrect = true;
                        if (!(/(^([8][0-9]{7,11})$)/.test($myPhone))) $phoneCorrect = false; 
                        //if (_.isNil($scope.phone.comment)) $phoneCorrect = false; 

                        if ($phoneCorrect == false){
                            $scope.addPhoneForm.phone.$valid = false;
                            $scope.processing['savePersonPhone'] = false;
                            swal("ошибка добавления телефона");
                        } else {
                            $scope.processing['savePersonPhone'] = true;
                            $scope.message = "добавление телефона";

                            personService
                                .addPersonPhone($scope.phone)
                                .then(function (result) {
                                    $scope.processing['savePersonPhone'] = false;
                                    $scope.initPhone();
                                    $scope.loadPersonPhone();
                                },
                                function () {
                                    $scope.processing['savePersonPhone'] = false;
                                    swal("ошибка добавления телефона");
                                });
                        }
                    }

                    $scope.deletePersonPhone = function (item) {

                        $scope.processing['deletePersonPhone'] = true;
                        $scope.message = "удаление телефона";

                        var delphone = {
                            idPerson: $scope.person.id,
                            idOffice: Office.GetOfficeId(),
                            idPerson_Phone: item.id_Person_Phone
                        }

                        personService
                           .deletePersonPhone(delphone)
                           .then(function (result) {
                               //console.log(result.data);
                               $scope.processing['deletePersonPhone'] = false;
                               $scope.loadPersonPhone();
                           },
                           function () {
                               $scope.processing['deletePersonPhone'] = false;
                               swal("ошибка удаления телефона");
                           });
                    }

                    $scope.confirmPersonPhone = function (item) {

                        $scope.processing['confirmPersonPhone'] = true;
                        $scope.message = "подтверждение телефона";

                        $scope.currentIdPhone = item.id_Phone;
                        $scope.currentPhone = item.phone;
                        var code = "type=2#idPhone=" + item.id_Phone;
                        var p = {
                            code: code
                        }

                        personService
                           .confirmPersonPhone(p)
                           .then(function (result) {
                               //console.log(result.data);
                               $scope.processing['confirmPersonPhone'] = false;
                               $scope.confirmcode = '';
                               $scope.loadPersonPhone();
                           },
                           function () {
                               $scope.processing['confirmPersonPhone'] = false;
                               swal("ошибка отправки сообщения");
                           });
                    }

                    $scope.sendSaleMemoryNote = function (item) {

                        $scope.processing['sendSaleMemoryNote'] = true;
                        $scope.message = "выслать памятку вдалельцу з/у";

                        $scope.currentIdPhone = item.id_Phone;
                        $scope.currentPhone = item.phone;
                        var code = "type=6#idPhone=" + item.id_Phone;
                        var p = {
                            code: code
                        }
                        console.log("проверка директивы1 "+code);
                        
                        personService
                           .sendSaleMemoryNote(p)
                           .then(function (result) {
                               //console.log(result.data);
                               if(result.data === 'Done'){
                                   swal('Сообщение отправлено','','success');
                               } else {
                                   swal('Сообщение не отправлено','','error');
                               }
                               $scope.processing['sendSaleMemoryNote'] = false;
                           },
                           function () {
                               $scope.processing['sendSaleMemoryNote'] = false;
                               swal("ошибка отправки сообщения");
                           });
                    }



                    $scope.checkPersonPhone = function () {

                        $scope.processing['checkPersonPhone'] = true;
                        $scope.message = "проверка кода подтверждения";

                        var p = {
                            idPhone: $scope.currentIdPhone,
                            code: $scope.confirmcode
                        }
                        personService
                           .checkPersonPhone(p)
                           .then(function (result) {
                               //$scope.confirmresult = result.data;
                               $scope.processing['checkPersonPhone'] = false;
                               //console.log(result.data);
                               if (result.data == "true")
                                   $scope.confirmresult = 'Телефон подтвержден';
                               else
                                   $scope.confirmresult = 'Код неверный';
                               $scope.loadPersonPhone();
                           },
                           function () {
                               $scope.processing['checkPersonPhone'] = false;
                               swal("ошибка подтверждения телефона");
                           });
                    }

                    $scope.loadContactPhone = function () {

                        $scope.processing['loadContactPhone'] = true;
                        $scope.message = "загрузка контактных телефонов";

                        var data = {
                            idPerson: $scope.person.id,
                            isDeleted: $scope.VisibleDeletedPhone
                        };


                        personService
                            .getPersonContactPhone(data)
                            .then(function (result) {
                                $scope.processing['loadContactPhone'] = false;
                                angular.copy(result.data, $scope.contactphones);
                                console.log(result.data);
                            },
                            function () {
                                $scope.processing['loadContactPhone'] = false;
                                swal("ошибка загрузки телефонов");
                            });
                    }

                    $scope.loadContactPhone();

                    $scope.loadPersonPhone = function () {

                        $scope.processing['loadPersonPhone'] = true;
                        $scope.message = "загрузка личных телефонов";

                        var data = {
                            idPerson: $scope.person.id,
                            isDeleted: $scope.VisibleDeletedPhone
                        };

                        personService
                            .getPersonPhone(data)
                            .then(function (result) {
                                $scope.processing['loadPersonPhone'] = false;
                                angular.copy(result.data, $scope.personphones);
                                console.log(result.data);
                            },
                            function () {
                                $scope.processing['loadPersonPhone'] = false;
                                swal("ошибка загрузки телефонов");
                            });
                    }

                    $scope.loadPersonPhone();
                }])
        }
    })
}