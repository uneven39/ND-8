const mongodb = require('mongodb'),
	ObjectId = mongodb.ObjectId,
	express = require('express'),
	MongoClient = mongodb.MongoClient,
	app = express(),
	bodyParser 	= require('body-parser'),
	url = 'mongodb://localhost:27017/ex9_db';

MongoClient.connect(url)
	.then(db => {
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({'extended': true}));

		app.get('/', (req,res) => {
			res.sendFile(__dirname + '/index.html');
		});

		const contactsRt = express.Router();
		app.use('/contacts', contactsRt);

		contactsRt.post('/', (req, res) => {
			console.log(req.body);
			if (req.body.phone && req.body.name && req.body.surname) {
				db.collection('contacts').insertOne(req.body)
					.then(() => {
						res.status(200);
						res.send('contact added');
					})
					.catch(error => {
						console.log(error)
					})
			} else {
				res.status(400);
				res.send('Некорректный ввод');
			}
		});

		contactsRt.get('/', (req, res) => {
			db.collection('contacts').find().toArray()
				.then(contacts => {
					res.status(200);
					res.send(contacts);
				})
				.catch(error => {
					res.status(500);
					res.send(error);
				})
		});

		contactsRt.get('/:id', (req, res) => {
			const id = new ObjectId(req.params['id']);
			console.log('get: ', id);
			db.collection('contacts').find({_id: id}).toArray()
				.then(contact => {
					console.log(contact);
					res.status(200);
					res.send(contact);
				})
				.catch(error => {
					res.status(500);
					res.send(error);
				})
		});

		contactsRt.delete('/:id', (req, res) => {
			const id = new ObjectId(req.params['id']);
			console.log('delete: ', id);
			db.collection('contacts').deleteOne({_id: id})
				.then(() => {
					res.status(200);
					res.send(id);
				})
				.catch(error => {
					console.log(error);
					res.status(500);
					res.send(error);
				});
		});

		// обрабатываем запрос в никуда:
		app.use((req, res) => {
			res.sendStatus(404);
		});

		app.listen(3000);
	})
	.catch(error => {
		console.warn('MongoDB connection error: ', error)
	});