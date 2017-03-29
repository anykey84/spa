export default (ngModule) => {

    ngModule.directive('myPersonSearchByPhone', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./PersonSearchByPhone.html'),
            scope: {
            
            },
            controller: (['$scope', 'Person', 'Profile', 'personService',
            function($scope,Person,Profile, personService){
            
                $scope.persons = [];
                $scope.messages = [];
                $scope.message = "";
                $scope.processing = {};
                $scope.findphone = "";

                $scope.VisiblePersonsByPhone = Profile.GetRolePropertyValue("VisiblePersonsByPhone");

                $scope.phoneSearch = function () 
                {
               
                    if ($scope.findphone != '') {
                    
                        $scope.processing['phoneSearch'] = true;
                        $scope.message = "поиск клиентов";

                        personService
                            .searchPersonByPhone($scope.findphone)
                            .then(function(result){
                                $scope.processing['phoneSearch'] = false;
                                angular.copy(result.data, $scope.persons);
                            },
                            function () {
                                $scope.processing['phoneSearch'] = false;
                                swal("ошибка поиска по телефону");
                            });
                    }
                    else 
                    {
                        $scope.persons = [];
                    }
            
                }
            }])
        }
    })
}