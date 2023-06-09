const express = require('express');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;

// Configuración de la aplicación
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuración de la sesión
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Rutas
const router = require('./router');
app.use('/', router);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
