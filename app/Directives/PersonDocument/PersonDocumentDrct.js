export default (ngModule) => {

    ngModule.directive('myPersonDocument', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonDocument.html'),
            scope: {
                typedoc: '=',
                visibleadddocument: '=',
                visiblefiledocument: '=',
                visibledownloadfiledocument: '=',
                visibleuploadfiledocument: '=',
                visibledeletefiledocument: '='
            },
            controller: (['$scope', '$routeParams', 'personDocumentService', 'personFileService', 'Person', 'Office', 'Profile',
               function ($scope, $routeParams, personDocumentService, personFileService, Person, Office, Profile, ngMask) {

                   

                   $scope.isNew = _.isNil($routeParams.par);
                   if ($scope.isNew) return;

                   $scope.person = {
                       id: $routeParams.par
                   }

                   //console.log('********************************$scope.typedoc********************************');
                   //console.log($scope.typedoc);

                   $scope.contract = {
                       idPerson: $scope.person.id,
                       idOffice: Office.GetOfficeId()
                   }

                   $scope.documents = [];
                   $scope.processing = {};
                   $scope.message = "";
                   $scope.messages = [];

                   $scope.EnableValidationPerson_Document = Profile.GetRolePropertyValue('EnableValidationPerson_Document');

                   $scope.loadPersonDocument = function (idPersonDocument) {

                       var doc = {
                           idPerson: $scope.person.id,
                           idDocument: $scope.typedoc.id
                       };

                       $scope.processing['loadPersonDocument'] = true;
                       $scope.message = "загрузка документа";

                       personDocumentService
                           .getPersonDocument(doc)
                           .then(function (result) {

                               $scope.processing['loadPersonDocument'] = false;

                               //if (result.data.length == 0) {
                               //    return;
                               //}

                               //console.log('lllll');
                               //console.log(result.data.length);

                               

                               if (result.data.length) {
                                   var values = result['data'][0]['values'];


                                   for (var prop in values) {
                                       if (values[prop]['propertyType'] === 'date') {
                                           var dt = new Date(values[prop]['propertyValue'])
                                           console.log((dt));
                                           values[prop]['propertyValue'] = (dt);
                                       }
                                   }
                               }
                           

                               //console.log(values);


                               angular.copy(result.data, $scope.documents);

                               if (idPersonDocument == 0) {
                                   // показываем самый последний
                                   var maxItem = _.max($scope.documents, function (work) {
                                       return work.id_Person_Document;
                                   });
                                   if(maxItem) maxItem.isVisible = true;

                               } else if (idPersonDocument == -1) {
                                   //ниче не показываем
                               } else if (idPersonDocument > 0) {
                                   // показывыем
                                   var firstItem = _.find($scope.documents, function (doc) {
                                       return doc.id_Person_Document == idPersonDocument;
                                   });
                                   firstItem.isVisible = true;
                               }
                           },
                           function () {
                               $scope.processing['loadPersonDocument'] = false;
                               swal("ошибка загрузки документа");
                           });
                   }

                   $scope.propertyPassportChanged = function ($index) {
                       //$scope.selectContractPerson.index = $index;
                       //$scope.contractPerson.idPerson = this.item.id;
                       //console.log(this.item.propertyName);
                   };

                   $scope.initpdp = function (item) {
                       //console.log('documentPropertyClick');

                       if (!_.isNil($scope.lastProperty) && (item.id_Person_DocumentProperty == $scope.lastProperty.id_Person_DocumentProperty)) {
                           //console.log('this.item.id_Person_DocumentProperty == $scope.lastProperty.id_Person_DocumentProperty');
                           return false;
                       }

                       //console.log('произошла переинициализация');
                       //console.log(item);
                       //console.log(item.propertyValue);
                       item.isSaved = false;

                       $scope.lastProperty = {};
                       angular.copy(item, $scope.lastProperty);
                       //console.log('lastProperty');
                       //console.log($scope.lastProperty);
                       //console.log($scope.lastProperty.propertyValue);
                       //console.log('конец переинициализация');
                       return true;
                   }

                   $scope.documentPropertyClick = function (item) {
                       $scope.initpdp(item);
                   };

                   $scope.documentPropertyChange = function (item) {
                   };

                   $scope.documentPropertyFocus = function (item) {
                       item.isSaved = false;
                   };

                   $scope.documentPropertyArrayChange = function (item) {
                       item.propertyValue = item.selectedDocumentPropertyArray.id;
                       item.isSaved = false;
                   };

                   $scope.initSelectedDocumentPropertyArray = function (item) {
                       //console.log(item);
                       item.selectedDocumentPropertyArray = _.find(item.arrays, function (ar) {
                           return ar.id == item.propertyValue;
                       });
                       //console.log('hhh');
                   };

                   $scope.click = function (item) {
                       //console.log('click');
                       //console.log(item);
                   };

                   $scope.focus = function (item) {
                       //console.log('focus');
                       //console.log(item);

                       $scope.initpdp(item);
                       //console.log('end focus');
                   };

                   $scope.formatDate = function(date) {
                       console.log(date)
                       var dd = date.getDate();
                       if (dd < 10) dd = '0' + dd;

                       var mm = date.getMonth() + 1;
                       if (mm < 10) mm = '0' + mm;

                       var yy = date.getFullYear();

                       return yy + '-' + mm + '-' + dd;
                   }

           

                   $scope.blur = function (item) {
                       //console.log('blur');
                       if(item.propertyType === "date"){
                           item.propertyValue = $scope.formatDate(item.propertyValue);
                       }
                       var firstDocument = _.find($scope.documents, function (doc) {
                           return doc.id_Person_Document == $scope.lastProperty.id_Person_Document;
                       });
                       //console.log(firstDocument);

                       var list = [];
                       _.each(firstDocument.values, function (item) {
                           list.push(item);
                           _.each(item.items, function (i) {
                               list.push(i);
                           });
                       });


                       var firstProperty = _.find(list, function (prop) {
                           return prop.id_Person_DocumentProperty == $scope.lastProperty.id_Person_DocumentProperty;
                       });

                       //console.log(firstProperty);

                       //console.log($scope.lastProperty);

                       if ($scope.lastProperty.propertyValue == firstProperty.propertyValue) {
                           console.log('значения равны апдейта нет');
                           firstProperty.isSaved = null;
                           $scope.lastProperty = {};
                           angular.copy(item, $scope.lastProperty);
                       } else {

                           if ($scope.EnableValidationPerson_Document) {
                               $scope.validatePerson_DocumentProperty(firstProperty);
                           }
                           else {
                               $scope.updatePerson_DocumentProperty(firstProperty);
                           }
                       }

                       //console.log('end blur');
                   };
               

                   //$scope.lastProperty = {};
                   $scope.documentPropertyChanged = function (item) {

                       //console.log('смена фокуса documentPropertyChanged');
                       //console.log(item);

                       if (!$scope.initpdp(item)) {
                           console.log('нет сохранения');
                           return;
                       }

                       //if (_.isNil($scope.lastProperty)) {
                       //    $scope.lastProperty = {};
                       //    angular.copy(item, $scope.lastProperty);
                       //    console.log('произошла переинициализация');
                       //    return;
                       //}

                       //console.log(item.id_Person_DocumentProperty);
                       //console.log('lastProperty = ' + $scope.lastProperty.id_Person_DocumentProperty);


                       //if (item.id_Person_DocumentProperty == $scope.lastProperty.id_Person_DocumentProperty) {
                       //    console.log('this.item.id_Person_DocumentProperty == $scope.lastProperty.id_Person_DocumentProperty');
                       //    return;
                       //}

                       // нужно получить первоначально значение 
                       //console.log('старое значение = ' + $scope.lastProperty.propertyValue);
                       // получить новое значение только по id 
                       // снчало новый документ получить и после этого получить его свойства и от туда получить по id_Person_DocumentProperty
                       var firstDocument = _.find($scope.documents, function (doc) {
                           return doc.id_Person_Document == $scope.lastProperty.id_Person_Document;
                       });

                       var firstProperty = _.find(firstDocument.values, function (prop) {
                           return prop.id_Person_DocumentProperty == $scope.lastProperty.id_Person_DocumentProperty;
                       });

                       //console.log('новое значение = ' + firstProperty.propertyValue);

                       if ($scope.lastProperty.propertyValue == firstProperty.propertyValue) {
                           console.log('значени равны апдейта нет');
                           firstProperty.isSaved = null;
                           $scope.lastProperty = {};
                           angular.copy(item, $scope.lastProperty);
                           return;
                       }

                       $scope.updatePerson_DocumentProperty(firstProperty);

                       // здесь мы уже перешли на другой элемент
                       $scope.lastProperty = {};
                       angular.copy(item, $scope.lastProperty);

                   };

                   //$scope.lastChildProperty = {};
                   $scope.documentPropertyChildChanged = function (item) {

                       //console.log('потеря фокуса');

                       if (_.isNil($scope.lastChildProperty)) {
                           $scope.lastChildProperty = {};
                           //console.log(item.id_Person_DocumentProperty);
                           angular.copy(item, $scope.lastChildProperty);
                           //console.log('произошла инициализация');
                           //console.log($scope.lastChildProperty);
                           //console.log('***********************************');
                           return;
                       }

                       //console.log(item.id_Person_DocumentProperty);
                       //console.log('lastChildProperty = ' + $scope.lastChildProperty.id_Person_DocumentProperty);


                       if (item.id_Person_DocumentProperty == $scope.lastChildProperty.id_Person_DocumentProperty) {
                           //console.log('this.item.id_Person_DocumentProperty == $scope.lastProperty.id_Person_DocumentProperty');
                           return;
                       }

                       // нужно получить первоначально значение 
                       //console.log($scope.lastChildProperty);
                       //console.log($scope.lastChildProperty.propertyValue);

                       //console.log('старое значение = ' + $scope.lastChildProperty.propertyValue);
                       // получить новое значение только по id 
                       // снчало новый документ получить и после этого получить его свойства и от туда получить по id_Person_DocumentProperty
                       var firstDocument = _.find($scope.documents, function (doc) {
                           return doc.id_Person_Document == $scope.lastChildProperty.id_Person_Document;
                       });

                       var firstProperty = _.find(firstDocument.values, function (prop) {
                           return prop.id_Person_DocumentProperty == $scope.lastChildProperty.id_Parent_Person_DocumentProperty;
                       });

                       var firstItemProperty = _.find(firstProperty.items, function (prop) {
                           return prop.id_Person_DocumentProperty == $scope.lastChildProperty.id_Person_DocumentProperty;
                       });

                       //console.log('новое значение = ' + firstItemProperty.propertyValue);

                       if ($scope.lastChildProperty.propertyValue == firstItemProperty.propertyValue) {
                           //console.log('значени равны апдейта нет');
                           $scope.lastChildProperty = {};
                           angular.copy(item, $scope.lastChildProperty);
                           firstProperty.isSaved = null;


                           //console.log('****************значени равны апдейта нет*********************');
                           //console.log($scope.lastChildProperty);
                           //console.log('*************************************');
                           return;
                       }

                       $scope.updatePerson_DocumentProperty(firstItemProperty);

                       // здесь мы уже перешли на другой элемент
                       $scope.lastChildProperty = {};
                       angular.copy(item, $scope.lastChildProperty);

                       //console.log('****************был апдейт*********************');
                       //console.log($scope.lastChildProperty);
                       //console.log('*************************************');
                   };

                   $scope.updatePerson_DocumentProperty = function (item) {
                       //console.log('апдейт');

                       var p_dp = {
                           id_Person_DocumentProperty: item.id_Person_DocumentProperty,
                           propertyValue: '' + item.propertyValue + '',
                           idOffice: $scope.contract.idOffice
                       }

                       $scope.processing[item.id_Person_DocumentProperty] = true;

                       personDocumentService
                           .updatePerson_DocumentProperty(p_dp)
                           .then(function (result) {
                               //console.log(result.data);
                               $scope.processing[item.id_Person_DocumentProperty] = false;
                               var id_p_dp = result.data;
                               item.id_Person_DocumentProperty = id_p_dp;
                               item.isSaved = true;
                           },
                           function () {
                               $scope.processing[item.id_Person_DocumentProperty] = false;
                               swal("ошибка авто сохранения свойства");
                           });
                   }

                   $scope.propertyWorkChanged = function ($index) {
                   };

                   $scope.addPerson_DocumentProperty = function (item) {
                       // проблема идентификации - посылаем обьект сразу в базу

                       var p_dp = {
                           idDocumentProperty: item.id_DocumentProperty,
                           idPerson_Document: item.id_Person_Document,
                           idOffice: $scope.contract.idOffice
                       }

                       $scope.processing['addPerson_DocumentProperty'] = true;
                       $scope.message = "добавление свойства";

                       personDocumentService
                           .addPerson_DocumentProperty(p_dp)
                           .then(function (result) {
                               //console.log(result.data);
                               $scope.processing['addPerson_DocumentProperty'] = false;
                               $scope.loadPersonDocument(item.id_Person_Document);
                           },
                           function () {
                               $scope.processing['addPerson_DocumentProperty'] = false;
                               swal("ошибка добавления свойства");
                           });
                   }

                   // удаление свойств типа XML
                   $scope.delPerson_DocumentProperty = function (item) {

                       var p_dp = {
                           id_Person_DocumentProperty: item.id_Person_DocumentProperty,
                           idOffice: $scope.contract.idOffice
                       }

                       personDocumentService
                           .delPerson_DocumentProperty(p_dp)
                           .then(function (result) {
                               //console.log(result.data);
                               $scope.loadPersonDocument(item.id_Person_Document);
                           },
                           function () {
                               swal("ошибка удаления свойства");
                           });
                   }

                   // добавление документа
                   $scope.addPerson_Document = function (id) {
                       // нужно понять какой действительно был последний и открыть его для редактирования
                       var t = {
                           idDocument: id,
                           idPerson: $scope.contract.idPerson,
                           idOffice: $scope.contract.idOffice
                       };

                       $scope.processing['addPerson_Document'] = true;
                       $scope.message = "добавление документа";

                       personDocumentService
                           .addPerson_Document(t)
                           .then(function (result) {
                               //console.log(result.data);
                               $scope.processing['addPerson_Document'] = false;
                               $scope.loadPersonDocument(0);
                           },
                           function () {
                               $scope.processing['addPerson_Document'] = false;
                               swal("ошибка добавления документа");
                           });
                   }

                   // сохранение документа
                   $scope.savePerson_Document = function () {

                       var result = [];
                       //console.log($scope.documents);

                       // сначало добавить свойства xml помеченные на удаление
                       _.each($scope.documents, function (item) {

                           //console.log(item.values);
                           var delItems = _.filter(item.values, function (t) {
                               //console.log(t.isDeleted);
                               return t.isDeleted == true;
                           });
                           //console.log(delItems);
                       });

                       // теперь добавим новые свойства добавленные в текущес сеансе

                       // теперь в цикле найти свойства которые были изменены и отправить их - эти свойства будут удалены и добавлены новые
                   }

                   // редактирование документа
                   $scope.openPerson_Document = function (item) {
                       item.isVisible = !item.isVisible;
                       console.log(item);
                       //_.each($scope.documents, function (item) { item.isVisible = false; });
                   }

                   // редактирование документа
                   $scope.editPerson_Document = function (item) {
                       //item.isVisible = !item.isVisible;
                       //_.each($scope.documents, function (item) { item.isVisible = false; });
                   }

                   // удаление документа
                   $scope.delPerson_Document = function (item) {

                       //console.log(item);
                       $scope.processing['delPerson_Document'] = true;
                       $scope.message = "удаление документа";

                       var data = {
                           id: item,
                           idOffice: Office.GetOfficeId()
                       };

                       personDocumentService
                           .delPerson_Document(data)
                           .then(function (result) {
                               //console.log(result.data);
                               $scope.processing['delPerson_Document'] = false;
                               $scope.loadPersonDocument(-1);
                           },
                           function () {
                               $scope.processing['delPerson_Document'] = false;
                               swal("ошибка удаления документа");
                           });
                   }

                   //валидация свойства документа
                   $scope.validatePerson_DocumentProperty = function (item) {


                       var p_dp = {
                           id_Person_DocumentProperty: item.id_Person_DocumentProperty,
                           propertyValue: '' + item.propertyValue + '',
                           idOffice: $scope.contract.idOffice,
                           id_Document: item.id_Document,
                           id_DocumentProperty: item.id_DocumentProperty,
                           typeParameter: item.propertyType
                       }

                       //очищаем массив ошибок
                       if (_.isNil(item.messages))
                           item.messages = []
                       else
                           item.messages.length = 0;

                       //console.log('validate p_dp');
                       //console.log(p_dp);

                       personDocumentService
                           .validatePerson_DocumentProperty(p_dp)
                           .then(function (result) {

                               if ((!_.isNil(result.data)) && (result.data.length > 0)) {
                                   item.messages = angular.copy(result.data);
                               }
                               else //если ошибок нет, то спокойно обновляем свойство
                                   $scope.updatePerson_DocumentProperty(item);
                           },
                           function () {
                               item.messages.push({ message: 'ошибка проверки значения', color: 'red' });
                           });
                   }



                   //if ($scope.typedoc.type == 'work') {
                   $scope.loadPersonDocument(-1);
                   //}
               }])
        }
    })
}