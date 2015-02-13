'use strict';

angular.module('<%= NG_APP_NAME %>')
.service('<%= SERVICE_NAME %>', function ($http, BASE_URL) {

    var baseUrl = BASE_URL.url+":"+BASE_URL.port+"/";


    this.fetchData = function() { 
        var getUrl = baseUrl+'api/collectionName';
        return $http.get(getUrl);
    };

    this.postData = function (dataToPost) {
        var postUrl = baseUrl+'api/collectionName';
        return $http.post(postUrl, dataToPost);
    };
});