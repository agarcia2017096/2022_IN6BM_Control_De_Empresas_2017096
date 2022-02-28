//ALEJANDRO JAVIER GARCIA GARCIA -2017096 - PE6BM2

const express = require('express');
const empresasController = require('../controllers/empresas.controller')
const md_autentificacion = require('../middlewares/autentication')
const pdfController = require('../GenerarPDF/generarPDF')


//RUTAS
var api = express.Router();

 //********************************* USUARIOS ********************************* */
 //EDITAR PROPIO PERFIL DE EMPRESA
api.put('/editarPerfilEmpresa',md_autentificacion.Auth,empresasController.EditarPerfilEmpresa)

 //******************* CRUD EMPRESAS - FUNCIONES ADMINISTRADOR ****************** */
//REGISTRAR EMPRESAS
api.post('/registrarEmpresas',md_autentificacion.Auth, empresasController.RegistrarEmpresas);

//EDITAR EMPRESAS
api.put('/editarEmpresas/:idEmpresa',md_autentificacion.Auth, empresasController.EditarEmpresas);

//OBTENER LAS EMPRESAS DEL ADMINISTRADOR
api.get('/obtenerEmpresasAdministrador', md_autentificacion.Auth, empresasController.ObtenerEmpresasAdministrador);

//ELIMINAR EMPRESAS
api.delete('/eliminiarEmpresa', md_autentificacion.Auth, empresasController.EliminarEmpresa);


//GENERACIÓN DE PDF POR EMPRESA Y VERIFICACIÓN DE TOKEN
api.get("/generaraPDF",md_autenticacion.autenticacion,crearPDF.empresaGenerar)

module.exports = api
