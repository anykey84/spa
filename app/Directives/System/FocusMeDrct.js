export default (ngModule) => {

    ngModule.directive('myFocus', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                scope.$watch(attr.myFocus, function (n, o) {
                    if (n != 0 && n) {
                        element[0].focus();
                    }
                });
            }
        };
    });

    ngModule.directive('myBlur', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind('blur', function () {
                    //apply scope (attributes)
                    scope.$apply(attr.myBlur);
                    //return scope value for focusing to false
                    scope.$eval(attr.myFocus + '=false');
                });
            }
        };
    });
}