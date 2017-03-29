export default (ngModule) => {

    ngModule.directive('myContractAttachProfileInWork', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/Contract/AttachProfileInWork',
            scope: {
                contracts: '='
            },
            controller: (['$scope', 'contractService', 'Office', 'Profile',
                function ($scope, contractService, Office, Profile) {

                    $scope.processing = {};
                    $scope.messages = [];
                    $scope.message = "";

               
                

                }])
        }
    })
}