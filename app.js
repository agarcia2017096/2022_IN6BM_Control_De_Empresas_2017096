//ALEJANDRO JAVIER GARCIA GARCIA -2017096 - PE6BM2

// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS
const UsuariosRutas = require('./src/rutes/usuarios.rutes');
const EmpresasRutas = require('./src/rutes/empleados.rutes');
const EmpleadosRutas = require('./src/rutes/empresas.rutes');



// MIDDLEWARES -> iNTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', EmpresasRutas,UsuariosRutas,EmpleadosRutas);


module.exports = app;
