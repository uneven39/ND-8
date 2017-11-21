const express = require('express');
const usersApi = require('./users/users-api');

const routerREST = express.Router();

// Если обращаемся к имени юзера в URL, получаем его из массива и сохраняем для обработки
routerREST.param('userName', (request, response, next) => {
	usersApi.getUser(request.params['userName'])
		.then(user => {
			response.locals.user = user;
			next();
		})
});

routerREST.get('/users/', (request, response) => {
	usersApi.readUsers().then(
		users => response
			.status(200)
			.send(JSON.parse(users))
	)
		.catch(error => response
			.status(500)
			.send({
				message: 'Internal error',
				error: error.message
			}));
});

routerREST.post('/users/', (request, response) => {
	const name = request.body.name;
	const score = request.body.score;
	if (name && score) {
		usersApi.createUser(name, score)
			.then(() => {
				response
					.status(200)
					.send({
						message: 'User created successfully!',
						newUser: request.body
					});
			})
			.catch(error => {
				response
					.status(500)
					.send({
						message: 'Internal error',
						error: error.message
					});
			});
	} else {
		response
			.status(400)
			.send({
				message: 'Invalid request',
				error: 'Invalid request'
			});
	}
});

routerREST.put('/users/:userName', (request, response) => {
	const name = request.params['userName'];
	const user = response.locals.user;
	const score = request.body.score;
	if (user) {
		usersApi.updateUser(user, score)
			.then(() => {
				response
					.status(200)
					.send({
						message: 'User updated successfully!',
						updatedUser: {
							name: name,
							score: score
						}
					})
			})
			.catch(error => {
				response
					.status(500)
					.send({
						message: 'Internal error',
						error: error.message
					});
			});
	} else {
		response
			.status(404)
			.send({
				message: `User ${name} not found`,
				error: 'Invalid request'
			});
	}
});

routerREST.delete('/users/:userName', (request, response) => {
	const name = request.params['userName'];
	const user = response.locals.user;
	if (user) {
		usersApi.deleteUser(user)
			.then(() => {
				response
					.status(200)
					.send({
						message: 'User updated successfully!',
						deletedUser: user
					})
			})
			.catch(error => {
				response
					.status(500)
					.send({
						message: 'Internal error',
						error: error.message
					});
			});
	} else {
		response
			.status(404)
			.send({
				message: `User ${name} not found`,
				error: 'Invalid request'
			});
	}
});

module.exports = routerREST;