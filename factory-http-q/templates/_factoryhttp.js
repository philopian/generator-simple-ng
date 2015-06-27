'use strict';

angular.module('<%= NG_APP_NAME %>')
.factory('<%= FACTORY_NAME %>', function($http, $q, BASE_URL){
    var baseUrl = BASE_URL.url+":"+BASE_URL.port;
    return {
        fetchData: function(){
            var deferred = $q.defer();
            $http({ 
                   method:'GET',
                   url:baseUrl+'/api/test',
                   headers:{'my-custom-header':"0.0.1"}
               })
              .success(function(data){
                  deferred.resolve(data);
              })
              .error(function(data){
                deferred.resolve(data);
              });
            return deferred.promise;
        },
        postData: function(postDataObject){
            var deferred = $q.defer();
            $http({ 
                 method:'POST',
                 url:baseUrl+'/api/test',
                 data:postDataObject
              })
              .success(function(data){
                  deferred.resolve(data);
              .error(function(data){
                deferred.resolve(data);
              });
            return deferred.promise;
        }

    };
});