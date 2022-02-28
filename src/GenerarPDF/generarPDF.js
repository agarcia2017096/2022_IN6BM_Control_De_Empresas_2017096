const fs = require("fs");
const PDFDocument = require("pdfkit");
const Empresa = require("../models/empresa.model");
const Empleado = require("../models/empleado.model");
const imagen = "./src/picture/tienda-de-aplicaciones.png"


function empresaGenerar(req, res){
  
  Empresa.find({empresa:req.user.empresa },(err, empresaEncontrada)=>{
    if(err) return res.status(500).send({ error: `Error en la peticion ${err}`})
    if(empresaEncontrada !== null){
        var nombreDoc;
        empresaEncontrada.forEach(element=>{
          nombreDoc= element.empresa;
        })
        // ruta
        var path = "./src/docPDF/"+nombreDoc+".pdf";
        Empleado.find({empresa: req.user.empresa},(err, empleadosEncontrados)=>{
          if(err) return res.status(500).send({ error: `Error en la peticion ${err}`})
          if(empleadosEncontrados === null) return res.status(404)
          .send({error: `Error al entrar al empleado`})
          
          createInvoice(empresaEncontrada,empleadosEncontrados, path);
          return res.status(200).send({empresa: "pdf generado"})
        })
    }
  })
}


function createInvoice(empresa,empleados, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
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
    .image(imagen, 30, 45, { width: 70 })
    .fillColor("#444444")
    .fontSize(30)
    .font('Helvetica-BoldOblique')
    .text(element.empresa, 110, 57)
    .fontSize(10)
    .font('Times-Roman')
    .text(formatDate(new Date()), 200, 50, { align: "right" })
    .text("Cd. Guatemala", 200, 65, { align: "right" })
    .moveDown();
  })
}

function generateCustomerInformation(doc, empresa) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Registro De Empleados", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;
  empresa.forEach(element=>{
    doc
      .fontSize(12)
      .text("Empresa:", 50, customerInformationTop)
      .font("Helvetica")
      .text(element.empresa, 150, customerInformationTop)
      .text("Direccion:", 50, customerInformationTop + 15)
      .text(element.direccion, 150, customerInformationTop + 15)
      .text("Web:", 50, customerInformationTop + 30)
      .text(element.empresa+".com",150,customerInformationTop + 30)
      .moveDown();
  })

  generateHr(doc, 252);
}

/****************** Inconcluso   ******************/ 
function generateInvoiceTable(doc, empleados) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold")
       .fontSize(15)
       .fillColor("#0x06327D");
    generateTableRow(
      doc,
      invoiceTableTop,
      "Nombre",
      "Apellido",
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
        item.departamento,
        item.puesto
      );

      generateHr(doc, position + 20);
    }
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Carlos Josué Levy Aceituno Pocasangre - 2017478 - IN6BM1",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  nombre,
  apellido,
  departamento,
  puesto
) {
  doc
    .fontSize(10)
    .text(nombre, 70, y)
    .text(apellido, 190, y)
    .text(departamento, 290, y, { width: 90, align: "center" })
    .text(puesto, 430, y, { width: 90, align: "center" })
}

function generateHr(doc, y) {
  doc
    .strokeColor("#0x365B6D")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;

}

module.exports = {
  empresaGenerar
};