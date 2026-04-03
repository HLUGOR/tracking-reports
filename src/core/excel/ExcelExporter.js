/**
 * ExcelExporter.js - Exportador de datos a múltiples formatos
 */

import ExcelJS from 'exceljs';

class ExcelExporter {
  /**
   * Exporta datos a archivo Excel con estilos
   * @param {Array} data - Array de objetos
   * @param {Object} options - { title, fileName, columnWidths, sheetName }
   * @returns {Promise<void>}
   */
  static async exportToExcel(data, options = {}) {
    const {
      title = 'Reporte',
      fileName = `reporte_${new Date().toISOString().split('T')[0]}.xlsx`,
      columnWidths = {},
      sheetName = 'Datos',
    } = options;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(sheetName);

      // Agregar título
      worksheet.insertRows(1, 1);
      const titleCell = worksheet.getCell('A1');
      titleCell.value = title;
      titleCell.font = { bold: true, size: 14, color: { argb: 'FF1F4E78' } };
      titleCell.alignment = { horizontal: 'left', vertical: 'center' };
      worksheet.mergeCells('A1:Z1');
      worksheet.getRow(1).height = 20;

      // Headers
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const headerRow = worksheet.addRow(headers);

        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1F4E78' },
        };
        headerRow.alignment = { horizontal: 'center', vertical: 'center' };

        // Configurar ancho de columnas
        headers.forEach((header, idx) => {
          const width = columnWidths[header] || 15;
          worksheet.getColumn(idx + 1).width = width;
        });

        // Agregar datos
        data.forEach((row) => {
          worksheet.addRow(Object.values(row));
        });

        // Formato de números y fechas
        worksheet.eachRow({ startRow: 3 }, (row) => {
          row.eachCell((cell) => {
            const header = headers[cell.col - 1];

            if (header && header.toLowerCase().includes('horas')) {
              cell.numFmt = '0.00';
            }
            if (header && header.toLowerCase().includes('fecha')) {
              cell.numFmt = 'dd/mm/yyyy';
            }
            if (header && header.toLowerCase().includes('dinero')) {
              cell.numFmt = '$#,##0.00';
            }
          });
        });
      }

      // Descargar
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      this.downloadBlob(blob, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  /**
   * Exporta a JSON
   * @param {Array} data
   * @param {string} fileName
   * @returns {void}
   */
  static exportToJSON(data, fileName = 'reporte.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    this.downloadBlob(blob, fileName);
  }

  /**
   * Exporta a CSV
   * @param {Array} data
   * @param {string} fileName
   * @returns {void}
   */
  static exportToCSV(data, fileName = 'reporte.csv') {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((h) => {
            const val = row[h];
            // Escapar comillas y valores con comas
            if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
              return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, fileName);
  }

  /**
   * Descarga blob con nombre de archivo
   * @param {Blob} blob
   * @param {string} fileName
   */
  static downloadBlob(blob, fileName) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export default ExcelExporter;
