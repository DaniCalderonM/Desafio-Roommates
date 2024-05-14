const express = require('express');
const fs = require('fs');
const uuid = require('uuid');
const { obtenerRoommate } = require('./funcion.js');

const app = express();
const PORT = 3000;

app.use(express.json());

//1. Devolver el documento HTML disponible
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

//2. Devolver a todos los roommates almacenados en roommates.json
app.get('/roommates', (req, res) => {
    const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
    res.send(roommatesJSON);
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
        fs.writeFileSync("roommates.json", JSON.stringify(roommatesJSON));
        res.status(201).send(roommatesJSON);
    } catch (error) {
        console.log("Error al agregar al roommate: ", error.message);
        res.status(500).json({ error: 'Error al agregar nuevo roommate: ' + error.message });
    }
});

//4. Devolver el historial con todos los gastos registrados en gastos.json
app.get('/gastos', (req, res) => {
    const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
    res.status(200).send(gastosJSON);
});

//5. Almacenar un nuevo gasto en gastos.json
app.post('/gasto', (req, res) => {
    try {
        const { roommate, descripcion, monto } = req.body;
        const nuevogasto = { id: uuid.v4().slice(30), roommate, descripcion, monto };
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
        gastosJSON.gastos.push(nuevogasto);
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
        res.status(201).send(gastosJSON);
    } catch (error) {
        console.log("Error al agregar nuevo gasto: ", error.message);
        res.status(500).json({ error: 'Error al agregar nuevo gasto: ' + error.message });
    }
});

//6. Modifica los datos almacenados en gastos.json
app.put('/gasto', (req, res) => {
    try {
        const { id } = req.query;
        const { roommate, descripcion, monto } = req.body;
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
        const gastos = gastosJSON.gastos;
        const index = gastos.findIndex(g => g.id === id);
        if (index !== -1) {
            gastos[index] = { id, roommate, descripcion, monto };
            fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
            console.log("Datos actualizados correctamente:", gastos[index]);
            res.status(201).send(gastosJSON);
        } else {
            console.log("Gasto no encontrado");
            res.status(404).send("Gasto no encontrado");
        }
    } catch (error) {
        console.log("Error al actualizar el gasto: ", error.message);
        res.status(500).json({ error: 'Error al actualizar el gasto: ' + error.message });
    }
});


//7. Elimina un gasto segun su id en gastos.json
app.delete('/gasto', (req, res) => {
    try {
        const { id } = req.query;
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
        const gastos = gastosJSON.gastos;
        gastosJSON.gastos = gastos.filter((g) => g.id !== id);
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
        res.status(200).send(gastosJSON);
    } catch (error) {
        console.log("Error al eliminar el gasto: ", error.message);
        res.status(500).json({ error: 'Error al eliminar el gasto: ' + error.message });
    }
});

//8. Ruta generica
app.get("*", (req, res) => {
    res.status(404).send("Esta página no existe...");
});

// Levantar servidor
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});