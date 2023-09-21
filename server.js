const express = require('express');
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require("body-parser");
const multer = require("multer")
const path = require("path")
const nodemailer = require("nodemailer");
const sendEmail = require("./utils/sendEmail")

const app = express();

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(express.static('public'))

console.log(path.join(__dirname, '/../public'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

//https://api.chaoschampionship.com/.netlify/functions/api/

app.get('/', (req, res) => { //la app funciona
    res.send('App is corriendo...');
});

const db = mysql.createPool({ //crear la conexion a la base de datos
    host: "161.97.162.29",
    user: "chao_chaossuperadmin",
    password: "kcuuDPIR@*NUWK7h",
    database: "chao_chaos",
})

app.post("/enviarcontacto", (req, res) => {
    const nombre = req.body.nombre
    const correo = req.body.correo
    const asunto = req.body.asunto
    const mensaje = req.body.mensaje

    sendEmail(nombre, correo, asunto, mensaje)
        .then((response) => res.send(response.message))
        .catch((error) => res.status(500).send(error.message));
});

app.post('/inscribirse', (req, res) => { //inscribimos usuarios

    const nombre = req.body.nombre
    const apellido = req.body.apellido
    const nick = req.body.nick
    const invocador = req.body.invocador
    const edad = req.body.edad
    const principal = req.body.principal
    const secundaria = req.body.secundaria

    const sqlInsert = "INSERT INTO `usuarios` (`id_usuario`, `id_equipo`, `id_discord`, `nombre_usuario`, `apellido_usuario`, `nick_usuario`, `nombre_ingame`, `id_ingame`, `puuid_ingame`, `edad`, `rol`, `linea_principal`, `linea_secundaria`, `verificado`) VALUES (NULL, NULL, NULL, ?, ?, ?, ?, NULL, NULL, ?, 0, ?, ?, 0)"
    db.query(sqlInsert, [nombre, apellido, nick, invocador, edad, principal, secundaria], (err, result) => {
        if (!err) {
            res.send("Successfully inserted - 200")
        } else {
            res.send(err)
        }
    })
})

app.get("/usuarios", (req, res) => { //buscamos TODOS los usuarios
    const sqlSelect = "SELECT * FROM usuarios"
    db.query(sqlSelect, (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

app.get("/usuarios/limite=:limite&pagina=:pagina", (req, res) => { //buscamos TODOS los usuarios

    const limite = parseInt(req.params.limite)
    const pagina = parseInt(req.params.pagina)

    const offset = parseInt((pagina - 1) * limite)

    const sqlSelect = "SELECT * FROM usuarios ORDER BY id_usuario LIMIT ? OFFSET ?"
    db.query(sqlSelect, [limite, offset], (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

app.get("/usuarios/id=:id", (req, res) => { //buscamos el usuario por id
    const id = req.params.id
    const sqlSelect = "SELECT * FROM usuarios WHERE id_usuario = ?"
    db.query(sqlSelect, [id], (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

app.get("/usuarios/invocador=:invocador", (req, res) => { //buscamos el usuario por invocador
    const invocador = req.params.invocador
    const sqlSelect = "SELECT nombre_ingame FROM usuarios WHERE nombre_ingame = ?"
    db.query(sqlSelect, [invocador], (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

app.put("/usuarios/modificar/lol/ids", (req, res) => { //modificamos ids de riot
    const idUsuario = req.body.idUsuario
    const idRiot = req.body.idRiot
    const puuidRiot = req.body.puuidRiot

    const sqlUpdate = "UPDATE `usuarios` SET `id_ingame` = ?, `puuid_ingame` = ? WHERE `usuarios`.`id_usuario` = ?"
    db.query(sqlUpdate, [idRiot, puuidRiot, idUsuario], (err, result) => {
        res.status(200)
        res.end("Successfully updated " + idUsuario + " with ID " + idRiot)
    })
})

app.put("/usuarios/modificar/lol/nombre", (req, res) => { //modificamos nombre de riot
    const idUsuario = req.body.idUsuario
    const nombreRiot = req.body.nombreRiot

    const sqlUpdate = "UPDATE `usuarios` SET `nombre_ingame` = ? WHERE `usuarios`.`id_usuario` = ?"
    db.query(sqlUpdate, [nombreRiot, idUsuario], (err, result) => {
        res.status(200)
        res.send("Successfully updated " + idUsuario + " with ID " + nombreRiot)
        if (err) {
            res.send(err)
        }
    })
})

app.get("/equipos", (req, res) => { //buscamos TODOS los usuarios
    const sqlSelect = "SELECT * FROM equipos"
    db.query(sqlSelect, (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

app.post("/crearequipo", upload.single("imagenEquipo"), (req, res) => {
    image = req.file

    console.log(req.body.nombre)
    nombre = (req.body.nombre)
    acronimo = (req.body.acronimo)



    const sql = "INSERT INTO `equipos` (`nombre_equipo`, `logo_equipo`, `acronimo_equipo`) VALUES (?, ?, ?)"
    db.query(sql, [nombre, image.filename, acronimo], (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

app.get("/ligas", (req, res) => { //buscamos todas las ligas
    const sqlSelect = "SELECT * FROM ligas"
    db.query(sqlSelect, (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

app.post("/log", (req, res) => {
    const id_usuario = req.body.id_usuario
    const fecha = req.body.fecha
    const accion = req.body.accion

    const sqlInsert = "INSERT INTO `logs` (`id_log`, `id_usuario`, `fecha`, `accion`) VALUES (NULL, ?, ?, ?)"
    db.query(sqlInsert, [id_usuario, fecha, accion], (err, result) => {
        if (!err) {
            res.send("Successfully inserted - 200")
        } else {
            res.send(err)
        }
    })
});

app.listen(3000, () => {
    console.log("funcionando")
})
