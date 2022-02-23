//ALEJANDRO JAVIER GARCIA GARCIA -2017096 - PE6BM2

const Empresas = require('../models/empresas.model');
const Empleados = require('../models/empleados.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

//El administrador puede registrar, editar y eliminar empresas.
/* | | | | | | | | | | | | | | | | | | | | | EMPRESAS CRUD | | | | | | | | | | | | | | | | | | | | |*/
//*************************** 1. REGISTRAR EMPRESAS *************************** */
function RegistrarEmpresas(req, res) {

    if ( req.user.rol == "ROL_EMPRESA" ) return res.status(500)
    .send({ mensaje: 'No tiene acceso a registar Empresas'});

    var parametros = req.body;
    var empresasModel = new Empresas();

    if(parametros.nombreEmpresa && parametros.actividadEconomica && 
        parametros.email && parametros.password) {
            empresasModel.nombreEmpresa = parametros.nombreEmpresa;
            empresasModel.actividadEconomica = parametros.actividadEconomica;
            empresasModel.email = parametros.email;
            empresasModel.rol = "ROL_EMPRESA";
            empresasModel.idUsuario = req.user.sub;

            Empresas.find({ email : parametros.email }, (err, empresaEncontrada) => {
                if ( empresaEncontrada.length == 0 ) {

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        empresasModel.password = passwordEncriptada;

                        empresasModel.save((err, empresaGuardada) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!empresaGuardada) return res.status(500)
                                .send({ mensaje: 'Error al agregar la empresa'});
                            
                            return res.status(200).send({ empresa: empresaGuardada });
                        });
                    });                    
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
                }
            })
    }else{
        return res.status(500)
        .send({ mensaje: 'Debe llenar los campos necesarios'});
    }
}

//**************************** 2. EDITAR EMPRESAS ******************************* */
function EditarEmpresas(req, res) {
    var idEmp = req.params.idEmpresa;
    var parametros = req.body;

    if ( req.user.rol == "ROL_EMPRESA" ) return res.status(500)
    .send({ mensaje: 'No tiene acceso a editar Cursos'});

    if(parametros.email || parametros.password|| parametros.rol|| parametros.idUsuario){
        return res.status(500)
        .send({ mensaje: 'No puede modificar los campos necesarios para el logueo,solamente nombre y actividad'});

    }else{
        Empresas.findByIdAndUpdate(idEmp, parametros, { new: true } ,(err, empresaActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!empresaActualizado) return res.status(404).send( { mensaje: 'Error al Editar el Cursos'});
    
            return res.status(200).send({ curso: empresaActualizado});
        });
    }
}

//********************************* 2.1. BUSCAR EMPRESAS DEL ADMINISTRADOR ********************************* */
function ObtenerEmpresasAdministrador(req, res) {

    if ( req.user.rol == "ROL_EMPRESA" ) return res.status(500)
    .send({ mensaje: 'No tiene acceso a buscar empresas'});

    Empresas.find({idEmpresa:req.user.sub}, (err, empresasEncontradas) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!empresasEncontradas) return res.status(500).send({ mensaje: "Error al obtener las encuestas."});
        return res.status(200).send({ empresa: empresasEncontradas });
    })
}

//********************************* 4. ELIMINAR EMPRESA ********************************* */
function EliminarEmpresa(req, res){
    var idCur = req.params.idCurso

    if ( req.user.rol == "ROL_ALUMNO" ) return res.status(500)
    .send({ mensaje: 'No tiene acceso a eliminar Cursos'});

    Cursos.findById(idCur, (err, cursosEncontradosId) => {

        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!cursosEncontradosId) return res.status(500).send({ mensaje: "Error al buscar el curso"});

        if ( cursosEncontradosId.nombreCurso == "CURSO POR DEFECTO" ) {
            return res.status(500)
        .send({ mensaje: 'No se puede eliminar este curso'});
        }else{
            //
            Asignaciones.find({idCurso: idCur}, (err,cursoEncontrado)=>{
                if(cursoEncontrado.length !=0){  

                    Cursos.findOne({nombreCurso:"CURSO POR DEFECTO"}, (err, cursosEncontrados) => {
                        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                        console.log(cursosEncontrados._id)
                        
                        Asignaciones.updateMany({idCurso:idCur},{idCurso:cursosEncontrados._id}, { new: true } ,(err, cursosActualizado)=>{
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion editar'});
                            if(!cursosActualizado) return res.status(404).send( { mensaje: 'Error al Editar el Cursos'});
            
                        })
                    })

                    Cursos.findByIdAndDelete(idCur,(err,cursoEliminado)=>{
                        if(err) return res.status(500).send({mensaje: "Error en la peticion1"});
                        if(!cursoEliminado) return res.status(404).send({mensaje: "Error al eliminar1"})
                        return res.status(200).send({Eliminacion_y_Modificacion_Exitosa_por_Id: cursoEliminado})

                    })

                }else{
                    Cursos.findByIdAndDelete(idCur,(err,cursoEliminado)=>{
                        if(err) return res.status(500).send({mensaje: "Error en la peticion2"});
                        if(!cursoEliminado) return res.status(404).send({mensaje: "Error al eliminar2"})
                        return res.status(200).send({Eliminacion_y_Modificacion_Exitosa_por_Id: cursoEliminado})
                    })
                }

            })
        }
    })

}


