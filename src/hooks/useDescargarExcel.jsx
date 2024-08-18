import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

// Función para obtener el valor anidado de un objeto
const getNestedValue = (obj, key) => {
    return key.split('.').reduce((o, i) => (o ? o[i] : ''), obj);
};

const exportToExcel = async (casos, selectedFields) => {
    // Crea un nuevo libro de trabajo y una nueva hoja
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Procesos');

    // Define los encabezados de columna basados en selectedFields
    const headers = selectedFields;

    // Agregar encabezados solo para los campos seleccionados
    worksheet.addRow(headers);

    // Estilo para los encabezados
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 12 };
    headerRow.alignment = { horizontal: 'center' };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' } // Color de fondo amarillo para los encabezados
    };

    // Rellenar datos
    casos.forEach(caso => {
        const row = headers.map(header => getNestedValue(caso, header));
        worksheet.addRow(row);
    });

    // Ajusta el tamaño de las columnas para adaptarse al contenido
    worksheet.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => Math.max(max, value ? value.toString().length : 0), 0);
        column.width = maxLength < 10 ? 10 : maxLength + 10;
    });

    // Genera un buffer del archivo
    const buffer = await workbook.xlsx.writeBuffer();

    // Guarda el archivo
    saveAs(new Blob([buffer]), 'casos.xlsx');
};

export default exportToExcel;
