//ALEJANDRO JAVIER GARCIA GARCIA -2017096 - PE6BM2

const Empresas = require('../models/empresas.model');
const Empleados = require('../models/empleados.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

//El administrador puede registrar, editar y eliminar empresas.
/* | | | | | | | | | | | | | | | | | | | | | EMPRESAS CRUD - OPCIONES DE ADMINISTRADOR| | | | | | | | | | | | | | | | | | | | |*/
//*************************** 1. REGISTRAR EMPRESAS *************************** */
function RegistrarEmpresas(req, res) {

    if ( req.user.rol == "ROL_EMPRESA" ) return res.status(500)
    .send({ mensaje: 'No tiene acceso a registar Empresas. Únicamente el Administrador'});

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
    .send({ mensaje: 'No tiene acceso a editar empresas. Únicamente el Administrador'});

    Empresas.findById(idEmp, (err,buscarEmpleado)=>{
        if(!buscarEmpleado)return res.status(404).send( { mensaje: 'La empresa no existe, verifique el ID'});

        if(parametros.email || parametros.password|| parametros.rol|| parametros.idUsuario|| parametros.email==""
        || parametros.password==""|| parametros.rol==""|| parametros.idUsuario==""
         ){
            return res.status(500)
            .send({ mensaje: 'No puede modificar los campos necesarios para el logueo,solamente nombre y actividad'});
    
        }else{
            Empresas.findByIdAndUpdate(idEmp, parametros, { new: true } ,(err, empresaActualizado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
                if(!empresaActualizado) return res.status(404).send( { mensaje: 'Error al editar la empresa'});
        
                return res.status(200).send({ empresa: empresaActualizado});
            });
        }
    })
}

//********************************* 2.1. BUSCAR EMPRESAS DEL ADMINISTRADOR ********************************* */
function ObtenerEmpresasAdministrador(req, res) {

    if ( req.user.rol == "ROL_EMPRESA" ) return res.status(500)
    .send({ mensaje: 'No tiene acceso a buscar empresas. Únicamente el Administrador'});

    Empresas.find({idEmpresa:req.user.sub}, (err, empresasEncontradas) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!empresasEncontradas) return res.status(500).send({ mensaje: "Error al obtener las encuestas."});
        return res.status(200).send({ empresa: empresasEncontradas });
    })
}

//********************************* 4. ELIMINAR EMPRESA ********************************* */
function EliminarEmpresa(req, res){
    const idEmp = req.params.idEmpresa;
    console.log("Hola")

    if ( req.user.rol == "ROL_EMPRESA" ) return res.status(500)
    .send({ mensaje: 'No tiene acceso a buscar empresas. Únicamente el Administrador'});

    Empresas.findOne({_id:idEmp},(err,empresaExistente)=>{
        if(err) return res.status(404).send({mensaje:'Error, la empresa no existe. Verifique el ID'})
        if(empresaExistente.length==0) return res.status(500).send({mensaje:"La empresa no existe"})

        Empresas.findOne({nombreEmpresa:"KINAL - POR DEFECTO"},(err,empresaEncontrada)=>{
            if(err) return res.status(400).send({mensaje:'Error en la peticion de buscar empresa por defecto'})
            if(!empresaEncontrada){
               const modeloEmpresa = new Empresas()
               modeloEmpresa.nombreEmpresa = "KINAL - POR DEFECTO"
               modeloEmpresa.actividadEconomica = "Educación"
               modeloEmpresa.email = "fundacionkinal@kinal.edu.gt"
               modeloEmpresa.rol = "ROL_EMPRESA"
               modeloEmpresa.email = "fundacionkinal@kinal.edu.gt"
               modeloEmpresa.rol = "ROL_EMPRESA"
               modeloEmpresa.password = "123456"

               bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
                modeloEmpresa.password = passwordEncriptada;

                }); 


                modeloEmpresa.save((err,empresaGuardada)=>{
                   if(err) return res.status(400).send({mensaje:'Error en la peticion de guardar la empresa por defecto'})
                   if(!empresaGuardada) return res.status(400).send({mensaje:'No se ha podido agregar la empresa'})

                  Empleados.updateMany({idEmpresa:idEmp},{idEmpresa:empresaGuardada.id},(err,empleadosActualizados)=>{
                    if(err) return res.status(400).send({mensaje:'Error en la peticion de actualizar '})

                    Empresas.findByIdAndDelete(cursoId,(err,empresaEliminada)=>{
                        if(err) return res.status(400).send({mensaje:'Error en la peticion al eliminar '})
                        if(!empresaEliminada) return res.status(400).send({mensaje:'No se ha podido eliminar el empresa'})
                        return res.status(200).send({editado:empleadosActualizados,empresa:empresaEliminada})

                    })


                })
               })

            }else{
            Empleados.updateMany({idEmpresa:idEmp},{idEmpresa:empresaEncontrada._id},(err,empresaEncontrada)=>{
                if(err) return res.status(400).send({mensaje:'Error en la peticion de actualizar '})
                Empresas.findByIdAndDelete(idEmp,(err,empresaEliminada)=>{
                    if(err) return res.status(400).send({mensaje:'Error en la peticion al eliminar '})
                    if(!empresaEliminada) return res.status(400).send({mensaje:'No se ha podido eliminar el curso'})
                    return res.status(200).send({editado:empresaEncontrada,curso:empresaEliminada})
                })
            })

         }      

        })
    })

}


//1. La empresa puede logearse y llevar el control de la misma.
//********************************* 1. EDITAR PERFIL EMPRESA ********************************* */
function EditarPerfilEmpresa(req, res) {
    var parametros = req.body;    

    if ( req.user.rol != "ROL_EMPRESA" ) return res.status(500)
    .send({ mensaje: 'Esta función es únicamente para editar el perfil propio de la empresa'});

    if(parametros.email || parametros.password|| parametros.rol|| parametros.idUsuario|| parametros.email==""
        || parametros.password==""|| parametros.rol==""|| parametros.idUsuario==""){
            return res.status(500)
            .send({ mensaje: 'No puede modificar los campos necesarios para el logueo,solamente nombre y actividad'});
            
    }else{
        Empresas.findByIdAndUpdate(req.user.sub, parametros, { new: true } ,(err, empresaActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!empresaActualizado) return res.status(404).send( { mensaje: 'Error al editar la empresa'});
            
        return res.status(200).send({ empresa: empresaActualizado});
         });
    }
}  
        
//********************************* EXPORTAR ********************************* */
//EXPORTAR

module.exports ={
    EditarPerfilEmpresa,

    RegistrarEmpresas,
    ObtenerEmpresasAdministrador,
    EditarEmpresas,
    EliminarEmpresa
    

}