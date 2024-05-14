const fs = require('fs');
const uuid = require('uuid');
const axios = require('axios');

const cRoommates = __dirname + '/data/roommates.json';
const cGastos = __dirname + '/data/gastos.json';

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

const postRoommate = async () => {
    const roommate = await obtenerRoommate();
    const nuevoRoommate = { id: uuid.v4().slice(30), nombre: roommate, debe: 0, recibe: 0, total: 0 };
    const roommatesJSON = JSON.parse(fs.readFileSync(cRoommates, "utf8"));
    roommatesJSON.roommates.push(nuevoRoommate);
    // Escribir el archivo JSON con la agregacion realizada
    fs.writeFileSync(cRoommates, JSON.stringify(roommatesJSON));
    return roommatesJSON;
}

const getRoommates = async () => {
    const roommatesJSON = JSON.parse(fs.readFileSync(cRoommates, "utf8"));
    return roommatesJSON;
}

const putCuentas = async () => {
    try {
        // Obtener a los roommates y los gastos
        const roommatesJSON = JSON.parse(fs.readFileSync(cRoommates, "utf8"));
        const gastosJSON = JSON.parse(fs.readFileSync(cGastos, "utf8"));
        const roommates = roommatesJSON.roommates;
        const gastos = gastosJSON.gastos;

        // Reiniciar las cuentas
        roommates.forEach(roommate => {
            roommate.debe = 0;
            roommate.recibe = 0;
        });

        // Calcular nuevos gastos
        gastos.forEach(gasto => {
            const montoPorRoommate = gasto.monto / roommates.length;
            roommates.forEach(roommate => {
                if (roommate.nombre == gasto.roommate) {
                    roommate.recibe += montoPorRoommate;
                } else {
                    roommate.debe += montoPorRoommate;
                }
            });
        });

        // Calcular total de cada roommate
        roommates.forEach(roommate => {
            roommate.total = roommate.recibe - roommate.debe;
        });

        // Actualizar el archivo roommates.json
        fs.writeFileSync(cRoommates, JSON.stringify(roommatesJSON));
    } catch (error) {
        console.log("Error al actualizar cuentas: ", error.message);
    }
}


module.exports = { postRoommate, getRoommates, putCuentas };