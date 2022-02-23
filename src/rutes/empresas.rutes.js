//ALEJANDRO JAVIER GARCIA GARCIA -2017096 - PE6BM2

const express = require('express');
const empresasController = require('../controllers/empresas.controller')
const md_autentificacion = require('../middlewares/autentication')

//RUTAS
var api = express.Router();

 //********************************* USUARIOS ********************************* */
 //EDITAR PROPIO PERFIL DE EMPRESA
api.put('/editarPerfilEmpresa',md_autentificacion.Auth,empresasController.EditarPerfilEmpresa)
module.exports = api
 //********************************* EMPRESAS ********************************* */
//REGISTRAR EMPRESAS
api.post('/registrarEmpresas',md_autentificacion.Auth, usuariosController.RegistrarEmpresas);

//EDITAR EMPRESAS
api.put('/editarEmpresas/:idEmpresa',md_autentificacion.Auth, usuariosController.EditarEmpresas);



//OBTENER LAS EMPRESAS DEL ADMINISTRADOR
api.get('/obtenerEmpresasAdministrador', md_autentificacion.Auth, usuariosController.ObtenerEmpresasAdministrador);



//OBTENER LA CATIDAD DE EMPLEADOS POR EMPRESA
//api.get('/usuarios',empresasController.ObtenerUsuarios)
//BUSCAR POR ID
//api.get('/empleadoID/:nombreEmpleado',empresasController.ObtenerNombreUsuarios)
//BUSCAR POR NOMBRE
//api.get('/empleadoNombre/:nombreUsuario',empresasController.ObtenerNombreUsuarios)
//BUSCAR POR PUESTO
//api.get('/empleadoPuesto/:apellidoUsuario',empresasController.ObtenerApellidoUsuarios)
//BUSCAR POR DEPARTAMENTO
//api.get('/empleadoDepartamento/:emailUsuario',empresasController.ObtenerEmailUsuarios)
//BUSCAR TODOS LOS EMPLEADOS
//BUSCAR POR DEPARTAMENTO
//api.get('/empleadoDepartamento/:emailUsuario',usuariosController.ObtenerEmailUsuarios)