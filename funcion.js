const axios = require('axios');

const obtenerRoommate = async () => {
    try {
        const respuesta = await axios.get('https://randomuser.me/api/');
        const randomUser = respuesta.data.results[0];
        const nombre = randomUser.name.first + ' ' + randomUser.name.last;
        return nombre;
    } catch (error) {
        return "Error al obtener el usuario de la api: " + error.message;
    }
}













module.exports = { obtenerRoommate };