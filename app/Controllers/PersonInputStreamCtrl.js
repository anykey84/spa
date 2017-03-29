export default (ngModule) => {
    ngModule
    .controller('PersonInputStreamCtrl',
                ['$scope', '$filter', '$window', 'Profile', '$http', 'profileService', 'personService', 'Person', 'PeopleFindText', 'Office',
        function ($scope, $filter, $window, Profile, $http, profileService, personService, Person, PeopleFindText, Office) {

            if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabPersonInputStream")) {
                $window.location.href = '/';
                return;
            }

            

        }]);
}