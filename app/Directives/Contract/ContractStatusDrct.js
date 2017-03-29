export default (ngModule) => {

    ngModule.directive('myContractstatus', function () {
        return {
            restrict: 'E',
            replace: true,
            template: require('./ContractStatus.html'),
            scope: {
                contract: '='
            },
            controller: (['$scope', 'Profile', 'personDocumentService', 'DictionaryTypes', 'contractStatusService',  'Office', 'officeService',
        function ($scope, Profile, personDocumentService, DictionaryTypes, contractStatusService, Office, officeService) {

            //console.log($scope.contract);

            $scope.statuses = [];
            $scope.messages = [];
            $scope.message = "";
            $scope.commenttypes = [];
            $scope.processing = {};

            $scope.VisibleButtonStatusClose = Profile.GetRolePropertyValue("VisibleButtonStatusClose");
            $scope.VisibleButtonStatusInSB = Profile.GetRolePropertyValue("VisibleButtonStatusInSB");
            $scope.VisibleButtonStatusCancel = Profile.GetRolePropertyValue("VisibleButtonStatusCancel");
            $scope.VisibleButtonStatusOk = Profile.GetRolePropertyValue("VisibleButtonStatusOk");
            $scope.VisibleButtonDeleteStatus = Profile.GetRolePropertyValue("VisibleButtonDeleteStatus");
            $scope.VisibleButtonStatusApproved = Profile.GetRolePropertyValue("VisibleButtonStatusApproved");
            $scope.VisibleButtonStatusCorrection = Profile.GetRolePropertyValue("VisibleButtonStatusCorrection");
                
            $scope.loadCommentTypes = function () {

                var countCommentTypes = DictionaryTypes.GetCommentTypes().length;

                if (countCommentTypes == 0) {

                    contractStatusService
                       .getCommentTypes()
                       .then(function (result) {

                           angular.copy(result.data, $scope.commenttypes);

                           DictionaryTypes.InitCommentTypes(result.data);
                       },
                        function () {
                            swal("ошибка загрузки типы коментов загружены");
                        });
                }
                else {
                    angular.copy(DictionaryTypes.GetCommentTypes(), $scope.commenttypes);
                }
            }

            $scope.loadCommentTypes();

            $scope.initStatus = function () {
                $scope.selected = null;

                $scope.status = {
                    idCommentType: null,
                    comment: '',
                    typeStatus: '',
                    contractId: $scope.contract.id,
                    idOffice: $scope.office
                }
            }
            $scope.initStatus();


            $scope.commentTypeChanged = function (item) {
                $scope.status.idCommentType = item.id;
            };

            $scope.addStatus = function () {

                officeService.getCurrentOffice()
                 .then(function (result) {
                     $scope.status.idOffice = result.data.id_Office

                     console.log($scope.status)
                     $scope.processing['addStatus'] = true;
                     $scope.message = "добавление статуса";

                     contractStatusService
                         .addStatusContract($scope.status)
                         .then(function (result) {
                             $scope.processing['addStatus'] = false;
                             $scope.initStatus();
                             $scope.loadStatuses();
                         },
                         function () {
                             $scope.processing['addStatus'] = false;
                             swal("ошибка добавления статуса");
                         });

                 },
                 function () {
                     window.location = '/#';
                 });                    
            }

            $scope.delStatus = function (id) {
                $scope.processing['delStatus'] = true;
                $scope.message = "удаление статуса";

                   

                officeService.getCurrentOffice()
                 .then(function (result) {

                     var s = {
                         id: id,
                         comment: "",
                         contractId: $scope.contract.id,
                         idOffice: result.data.id_Office
                     }

                     contractStatusService
                    .deleteStatus(s)
                    .then(function (result) {
                        $scope.processing['delStatus'] = false;
                        $scope.loadStatuses();
                    },
                    function () {
                        $scope.processing['delStatus'] = false;
                        swal("ошибка удаления статуса");
                    });
                 })
                    
            }

            $scope.loadStatuses = function () {
                $scope.processing['loadStatuses'] = true;
                $scope.message = "загрузка статусов";

                contractStatusService
                    .getContractStatus($scope.contract.id)
                        .then(function (result) {
                            //console.log("загрузка contractStatusService");
                            $scope.processing['loadStatuses'] = false;
                            angular.copy(result.data, $scope.statuses)
                        },
                        function () {
                            $scope.processing['loadStatuses'] = false;
                            swal("ошибка загрузки статусов карточек");
                        });
            }

            $scope.loadStatuses();
        }])
        }
    })
}