//1. La empresa puede logearse y llevar el control de la misma.
//********************************* 1. EDITAR ********************************* */
function EditarPerfilEmpresa(req, res) {
    var parametros = req.body;    

    if ( req.user.rol != "ROL_EMPRESA" ) return res.status(500)
    .send({ mensaje: 'Esta función es únicamente para editar el perfil propio de la empresa'});

    Empresas.find({_id:req.user.sub},(err,empresaEncontrada)=>{
        if(empresaEncontrada){
            if(parametros.email || parametros.password|| parametros.rol|| parametros.idUsuario){
                return res.status(500)
                .send({ mensaje: 'No puede modificar los campos necesarios para el logueo,solamente nombre y apellido'});
        
            }else{
                Usuarios.findByIdAndUpdate(req.user.sub, {nombre:parametros.nombre,apellido:parametros.apellido}, {new : true},
                    (err, empresaActualizada)=>{
                        if(err) return res.status(500)
                            .send({ mensaje: 'Error en la peticion' });
                        if(!usuarioActualizado) return res.status(500)
                            .send({ mensaje: 'Error al editar el Usuario'});
                        
                        return res.status(200).send({empresa : empresaActualizada})
                    })
            }  
        }else{
            return res.send({ mensaje: 'Error al editar' });
        }
    })

     
}

//********************************* 2. ELIMINAR ********************************* */
function EliminarPerfilEmpresa(req, res){

    if ( req.user.rol != "ROL_EMPRESA" ) return res.status(500)
    .send({ mensaje: 'Esta función es únicamente para editar el perfil propio de la empresa'});

    Empresas.findByIdAndDelete(req.user.sub,(err,empresaEliminada)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(!empresaEliminada) return res.status(404).send({mensaje: "Error al eliminar empresa"})

        return  res.status(200).send({empresa:empresaEliminada});
    })
}

//2. Puede crear, editar y eliminar empleados por empresa.
//********************************* 2.1. AGREGAR EMPLEADO ********************************* */
function AgregarEmpleados(req, res){
    var parametros = req.body

    var empleadoModel = new Empleados()

    if ( req.user.rol != "ROL_EMPRESA" ) return res.status(500)
    .send({ mensaje: 'No tiene acceso a agregar empleados. Solamente la empresa puede hacerlo'});

    if(parametros.nombre && parametros.apellido && 
    parametros.email && parametros.telefono && parametros.departamento && parametros.puesto){

        empleadoModel.nombre = parametros.nombre;
        empleadoModel.apellido = parametros.apellido;
        empleadoModel.email = parametros.email;
        empleadoModel.telefono = parametros.telefono;
        empleadoModel.departamento = parametros.departamento;
        empleadoModel.puesto = parametros.puesto;
        empleadoModel.idempresa = req.user.sub;

        cursoModel.save((err, empleadoGuardado) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!empleadoGuardado) return res.status(500).send({ mensaje: "Error al guardar el curso"});
            
            return res.status(200).send({ empleado: empleadoGuardado });
        });

    } else{
        return res.status(500).send({ mensaje: "Debe rellenar los campos necesarios." });
    }
}

//********************************* 2.2. EDITAR EMPLEADO ********************************* */
function EditarEmpleados(req, res){
    var idEmp = req.params.idEmpleado

    var parametros = req.body

    if ( req.user.rol != "ROL_EMPRESA" ) return res.status(500)
    .send({ mensaje: 'No tiene acceso a editar empleados. Solamente la empresa puede hacerlo'});

    Empleados.find({_id:idEmp,idEmpresa:req.user.sub}, (err, empleadoEncontrado) => {
        if(err) return res.status(500).send({ mensaje:"El empleado no existe. Verifique el ID"})
        if(!empleadoEncontrado){
            return res.send({ mensaje:"Unicamente puede editar empleados de su empresa"})
        }else{
            if(parametros.nombre || parametros.apellido || 
                parametros.email || parametros.telefono || parametros.departamento || parametros.puesto){
                
                     Usuarios.findByIdAndUpdate(req.user.sub, parametros, {new : true},
                            (err, empleadoActualizado)=>{
                                if(err) return res.status(500)
                                    .send({ mensaje: 'Error en la peticion' });
                                if(!usuarioActualizado) return res.status(500)
                                    .send({ mensaje: 'Error al editar el Usuario'});
                                
                                return res.status(200).send({empleado : empleadoActualizado})
                
                            })
                } else{
                    return res.status(500).send({ mensaje: "Debe rellenar los campos necesarios. No se puede modificar el ID de la empresa." });
                }
        }
    })
}

