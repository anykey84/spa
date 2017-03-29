export default (ngModule) => {

    ngModule.directive('myPersonFinder', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonFinder.html'),
            scope: {
                persons: '=', // через это возвращаем массив найденных персонов
                selectedPerson: '=' // а через это самого персона
            },
            controller: (['$scope', 'personService', '$filter',
                function($scope, personService, $filter) {
                    $scope.messages = [];
                    $scope.message = '';
                    $scope.processing = [];
                    $scope.fullName = "";

                    //$scope.persons = [];
                    //$scope.selectedPerson = {};

                    $scope.findPerson = function (FullName) {
                        $scope.processing['findPersons'] = true;
                        $scope.message = 'Поиск по реестру физических лиц';
                        $scope.messages.length = 0;
                        $scope.selectedPerson = {};
                        FullName = FullName.trim();

                        personService
                            .getPeople(FullName)
                            .then(function (result) {
                                if (result.data.length == 0) {
                                    $scope.messages.push({ message: 'Не обнаружено лиц по запросу: \"' + FullName+'\"', color: 'red' });
                                }

                                $scope.persons = result.data;
                                $scope.processing['findPersons'] = false;
                            },
                            function () {
                                $scope.messages.push({ message: 'Не удалось выполнить поиск по реестру.', color: 'red' });
                                $scope.processing['findPersons'] = false;
                            });
                    }

                    $scope.selectPerson = function (item) {
                        $scope.selectedPerson = item;
                        $scope.selectedPerson.stringValue = isNull(item.lastName, '') + ' ' + isNull(item.firstName, '') + ' '
                            + isNull(item.middleName, '') + ' ' + (_.isNil(new Date(item.dateBirth)) ? '' : $filter('date')(item.dateBirth, 'dd.MM.yyyy'));
                        console.log('Select: ', $scope.selectedPerson);
                    }

                    var isNull = function (item, replacement) {
                        return _.isNil(item) ? replacement : item;
                    }

                }
            ])
        };
    });
}
