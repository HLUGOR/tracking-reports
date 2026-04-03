/**
 * ExcelValidator.js - Validador de datos de Excel
 */

class ExcelValidator {
  /**
   * Valida un conjunto de filas de datos
   * @param {Array} rows - Array de objetos
   * @param {Object} config - Configuración de validación
   * @returns {Object} - { isValid, errors: [], warnings: [] }
   */
  static validateData(rows, config = {}) {
    const {
      requiredColumns = [],
      minRows = 1,
      maxRows = 1000000,
      columnTypes = {},
    } = config;

    const errors = [];
    const warnings = [];

    // Validar cantidad de filas
    if (rows.length < minRows) {
      errors.push(`Se requieren al menos ${minRows} filas de datos`);
    }
    if (rows.length > maxRows) {
      errors.push(`Máximo ${maxRows} filas permitidas`);
    }

    // Validar columnas requeridas
    if (requiredColumns.length > 0 && rows.length > 0) {
      const firstRow = rows[0];
      const missingCols = requiredColumns.filter(
        (col) => !(col in firstRow)
      );
      if (missingCols.length > 0) {
        errors.push(`Faltan columnas requeridas: ${missingCols.join(', ')}`);
      }
    }

    // Validar tipos de datos en columnas
    rows.forEach((row, idx) => {
      Object.entries(columnTypes).forEach(([col, type]) => {
        if (col in row && row[col]) {
          const value = row[col];
          const isValid = this.validateType(value, type);
          if (!isValid) {
            warnings.push(
              `Fila ${idx + 1}, columna "${col}": valor "${value}" no es de tipo ${type}`
            );
          }
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      totalRows: rows.length,
    };
  }

  /**
   * Valida el tipo de un valor
   * @param {*} value
   * @param {string} type - 'string' | 'number' | 'date' | 'email'
   * @returns {boolean}
   */
  static validateType(value, type) {
    switch (type) {
      case 'number':
        return !isNaN(parseFloat(value)) && isFinite(value);
      case 'date':
        return !isNaN(Date.parse(value));
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'string':
        return typeof value === 'string' || value !== null;
      default:
        return true;
    }
  }

  /**
   * Sanitiza una cadena de texto
   * @param {string} text
   * @returns {string}
   */
  static sanitizeString(text) {
    if (typeof text !== 'string') return text;
    return text.trim().replace(/[\n\r]/g, ' ');
  }

  /**
   * Detecta duplicados en una columna
   * @param {Array} rows
   * @param {string} columnName
   * @returns {Array} - Array de valores duplicados
   */
  static findDuplicates(rows, columnName) {
    const seen = new Map();
    const duplicates = [];

    rows.forEach((row) => {
      const value = row[columnName];
      if (value) {
        if (seen.has(value)) {
          if (!duplicates.includes(value)) {
            duplicates.push(value);
          }
        } else {
          seen.set(value, true);
        }
      }
    });

    return duplicates;
  }
}

export default ExcelValidator;
