// Importamos middlewares
const db = require("../middleware/db");

function returnPlayer(id, res) {
    let usuario = { info: {}, equipo: {}, cuentas: {}, estadisticas: {} };

    const sqlUser =
        "SELECT id_usuario, id_equipo, id_discord, nombre_usuario, apellido_usuario, nick_usuario, edad, rol, icono, usuario_activado, circuitotormenta, twitter, discord FROM usuarios WHERE id_usuario = ?";
    const sqlEquipo = "SELECT * FROM equipos WHERE id_equipo = ?";
    const sqlCuentas = "SELECT * FROM cuentas_lol WHERE id_usuario = ?";
    //const sqlEstadisticas = ""

    db.query(sqlUser, [id], (err2, result2) => {
        if (err2) {
            res.send({ status: 500, success: false, reason: "Problema con la base de datos 2.", error: err2 });
        } else {
            usuario.info = result2[0];
            db.query(sqlCuentas, [id], (err3, result3) => {
                if (err3) {
                    res.send({ status: 500, success: false, reason: "Problema con la base de datos 3.", error: err3 });
                } else {
                    usuario.cuentas = result3;
                    if (usuario.info["id_equipo"]) {
                        db.query(sqlEquipo, usuario.info["id_equipo"], (err4, result4) => {
                            if (err4) {
                                res.send({ status: 500, success: false, reason: "Problema con la base de datos 4.", error: err4 });
                            } else {
                                usuario.equipo = result4[0];
                                res.send({ status: 200, success: true, result: usuario });
                            }
                        });
                    } else {
                        res.send({ status: 200, success: true, result: usuario });
                    }
                }
            });
        }
    });
}

module.exports = returnPlayer;
