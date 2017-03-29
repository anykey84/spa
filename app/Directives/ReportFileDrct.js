'use strict';

appMain.directive('myReportfile', function () {
    return {
        restrict: 'E',
        replace: false,
        templateUrl: '/File/ReportFile',
        scope: {
            visible: '=',
            visibledelete: '=',
            visibledownload: '=',

            typereport: '@',
            isuser: '=',

            idfiletype: '='
        },
        controller: (['$scope', '$http', '$filter', 'reportService', 'personFileService', 'officeService', 'Office', 'reportFactory', 'UrlFactory',
           function ($scope, $http, $filter, reportService, personFileService, officeService, Office, reportFactory, UrlFactory) {

               $scope.processing = {};
               $scope.message = "";
               $scope.error = {};

               //$scope.dateReport = {};
               $scope.reportResultData = {};
               $scope.personfiles = [];
               $scope.offices = [];
               
               if ($scope.typereport = 'typicalreport') {
                   // Имя Отчета
                   $scope.reportName = "";
                   // Адрес до вложенной вьюхи1
                   $scope.innerUrl1 = "";
                   // видимость элементов
                   $scope.VisibilityElements = {};

                   $scope.reportName = reportFactory.GetFileNameById($scope.idfiletype);
                   $scope.innerUrl1 = UrlFactory.GetUrlByAlias('report' + $scope.idfiletype.toString()); // для репортов добавляем префикс report

                   switch ($scope.idfiletype) {
                       case 69: // Отчет остатки по кассе
                           $scope.VisibilityElements = { VisibleDateFrom: true, VisibleDateTo: false };
                           break;
                       case 71:
                           $scope.VisibilityElements = { VisibleDateFrom: true, VisibleDateTo: false };
                           break;
                       case 72:
                           $scope.VisibilityElements = { VisibleDateFrom: true, VisibleDateTo: false };
                           break;
                       case 73:
                           $scope.VisibilityElements = { VisibleDateFrom: true, VisibleDateTo: false };
                           break;
                       case 74: // TimeControl
                           $scope.VisibilityElements = { VisibleDateFrom: true, VisibleDateTo: false };
                           break;
                       case 75: // Отчет Инвентаризация задолженности (Обеспеченные)
                       case 76: // Отчет Инвентаризация задолженности (Необеспеченные)
                           $scope.VisibilityElements = { VisibleDateFrom: true, VisibleDateTo: false };
                           break;

                           // Добавляем поведение кнопок для новых отчетов сюды...

                       default:
                           $scope.VisibilityElements = { VisibleDateFrom: false, VisibleDateTo: false };
                           break;
                   }
               }


               $scope.editTemplates = {
                   'cash': '/Report/ReportCash',
                   'contractsinwork': '/Report/ReportContractsInWork',
                   'analysisoffice': '/Report/ReportAnalysisOffice',
                   'cashbyoffice': '/Report/ReportCashByOffice',
                   'cashgroupoffice': '/Report/ReportCashGroupOffice',
                   'managerreturnsissuance': '/Report/ReportManagerReturnsIssuance',
                   'profitoverdue': '/Report/ReportProfitOverdue',
                   'sales': '/Report/ReportSales',
                   'reestr': '/Report/ReportReestr',
                   'salescall': '/Report/ReportSalesCall',
                   'averageweighted': '/Report/ReportAverageWeighted',
                   'typicalreport': '/Report/TypicalReport' // шаблон, в который и будет всё пихатцо
               };

               $scope.dateReport = {
                   date: new Date(),
                   dateTo: new Date(),
                   //dateMonth: $filter("date")(Date.now(), 'yyyy-MM-dd'),
                   idOffice: null,
                   officeName: ''
               };
               // $filter("date")(Date.now(), 'yyyy-MM-dd');

               $scope.visibleClick = function (visibleflag) {
                   if (visibleflag) {
                       $scope.loadPersonFile();
                       $scope.loadData();
                   }
                   else {
                       $scope.personfiles = [];
                   }
               }

               $scope.loadData = function () {
                   if ($scope.typereport == "cashbyoffice" || $scope.typereport == "analysisoffice") {
                       $scope.loadOffices();
                   }
               }

               $scope.officeChanged = function (item) {
                   $scope.dateReport.idOffice = item.id;
                   $scope.dateReport.officeName = item.name;
               }

               $scope.loadOffices = function () {

                   if ($scope.processing['loadOffices']) {
                       console.log('уже идет');
                       return;
                   }

                   $scope.offices = [];

                   $scope.processing['loadOffices'] = true;

                   officeService
                       .getOffices()
                           .then(function (result) {
                               angular.copy(result.data, $scope.offices);
                               $scope.processing['loadOffices'] = false;
                           },
                           function () {
                               $scope.processing['loadOffices'] = false;
                               swal("ошибка загрузки офисов");
                           });
               }

               $scope.loadPersonFile = function () {

                   if ($scope.processing['loadPersonFile']) {
                       return;
                   }

                   $scope.processing['loadPersonFile'] = true;
                   $scope.message = "загрузка отчетов";

                   var doc = {
                       idPerson: null,
                       idPersonDocument: null,
                       idPayment: null,
                       idContract: null,
                       idFileType: $scope.idfiletype,
                       isUser: $scope.isuser
                   };

                   personFileService
                       .getPerson_File(doc)
                       .then(function (result) {
                           //console.log('loadPersonFile');
                           //console.log(result.data);
                           $scope.processing['loadPersonFile'] = false;
                           angular.copy(result.data, $scope.personfiles);
                           //console.log($scope.processing);
                       },
                       function () {
                           $scope.processing['loadPersonFile'] = false;
                           swal("ошибка загрузки файлов");
                       });
               }

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
                           swal("ошибка удаления файла");
                       });
               }

               $scope.generateReport = function () {

                   $scope.processing['generateReport'] = true;
                   $scope.message = "генерация отчета на сервере";

                   console.log($scope.dateReport);

                   var data = {
                       id: 0,
                       idOffice: Office.GetOfficeId(),
                       idContract: null,
                       idPayment: null,
                       reportType: $scope.typereport,
                       dateReport: $scope.dateReport,
                       idFileType: $scope.idfiletype
                   };

                   // console.log(data);

                   reportService
                       .generateReport(data)
                       .then(function (result) {
                           $scope.processing['generateReport'] = false;
                           $scope.reportResultData = result.data;
                           $scope.loadPersonFile();
                       },
                       function () {
                           $scope.processing['generateReport'] = false;
                           swal("ошибка генерации отчета на сервере");
                       });
               }               
           }])
    }
})