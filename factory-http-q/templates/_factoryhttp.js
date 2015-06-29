'use strict';

angular.module('<%= NG_APP_NAME %>')
.factory('<%= FACTORY_NAME %>', function ($http,$q,BASE_URL) {

  var baseUrl = BASE_URL.url+":"+BASE_URL.port;

  return {
      fetchData: function () {
        return $http({ 
                   method:'GET',
                   url:baseUrl+'/api/test',
                   headers:{'my-custom-header':"0.0.1"}
               })
               .then(function(response){
                 // console.log(response);
                 return response.data;
               })
               .catch(function(response){
                 return $q.reject('Error. HTTP status ('+response.status+')');
               });
    },
    postData: function (postDataObject) {
      return $http({ 
                 method:'POST',
                 url:baseUrl+'/api/test',
                 data:postDataObject
             })
             .then(function(response){
               console.log(response);
               return response.data;
             })
             .catch(function(response){
               return $q.reject('Error. HTTP status ('+response.status+')');
             });
    }
  };
  
});