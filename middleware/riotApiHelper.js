const axios = require("axios");

const API = "RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206";



async function getUserFromApi(uuid){

    const response = await axios.get("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/" + uuid + "?api_key=" + API)
        
    return response;
}

async function getUserInfoFromUuid(uuid) {

    const response = await getUserFromApi(uuid)
        

    if (response.status == 200) {

        console.log("Usuario encontrado correctamente.")
        return response.data;

    } else{

        console.log("Problema encontrando el usuario en la api de RIOT.")
        return null;
    }
                 
}

async function checkUserEuw(uuid) {

    const response = await getUserFromApi(uuid)

    if(response.status == 200){

        console.log("Usuario encontrado correctamente.")
        return 1;

    }else{

        console.log("Usuario no encontrrado en la API -- Status Code de la respuesta " + response.status)
        return 0;
    }
}


module.exports = {checkUserEuw,getUserInfoFromUuid};