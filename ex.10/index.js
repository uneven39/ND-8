const mongodb				= require('mongodb'),
	bodyParser				= require('body-parser'),
	express						= require('express'),
	tasksRT						= express.Router(),
	usersRT						= express.Router(),
	app								= express(),
	dbUrl							= 'mongodb://localhost:27017/ex10_db';

let mongoose				= require('mongoose'),
	Schema						= mongoose.Schema,
	userSchema				= new Schema({
												name: String
											}),
	User							= mongoose.model('User', userSchema, 'users'),
	taskSchema				= new Schema({
												title: String,
												description: String,
												isOpen: Boolean,
												user: String
											}),
	Task							= mongoose.model('Task', taskSchema, 'tasks');
mongoose.Promise		= Promise;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));
app.use(express.static('public'));

app.get('/', (req,res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.use('/users', usersRT);
app.use('/tasks', tasksRT);

app.listen(3000, () => {
	console.log('Express server listening on port 3000');
});

mongoose.connect(dbUrl, {useMongoClient: true})
	.then(db => {
		// Показываем запросы на /users
		usersRT.use((req, res, next) => {
			console.log('users method: ', req.method);
			console.log('users url: ', req.originalUrl);
			if ((req.method === 'POST') || (req.method === 'PUT')) {
				console.log('users request body: ', req.body);
			}
			console.log('====='.repeat(5));
			next();
		});

		// Получить список юзеров:
		usersRT.get('/', (req, res) => {
			User.find({})
				.then(users => {
					res.send(users);
					res.status(200);
				})
				.catch(error => {
					res.send(error);
					res.status(500);
				})
		});

		// Создать юзера:
		usersRT.post('/', (req, res) => {
			if (req.body.name) {
				let newUser = new User({name: req.body.name});
				newUser.save((error, newUser) => {
					if (error) {
						res.send(error);
						res.status(500);
					} else {
						res.send(newUser);
						res.status(200);
					}
				})
			} else {
				res.send('name required');
				res.status(400);
			}
		});

		// Обновить юзера:
		usersRT.put('/:id', (req, res) => {
			let id 		= req.params['id'],
				newName	=	req.body.name;
			if (id && newName) {
				User.update({_id: id}, {name: newName})
					.then(updated => {
						res.send(updated);
						res.status(200);
					})
					.catch(error => {
						res.send(error);
						res.status(500);
					})
			} else {
				res.send('id & newName required');
				res.status(400);
			}
		});

		// Удалить юзера:
		usersRT.delete('/:id', (req, res) => {
			let id = req.params['id'];
			if (id) {
				User.remove({_id: id})
					.then(deleted => {
						res.send(deleted);
						res.status(200);
					})
					.catch(error => {
						res.send(error);
						res.status(500);
					})
			} else {
				res.send('id required');
				res.status(400);
			}
		});
	})
	.catch(error => {
		console.log(error);
	});