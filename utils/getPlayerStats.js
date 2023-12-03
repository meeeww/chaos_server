// Importamos middlewares
const db = require("../middleware/db");

// Importamos dependencias
const axios = require("axios");

const RIOT_API = "RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206";

async function getPlayerStats(res, resultInfo) {
  resultInfo.forEach((idPartido) => {
    axios.get("https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_" + idPartido["match_id"] + "?api_key=" + RIOT_API).then(async function (response) {
      //recogemos el id_usuario a partir del puuid de la cuenta
      response.data["metadata"]["participants"].forEach((puuidUsuario, index) => {
        let sqlSelect = "SELECT id_usuario FROM cuentas_lol WHERE puuid_lol = ?";
        db.query(sqlSelect, [puuidUsuario], (err, result) => {
          if (err) {
            res.send({ status: 500, success: false, reason: "Problema con la base de datos.", error: err });
          } else {
            if (result.length > 0) {
              // revisamos si existe el usuario en la tabla estadisticas_usuarios
              let sqlSelectUserStats = "SELECT * FROM estadisticas_usuarios WHERE id_usuario = ?";
              db.query(sqlSelectUserStats, [result[0]["id_usuario"]], (err2, result2) => {
                if (err) {
                  res.send({ status: 500, success: false, reason: "Problema con la base de datos.", error: err2 });
                } else {
                  console.log(result2);
                  if (result2.length == 0) {
                    let chaosScore = 50;
                    let riotParticipantList = response.data["info"]["participants"];
                    console.log(result[0]["id_usuario"]);
                    let sqlInsertUserStats =
                      "INSERT INTO `estadisticas_usuarios` (`id_usuario`, `kda`, `asesinatos`, `muertes`, `asistencias`, `kp`, `csmin`, `dmgmin`, `chaosscore`, `doublekills`, `triplekills`, `quadrakills`, `pentakills`, `objetivos_robados`, `torres_destruidas`, `inhibidores_destruidos`, `torretas_por_partido`, `inhibidores_por_partido`, `oro_partido`, `oromin`, `primera_torre`, `primera_sangre`, `vision_partido`, `wards`, `wards_destruidos`, `placas`, `pings`, `objetivos`, `objetivos_partido`, `wards_partido`, `wards_destruidos_partido`, `partidos_totales`, `victorias`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    db.query(
                      sqlInsertUserStats,
                      [
                        result[0]["id_usuario"],
                        parseFloat(
                          (riotParticipantList[index]["kills"] + riotParticipantList[index]["assists"]) / riotParticipantList[index]["deaths"]
                        ).toFixed(2),
                        riotParticipantList[index]["kills"],
                        riotParticipantList[index]["deaths"],
                        riotParticipantList[index]["assists"],
                        (riotParticipantList[index]["challenges"]["killParticipation"] * 100).toFixed(2),
                        (riotParticipantList[index]["totalMinionsKilled"] / (response.data["info"]["gameDuration"] / 60)).toFixed(2),
                        riotParticipantList[index]["challenges"]["damagePerMinute"].toFixed(2),
                        chaosScore,
                        riotParticipantList[index]["doubleKills"],
                        riotParticipantList[index]["tripleKills"],
                        riotParticipantList[index]["quadraKills"],
                        riotParticipantList[index]["pentaKills"],
                        riotParticipantList[index]["objectivesStolen"] + riotParticipantList[index]["objectivesStolenAssists"],
                        riotParticipantList[index]["challenges"]["turretTakedowns"],
                        riotParticipantList[index]["inhibitorKills"] + riotParticipantList[index]["inhibitorTakedowns"],
                        riotParticipantList[index]["challenges"]["turretTakedowns"],
                        riotParticipantList[index]["inhibitorKills"] + riotParticipantList[index]["inhibitorTakedowns"],
                        riotParticipantList[index]["challenges"]["goldPerMinute"].toFixed(2),
                        riotParticipantList[index]["challenges"]["goldPerMinute"].toFixed(2),
                        riotParticipantList[index]["challenges"]["firstTurretKilled"],
                        riotParticipantList[index]["firstBloodKill"],
                        riotParticipantList[index]["visionScore"],
                        riotParticipantList[index]["wardsPlaced"],
                        riotParticipantList[index]["wardsKilled"],
                        riotParticipantList[index]["challenges"]["turretPlatesTaken"],
                        riotParticipantList[index]["allInPings"] +
                          riotParticipantList[index]["assistMePings"] +
                          riotParticipantList[index]["baitPings"] +
                          riotParticipantList[index]["basicPings"] +
                          riotParticipantList[index]["commandPings"] +
                          riotParticipantList[index]["dangerPings"] +
                          riotParticipantList[index]["enemyMissingPings"] +
                          riotParticipantList[index]["enemyVisionPings"] +
                          riotParticipantList[index]["getBackPings"] +
                          riotParticipantList[index]["holdPings"] +
                          riotParticipantList[index]["needVisionPings"] +
                          riotParticipantList[index]["onMyWayPings"] +
                          riotParticipantList[index]["pushPings"] +
                          riotParticipantList[index]["visionClearedPings"],
                        riotParticipantList[index]["challenges"]["dragonTakedowns"] +
                          riotParticipantList[index]["challenges"]["riftHeraldTakedowns"] +
                          riotParticipantList[index]["challenges"]["baronTakedowns"],
                        riotParticipantList[index]["challenges"]["dragonTakedowns"] +
                          riotParticipantList[index]["challenges"]["riftHeraldTakedowns"] +
                          riotParticipantList[index]["challenges"]["baronTakedowns"],
                        riotParticipantList[index]["wardsPlaced"],
                        riotParticipantList[index]["wardsKilled"],
                        1,
                        riotParticipantList[index]["win"] ? 1 : 0,
                      ],
                      (err3, result3) => {
                        if (err3) {
                          res.send({ status: 500, success: false, reason: "Problema con la base de datos.", error: err3 });
                        } else {
                        }
                      }
                    );
                  } else {
                    //hay que modificar en caso de ya exista el usuario
                  }
                }
              });
              console.log(result[0]["id_usuario"]);
              console.log(index);
            }
          }
        });
      });
    });
  });
}

module.exports = { getPlayerStats };
