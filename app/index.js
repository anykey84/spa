const angular = require('angular');
const _ = require('lodash');
const moment = require('moment');
require('angular-moment');
require('angular-ui-bootstrap');
require('jquery-validation');
require('ng-file-upload');
require('angular-route');
require('angular-sanitize');
require('./ajaxlogin.js');

const ngModule = angular
    .module('app', ['ui.bootstrap', 'ngRoute', 'ngFileUpload', 'ngSanitize', 'angularMoment'])
    .config(['$routeProvider', '$locationProvider', 
        function ($routeProvider, $locationProvider) {

            // Specify the three simple routes ('/', '/About', and '/Contact')
            $routeProvider.when('/', {
                templateUrl: '/Home/Home', controller: 'HomeCtrl',
            });
            $routeProvider.when('/Person', {
                templateUrl: '/Home/Person', controller: 'PeopleCtrl',
            });
            $routeProvider.when('/PersonInputStream', {
                templateUrl: '/Home/PersonInputStream', controller: 'PersonInputStreamCtrl',
            });
            $routeProvider.when('/Contract', {
                templateUrl: '/Home/Contract', controller: 'ContractCtrl',
            });
            $routeProvider.when('/Ticket', {
                templateUrl: '/Home/Ticket', controller: 'TicketCtrl'
            });
            $routeProvider.when('/Admin', {
                templateUrl: '/Home/Admin', controller: 'AdminCtrl'
            });
            $routeProvider.when('/Archive', {
                templateUrl: '/Home/Archive', controller: 'ArchiveCtrl'
            });
            $routeProvider.when('/Report', {
                templateUrl: '/Home/Report', controller: 'ReportCtrl'
            });
            $routeProvider.when('/Task', {
                templateUrl: '/Home/Task', controller: 'TaskCtrl'
            });
            $routeProvider.when('/Regional', {
                templateUrl: '/Home/Regional', controller: 'RegionalCtrl', controllerAs: 'regionalCtrl'
            });
            $routeProvider.when('/Person/Info/:par', {
                templateUrl: '/Person/Info', controller: 'PersonInfoCtrl'
            });
            $routeProvider.when('/Person/InfoAll/:par', {
                templateUrl: '/Person/InfoAll', controller: 'PersonInfoAllCtrl'
            });
            //$routeProvider.when('/Person/Info', {
            //    templateUrl: '/Person/Info', controller: 'PersonInfoCtrl'
            //});
            $routeProvider.when('/Contract/Info/:par', {
                templateUrl: '/Contract/Info', controller: 'ContractInfoCtrl'
            });
            $routeProvider.when('/Contract/InfoAll/:par', {
                templateUrl: '/Contract/InfoAll', controller: 'ContractInfoAllCtrl'
            });

            $routeProvider.when('/Deposit/Info/:par', {
                templateUrl: '/Deposit/Info', controller: 'DepositInfoCtrl'
            });
            //$routeProvider.when('/Contract/Info', {
            //    templateUrl: '/Contract/Info', controller: 'ContractInfoCtrl'
            //});
            $routeProvider.otherwise({
                redirectTo: '/'
            });

        }]);

require('./Directives/')(ngModule);
require('./Services/')(ngModule);
require('./Controllers/')(ngModule);
require('./Factory/')(ngModule);
require('./Filters/')(ngModule);
//require('./app.scss')

