export default (ngModule) => {

    ngModule.directive('fileInput', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                elm.bind('change', function () {
                    $parse(attrs.fileInput).assign(scope, elm[0].files);
                    scope.$apply();
                })
            }
        }
    }]);

    ngModule.directive('myPersonfile', function () {
        return {
            restrict: 'E',
            replace: false,
            template: require('./PersonFile.html'),
            scope: {
                type: '@',
                //refresh: '&', // событие по обновлению списка файлов
                idpersondocument: '=',
                idpayment: '=',
                idcontract: '=',
                idperson: '=',
                visible: '=',
                visibledelete: '=',
                visibledownload: '=',
                visibleupload: '=?',
                visiblescanupload: '=?',

                visibleletter: '=?',
                visibleregister: '=?',

                visibleinquirykpk: '=?',
                visibleinquiryjuridicalkpk: '=?',
            
                visiblegeneratecontractguarantee: '=?',
                visiblegeneratecontractguaranteeadditional: '=?',
                visiblegeneratecontractprolongation: '=?',
                visiblegeneratecontractpartial: '=?',
                visiblegeneratecontractpartialadditional: '=?',
                visiblegeneratecontractpartialapplication: '=?',
                visiblegeneratecontract: '=?',
                visiblegenerategraphic: '=?',
                visiblepersonoutkpk: '=?',

                isdeposit: '=?',
                visiblegeneratedepositcontract: '=?',
                visiblegeneratedepositgraphic: '=?',
                visiblegeneratedepositcontractprolongation: '=?',

                idfiletype: '='
            },
            controller: (['$scope', '$http', '$routeParams', '$rootScope', '$timeout', 'Upload', 'Profile', 'personService', 'reportService', 'personFileService', 'Person', 'Office',
               function ($scope, $http, $routeParams, $rootScope, $timeout, Upload, Profile, personService, reportService, personFileService, Person, Office) {

                   //$scope.isNew = _.isNil($routeParams.par);
                   //if ($scope.isNew) return;
                   //console.log('sssssssssss');
                   //console.log($scope.visiblescanupload);

                   $scope.processing = {};

                   $scope.person = {
                       id: null //$routeParams.par
                   }

                   //$scope.visiblebuttonupload = true;

                   $scope.contract = {
                       idPerson: $scope.person.id
                   }
                   $scope.selected = null;
                   $scope.upload = [];
                   $scope.personfiles = [];
                   $scope.files = [];
                   $scope.filetypes = [];
                   $scope.error = {};
                   $scope.message = "";

                   $scope.messages = [];

                   $scope.VisibleDebtorLetter = Profile.GetRolePropertyValue("VisibleDebtorLetter");


                   $scope.loadFileTypes = function () {

                       $scope.processing['loadFileTypes'] = true;
                       $scope.message = "загрузка списка типов файлов";

                       var idType = 0;
                       if ($scope.isdeposit == true) {
                           idType = 1;
                       }

                       personFileService
                           .getFileTypes(idType)
                           .then(function (result) {
                               $scope.processing['loadFileTypes'] = false;
                               angular.copy(result.data, $scope.filetypes);
                               //console.log($scope.processing);
                           },
                           function () {
                               $scope.processing['loadFileTypes'] = false;
                               //console.log($scope.processing);
                               $scope.messages.push({ color: 'red', message: 'ошибка загрузки типов файлов' });
                           });
                   }
                   $scope.loadFileTypes();

                   $scope.loadPersonFile = function () {

                       if ($scope.processing['loadPersonFile']) {
                           return;
                       }

                       $scope.processing['loadPersonFile'] = true;
                       $scope.message = "обновление списка файлов";
                       //console.log($scope.processing);

                       var doc = {
                           idPerson: $scope.idperson,
                           idPersonDocument: $scope.idpersondocument,
                           idPayment: $scope.idpayment,
                           idContract: $scope.idcontract,
                           idFileType: null //$scope.idfiletype
                       };
                       //console.log(doc);

                       personFileService
                           .getPerson_File(doc)
                           .then(function (result) {
                               //console.log(result.data);
                               $scope.processing['loadPersonFile'] = false;
                               angular.copy(result.data, $scope.personfiles);
                               //console.log($scope.processing);
                           },
                           function () {
                               $scope.processing['loadPersonFile'] = false;
                               $scope.messages.push({ color: 'red', message: 'ошибка загрузки файлов' });
                           });
                   }
                   $scope.loadPersonFile();

                   $scope.delPerson_File = function (item) {

                       $scope.processing['delPerson_File'] = true;
                       $scope.message = "удаление";

                       personFileService
                           .delPerson_File(item)
                           .then(function (result) {
                               //console.log(result.data);
                               $scope.processing['delPerson_File'] = false;
                               $scope.loadPersonFile();
                           },
                           function () {
                               $scope.processing['delPerson_File'] = false;
                               $scope.messages.push({ color: 'red', message: 'ошибка удаления файла' });
                           });
                   }

                   $scope.onFileSelect = function ($files) {
                       //console.log($files);
                       //$files: an array of files selected, each file has name, size, and type.
                       for (var i = 0; i < $files.length; i++) {
                           var $file = $files[i];

                           var fileInfo = {
                               name: $file.name,
                               size: $file.size,
                               type: $file.type,
                               lastModifiedDate: $file.lastModifiedDate,
                               //id_FileType: $scope.selected.id,
                               id_Person_Document: $scope.idpersondocument,
                               id_Office: Office.GetOfficeId(),
                               id_Person: $scope.person.id,
                               id_Contract: $scope.idcontract,
                               id_Payment: $scope.idpayment,
                           };

                           //console.log(fileInfo);

                           (function (index) {
                               $scope.upload[index] = Upload.upload({
                                   url: "./api/files/uploadfile", // webapi url
                                   method: "POST",
                                   headers: { 'Content-Type': false },
                                   //data: { fileUploadObj: fileInfo },
                                   file: $file
                               }).progress(function (evt) {
                                   // get upload percentage
                                   console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                               }).success(function (data, status, headers, config) {
                                   $scope.loadPersonFile();
                               }).error(function (data, status, headers, config) {
                                   // file failed to upload
                                   //console.log(data);
                                   $scope.messages.push({ color: 'red', message: 'ошибка загрузки файлов' });
                               });
                           })(i);
                       }
                   }
                   $scope.abortUpload = function (index) {
                       $scope.upload[index].abort();
                   }

                   $scope.upload = function () {
                       console.log($scope.selected);

                       var idFileType = 0;

                       if ($scope.selected === null && $scope.visiblescanupload) {
                           //swal("");
                           $scope.messages.push({ color: 'red', message: 'не выбран тип скана!' });
                           return;
                       }
                       else if ($scope.selected !== null && $scope.visiblescanupload) {
                           idFileType = $scope.selected.id;
                       }
                       else if (!$scope.visiblescanupload) {
                           idFileType = $scope.idfiletype;
                       }


                       angular.forEach($scope.files, function (file) {

                           $scope.visiblebuttonupload = false;

                           //$scope.processing['file'] = true;
                           //$scope.message = "загрузка файла " + file.name;
                           //console.log("загрузка файла " + file.name);
                           var fd = new FormData();

                           var ext = "";
                           var a = file.name.split(".");
                           if (!(a.length === 1 || (a[0] === "" && a.length === 2))) {
                               ext = "." + a.pop();
                           }

                           fd.append('file', file);
                           fd.append('lastModifiedDate', file.lastModifiedDate.toISOString());
                           fd.append('id_FileType', idFileType);
                           fd.append('id_Person_Document', $scope.idpersondocument);
                           fd.append('id_Office', Office.GetOfficeId());
                           fd.append('id_Person', $scope.person.id);
                           fd.append('id_Contract', $scope.idcontract);
                           fd.append('id_Payment', $scope.idpayment);
                           fd.append('ext', ext);

                           $scope.processing[file.name] = true;

                           $http.post('FileHandler.ashx', fd, {
                               headers: { 'Content-Type': undefined },
                               transformRequest: angular.identity
                           })
                          .success(function (d) {
                              //console.log(d);
                              //$scope.processing['file'] = false;
                              $scope.processing[file.name] = false;
                              //console.log("конец загрузки файла " + file.name);

                              var first = _.find($scope.files, function (f) { return $scope.processing[f.name]; });
                              if (_.isNil(first)) {
                                  //console.log("sssssssss");
                                  $scope.files = [];
                                  $scope.visiblebuttonupload = true;
                                  $scope.loadPersonFile();
                              }
                              //$scope.processing['file'] = false;
                          })
                          .error(function (data, status, headers, config) {
                              //$scope.processing['file'] = false;
                              //console.log('error');
                              //console.log(data);
                              $scope.error[file.name] = true;
                          });
                       });

                       $scope.selected = null;
                   }

                   $scope.generateReport = function () {

                       $scope.processing['generateReport'] = true;
                       $scope.message = "генерация файла на сервере";

                       var data = {
                           id: 0,
                           idOffice: 4, //Office.GetOfficeId(),
                           idContract: $scope.idcontract,
                           idPerson: $scope.idperson,
                           idPayment: $scope.idpayment,
                           reportType: $scope.reporttype,
                           dateReport: null
                       };

                       console.log(data);

                       reportService
                           .generateReport(data)
                           .then(function (result) {

                               $scope.processing['generateReport'] = false;
                               $scope.loadPersonFile();
                           },
                           function () {
                               $scope.processing['generateReport'] = false;
                               $scope.messages.push({ color: 'red', message: 'ошибка генерации отчета на сервере' });
                           });
                   }
               }])
        }
    })
}