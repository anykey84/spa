export default (ngModule) => {

    ngModule.directive('myContractperson', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./ContractPerson.html'),
            scope: {
                contract: '=',
                office: '='
            },
            controller: (['$scope', '$routeParams', 'contractPersonService', 'personService', 'DictionaryTypes', 'Person', 'Office',
               function ($scope, $routeParams, contractPersonService, personService, DictionaryTypes, Person, Office) {

                   $scope.selectContractPerson = {
                       index: null
                   }

                   $scope.contractPerson = {
                       id: 0,
                       idPersonType: 0,
                       idContract: $scope.contract.id,
                       idPerson: 0,
                       idOffice: $scope.office.id,
                       comment: ""
                   }
                   $scope.messages = [];
                   $scope.message = "";
                   $scope.processing = {};

                   $scope.findContractPersontext = "";
                   $scope.contractpersons = [];

                   $scope.persons = [];
                   $scope.persontypes = [];

                   $scope.addPersonVisible = true;
                   $scope.deletePersonVisible = true;

                   $scope.resultTableContractPersonVisible = false;
                   $scope.noneresult = false;

                   $scope.loadPersonTypes = function () {

                       var countPersonTypes = DictionaryTypes.GetPersonTypes().length;

                       if (countPersonTypes === 0) {
                           $scope.processing['loadPersonTypes'] = true;
                           $scope.message = "загрузка типов заемщиков";

                           personService
                              .getPersonTypes()
                                  .then(function (result) {
                                      angular.copy(result.data, $scope.persontypes);
                                      DictionaryTypes.InitPersonTypes(result.data);
                                      $scope.processing['loadPersonTypes'] = false;
                                  },
                                   function () {
                                       $scope.processing['loadPersonTypes'] = false;
                                       swal("ошибка загрузки типы заемщиков");
                                   });
                       }
                       else {
                           angular.copy(DictionaryTypes.GetPersonTypes(), $scope.persontypes);
                       }
                   };

                   $scope.loadPersonTypes();

                   $scope.personTypeChanged = function (item) {
                       $scope.contractPerson.idPersonType = item.id;
                       //console.log("$scope.contractPerson.idPersonType " + $scope.contractPerson.idPersonType);
                   };

                   $scope.personChanged = function ($index) {
                       $scope.selectContractPerson.index = $index;
                       $scope.contractPerson.idPerson = this.item.id;
                       //console.log("$scope.contractPerson.idPerson " + $scope.contractPerson.idPerson);
                   };

                   $scope.addContractPerson = function () {
                       if ($scope.contractPerson.idPerson == 0) {
                           swal("вы не выбрали клиента из поискового результата");
                           return;
                       }

                       if ($scope.contractPerson.idPersonType == 0) {
                           swal("вы не выбрали тип заемщика");
                           return;
                       }

                       $scope.processing['addContractPerson'] = true;
                       $scope.message = "добавления клиента в карточку";

                       contractPersonService
                           .addContractPerson($scope.contractPerson)
                               .then(function (result) {
                                   //console.log(result.data);
                                   $scope.processing['addContractPerson'] = false;
                                   $scope.loadContractPersons();
                                   $scope.persons = [];
                                   $scope.findtext = "";
                               }, function () {
                                   $scope.processing['addContractPerson'] = false;
                                   swal("ошибка добавления клиента в карточку");
                               });
                   };

                   $scope.loadContractPersons = function () {

                       $scope.processing['loadContractPersons'] = true;
                       $scope.message = "загрузка заемщиков";

                       contractPersonService
                           .getContractPerson($scope.contract.id)
                               .then(function (result) {
                                   $scope.processing['loadContractPersons'] = false;
                                   angular.copy(result.data, $scope.contractpersons);
                               },
                               function () {
                                   $scope.processing['loadContractPersons'] = false;
                                   swal("ошибка загрузки заемщиков");
                               });
                   };

                   $scope.findtext = "";

                   $scope.findContractPersonClick = function () {

                       $scope.processing['findContractPersonClick'] = true;
                       $scope.message = "поиска по реестру физических лиц";

                       personService
                           .getPeople($scope.findtext)
                               .then(function (result) {
                                   $scope.processing['findContractPersonClick'] = false;
                                   angular.copy(result.data, $scope.persons);

                                   if ($scope.persons.length === 0) {
                                       $scope.noneresult = true;
                                   }
                                   else {
                                       $scope.noneresult = false;
                                   }
                               },
                                function () {
                                    $scope.processing['findContractPersonClick'] = false;
                                    swal("ошибка поиска по реестру физических лиц");
                                });
                   };

                   $scope.loadContractPersons();


                   $scope.delContractPerson = function (id) {

                       $scope.processing['delContractPerson'] = true;
                       $scope.message = "удаление человека из карточки";

                       var contractperson = {
                           id: id,
                           comment: "",
                           idOffice: Office.GetOfficeId()
                       }

                       contractPersonService
                           .deleteContractPerson(contractperson)
                               .then(function (result) {
                                   //angular.copy(result.data, $scope.messages);
                                   $scope.processing['delContractPerson'] = false;
                                   $scope.loadContractPersons();
                               },
                                function () {
                                    $scope.processing['delContractPerson'] = false;
                                    swal("ошибка удаления человека из карточки");
                                });
                   };

               }])
        }
    })
}