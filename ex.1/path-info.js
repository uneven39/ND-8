const fs = require('fs');

function pathInfo(path, callback) {
	let result = {path: path,
		type: '',
		content: '',
		childs: []
	};

	function handlePath(error, files) {
		if (error) {
			fs.readFile(path, 'utf-8', handleFile)
		} else {
			result.type = 'directory';
			result.content = undefined;
			result.childs = files;
			callback(null, result);
		}
	}

	function handleFile(error, data) {
		if (error) {
			callback(error, null);
		} else {
			result.type = 'file';
			result.content = data;
			result.childs = undefined;
			callback(null, result);
		}
	}

	fs.readdir(path, 'utf-8', handlePath);
}

module.exports = pathInfo;
