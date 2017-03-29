export default (ngModule) => {

    ngModule.factory('Office', function () {

            var isInit = false;
            var idOffice = '';
            var idOffice_User = '';
            var name = '';
            var officeService = {};

            officeService.Init = function (item) {
                isInit = true;
                idOffice = item.id_Office;
                idOffice_User = item.id_Office_User;
                name = item.name;
            };
            officeService.GetOfficeId = function () {

                if (idOffice == -1) {
                    toastr.warning("НЕ ВЫБРАНА ТОРГОВАЯ ТОЧКА!!!!!!!!!!!!!!!!!!!")
                }

                return idOffice;
            };

            officeService.IsInit = function () {
                return !(idOffice === -1);
            };

            return officeService;
        })
}