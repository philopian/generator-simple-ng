var path 	= require('path');
var express = require('express');


var app = express();


/******** Middleware *************************************/
var clientPath = path.resolve(__dirname, '../webClient');
app.use(express.static(clientPath));






/******** Add all specific routes here	******************/



/******** All other routes redirect to angularjs  ********/
app.use(express.static(clientPath));
app.use('/*', function(req, res){
  res.sendFile(clientPath+'/index.html');
});






/******** Listen on a port	*****************************/

var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log('The magic happens on port: ' + port);
});
