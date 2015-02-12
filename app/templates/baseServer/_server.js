var path 	= require('path');
var express = require('express');


var app = express();


/******** Middleware *************************************/
var clientPath = path.resolve(__dirname, '../webClient');
app.use(express.static(clientPath));



/******** Add all specific routes here	******************/



/******** All other routes redirect to angularjs  ********/
var webPath   = path.resolve("..") + "/webClient/";
app.use(express.static(webPath));
app.use('/*', function(req, res){
  res.sendFile(webPath+'/index.html');
});



/******** Listen on a port	*****************************/

var port = process.env.PORT || 8081;
app.listen(port, function() {
	console.log('The magic happens on port: ' + port);
});