//********************************* 2.3. ELIMINAR EMPLEADO ********************************* */
function EliminarEmpleados(req,re){
    var idEmp = req.params.idEmpleado

    if ( req.user.rol != "ROL_EMPRESA" ) return res.status(500)
    .send({ mensaje: 'No tiene acceso a editar empleados. Solamente la empresa puede hacerlo'});

    Empleados.find({_id:idEmp,idEmpresa:req.user.sub}, (err, empleadoEncontrado) => {
        if(err) return res.status(500).send({ mensaje:"El empleado no existe. Verifique el ID"})

        if(!empleadoEncontrado){
            return res.send({ mensaje:"Unicamente puede eliminar empleados de su empresa"})
        }else{
           Empleados.findByIdAndDelete(idEmp, (err, empleadoEliminado)=>{
               if(err) return res.status(404).send({mensaje: "Error en la peticion"})
               if(err) return res.status(500).send({mensaje: "Error al eliminar"})

              return res.status(200).send({empleado:empleadoEliminado})

           })
        }
    })
}

//3. Se tendrá que llevar control del personal laborando por empresa
//actualmente y la cantidad de los mismos por empresa.
//********************************* 3.1. BUSCAR CANTIDAD DE EMPLEADOS DE LA EMPRESA ********************************* */
function EmpleadosActuales (req,res){
    
    Empleados.find({},{idEmpresa:req.user.sub},(err,empleadosEcontrados)=>{
        if(err) return res.status(404).send({mensaje:"Error en la peticion"})
        if(!usuariosObtenidos){
            return res.status(500).send({mensaje:"No existen empleados de su empresa"})

        }else{
            return res.status(200).send({ EmpleadosActuales: empleadosEcontrados.length})
        }
    })
}
//4. Búsqueda del empleado por:Id, Nombre, Puesto, Departamento, Todos los Empleados

//OBTENER EMPLEADOS POR ID
function ObtenerUsuarioID(req, res){
    var idEmp =req.params.idEmpleado;

    Empleados.find({_id:idEmp,idEmpresa:req.user.sub},(err,empleadoEncontrado)=>{

        if(err) return res.status(500).send({mensaje: "Error en la peticion"})

        if(!empleadoEncontrado)return res.status(404).send({mensaje: "Este usuario no existe en la empresa"})

        return res.status(200).send({empleado: empleadoEncontrado})
    })
}

//BUSCAR POR NOMBRE DE USUARIO
function ObtenerNombreEmpleados(req, res) {
    var nombrEmp= req.params.nombreEmpleado;

    Empleados.find({ nombre : { $regex: nombrEmp, $options: 'i' },idEmpresa:req.user.sub },(err, empleadoEncontrado)=>{
        if(err)return res.status(500).send({mensaje: "Error, nose ha podido reolver la consulta"});
        if(!empleadoEncontrado)return res.status(404).send({mensaje: "Este nombre no existe en la empresa"});
        return res.status(200).send({empleado: empleadoEncontrado})
    })
}

//BUSCAR POR PUESTO DE EMPLEADO
function ObtenerPuestoEmpleados(req, res) {
    var puestoEmp= req.params.puestoEmpleado;

    Empleados.find({ puesto : { $regex: apellidoUser, $options: 'i' },idEmpresa:req.user.sub },(err, empleadoEncontrado)=>{
        if(err)return res.status(500).send({mensaje: "Error en la peticion"});
        if(!empleadoEncontrado)return res.status(404).send({mensaje: "Error, el usuario no existe"});
        return res.status(200).send({empleado: empleadoEncontrado})
    })
}


//BUSCAR POR DEPARTAMENTO DE EMPLEADO
function ObtenerDepartamentoEmpleados(req, res) {
    var emailUser= req.params.emailUsuario;

    Empleados.find({ departamento : { $regex: emailUser, $options: 'i' },idEmpresa:req.user.sub },(err, empleadoEncontrado)=>{
        if(err)return res.status(500).send({mensaje: "Error en la peticion"});
        if(!empleadoEncontrado)return res.status(404).send({mensaje: "Error, el usuario no existe"});
        return res.status(200).send({empleado: empleadoEncontrado})
    })
}

//BUSCAR TODOS LOS EMPLEADOS DE LA EMPRESA
function ObtenerTodosEmpleados(req, res) {
    var emailUser= req.params.emailUsuario;

    Empleados.find({},{idEmpresa:req.user.sub },(err, empleadoEncontrado)=>{
        if(err)return res.status(500).send({mensaje: "Error en la peticion"});
        if(!empleadoEncontrado)return res.status(404).send({mensaje: "Error, el usuario no existe"});
        return res.status(200).send({empleado: empleadoEncontrado})
    })
}

//********************************* EXPORTAR ********************************* */
//EXPORTAR

module.exports ={
    EditarPerfilEmpresa,
    EliminarPerfilEmpresa,
    AgregarEmpleados,
    EditarEmpleados,
    EliminarEmpleados,
    EditarEmpleados,
    EmpleadosActuales,
    RegistrarEmpresas,
    ObtenerEmpresasAdministrador,
    EditarEmpresas 
    

}