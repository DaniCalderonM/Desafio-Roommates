// Importacion
const express = require('express');
const fs = require('fs');
const uuid = require('uuid');
const { obtenerRoommate } = require('./funcion.js');
// Instancia de express
const app = express();
const PORT = 3000;

// Middleware para enviar respuestas json
app.use(express.json());

//1. Devolver el documento HTML disponible
app.get("/", (req, res) => {
    try {
        return res.sendFile(__dirname + '/index.html');
    } catch (error) {
        console.log("Error del servidor: ", error.message);
        return res.status(500).send("Error del servidor: " + error.message);
    }
});

//2. Devolver a todos los roommates almacenados en roommates.json
app.get('/roommates', (req, res) => {
    try {
        const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
        return res.status(200).send(roommatesJSON);
    } catch (error) {
        console.log("Error interno del servidor: ", error.message);
        return res.status(500).send("Error interno del servidor: " + error.message);
    }
});

//3. Almacenar un nuevo roommate en roommates.json ocupando randomUser
app.post('/roommate', async (req, res) => {
    try {
        const roommate = await obtenerRoommate();
        const debe = 10000;
        const recibe = 20000;
        const total = 10000;
        const nuevoRoommate = { id: uuid.v4().slice(30), nombre: roommate, debe, recibe, total };
        const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
        roommatesJSON.roommates.push(nuevoRoommate);
        // Escribir el archivo JSON con la agregacion realizada
        fs.writeFileSync("roommates.json", JSON.stringify(roommatesJSON));
        return res.status(201).send(roommatesJSON);
    } catch (error) {
        console.log("Error interno del servidor: ", error.message);
        return res.status(500).send("Error interno del servidor: " + error.message);
    }
});

//4. Devolver el historial con todos los gastos registrados en gastos.json
app.get('/gastos', (req, res) => {
    try {
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
        return res.status(200).send(gastosJSON);
    } catch (error) {
        console.log("Error interno del servidor: ", error.message);
        return res.status(500).send("Error interno del servidor: " + error.message);
    }
});

//5. Almacenar un nuevo gasto en gastos.json
app.post('/gasto', (req, res) => {
    try {
        const { roommate, descripcion, monto } = req.body;

        // Verificar si se proporcionan los datos del req.body
        if (!roommate || !descripcion || !monto) {
            return res.status(400).send("Debe proporcionar el roommate, la descripcion y el monto");
        }

        const nuevogasto = { id: uuid.v4().slice(30), roommate, descripcion, monto };
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
        gastosJSON.gastos.push(nuevogasto);
        // Escribir el archivo JSON con la agregacion realizada
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));

        return res.status(201).send(gastosJSON);
    } catch (error) {
        console.log("Error interno del servidor: ", error.message);
        return res.status(500).send("Error interno del servidor: " + error.message);
    }
});

//6. Modifica los datos almacenados en gastos.json
app.put('/gasto', (req, res) => {
    try {
        const { id } = req.query;
        const { roommate, descripcion, monto } = req.body;

        // Verificar si se proporciona el id en la consulta
        if (!id) {
            return res.status(400).send("Debe proporcionar un ID");
        }
        // Verificar si se proporcionan los datos del req.body
        if (!roommate || !descripcion || !monto) {
            return res.status(400).send("Debe proporcionar el roommate, la descripcion y el monto");
        }

        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
        const gastos = gastosJSON.gastos;

        // Verificar si el gasto con el id proporcionado existe
        const buscarId = gastos.findIndex(g => g.id === id);
        if (buscarId == -1) {
            console.log("Gasto no encontrado");
            return res.status(404).send("Gasto no encontrado");
        } else {
            // Actualizar los datos del gasto
            gastos[buscarId] = { id, roommate, descripcion, monto };
            // Escribir el archivo JSON con la modificacion realizada
            fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
            console.log("Datos actualizados correctamente:", gastos[buscarId]);
            return res.status(200).send(gastosJSON);
        }
    } catch (error) {
        console.log("Error interno del servidor: ", error.message);
        return res.status(500).send("Error interno del servidor: " + error.message);
    }
});

//7. Elimina un gasto segun su id en gastos.json
app.delete('/gasto', (req, res) => {
    try {
        const { id } = req.query;
        // Verificar si se proporciono el id
        if (!id) {
            return res.status(400).send("Debe proporcionar un ID");
        }
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
        const gastos = gastosJSON.gastos;
        // Verificar si el gasto con el id proporcionado existe
        const buscarId = gastos.findIndex(g => g.id == id);
        if (buscarId == -1) {
            return res.status(404).send("El gasto con el ID proporcionado no existe");
        }
        // Eliminar el gasto del arreglo
        gastosJSON.gastos = gastos.filter((g) => g.id !== id);
        // Escribir el archivo JSON con la eliminacion realizada
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
        return res.status(200).send(gastosJSON);
    } catch (error) {
        console.log("Error interno del servidor: ", error.message);
        return res.status(500).send("Error interno del servidor: " + error.message);
    }
});

//8. Ruta generica
app.get("*", (req, res) => {
    return res.status(404).send("Esta página no existe...");
});

// Levantar servidor
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});
