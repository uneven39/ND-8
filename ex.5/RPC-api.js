const express = require('express');
const usersApi = require('./users/users-api');

const routerRPC = express.Router();

routerRPC.use('/users/', (request, response, next) => {
	const method = request.body.method;
	console.log('RPC requset: ', method);
	if (!method)
		response
			.status(400)
			.send('No method received');
	next();
});

routerRPC.post('/users/', (request, response) => {
	const method = request.body.method;
	let name, score;
	switch (method) {
		case 'readUsers':
			usersApi.readUsers()
				.then(
					users => response
						.status(200)
						.send(users)
				)
				.catch(error => response
					.status(500)
					.send(error.message));
			break;
		case 'createUser':
			try {
				({name, score} = JSON.parse(request.body.user));
			} catch(error) {
				name = '';
				score = '';
			}
			if (name && score) {
				usersApi.createUser(name, score)
					.then(() => {
						response
							.status(200)
							.send(JSON.stringify(request.body.user));
					})
					.catch(error => {
						response
							.status(500)
							.send(error.message);
					});
			} else {
				response
					.status(400)
					.send('invalid request');
			}
			break;
		case 'updateUser':
			try {
				({name, score} = JSON.parse(request.body.user));
			} catch(error) {
				name = '';
				score = '';
			}
			if (name && score) {
				usersApi.getUser(name)
					.then(user => {
						usersApi.updateUser(user, score);
					})
					.then(() => {
						response
							.status(200)
							.send(JSON.stringify(request.user));
					})
					.catch(error => {
						response
							.status(500)
							.send(error.message);
					});
			} else {
				response
					.status(400)
					.send('invalid request');
			}
			break;
	}
});

routerRPC.put('/users/:userName', (request, response) => {
	const name = request.params['userName'];
	const user = response.locals.user;
	const score = request.body.score;
	if (user) {
		usersApi.updateUser(user, score)
			.then(() => {
				response
					.status(200)
					.send(JSON.stringify(request.body));
			})
			.catch(error => {
				response
					.status(500)
					.send(error.message);
			});
	} else {
		response
			.status(404)
			.send(`No such user "${name}"`);
	}
});

routerRPC.delete('/users/:userName', (request, response) => {
	const name = request.params['userName'];
	const user = response.locals.user;
	console.log(name);
	if (user) {
		usersApi.deleteUser(name)
			.then(() => {
				response
					.status(200)
					.send(JSON.stringify(request.body));
			})
			.catch(error => {
				response
					.status(500)
					.send(error.message);
			});
	} else {
		response
			.status(404)
			.send(`No such user "${name}"`);
	}
});

module.exports = routerRPC;