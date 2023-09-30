const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const sendEmail = require("./utils/sendEmail");

const app = express();

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

//https://api.chaoschampionship.com/.netlify/functions/api/

var corsOptions = {
  origin: ['https://panel.chaosseries.com', 'http://localhost:5173/'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get("/", (req, res) => {
  //la app funciona
  res.send("App ids corriendo...");
});

const db = mysql.createPool({
  //crear la conexion a la base de datos
  host: "161.97.162.29",
  user: "chao_chaossuperadmin",
  password: "kcuuDPIR@*NUWK7h",
  database: "chao_chaos",
});

app.post("/enviarcontacto", cors(corsOptions), (req, res) => {
  const nombre = req.body.nombre;
  const correo = req.body.correo;
  const asunto = req.body.asunto;
  const mensaje = req.body.mensaje;

  sendEmail(nombre, correo, asunto, mensaje)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.post("/inscribirse", cors(corsOptions), (req, res) => {
  //inscribimos usuarios

  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const nick = req.body.nick;
  const invocador = req.body.invocador;
  const edad = req.body.edad;
  const principal = req.body.principal;
  const secundaria = req.body.secundaria;

  const sqlInsert =
    "INSERT INTO `usuarios` (`id_usuario`, `id_equipo`, `id_discord`, `nombre_usuario`, `apellido_usuario`, `nick_usuario`, `nombre_ingame`, `id_ingame`, `puuid_ingame`, `edad`, `rol`, `linea_principal`, `linea_secundaria`, `verificado`) VALUES (NULL, NULL, NULL, ?, ?, ?, ?, NULL, NULL, ?, 0, ?, ?, 0)";
  db.query(
    sqlInsert,
    [nombre, apellido, nick, invocador, edad, principal, secundaria],
    (err, result) => {
      if (!err) {
        res.send("Successfully inserted - 200");
      } else {
        res.send(err);
      }
    }
  );
});

app.get("/usuarios", (req, res) => {
  //buscamos TODOS los usuarios
  const sqlSelect = "SELECT * FROM usuarios";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/usuarios/limite=:limite&pagina=:pagina", (req, res) => {
  //buscamos TODOS los usuarios

  const limite = parseInt(req.params.limite);
  const pagina = parseInt(req.params.pagina);

  const offset = parseInt((pagina - 1) * limite);

  const sqlSelect =
    "SELECT * FROM usuarios ORDER BY id_usuario LIMIT ? OFFSET ?";
  db.query(sqlSelect, [limite, offset], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/usuarios/id=:id", (req, res) => {
  //buscamos equipo por id
  const id = req.params.id;

  const sqlSelect = "SELECT * FROM `usuarios` WHERE usuarios.id_usuario = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/usuarios/nombre=:nombre", (req, res) => {
  //buscamos usuario por nombre
  const nombre = req.params.nombre;

  const sqlSelect = "SELECT * FROM `usuarios` WHERE usuarios.nick_usuario = ?";
  db.query(sqlSelect, [nombre], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/buscarsesion/token=:token", (req, res) => {
  //buscamos sesion por id usuario
  const token = req.params.token;

  const sqlSelect =
    "SELECT sesiones.token, usuarios.id_usuario, usuarios.id_equipo, usuarios.id_discord, usuarios.nombre_usuario, usuarios.apellido_usuario, usuarios.nick_usuario, usuarios.edad, usuarios.rol, usuarios.icono, usuarios.usuario_activado FROM sesiones LEFT JOIN usuarios ON sesiones.id_usuario = usuarios.id_usuario WHERE token = ?";
  db.query(sqlSelect, [token], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/crearsesion", cors(corsOptions), (req, res) => {
  id = req.body.id;
  fecha = req.body.fecha;
  dispositivo = req.body.dispositivo;
  token = req.body.token;

  const sql =
    "INSERT INTO `sesiones` (`id_usuario`, `fecha`, `dispositivo`, `token`) VALUES (?, ?, ?, ?)";
  db.query(sql, [id, fecha, dispositivo, token], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/usuarios/equipo/id=:id", (req, res) => {
  //buscamos equipo por id
  const id = req.params.id;

  const sqlSelect =
    "SELECT * FROM equipos INNER JOIN usuarios ON equipos.id_equipo = usuarios.id_equipo INNER JOIN ligas ON equipos.id_liga = ligas.id_liga INNER JOIN temporadas ON equipos.id_temporada = temporadas.id_temporada WHERE usuarios.id_usuario = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/usuarios/cuentas/id=:id", (req, res) => {
  //buscamos equipo por id
  const id = req.params.id;

  const sqlSelect =
    "SELECT * FROM `cuentas_lol` INNER JOIN usuarios ON cuentas_lol.id_usuario = usuarios.id_usuario WHERE usuarios.id_usuario = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/crearusuario", cors(corsOptions), (req, res) => {
  nombre = req.body.nombre;
  apellido = req.body.apellido;
  nick = req.body.nick;
  edad = req.body.edad;
  rol = req.body.rol;

  const sql =
    "INSERT INTO `usuarios` (`id_usuario`, `id_equipo`, `id_discord`, `nombre_usuario`, `apellido_usuario`, `nick_usuario`, `edad`, `rol`) VALUES (NULL, NULL, NULL, ?, ?, ?, ?, ?)";
  db.query(sql, [nombre, apellido, nick, edad, rol], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/registrarse", cors(corsOptions), (req, res) => {
  nombre = req.body.nombre;
  apellido = req.body.apellido;
  nick = req.body.nick;
  edad = req.body.edad;
  contra = req.body.contra;

  const sql =
    "INSERT INTO `usuarios` (`nombre_usuario`, `apellido_usuario`, `nick_usuario`, `edad`, `contra`) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [nombre, apellido, nick, edad, contra], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/modificarusuario", cors(corsOptions), (req, res) => {
  id = req.body.id;
  columna = req.body.columna;
  valor = req.body.valor;

  console.log(typeof columna);

  const sql = "UPDATE usuarios SET `" + columna + "` = ? WHERE id_usuario = ?";
  db.query(sql, [valor, id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.delete("/borrarusuario", cors(corsOptions), (req, res) => {
  id = req.body.id;

  const sqlDelete = "DELETE FROM sesiones WHERE id_usuario = ?";
  const sql = "DELETE FROM usuarios WHERE id_usuario = ?";
  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      db.query(sql, [id], (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.status(200);
          res.end("Successfully deleted - 200");
        }
      });
    }
  });
});

app.get("/equipos", (req, res) => {
  //buscamos TODOS los equipos
  const sqlSelect = "SELECT * FROM equipos";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/equipos/id=:id", (req, res) => {
  //buscamos equipo por id
  const id = req.params.id;

  const sqlSelect =
    "SELECT * FROM equipos INNER JOIN ligas ON equipos.id_liga = ligas.id_liga INNER JOIN temporadas ON equipos.id_temporada = temporadas.id_temporada WHERE equipos.id_equipo = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/crearequipo", cors(corsOptions), upload.single("imagenEquipo"), (req, res) => {
  image = req.file;
  nombre = req.body.nombre;
  acronimo = req.body.acronimo;

  const sql =
    "INSERT INTO `equipos` (`nombre_equipo`, `logo_equipo`, `acronimo_equipo`) VALUES (?, ?, ?)";
  db.query(sql, [nombre, image.filename, acronimo], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/modificarequipo", cors(corsOptions), (req, res) => {
  id = req.body.id;
  columna = req.body.columna;
  valor = req.body.valor;

  console.log(typeof columna);

  const sql = "UPDATE equipos SET `" + columna + "` = ? WHERE id_equipo = ?";
  db.query(sql, [valor, id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.delete("/borrarequipo", cors(corsOptions), (req, res) => {
  id = req.body.id;

  const sql = "DELETE FROM equipos WHERE id_equipo = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200);
      res.end("Successfully deleted - 200");
    }
  });
});

app.get("/ligas", (req, res) => {
  //buscamos todas las ligas
  const sqlSelect = "SELECT * FROM ligas";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/temporadas", (req, res) => {
  //buscamos todas las temporadas
  const sqlSelect = "SELECT * FROM temporadas";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/crearcuenta", cors(corsOptions), (req, res) => {
  idusuario = req.body.id_usuario;
  juego = req.body.id_juego;
  invocador = req.body.invocador;
  idlol = req.body.id_lol;
  puuidlol = req.body.puuid_lol;
  lineaprincipal = req.body.linea_principal;
  lineasecundaria = req.body.linea_secundaria;

  const sql =
    "INSERT INTO `cuentas_lol` (`id_cuenta`, `id_usuario`, `id_juego`, `invocador`, `id_lol`, `puuid_lol`, `linea_principal`, `linea_secundaria`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      idusuario,
      juego,
      invocador,
      idlol,
      puuidlol,
      lineaprincipal,
      lineasecundaria,
    ],
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/crearcuenta");

app.post("/log", cors(corsOptions), (req, res) => {
  const id_usuario = req.body.id_usuario;
  const fecha = req.body.fecha;
  const accion = req.body.accion;
  const info = req.body.info;

  const sqlInsert =
    "INSERT INTO `logs` (`id_log`, `id_usuario`, `fecha`, `accion`, `info`) VALUES (NULL, ?, ?, ?, ?)";
  db.query(sqlInsert, [id_usuario, fecha, accion, info], (err, result) => {
    if (!err) {
      res.send("Successfully inserted - 200");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, () => {
  console.log("funcionando");
});
