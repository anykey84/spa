export default (ngModule) => {

    ngModule.factory('productService', [
        '$http',
        function ($http) {

            return {

                getProduct: function (p) {
                    return $http({
                        method: 'POST',
                        url: '/api/product/products/0',
                        data: p
                    });
                }

                , getProductTypes: function () {
                    return $http({
                        method: 'GET',
                        url: '/api/product/producttypes/0'
                    });
                }

                 , getProductServices: function (p) {
                     return $http({
                         method: 'POST',
                         url: '/api/product/getproductservices/0',
                         data: p
                     });
                 }


                , addProduct: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/product/add',
                        data: p
                    });
                }

                , deleteProduct: function (p) {
                    //console.log(p);
                    return $http({
                        method: 'POST',
                        url: '/api/product/del/' + p.id,
                        data: p
                    });
                }
            }
        }]);
}