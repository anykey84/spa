export default (ngModule) => {

    ngModule.filter('dateFormat1', ['$filter',
        function ($filter) {
            return function (input) {
                if (input == null) { return ""; }

                var _date = $filter('date')(input, 'dd.MM.yyyy');

                return _date.toUpperCase();

            };
        }]);



    ngModule.filter('dateFormatShort', ['$filter',
        function ($filter) {
            return function (input) {
                if (input == null) { return ""; }

                var _date = $filter('date')(input, 'dd.MM.yyyy');

                return _date.toUpperCase();

            };
        }]);

    //appMain.filter('dateFormat1', ['$filter',
    //    function ($filter) {
    //        return function (input) {
    //            if (input == null) { return ""; }

    //            var _date = $filter('date')(new Date(input), 'dd.MM.yyyy');

    //            return _date.toUpperCase();

    //        };
    //    }]);

    ngModule.filter('dateFormatLong', ['$filter',
        function ($filter) {
            return function (input) {
                if (input == null) { return ""; }

                var _date = $filter('date')(input, 'dd.MM.yyyy HH:mm.ss');

                return _date;
            };
        }]);


    ngModule.filter('maxcurrentdate', ['$filter', function ($filter) {
        return function () {
            return $filter('date')(moment().add(7, 'd'), 'yyyy-MM-dd');
        };
    }])


    ngModule.filter('mincurrentdate', ['$filter', function ($filter) {
        return function () {
            return $filter('date')(new Date(), 'yyyy-MM-dd');
        };
    }])

    ngModule.filter('orderObjectBy', function() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if(reverse) filtered.reverse();
            return filtered;
        };
    });
}