export default (ngModule) => {

    ngModule.directive('myPersonAttachProfileInWork', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonAttachProfileInWork.html'),
            scope: {
                persons: '=',
                loadpersonsprofileinwork: '&'
            },
            controller: (['$scope', 'personService', 'Office', 'Profile',
                function ($scope, personService, Office, Profile) {

                    $scope.processing = {};
                    $scope.messages = [];
                    $scope.message = "";

                    $scope.VisibleAttachPersonsProfileInWork = Profile.GetRolePropertyValue("VisibleAttachPersonsProfileInWork");


                    $scope.selectPersonsAll = function (isSelectPersonsAll) {
                        _.each($scope.persons, function (item) { item.isSelected = isSelectPersonsAll; });
                    }

                    $scope.attachPersonsProfileInWork = function () {

                        var selectedpersons = _.filter($scope.persons, function (c) { return c.isSelected == true; });

                        var str = "";
                        _.each(selectedpersons, function (c) { str = str + c.id_Person + '#'; });

                        if (_.isNil(str)) {
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали ни одной карточки для закрепления!!!!' });
                            return;
                        }

                        if (_.isNil($scope.selectedPersonProfile)) {
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали сотрудника для закрепления!!!!' });
                            return;
                        }

                        var data = {
                            idProfile: $scope.selectedPersonProfile.id,
                            idOffice: Office.GetOfficeId(),
                            comment: $scope.commentPerson,
                            persons: str
                        }

                        $scope.processing['attachPersonsProfileInWork'] = true;
                        $scope.message = "закрепление";

                        personService
                            .attachPersonsInWork(data)
                            .then(function (result) {
                                $scope.processing['attachPersonsProfileInWork'] = false;
                                $scope.loadpersonsprofileinwork();
                            },
                            function () {
                                $scope.processing['attachPersonsProfileInWork'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка закрепления' });
                            });

                    }

                    $scope.detachPersonsProfileInWork = function () {

                        var selectedpersons = _.filter($scope.persons, function (c) { return c.isSelected == true; });

                        var str = "";
                        _.each(selectedpersons, function (c) { str = str + c.id_Person + '#'; });

                        if (_.isNil(str)) {
                            $scope.messages.push({ color: 'red', message: 'вы не выбрали ни одной карточки для открепления!!!!' });
                            return;
                        }

                        var data = {
                            idOffice: Office.GetOfficeId(),
                            comment: $scope.commentPerson,
                            persons: str
                        }

                        $scope.processing['detachPersonsProfileInWork'] = true;
                        $scope.message = "открепление";

                        personService
                             .detachPersonsInWork(data)
                             .then(function (result) {
                                 $scope.processing['detachPersonsProfileInWork'] = false;
                                 $scope.loadpersonsprofileinwork();
                             },
                             function () {
                                 $scope.processing['detachPersonsProfileInWork'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка открепления' });
                             });

                    }


                }])
        }
    })
}