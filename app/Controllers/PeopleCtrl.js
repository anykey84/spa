export default (ngModule) => {
    ngModule.controller('PeopleCtrl', ['$scope', '$filter', '$window', 'Profile', '$http', 'profileService', 'personService', 
        'Person', 'PeopleFindText', 'Office', 'dateService',
        function ($scope, $filter, $window, Profile, $http, profileService, personService, Person, PeopleFindText, Office, dateService) {

            if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabPeople")) {
                $window.location.href = '/';
                return;
            }

            $scope.sexs = [{ sex: true, name: 'мужской' }, { sex: false, name: 'женский' }];
            //console.log($scope.sexs);

            $scope.people = [];
            $scope.messages = [];
            $scope.message = "";
            $scope.processing = {};

            $scope.person = {
                id: 0,  
                lastName: '',
                firstName: '',
                middleName: '',
                birthDate: '',
                sex: true,
                idOffice: Office.GetOfficeId()
            };

            $scope.initperson = function () {
                $scope.id = 0;
                $scope.lastName = '';
                $scope.firstName = '';
                $scope.middleName = '';
                $scope.birthDate = '';
                $scope.sex = true;
            }

            $scope.sexChanged = function () {
                console.log($scope.selectedSex);
                $scope.person.sex = $scope.selectedSex.sex;
            };

            profileService
                  .getRoles()
                  .then(function (result) {
                      //$scope.loadCurrentOffice();
                      Profile.InitRoles(result.data);
                  },
                  function () {
                      alert("ошибка загрузки ролей");
                  });

            //$scope.loadCurrentOffice = function () {
            //    $scope.processing['loadCurrentOffice'] = true;
            //    $scope.message = "загрузка текущего офиса";

            //    officeService
            //         .getCurrentOffice()
            //         .then(function (result) {
            //             Office.Init(result.data);
            //             //console.log(Office.GetOfficeId());
            //             $scope.processing['loadCurrentOffice'] = false;
            //         },
            //         function () {
            //             $scope.processing['loadCurrentOffice'] = false;
            //             alert("ошибка при загрузке офисов");
            //         });

            //};

            $scope.addPersonVisible = false;
            $scope.VisibleButtonAddPerson = Profile.GetRolePropertyValue("VisibleButtonAddPerson");

            if (PeopleFindText.GetPeopleFindText() != '') {
                $scope.findtext = PeopleFindText.GetPeopleFindText();
            }
            else {

                $scope.findtext = "";
                //$scope.findtext = "Фамилия Имя Отчество";
                //$scope.findtext = "slavenin slavenin slavenin";
            }

            $scope.personopen = function (id) {
                //$scope.findtext = id
                //$location.path('#!/Contract')
                //$location.replace()
                Person.Init(id);
            }

            $scope.personupdate = function (item) {

                $scope.person.id = item.id;
                $scope.person.lastName = item.lastName;
                $scope.person.firstName = item.firstName;
                $scope.person.middleName = item.middleName;
                $scope.person.birthDate = new Date(item.dateBirth);

                $scope.selectedSex = _.find($scope.sexs, function (p) {
                    return p.sex == item.sex;
                });
            }

            $scope.checkfind = false;
            $scope.savePerson = function () {
                //перед сохранением человека сделать поиск
                //$scope.find();

                $scope.findtext = $scope.person.lastName + ' ' + $scope.person.firstName + ' ' + $scope.person.middleName;
                $scope.find();

                if (!$scope.checkfind && $scope.person.id == 0) {
                    $scope.checkfind = true;
                    return;
                }

                $scope.checkfind = false;

                $scope.processing['savePerson'] = true;
                $scope.message = "сохранение клиента";
                console.log($scope.person);
                $scope.person.shortBirthDate = dateService.dateConvert($scope.person.birthDate);


                personService
                    .addPerson($scope.person)
                    .then(function (result) {
                        $scope.processing['savePerson'] = false;
                        angular.copy(result.data, $scope.people);

                        // только после успешного добавления скрываем
                        $scope.formAddPersonVisible = false;

                        $scope.findtext = $scope.person.lastName + ' ' + $scope.person.firstName + ' ' + $scope.person.middleName;
                        $scope.find();
                    },
                    function () {
                        $scope.processing['savePerson'] = false;
                        alert("ошибка сохранения клиента");
                    });
            }

            $scope.cancelPerson = function () {
                $scope.formAddPersonVisible = false;
                $scope.checkfind = false;

                $scope.initperson();
            }

            $scope.find = function () {
                //alert("/api/people?par=" + $scope.findtext)
                if ($scope.findtext != '') {
                    PeopleFindText.Init($scope.findtext);
                    $scope.formcheckfind = false;

                    $scope.processing['find'] = true;
                    $scope.message = "поиска по реестру физических лиц";

                    personService
                        .getPeople($scope.findtext)
                        .then(function (result) {
                            $scope.processing['find'] = false;
                            angular.copy(result.data, $scope.people);

                            if ($scope.checkfind && $scope.people.length != 0) {
                                $scope.formcheckfind = true;
                            }
                            // только после поиска показыаем кнопку добаления
                            $scope.addPersonVisible = true;
                        },
                         function () {
                             $scope.processing['find'] = false;
                             alert("ошибка поиска по реестру физических лиц");
                         });
                }
                else {
                    $scope.people = [];
                    PeopleFindText.Init('');
                }
            }

            $scope.find();
        }]);
}