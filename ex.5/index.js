const express 		= require('express');
const bodyParser 	= require('body-parser');

const routerREST	= require('./REST-api');
const routerRPC		= require('./RPC-api');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));

app.use('/rest', routerREST);
app.use('/rpc', routerRPC);

app.listen(2000);

