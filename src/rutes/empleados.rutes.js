//ALEJANDRO JAVIER GARCIA GARCIA -2017096 - PE6BM2

const express = require('express');
const empleadosController = require('../controllers/empleados.controller')
const md_autentificacion = require('../middlewares/autentication')

//RUTAS
var api = express.Router();

 //********************************* EMPLEADOS - FUNCIONES EMPRESA ********************************* */
//AGREGAR EMPLEADOS
api.post('/agregarEmpleados',md_autentificacion.Auth,empleadosController.AgregarEmpleados)

//EDITAR EMPLEADOS
api.put('/editarEmpleados/:idEmpleado',md_autentificacion.Auth,empleadosController.EditarEmpleados)

//ELIMINAR EMPLEADOS
api.delete('/eliminarEmpleados/:idEmpleado',md_autentificacion.Auth,empleadosController.EliminarEmpleados)

//OBTENER LA CATIDAD DE EMPLEADOS POR EMPRESA
api.get('/empleadosActualesCantidad',md_autentificacion.Auth,empleadosController.CantidadEmpleadosActuales)
//BUSCAR POR ID
api.get('/empleadosId/:idEmpleado',empleadosController.ObtenerUsuarioID)

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


module.exports = api