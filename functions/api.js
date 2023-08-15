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
	host: "161.97.162.29",
    user: "chao_chaossuperadmin",
    password: "kcuuDPIR@*NUWK7h",
    database: "chao_chaos",
})

app.use('/', router);
module.exports.handler = serverless(app);