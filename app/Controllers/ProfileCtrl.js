export default (ngModule) => {
    ngModule.controller('ProfileCtrl', ['officeService', '$scope', '$location',
function (officeService, $scope, $location) {
    const vm = this;
    console.log('ProfileCtrl');

    vm.currentoffice = {};

    vm.loadCurrentOffice = function () {

        //vm.processing['loadCurrentOffice'] = true;
        vm.message = "загрузка текущего офиса";

        officeService
             .getCurrentOffice()
             .then(function (result) {
                 angular.copy(result.data, vm.currentoffice);
                 //Office.Init(vm.currentoffice);
                 //vm.isload = true;
                 //vm.processing['loadCurrentOffice'] = false;
                 if (vm.currentoffice.officeName !== undefined) {
                     toastr.success("Активная точка: " + vm.currentoffice.officeName);
                 } else {
                     toastr.error("Не выбрана торговая точка!");
                     swal('Не выбрана торговая точка!', 'Укажите текущую торговую точку', 'warning');
                     $location.path('/#/');
                 }
             },
             function () {
                 //vm.processing['loadCurrentOffice'] = false;
                 swal("ошибка при загрузке офисов");
             });

    };


    //if (!Office.IsInit() || !Profile.GetRolePropertyValue("VisibleTabCard")) {
    //    $window.location.href = '/';
    //    return;
    //}           
    $scope.$on('changeOffice', function (event, data) {
        vm.loadCurrentOffice(); 
    });

    $scope.$on('syncOffice', function (event, data) {
        if (vm.currentoffice.id_Office !== data.id_Office) {

            if (data.id_Office !== undefined && data.id_Office !== -1) {
                vm.currentoffice = data;
                toastr.success("Активная точка: " + vm.currentoffice.officeName);
            } else {
                toastr.error("Не выбрана торговая точка!");
                swal('Не выбрана торговая точка!', 'Укажите текущую торговую точку', 'warning');
                //$location.path('/#/');
            }
        };
                
    });

            

}]);

};

