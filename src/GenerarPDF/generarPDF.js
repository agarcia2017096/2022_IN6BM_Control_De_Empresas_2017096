//ALEJANDRO JAVIER GARCIA GARCIA -2017096 - PE6BM2

const fs = require("fs");
const PDFDocument = require("pdfkit");
const Empresas = require("../models/empresas.model");
const Empleados = require("../models/empleados.model");
const imagen = "./src/GenerarPDF/LCS KINAL.png"


function empresasPDF(req, res){
  if ( req.user.rol == "ROL_ADMINISTRADOR" ) return res.status(500)
  .send({ mensaje: 'No tiene acceso a generar PDF de empresas. Únicamente el cada empresa puede hacerlo'});


  Empresas.findOne({_id:req.user.sub},(err,nombreIdEncontrado)=>{
    Empresas.find({_id:req.user.sub },(err, empresaEncontrada)=>{
      if(err) return res.status(500).send({ error: `Error en la peticion ${err}`})
      if(empresaEncontrada !== null){
          var nombreDoc=nombreIdEncontrado.nombreEmpresa;

          // DIRECCIONAMIENTO
          var path = "./src/docPDF/"+nombreDoc+".pdf";
          Empleados.find({idEmpresa: req.user.sub},(err, empleadosEncontrados)=>{
            if(err) return res.status(500).send({ error: `Error en la peticion ${err}`})
            if(empleadosEncontrados === null) return res.status(404)
            .send({error: `Error al entrar al empleado`})
            
            createInvoice(empresaEncontrada,empleadosEncontrados, path);
            return res.status(200).send({empresa: "El PDf de la empresa se ha creado exitosamente"})
          })
      }
    })
  })

}


function createInvoice(empresa,empleados, path) {
  let doc = new PDFDocument({ size: "A4", margin: 20 });
  generateHeader(doc,empresa);
  generateCustomerInformation(doc, empresa);
  generateInvoiceTable(doc, empleados);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}


function generateHeader(doc,empresa) {
  empresa.forEach(element=>{
    doc
     .image(imagen, 70, 45, { width: 60 })
    .fillColor("#212F3C")
    .fontSize(30)
    .font('Helvetica-BoldOblique')
    //.text(element.empresa, 110, 57)
    .fontSize(10)
    .font('Times-Roman')
    .text(formatDate(new Date()), 220, 50, { align: "right" })
    .text("Control de Empresas", 220, 90, { align: "right" })
    .text("Alejandro García - 2017096", 220, 110, { align: "right" })
    .text(" PE6BM2", 220, 130, { align: "right" })


    .moveDown();
  })
}

function generateCustomerInformation(doc, empresa) {
  doc
    .fillColor("#444444")
    .fontSize(24)
    .font('Times-Roman')
    .text("Registro de Empleados", 175, 60),{ align: "center" };

  generateHr(doc, 155);

  const informacionPrimaria = 168;
  empresa.forEach(element=>{
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Empresa:", 70, informacionPrimaria)
      .font("Helvetica")
      .text(element.nombreEmpresa, 190, informacionPrimaria)
      .font("Helvetica-Bold")
      .text("Actividad Economica:", 70, informacionPrimaria + 15)
      .font("Helvetica")
      .text(element.actividadEconomica, 190, informacionPrimaria + 15)
      .font("Helvetica-Bold")
      .text("Email:", 70, informacionPrimaria + 30)
      .font("Helvetica")
      .text(element.email,190,informacionPrimaria + 30)
      .image("./src/GenerarPDF/IconoEMpresa.png", 475, 157, { width: 60, align: "right"})
      .moveDown();
  })

  generateHr(doc, 220);
}

function generateInvoiceTable ( doc, empleados) {
    let i;
    const invoiceTableTop = 250;

    doc.font("Helvetica-Bold")
       .fontSize(15)
       .fillColor("#154360");
       generateTableRow(
      doc,
      invoiceTableTop,
      "Nombre",
      "Apellido",
      "Email",
      "Telefono",
      "Departamento",
      "Puesto"
      );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica")
       .fontSize(10)
       .fillColor("black");

        for (i = 0; i < empleados.length; i++) {
          const item = empleados[i];
          const position = invoiceTableTop + (i + 1) * 30;
    
          generateTableRow(
            doc,
            position,
            item.nombre,
            item.apellido,
            item.email,
            item.telefono,
            item.departamento,
            item.puesto
          );
    
          generateHr(doc, position + 20);
        }



}

function generateFooter(doc) {
  doc
    .image("./src/GenerarPDF/LLS KINAL.png", 20, 750, { width: 70, align: "left"})
    .fontSize(10)
    .font("Helvetica")
    .text(
      "Sexto Perito en Informática - Ciclo Diversificado 2022",
      50,
      760,
      { align: "center", width: 500 }
    )
    .text("Ciudad de Guatemala", 50, 780, { align: "center" })
    .image("./src/GenerarPDF/LLS KINAL.png", 480, 750, { width: 70, align: "right"})

}

function generateTableRow(
  doc,
  y,
  nombre,
  apellido,
  email,
  telefono,
  departamento,
  puesto
) {
  doc
    .fontSize(10)
    .text(nombre, 25, y)
    .text(apellido, 95, y)
    .text(email, 160, y)
    .text(telefono, 315, y)
    .text(departamento, 390, y)
    .text(puesto, 506, y)
}

function generateHr(doc, y) {
  doc
    .strokeColor("#1C2833")
    .lineWidth(1)
    .moveTo(15, y)
    .lineTo(580, y)
    .stroke();
}

function formatDate(date) {
  
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return day + "/" + month + "/" + year;

}

module.exports = {
  empresasPDF
};