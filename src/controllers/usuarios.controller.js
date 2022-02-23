//ALEJANDRO JAVIER GARCIA GARCIA -2017096 - PE6BM2

const Usuarios = require('../models/usuarios.model');
const Empresas = require('../models/empresas.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

//1. Al iniciar la aplicación se creará un usuario administrador con lo siguiente:
//a. Usuario: Admin
//b. UsuarioContraseña: 123456
//3. El administrador puede logearse 
/* | | | | | | | | | | | | | | | | | | | | | LOGIN DEL PROYECTO | | | | | | | | | | | | | | | | | | | | |*/
//********************************* LOGIN ********************************* */
function Login(req, res) {
    var parametros = req.body;

 if(!parametros.email&&!parametros.password) return res.status(500)
 .send({ mensaje: 'Debe llenar los campos necesario'});

    Usuarios.findOne({ email : parametros.email }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{//TRUE OR FALSE
                    if ( verificacionPassword ) {
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }

                    
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contraseña no es válida'});
                    }
                })

        }else {
                Empresas.findOne({ email : parametros.email }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{//TRUE OR FALSE
                    if ( verificacionPassword ) {
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }

                    
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contraseña no es válida'});
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
        }
                })
        }
    })
}

//********************************* EXPORTAR ********************************* */
module.exports ={
    Login,
}