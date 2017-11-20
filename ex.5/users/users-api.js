const fs = require('fs');

function readFile(file) {
	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf8', (error, data) => {
			if (error)
				reject(error);
			else
				resolve(data);
		});
	});
}

function writeFile(file, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, data, 'utf8', err => {
			if (err)
				reject(err);
			else
				resolve(file);
		});
	});
}

function readUsers() {
	return new Promise((resolve, reject) => {
		fs.readFile('./users/users.json', 'utf8', (error, data) => {
			if (error)
				reject(error);
			else
				resolve(data);
		});
	});
}

function getUser(name) {
	return new Promise(resolve => {
		readUsers()
			.then(data => {
				const users = JSON.parse(data);
				let found = users.find(user => {
					if (user.name === name)
						return true;
				});
				resolve(found);
			})
	});
}

function createUser(name, score) {
	const newUser = {'name': name, 'score': score};
	return readFile('./users/users.json')
		.then(data => {
			let users = JSON.parse(data);
			users.push(newUser);
			return JSON.stringify(users);
		})
		.then(data => {
			writeFile('./users/users.json', data);
		})
}

function updateUser(user, score) {
	return readFile('./users/users.json')
		.then(data => {
			let users = JSON.parse(data),
					found = users.find((item, i) => {
					if (item.name === user.name) {
						users[i].score = score;
						return true;
					}
				});
			return JSON.stringify(users);
		})
		.then(users => {
			writeFile('./users/users.json', users);
		})
}

function deleteUser(user) {
	return readFile('./users/users.json')
		.then(data => {
			let users = JSON.parse(data),
					found = users.find((item, i) => {
						if (item.name === user.name) {
							users.splice(i, 1);
							return true
						}
			});
			return JSON.stringify(users);
		})
		.then(data => {
			writeFile('./users/users.json', data)
		})
}

module.exports = {
	getUser,
	createUser,
	readUsers,
	updateUser,
	deleteUser
};