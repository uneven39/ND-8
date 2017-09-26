const fs = require('fs');

function pathInfo(path, callback) {
	let result = {
		path: path,
		type: '',
		content: '',
		childs: []
	};

	function handleFile(error, data) {
		if (error) {
			callback(error, null);
		} else {
			result.content = data;
			result.childs = undefined;
			callback(null, result);
		}
	}

	function handleDir(error, files) {
		if (error) {
			callback(error, null);
		} else {
			result.content = undefined;
			result.childs = files;
			callback(null, result);
		}
	}

	function handlePath (error, stats) {
		if (error) {
			callback(error, null);
		} else {
			result.type = stats.isFile() ? 'file' : (stats.isDirectory() ? 'directory' : undefined);
			if (result.type === 'file') {
				fs.readFile(path, 'utf-8', handleFile)
			} else if (result.type === 'directory') {
				fs.readdir(path, 'utf-8', handleDir)
			}
		}
	}

	fs.stat(path, handlePath)
}

module.exports = pathInfo;