const mongodb = require('mongodb'),
	MongoClient = mongodb.MongoClient,
	url = 'mongodb://localhost:27017/ex8_db';

let users = [
	{name: 'Jack'},
	{name: 'Ann'},
	{name: 'Max'},
	{name: 'Jane'},
	{name: 'Nick'},
	{name: 'Tom'},
	{name: 'Roy'},
	{name: 'Bill'},
	{name: 'Luke'}
];

let usersToChange = [
	{name: 'Jack', newName: 'Jackie'},
	{name: 'Nick', newName: 'Nickie'},
	{name: 'Tom', newName: 'Tommy'},
	{name: 'Bill', newName: 'Billy'}
];

MongoClient.connect(url)
	.then(db => {
		// Удаляем коллекцию, если такая уже есть (на случай повторного запуска)
		return db.collection('users').drop()
			.then(() =>{
				return db;
			})
			.catch((error) => {
				if (error.code === 26)
					console.log('"users" collection doesn\'t exist');
				else
					console.log('Users drop error: ', error);
				return db;
			});
	})
	.then (db => {
		const usersCollection = db.collection('users');
		// 1. Добавлять список имён в коллекцию:
		return usersCollection.insertMany(users)
			.then(() => {
				return usersCollection.find().toArray()
			})
			.then(docs => {
				// 2. Выводить этот список;
				console.log('Коллекция "users":');
				console.log(docs);
			})
			.then(() => {
			// 3. Изменять несколько имён на другие;
				return Promise.all(
					usersToChange.map(user => {
						usersCollection.updateOne({name: user.name}, {$set: {name: user.newName}})
					})
				)
			})
			.then(() => {
				return usersCollection.find().toArray()
			})
			.then(docs => {
				// 4. Отображать изменённый список;
				console.log('Коллекция "users" с новыми именами:');
				console.log(docs);
			})
			.then(() => {
				// 5. Удалять новые имена из п.3.
				return Promise.all(
					usersToChange.map(user => {
						usersCollection.deleteOne({name: user.newName})
					})
				)
			})
			.catch(error => {
				console.log('Ошибка работы с коллекцией "users":');
				console.log(error)
			})
	})
	.catch(error => {
		console.log(error);
	});