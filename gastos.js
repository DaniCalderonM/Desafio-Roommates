const fs = require('fs');
const uuid = require('uuid');
const cGastos = __dirname + '/data/gastos.json';

const getGastos = async () => {
    const gastosJSON = JSON.parse(fs.readFileSync(cGastos, "utf8"));
    return gastosJSON;
}

const postGasto = async ( roommate, descripcion, monto) => {
    const nuevogasto = { id: uuid.v4().slice(30), roommate, descripcion, monto };
    const gastosJSON = JSON.parse(fs.readFileSync(cGastos, "utf8"));
    gastosJSON.gastos.push(nuevogasto);
    // Escribir el archivo JSON con la agregacion realizada
    fs.writeFileSync(cGastos, JSON.stringify(gastosJSON));
}

module.exports = { getGastos, postGasto };