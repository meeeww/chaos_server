const express = require('express');
const serverless = require('serverless-http');
const mysql = require('mysql')
const app = express();
const router = express.Router();
const cors = require('cors')

app.use(cors())
app.use(express.json())

//ruta por determinar

router.get('/', (req, res) => { //la app funciona
	res.send('App is corriendo...');
});

const db = mysql.createPool({ //crear la conexion a la base de datos
	host: '',
	user: '',
	password: '',
	database: ''
})

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);