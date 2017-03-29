export default (ngModule) => {

    ngModule.factory('dateService', [
        '$http',
        function () {

            return {
                dateConvert: function (dateString) {
                    var date = new Date(dateString);
                    var dd = date.getDate();
                    if (dd < 10) dd = '0' + dd;

                    var mm = date.getMonth() + 1;
                    if (mm < 10) mm = '0' + mm;

                    var yyyy = date.getFullYear();
                    console.log(yyyy + "-" + mm + "-" + dd);
                    return (yyyy+"-"+mm+"-"+dd);
                }
            }
        }]);
}