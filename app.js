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





//////////////////////////////// CÓDIGO PDF ////////////////////////////////
//Fuente:https://www.youtube.com/watch?v=VR8Q43bJfwc
const fs = require("fs");
const PDFDocument = require("./src/pdfDoc/pdf-kit");

const asignaciones = require("./src/pdfDoc/asignacion.json");

// Creacion de documento
const doc = new PDFDocument();

doc.pipe(fs.createWriteStream(`asignaciones.pdf`));

doc
    .image("./src/pdfDoc/LCS KINAL.png", 10, 10, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Información Asignación.", 110, 57)
    .fontSize(8)
    .text("Laboratorio #2", 200, 65, { align: "right" })
    .text("Alejandro García - 2017096 - PE6BM2", 200, 80, { align: "right" })
    .moveDown();

const table = {
    headers: ["_id","Nombre","", "Email", "Rol", "idCurso", "NombreCurso"],
    rows: []
};

for (const asig of asignaciones) {
    table.rows.push([asig._id, asig.nombre, asig.apellido, asig.email, asig.rol, asig.idCurso, asig.nombreCurso])
}

doc.moveDown().table(table, 10, 125, { width: 590 });

doc.end();