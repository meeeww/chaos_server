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

router.post('/inscribirse', (req, res) => { //inscribimos usuarios
    
    const nombre = req.body.nombre
    const apellido = req.body.apellido
    const nick = req.body.nick
    const invocador = req.body.invocador
    const edad = req.body.edad
    const principal = req.body.principal
    const secundaria = req.body.secundaria

    const sqlInsert = "INSERT INTO `usuarios` (`id_usuario`, `id_equipo`, `id_discord`, `nombre_usuario`, `apellido_usuario`, `nick_usuario`, `nombre_ingame`, `id_ingame`, `puuid_ingame`, `edad`, `rol`, `linea_principal`, `linea_secundaria`) VALUES (NULL, NULL, NULL, ?, ?, ?, ?, NULL, NULL, ?, 0, ?, ?)"
    db.query(sqlInsert, [nombre, apellido, nick, invocador, edad, principal, secundaria], (err, result) => {
        if (!err) {
            res.send("Successfully inserted - 200")
        } else {
            res.send(err)
        }
    })
})

router.get("/usuarios", (req, res) => { //buscamos TODOS los usuarios
	const sqlSelect = "SELECT * FROM usuarios"
	db.query(sqlSelect, (err, result) => {
		if (err) {
			res.send(err)
		} else {
			res.send(result)
		}
	})
})

router.put("/usuarios/modificar/lol/ids", (req, res) => { //modificamos ids de riot
	const idUsuario = req.body.idUsuario
	const idRiot = req.body.idRiot
    const puuidRiot = req.body.puuidRiot

	const sqlUpdate = "UPDATE `usuarios` SET `id_ingame` = ?, `puuid_ingame` = ? WHERE `usuarios`.`id_usuario` = ?"
	db.query(sqlUpdate, [idRiot, puuidRiot, idUsuario], (err, result) => {
		res.status(200)
		res.end("Successfully updated " + idUsuario + " with ID " + idRiot)
	})
})

router.put("/usuarios/modificar/lol/nombre", (req, res) => { //modificamos nombre de riot
	const idUsuario = req.body.idUsuario
	const nombreRiot = req.body.nombreRiot

	const sqlUpdate = "UPDATE `usuarios` SET `nombre_ingame` = ? WHERE `usuarios`.`id_usuario` = ?"
	db.query(sqlUpdate, [nombreRiot, idUsuario], (err, result) => {
		res.status(200)
		res.end("Successfully updated " + idUsuario + " with ID " + idRiot)
	})
})

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);