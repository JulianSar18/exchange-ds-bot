// Importar el módulo Express
import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import * as other from "./index.js";
// Crear una instancia de la aplicación Express
const app = express();

// Definir una ruta para el endpoint '/'
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Escuchar en el puerto 3000
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  other.start();
});