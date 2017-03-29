'use strict';

angular.isUndefined = function (val) {
    return val === null || val === "" || angular.isUndefined(val) || val === null
}

var appMain = angular.module('app'
        , [
          'ui.bootstrap'
        //, 'ui.bootstrap.demo'
        , 'ui.checkbox'
        , 'angularFileUpload'
        , 'ngRoute'
        , 'ngSanitize'
        , 'timer'
        , 'ngMask'
        , 'app.service.person'
        , 'app.service.persondocument'
        , 'app.service.personfile'
        , 'app.service.contract'
        , 'app.service.contractstatus'
        , 'app.service.payment'
        , 'app.service.loaninfo'
        , 'app.service.contractperson'
        , 'app.service.product'
        , 'app.service.contractparameter'
        , 'app.service.address'
        , 'app.service.ticket'
        , 'app.service.profile'
        , 'app.service.report'
        //, 'app.service.office'
        , 'app.service.phone'
        , 'app.service.task'
        , 'app.service.credithistory'
        , 'app.service.role'
        , 'app.service.personkpk'
        , 'app.service.document'
        , 'app.service.alertmessages'
        , 'app.service.deposit'
        , 'app.service.timecontrol'
        , 'app.service.communication' //Добавлено РЖ
        , 'app.service.adwarechannel' //Добавлено РЖ

        //, 'app.ctrl.home'
        , 'app.ctrl.people'
        , 'app.ctrl.ticket'
        , 'app.ctrl.admin'
        , 'app.ctrl.archive'
        , 'app.ctrl.report'
        //, 'app.ctrl.contract'
        , 'app.ctrl.task'
        , 'app.ctrl.personinputstream'

        , 'app.ctrl.depositInfo'
        , 'app.ctrl.personInfo'
        , 'app.ctrl.personInfoAll'
        , 'app.ctrl.contractInfo'
        , 'app.ctrl.contractInfoAll'
        //, 'angularMoment'
        //, 'app.ctrl.deleteContractPerson'
        ]

    ).config(['$routeProvider', '$locationProvider',
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






/* main: startup script creates the 'todo' module and adds custom Ng directives */

// 'todo' is the one Angular (Ng) module in this app
// 'todo' module is in global namespace
//************window.app = angular.module('app', []);

// Add global "services" (like breeze and Q) to the Ng injector
// Learn about Angular dependency injection in this video
// http://www.youtube.com/watch?feature=player_embedded&v=1CpiB3Wk25U#t=2253s
/*****todo.value('breeze', window.breeze)
    .value('Q', window.Q);*/

// Configure routes
//********************/*app.config(['$routeProvider', function ($routeProvider) {
//$routeProvider.
//when('/', { templateUrl: 'app/todo.view.html', controller: 'TodoCtrl' }).
//when('/', { templateUrl: 'app/about.view.html', controller: 'AboutCtrl' }).
//when('/about', { templateUrl: 'app/about.view.html', controller: 'AboutCtrl' }).
// when('/', { templateUrl: 'app/Views/people.html', controller: 'PeopleCtrl' }).
// otherwise({ redirectTo: '/' });
// }]); 

//#region Ng directives
/*  We extend Angular with custom data bindings written as Ng directives */
/******todo.directive('onFocus', function () {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                elm.bind('focus', function () {
                    scope.$apply(attrs.onFocus);
                });
            }
        };
    })
    .directive('onBlur', function () {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                elm.bind('blur', function () {
                    scope.$apply(attrs.onBlur);
                });
            }
        };
    })
    .directive('onEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.onEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .directive('selectedWhen', function () {
        return function (scope, elm, attrs) {
            scope.$watch(attrs.selectedWhen, function (shouldBeSelected) {
                if (shouldBeSelected) {
                    elm.select();
                }
            });
        };
    });*/

/*******if (!Modernizr.input.placeholder) {
    // this browser does not support HTML5 placeholders
    // see http://stackoverflow.com/questions/14777841/angularjs-inputplaceholder-directive-breaking-with-ng-model
    todo.directive('placeholder', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {

                var value;

                var placeholder = function () {
                    element.val(attr.placeholder);
                };
                var unplaceholder = function () {
                    element.val('');
                };

                scope.$watch(attr.ngModel, function (val) {
                    value = val || '';
                });

                element.bind('focus', function () {
                    if (value == '') unplaceholder();
                });

                element.bind('blur', function () {
                    if (element.val() == '') placeholder();
                });

                ctrl.$formatters.unshift(function (val) {
                    if (!val) {
                        placeholder();
                        value = '';
                        return attr.placeholder;
                    }
                    return val;
                });
            }
        };
    });
}*/

//#endregion 


