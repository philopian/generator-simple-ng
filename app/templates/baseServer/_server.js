var path 		= require('path');
var express 	= require('express');
var bodyParser  = require('body-parser');

var app = express();


/******** Middleware *************************************/
var clientPath = path.resolve(__dirname, '../www');
app.use(express.static(clientPath));





/******** Add all specific routes here	******************/





/******** API Calls	**************************************/
var api = new express.Router();
app.use('/api/', api);
api.use( bodyParser.json() );
api.get('/test',function(req,res){
	res.send('["yeoman", "angularjs", "nodejs", "express", "mongodb", "jwt", "gulp", "passport", "spinjs", "animate.css"]');
});
api.use('/*', function(req, res){
  res.status(400).send('API Route doesn\'t exist!');
});



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
