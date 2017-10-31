const mongodb = require('mongodb'),
	path = require('path'),
	bodyParser 	= require('body-parser'),
	express = require('express'),
	ObjectId = mongodb.ObjectId,
	MongoClient = mongodb.MongoClient,
	app = express(),
	url = 'mongodb://localhost:27017/ex10_db';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000, function(){
	console.log('Express server listening on port 3000');
});