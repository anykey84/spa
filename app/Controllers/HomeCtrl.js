export default (ngModule) => {
    ngModule.controller('HomeCtrl', ['$scope', 'Guid', '$rootScope', 'taskService', 'profileService', 'Profile', 'reportFactory', 'depositService',
        function ($scope, Guid, $rootScope, taskService, profileService, Profile, reportFactory, depositService) {

            //$scope.name = Guid.NewGuid(); //"домашняя страница";
            $scope.name = "Домашняя страница";
            $scope.isload = false;

            profileService
                .getRoles()
                .then(function (result) {
                    //console.log(result.data);
                    Profile.InitRoles(result.data);
                    //console.log(Profile.GetRoles());
                    //console.log(Profile.GetRolePropertyValue("VisibleTabAdmin"));
                },
                function () {
                    $scope.messages.push({ color: 'red', message: 'ошибка загрузки ролей' });
                });

            // Грузим FileTypes
            reportFactory.InitFileTypesAuto();

            //var dd = {
            //    idDeposit: 35026 ,
            //    dateNow: '2016-05-25'
            //}
            //depositService
            //   .getDepositInfo(dd)
            //   .then(function (result) {
            //       console.log('depositService');
            //       console.log(result.data);
            //   },
            //   function () {
            //       console.log('errrrrreerrrr');
            //   });

            //$scope.timerRunning = true;

            //$scope.startTimer = function () {
            //    $scope.$broadcast('timer-start');
            //    $scope.timerRunning = true;
            //};

            //$scope.stopTimer = function () {
            //    $scope.$broadcast('timer-stop');
            //    $scope.timerRunning = false;
            //};

            //$scope.$on('timer-stopped', function (event, data) {
            //    console.log('Timer Stopped - data = ', data);
            //});

            //$scope.$on('timer-tick', function (event, data) {
            //    console.log('Timer tick');
            //});


        }]);
}