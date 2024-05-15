# Desafío - Roommates

## Descripción
Es bien sabido que entre las mejores recomendaciones que un programador amateur puede
recibir para mejorar sus habilidades es “crear aplicaciones”, sin darle tanta importancia a la
temática a elaborar, sino que solo basta con un problema para desarrollar una solución digital.
En esta prueba deberás crear un servidor con Node que sirva una interfaz HTML que tendrás
a disposición en el Apoyo Desafío - Roommates y cuya temática está basada en el registro
de gastos entre roommates.
Además deberás servir una API REST que permita hacer lo siguiente:

● Almacenar roommates nuevos ocupando random user.

● Devolver todos los roommates almacenados.

● Registrar nuevos gastos.

● Devolver el historial de gastos registrados.

● Modificar la información correspondiente a un gasto.

● Eliminar gastos del historial.


## Requerimientos
1. Ocupar el módulo File System para la manipulación de archivos alojados en el
servidor.
(3 Puntos)
2. Capturar los errores para condicionar el código a través del manejo de excepciones.
(1 Punto)
3. El botón “Agregar roommate” de la aplicación cliente genera una petición POST (sin
payload) esperando que el servidor registre un nuevo roommate random con la API
randomuser, por lo que debes preparar una ruta POST /roommate en el servidor que
ejecute una función asíncrona importada de un archivo externo al del servidor (la
función debe ser un módulo), para obtener la data de un nuevo usuario y la acumule
en un JSON (roommates.json).
El objeto correspondiente al usuario que se almacenará debe tener un id generado con
el paquete UUID.
(2 Puntos)
4. Crear una API REST que contenga las siguientes rutas:

a. GET /gastos: Devuelve todos los gastos almacenados en el archivo
gastos.json.

b. POST /gasto: Recibe el payload con los datos del gasto y los almacena en un
archivo JSON (gastos.json).

c. PUT /gasto: Recibe el payload de la consulta y modifica los datos
almacenados en el servidor (gastos.json).

d. DELETE /gasto: Recibe el id del gasto usando las Query Strings y la elimine del
historial de gastos (gastos.json).

e. GET /roommates: Devuelve todos los roommates almacenados en el servidor
(roommates.json)

Se debe considerar recalcular y actualizar las cuentas de los roommates luego de este
proceso.(3 Puntos)

PD: Para el punto de recalcular y actualizar las cuentas de los roommates,
la modalidad es que cuando se agrega un nuevo gasto este se divide entre todos los roommates 
existentes y si se añade uno nuevo, a este tambien se le agrega al "debe" el valor correspondiente.
5. Devolver los códigos de estado HTTP correspondientes a cada situación.
(1 Punto)


## Instalación 🔧
1. Clona este repositorio.
2. Instala las dependencias por la terminal con npm:
- npm install
3. Inicia el servidor por la terminal:
- nodemon server

## Funcionalidades
- Agregar un nuevo Roommate desde la API Random User.
- Ver todos los Roommates almacenados.
- Agregar un nuevo Gasto.
- Ver todos los Gastos almacenados.
- Editar un Gasto existente.
- Eliminar un Gasto existente.

## Tecnologías Utilizadas
- Node.js
- Express

## Autor
- Danicsa Calderón - [GitHub](https://github.com/DaniCalderonM)
- ![7440210cfa7f959af99fb330c50127d5](https://github.com/DaniCalderonM/Desafio-Roommates/assets/128839529/f77df248-e6d6-4b6c-928d-3ca174bd7076)
