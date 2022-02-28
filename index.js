//ALEJANDRO JAVIER GARCIA GARCIA -2017096 - PE6BM2

const mongoose = require('mongoose');
const app = require('./app');
const Usuarios = require('./src/models/usuarios.model');
const bcrypt = require("bcrypt-nodejs");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/IN6BM2_CONTROL_EMPRESA_2017096',{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log('Se encuentra conectado a la base de datos.');

    app.listen(3000,function(req, res){
        console.log('IN6BM, eL servidor esta corriendo correctamente (puerto 3000))');
        RegistrarAdministradorDefault();
        createInvoice()
    
    })
}).catch(error =>console.log(error))

//********************** 1. REGISTRAR ADMINISTRADOR POR DEFECTO ************** */
function RegistrarAdministradorDefault(req, res) {

    Usuarios.findOne({email:"Admin"}, (err, AdministradorEncontrados) => {
        if(!AdministradorEncontrados==null){
            console.log('El administrador ya se encuentra registrado')
        }

        if(err) console.log('error en la peticion de MongoDB')

        if(!AdministradorEncontrados){
            //Agregar por defecto
            var usuarioModel = new Usuarios();
                usuarioModel.nombre = "Admin";
                   usuarioModel.apellido = "Admin";
                   usuarioModel.password = "123456";
                    usuarioModel.email = "Admin";
                    usuarioModel.rol = 'ROL_ADMINISTRADOR';
                    usuarioModel.imagen = null;
        
                    Usuarios.find({ email: "Admin"}, (err, usuarioEncontrado) => {
                        if ( usuarioEncontrado.length == 0 ) {
        
                            bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
                                usuarioModel.password = passwordEncriptada;
        
                                usuarioModel.save((err, usuarioGuardado) => {
                                    if (err) console.log('Error en la peticion');
                                    if(!usuarioGuardado) console.log('Error al agregar el Usuario') 
                                        console.log('--El administrador se ha registrado registrado--')

                                });
                            });                    
                        }
                    })        
        }else {
            console.log('El usuario por defecto ya está registrado' );
        }

    })
}


const fs = require('fs');
const PDFDocument = require('pdfkit');

function createInvoice(invoice, path) {
	let doc = new PDFDocument({ margin: 50 });

	generateHeader(doc);
	generateFooter(doc);

	doc.end();
	doc.pipe(fs.createWriteStream(path));

}

const req = require("express/lib/request");

function generateHeader(doc) {
	doc    .image("./src/pdfDoc/LCS KINAL.png", 10, 10, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("CONTROL EMPRESAS.", 110, 57)
    .fontSize(8)
    .text("Proyecto Taller", 200, 65, { align: "right" })
    .text("Alejandro García - 2017096 - PE6BM2", 200, 80, { align: "right" })
    .moveDown();
}

function generateFooter(doc) {
	doc
    .image("./src/pdfDoc/LLS KINAL.png", 10, 10, { width: 50 })
    .fontSize(
		10,
	).text(
		'Centro Educativo Laboraral Kinal',
		50,
		780,
		{ align: 'center', width: 500 },
	);
}