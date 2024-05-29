// Importacion
const express = require('express');
const fs = require('fs');
const cors = require('cors')
const { postRoommate, getRoommates, putCuentas } = require('./roommates.js');
const { getGastos, postGasto, buscarPorId } = require('./gastos.js');
// Instancia de express
const app = express();
const PORT = 3000;

// Middleware para enviar respuestas json
app.use(express.json());
app.use(cors());

const cGastos = __dirname + '/data/gastos.json';

//1. Devolver el documento HTML disponible
// app.get("/", (req, res) => {
//     try {
//         console.log("Archivo html obtenido correctamente");
//         return res.sendFile(__dirname + '/index.html');
//     } catch (error) {
//         console.log("Error del servidor: ", error.message);
//         return res.status(500).send({ message: "Error interno del servidor: " + error.message });
//     }
// });

//2. Devolver a todos los roommates almacenados en roommates.json
app.get('/roommates', async (req, res) => {
    try {
        const respuesta = await getRoommates();
        console.log("Roommates obtenidos correctamente");
        return res.status(200).send(respuesta);
    } catch (error) {
        console.log("Error interno del servidor: ", error.message);
        return res.status(500).send({ message: "Error interno del servidor: " + error.message });
    }
});

//3. Almacenar un nuevo roommate en roommates.json ocupando randomUser
app.post('/roommate', async (req, res) => {
    try {
        const respuesta = await postRoommate();
        // Se llama a la funcion para actualizar las cuentas
        await putCuentas();
        console.log("Roommate agregado correctamente");
        return res.status(201).send(respuesta);
    } catch (error) {
        console.log("Error interno del servidor: ", error.message);
        return res.status(500).send({ message: "Error interno del servidor: " + error.message });
    }
});

//4. Devolver el historial con todos los gastos registrados en gastos.json
app.get('/gastos', async (req, res) => {
    try {
        const respuesta = await getGastos();
        console.log("Gastos obtenidos correctamente");
        return res.status(200).send(respuesta);
    } catch (error) {
        console.log("Error interno del servidor: ", error.message);
        return res.status(500).send({ message: "Error interno del servidor: " + error.message });
    }
});

//5. Almacenar un nuevo gasto en gastos.json
app.post('/gasto', async (req, res) => {
    try {
        const { roommate, descripcion, monto } = req.body;
        // Verificar si se proporcionan los datos del req.body
        if (!roommate || !descripcion || !monto) {
            console.log("status 400: Debe proporcionar el roommate, la descripcion y el monto");
            return res.status(400).send({ message: "Debe proporcionar el roommate, la descripcion y el monto" });
        }

        const respuesta = await postGasto(roommate, descripcion, monto);
        // Se llama a la funcion para actualizar las cuentas
        await putCuentas();
        console.log("Gasto ingresado correctamente");
        return res.status(201).send(respuesta);
    } catch (error) {
        console.log("Error interno del servidor: ", error.message);
        return res.status(500).send({ message: "Error interno del servidor: " + error.message });
    }
});

//6. Modifica los datos almacenados en gastos.json
app.put('/gasto', async (req, res) => {
    try {
        const { id } = req.query;
        const { roommate, descripcion, monto } = req.body;

        // Verificar si se proporciona el id en la consulta
        if (!id) {
            console.log("status 400: Debe proporcionar un ID");
            return res.status(400).send({ message: "Debe proporcionar un ID" });
        }
        // Verificar si se proporcionan los datos del req.body
        if (!roommate || !descripcion || !monto) {
            console.log("status 400: Debe proporcionar el roommate, la descripcion y el monto");
            return res.status(400).send({ message: "Debe proporcionar el roommate, la descripcion y el monto" });
        }

        const resultado = await getGastos();
        const gastos = resultado.gastos;

        // Verificar si el gasto con el id proporcionado existe
        const indiceId = buscarPorId(gastos, id)
        if (indiceId == -1) {
            console.log("status 404: Gasto no encontrado");
            return res.status(404).send({ message: "Gasto no encontrado" });
        } else {
            // Actualizar los datos del gasto
            gastos[indiceId] = { id, roommate, descripcion, monto };
            // Escribir el archivo JSON con la modificacion realizada
            fs.writeFileSync(cGastos, JSON.stringify(resultado));
            // Se llama a la funcion para actualizar las cuentas
            await putCuentas();
            console.log("Datos actualizados correctamente: ", gastos[indiceId]);
            return res.status(200).send(resultado);
        }
    } catch (error) {
        console.log("Error interno del servidor: ", error.message);
        return res.status(500).send({ message: "Error interno del servidor: " + error.message });
    }
});

//7. Elimina un gasto segun su id en gastos.json
app.delete('/gasto', async (req, res) => {
    try {
        const { id } = req.query;
        // Verificar si se proporcionó el id
        if (!id) {
            console.log("status 400: Debe proporcionar un ID")
            return res.status(400).send({ message: "Debe proporcionar un ID" });
        }
        const resultado = await getGastos();
        const gastos = resultado.gastos;
        // Verificar si el gasto con el id proporcionado existe
        const indiceId = buscarPorId(gastos, id)
        if (indiceId == -1) {
            console.log("status 404: El gasto con el ID proporcionado no existe")
            return res.status(404).send({ message: "El gasto con el ID proporcionado no existe" });
        }
        // Eliminar el gasto del arreglo
        resultado.gastos = gastos.filter((g) => g.id !== id);
        // Escribir el archivo JSON con la eliminacion realizada
        fs.writeFileSync(cGastos, JSON.stringify(resultado));
        // Se llama a la función para actualizar las cuentas
        await putCuentas();
        console.log("Gasto eliminado correctamente")
        return res.status(200).send({ message: "Gasto eliminado correctamente" });
    } catch (error) {
        console.log("Error interno del servidor: ", error.message);
        return res.status(500).send({ message: "Error interno del servidor: " + error.message });
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
