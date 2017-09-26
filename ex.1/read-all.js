const fs = require('fs');
const read = require('./file-promise').read;

let options = {
	encoding: 'utf-8'
};

function viewDir(dir) {
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
		read(file).then(data => {
			resolve({name: file, content: data});
		}, error => {
			reject(error);
		})
	});
}

function readAll(path) {
	return viewDir(path)
		.then(files => {
			return Promise.all(
				files.map(file => getFileInfo(path + file))
			)
		});
}

module.exports = readAll;