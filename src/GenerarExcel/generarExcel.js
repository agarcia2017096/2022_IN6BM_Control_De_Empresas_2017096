const ExcelJS = require('exceljs');
const fs = require("fs");
const Empresas = require("../models/empresas.model");
const Empleados = require("../models/empleados.model");



function CrearExcel(nombreEmpresa, arrayEmpleados){
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet('Empresa');

    sheet.columns = [
        {header: 'nombre', key: 'nombre'},
        {header: 'apellido', key: 'apellido'},
        {header: 'email', key: 'email'},
        {header: 'telefono', key: 'telefono'},
        {header: 'departamento', key: 'departamento'},
        {header: 'puesto', key: 'puesto'},
    ]

    for (let i = 0; i< arrayEmpleados.length; i++) {

        sheet.addRow({
            nombre: arrayEmpleados[i].nombre,
            apellido: arrayEmpleados [i]. apellido,
            email: arrayEmpleados [i]. email,
            telefono: arrayEmpleados [i]. telefono,
            departanento: arrayEmpleados[i].departanento,
            puesto: arrayEmpleados[i].puesto,
        })
    }

    sheet.addRow({
        nombre:'',
        apellido:'',
        email:'',
        telefono:'',
        puesto:'',
        departasento:'',
    })


    
    sheet.addRow({
        nombre:'Cantidad de Empleados',
        apellido:arrayEmpleados.length,
        email:'',
        telefono:'',
        puesto:'',
        departasento:'',
    })

 
        sheet.columns.forEach(column => {

            var Acumulado = 0;
           column.eachCell({ includeEmpty: true})
            var columnLength = cell.value.length;
            if (columnLength > Acumulado) {
               Acumulado = columnlength;
            }
        
        })


        sheet.getRow(1). font = { 
            bold: true,
            color: {argb: 'ffffff'}
         }
         sheet.getRow(1).fill = {
             type: 'pattern',
            pattern: 'solid',
            bgColor: {argb: 'ad2f33'}
         }

         sheet.workbook.xlsx.writeFile('./src/GenerarExcel')

}

module.exports = {
    CrearExcel
  };