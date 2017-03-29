export default (ngModule) => {

    ngModule.directive('myPersontable', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonTable.html'),
            scope: {
                persons: '=persons'
                , loadpersons: '&'
            },
            controller: (['$scope', 'Profile', 'Office', 'personService', 'profileService',
                function ($scope, Profile, Office, personService, profileService) {

                    $scope.profiles = [];
                    $scope.messages = [];
                    $scope.message = "";
                    $scope.processing = {};

                    $scope.VisibleAttachPersonsProfileInWork = Profile.GetRolePropertyValue("VisibleAttachPersonsProfileInWork");

                    $scope.selectPersonsAll = function (isSelectPersonsAll) {
                        _.each($scope.persons, function (item) { item.isSelected = isSelectPersonsAll; });
                    }

                    $scope.loadProfilesInWork = function () {

                        $scope.processing['loadProfilesInWork'] = true;
                        $scope.message = "загрузка профилей";

                        profileService
                            .getProfilesInWork()
                            .then(function (result) {
                          
                                $scope.processing['loadProfilesInWork'] = false;
                                angular.copy(result.data, $scope.profiles);
                                //console.log($scope.profiles);
                            },
                            function () {
                                $scope.processing['loadProfilesInWork'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка загрузки' });
                            });
                    }
                    $scope.loadProfilesInWork();

                    $scope.detachPersonsProfileInWork = function () {

                        $scope.messages.length = 0;

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
                                 $scope.visibleFormAttach = false;
                                 $scope.processing['detachPersonsProfileInWork'] = false;
                                 $scope.loadpersons();
                             },
                             function () {
                                 $scope.processing['detachPersonsProfileInWork'] = false;
                                 $scope.messages.push({ color: 'red', message: 'ошибка открепления' });
                             });

                    }

                    $scope.attachPersonsProfileInWork = function () {

                        $scope.messages.length = 0;

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

                        //console.log(data);

                        $scope.processing['attachPersonsProfileInWork'] = true;
                        $scope.message = "закрепление";

                        personService
                            .attachPersonsInWork(data)
                            .then(function (result) {
                                $scope.visibleFormAttach = false;
                                $scope.processing['attachPersonsProfileInWork'] = false;
                                $scope.loadpersons();
                            },
                            function () {
                                $scope.processing['attachPersonsProfileInWork'] = false;
                                $scope.messages.push({ color: 'red', message: 'ошибка закрепления' });
                            });

                    }

                }])
        }
    })
}