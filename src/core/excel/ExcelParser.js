/**
 * ExcelParser.js - Parseador de archivos Excel
 * Convierte archivos .xlsx en arrays de objetos JavaScript
 */

import * as XLSX from 'xlsx';

class ExcelParser {
  /**
   * Lee archivo Excel y convierte a array de objetos
   * @param {File} file - Archivo subido por usuario
   * @param {Object} options - Opciones { headerRow: 0, trimValues: true }
   * @returns {Promise<{rows: Array, headers: Array, fileName: string}>}
   */
  static async parseFile(file, options = {}) {
    const { headerRow = 0, trimValues = true, sheetName = 0 } = options;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          // Seleccionar hoja
          const sheet = workbook.Sheets[
            sheetName === 0 ? workbook.SheetNames[0] : sheetName
          ];

          if (!sheet) {
            reject(new Error('No se encontró la hoja especificada'));
            return;
          }

          // Convertir a JSON (con headers en primera fila)
          const rows = XLSX.utils.sheet_to_json(sheet, {
            defval: '',
            header: 1, // Retorna array de arrays
          });

          if (rows.length === 0) {
            reject(new Error('El archivo está vacío'));
            return;
          }

          // Headers (primera fila)
          const headers = rows[headerRow] || [];

          // Datos (desde headerRow+1 en adelante)
          const dataRows = rows.slice(headerRow + 1).map((row) => {
            const obj = {};
            headers.forEach((header, idx) => {
              const key = trimValues && typeof header === 'string' 
                ? header.trim() 
                : header;
              const value = row[idx];
              obj[key] = trimValues && typeof value === 'string'
                ? value.trim()
                : value;
            });
            return obj;
          });

          resolve({
            rows: dataRows,
            headers: headers,
            fileName: file.name,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
            rowCount: dataRows.length,
            sheetNames: workbook.SheetNames,
          });
        } catch (error) {
          reject(new Error(`Error al procesar Excel: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Valida que el Excel tenga las columnas requeridas
   * @param {Array} headers - Headers del Excel
   * @param {Array} requiredHeaders - Columnas obligatorias
   * @returns {Object} - { isValid: bool, missingHeaders: Array }
   */
  static validateHeaders(headers, requiredHeaders = []) {
    const normalized = headers.map((h) =>
      typeof h === 'string' ? h.toLowerCase().trim() : String(h)
    );

    const missing = requiredHeaders.filter(
      (req) =>
        !normalized.includes(
          typeof req === 'string' ? req.toLowerCase().trim() : String(req)
        )
    );

    return {
      isValid: missing.length === 0,
      missingHeaders: missing,
      headers: headers,
    };
  }

  /**
   * Obtiene lista de hojas disponibles en workbook
   * @param {File} file
   * @returns {Promise<Array>}
   */
  static getSheetNames(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          resolve(workbook.SheetNames);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
}

export default ExcelParser;
