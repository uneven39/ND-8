const http = require('http');
const https = require('https');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const API_KEY = 'trnsl.1.1.20171008T211034Z.f1449cb9ecba0fee.43dde29baa5b6449929e8cf71ee456562c32e7bf';
const TRANSLATE_URL = '/api/v1.5/tr.json/translate?key=' + API_KEY;

let server = http.createServer();

function translate(request, response) {
	let translationRequest = '';
	let translationResponse = '';

	console.log('--'.repeat(10));
	console.log('Url: ' + request.url);
	console.log('Тип запроса: ' + request.method);

	function handleYandexRes(res) {
		res
			.on('data', (chunk) => {
				translationResponse += chunk;
			})
			.on('end', () => {
				console.log('Перевод: ', translationResponse);
				response.writeHead(200, {'Content-Type': 'text/plain'});
				response.write(translationResponse);
				response.end();
			});
	}

	function getTranslate() {
		console.log('Запрос для перевода: ', decodeURI(translationRequest));
		if (request.url === '/translate') {
			let dataObj = JSON.parse(translationRequest),
				reqOptions = {
					host: 'translate.yandex.net',
					path: TRANSLATE_URL + '&lang=' + dataObj.lang,
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					}
				};

			let reqToYandex = https.request(reqOptions, handleYandexRes);
			reqToYandex.write('text=' + dataObj.text);
			reqToYandex.end();
		}
	}

	if (request.method === 'GET') {
		fs.readFile('./index.html', (error, data) => {
			if(error){
				response.statusCode = 404;
				response.end('Страница не найдена');
			} else {
				response.writeHeader(200, {"Content-Type": "text/html"});
				response.write(data);
				response.end();
			}
		});
	} else if (request.method === 'POST') {
		request
			.on('data', function (data) {
				translationRequest += data;
			})
			.on('end', getTranslate);
	}
}

server
	.listen(PORT)
	.on('listening', () => {
		console.log('Starting HTTP on port', PORT)
	})
	.on('request', translate)
	.on('error', error => console.error(error));