const fs = require('fs');

let options = {
	encoding: 'utf-8'
};

function lookUpDir(dir) {
	return new Promise((resolve, reject) => {
		fs.readdir(dir, options, (error, files) => {
			if (error)
				reject(error);
			else
				resolve(files);
		});
	});
}

function getFileInfo(file) {
	return new Promise((resolve, reject) => {
		fs.readFile(file, options, (error, data) => {
			if (error)
				reject(error);
			else
				resolve({name: file, content: data});
		});
	});
}

function readAll(path) {
	return lookUpDir(path)
		.then(files => {
			return Promise.all(files.map(file => {
				return getFileInfo(path + file);
			}))
		});
}

module.exports = readAll;