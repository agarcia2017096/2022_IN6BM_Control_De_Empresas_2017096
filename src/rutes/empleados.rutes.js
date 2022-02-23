//ALEJANDRO JAVIER GARCIA GARCIA -2017096 - PE6BM2

const express = require('express');
const empleadosController = require('../controllers/empleados.controller')
const md_autentificacion = require('../middlewares/autentication')

//RUTAS
var api = express.Router();

module.exports = api