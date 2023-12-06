const axios = require("axios");

const API = "RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206";

async function getUserInfoFromUuid(uuid) {

    const response = await axios.get("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/" + uuid + "?api_key=" + API)
        
    if (response.status != 200) {

        console.log("Problema encontrando el usuario en la api de RIOT.")
        return null;
        

    } else{

        console.log("Usuario encontrado correctamente.")
        return response.data;
    }
                 
}

async function checkUserEuw(uuid) {

    const user = await getUserInfoFromUuid(uuid)

    if(user != null){
        return 1;
    }else{
        return 0;
    }
}


module.exports = {checkUserEuw};