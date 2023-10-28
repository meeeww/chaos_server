app.get("/buscarsesion/token=:token", (req, res) => {
  //buscamos sesion por id usuario
  const token = req.params.token;

  const sqlSelect =
    "SELECT sesiones.token, usuarios.id_usuario, usuarios.id_equipo, usuarios.id_discord, usuarios.nombre_usuario, usuarios.apellido_usuario, usuarios.nick_usuario, usuarios.edad, usuarios.rol, usuarios.icono, usuarios.usuario_activado, usuarios.circuitotormenta, usuarios.twitter, usuarios.discord FROM sesiones LEFT JOIN usuarios ON sesiones.id_usuario = usuarios.id_usuario WHERE token = ?";
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

  const sql = "INSERT INTO `sesiones` (`id_usuario`, `fecha`, `dispositivo`, `token`) VALUES (?, ?, ?, ?)";
  db.query(sql, [id, fecha, dispositivo, token], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});