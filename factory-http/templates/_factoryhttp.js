'use strict';

angular.module('<%= NG_APP_NAME %>')
.factory('<%= FACTORY_NAME %>', function ($http, BASE_URL) {

    var baseUrl = BASE_URL.url+":"+BASE_URL.port+"/";

    return {
        fetchAllData: function () {
            var getUrl = baseUrl+'api/items';
            return $http.get(getUrl);
        },
        postData: function (dataToPost) {
            var postUrl = baseUrl+'api/item';
            return $http.post(postUrl, dataToPost);
        }
    };
});
