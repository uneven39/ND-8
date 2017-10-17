const express = require('express');
const bodyParser 	= require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));

// Формируем тело страницы
function initPage(data) {
	app.myData = data;
	app.myPage = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<style>
			 html {
			 	font-family: Arial, SansSerif;
			 }
			</style>
			<meta charset="UTF-8">
		<title>Express.js routing</title>
		</head>
		<body>
		<div class="container">
			<div class="row">
				<div class="col-12 text-center">
					<h1>
						${app.myData}
					</h1>
				</div>
			</div>
		</div>
		</body>
		</html>
		`;
}

// 1 GET / – Главная страница которая вернет код 200 OK и покажет текст "Hello, Express.js"
app.get('/', (request, response) => {
	initPage('Hello, Express.js');
	response
		.status(200)
		.send(app.myPage);
});

// 2 GET /hello – Страница, код ответа 200 OK и покажет текст "Hello stranger!"
app.get('/hello', (request, response) => {
	initPage('Hello, stranger!');
	response
		.status(200)
		.send(app.myPage);
});

// 3 GET /hello/[любое имя] – Страница, код ответа 200 OK и покажет текст "Hello, [любое имя]!"
app.get('/hello/:name', (request, response) => {
	initPage(`Hello, ${request.params['name']}!`);
	response
		.status(200)
		.send(app.myPage);
});

// 4 ANY /sub/[что угодно]/[возможно даже так] –
// Любая из этих страниц должна показать текст "You requested URI: [полный URI запроса]"
app.all('/sub/*', (request, response) => {
	initPage(`You requested URI: ${request.url}`);
	response
		.status(200)
		.send(app.myPage);
});

// 5POST /post – Страница которая вернет все тело POST запроса (POST body) в JSON формате,
// либо 404 Not Found - если нет тела запроса
app.post('/post', checkHeader, (request, response) => {
	console.log(request.body);
	let isEmpty = Object.keys(request.body).length === 0,
			msg = isEmpty ? 'Not Found' : JSON.stringify(request.body),
			statusCode = isEmpty ? 404 : 200;
	initPage(`You requested URI: ${msg}`);
	response
		.status(statusCode)
		.send(app.myPage);
});

// Bonus: Добавить в роут POST /post проверку на наличие Header: Key (на уровне middleware),
// если такого header не существует, то возвращать 401
function checkHeader(request, response, next) {
	if (!request.header('header'))
		response.sendStatus(401);
	else
		next();
}

app.listen(3000);