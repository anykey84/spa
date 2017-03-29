export default (ngModule) => {

    ngModule.directive('input', function () {
        return {
            require: '?ngModel',
            restrict: 'E',
            link: function (scope, element, attrs, ngModel) {
                if (attrs.type = "date" && ngModel) {
                    element.bind('change', function () {
                        scope.$apply(function () {
                            ngModel.$setViewValue(element.val());
                        });
                    });
                }
            }
        };
    });


    //appMain.directive('jqdatepicker', function () {
    //    return {
    //        restrict: 'A',
    //        link: function (scope, element, attrs) {
    //            element.datepicker({
    //                changeYear: "true",
    //                changeMonth: true,
    //                dateFormat: 'yy-mm-dd',
    //                showOtherMonths: true,
    //                showButtonPanel: true,
    //                onClose: function (selectedDate) {
    //                    scope.dateTtime = selectedDate + "T" + scope.time;
    //                    scope.$apply();
    //                }
    //            });
    //        }
    //    };
    //});

}