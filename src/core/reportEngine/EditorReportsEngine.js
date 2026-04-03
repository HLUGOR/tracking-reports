/**
 * EditorReportsEngine.js - Motor de cálculo de reportes por editor
 */

class EditorReportsEngine {
  /**
   * Calcula horas por editor en rango de fechas
   * @param {Array} rows - Datos del Excel
   * @param {Date} startDate - Fecha inicio
   * @param {Date} endDate - Fecha fin
   * @param {Object} filters - { editorColumn, hoursColumn, dateColumn }
   * @returns {Object}
   */
  static calculateByEditor(rows, startDate, endDate, filters = {}) {
    const {
      editorColumn = 'editor',
      hoursColumn = 'horas',
      dateColumn = 'fecha',
    } = filters;

    // Filtrar por rango de fechas
    const filtered = rows.filter((row) => {
      const dateStr = row[dateColumn];
      if (!dateStr) return false;
      
      const rowDate = this.parseDate(dateStr);
      return rowDate >= startDate && rowDate <= endDate;
    });

    // Agrupar por editor
    const grouped = {};
    filtered.forEach((row) => {
      const editor = row[editorColumn] || 'Sin asignar';
      const hours = parseFloat(row[hoursColumn]) || 0;

      if (!grouped[editor]) {
        grouped[editor] = {
          totalHours: 0,
          taskCount: 0,
          tasks: [],
        };
      }

      grouped[editor].totalHours += hours;
      grouped[editor].taskCount += 1;
      grouped[editor].tasks.push(row);
    });

    // Transformar a array y calcular stats
    const result = Object.entries(grouped)
      .map(([editor, data]) => ({
        editor,
        totalHours: parseFloat(data.totalHours.toFixed(2)),
        tasksCompleted: data.taskCount,
        averageHoursPerTask: parseFloat(
          (data.totalHours / data.taskCount).toFixed(2)
        ),
        productivity: this.calculateProductivity(
          data.totalHours,
          data.taskCount
        ),
      }))
      .sort((a, b) => b.totalHours - a.totalHours);

    // Estadísticas globales
    const totalHours = result.reduce((sum, e) => sum + e.totalHours, 0);
    const totalTasks = result.reduce((sum, e) => sum + e.tasksCompleted, 0);

    return {
      period: { start: startDate, end: endDate },
      editors: result,
      summary: {
        totalEditors: result.length,
        totalHours: parseFloat(totalHours.toFixed(2)),
        averageHoursPerEditor: parseFloat((totalHours / result.length).toFixed(2)),
        totalTasks: totalTasks,
        averageHoursPerTask: parseFloat((totalHours / totalTasks).toFixed(2)),
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Calcula productividad (0-100)
   * @param {number} totalHours
   * @param {number} taskCount
   * @returns {number}
   */
  static calculateProductivity(totalHours, taskCount) {
    const expectedHoursPerTask = 8; // Horas esperadas por tarea
    const efficiency = (totalHours / (taskCount * expectedHoursPerTask)) * 100;
    return Math.min(100, Math.max(0, efficiency)).toFixed(0);
  }

  /**
   * Parsea una cadena de fecha a Date
   * @param {string} dateStr
   * @returns {Date}
   */
  static parseDate(dateStr) {
    if (!dateStr) return new Date(0);

    // Intenta varios formatos
    let date;

    // Formato ISO: YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      date = new Date(dateStr + 'T00:00:00');
    }
    // Formato DD/MM/YYYY
    else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/');
      date = new Date(year, month - 1, day);
    }
    // Formato MM/DD/YYYY
    else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
      const [month, day, year] = dateStr.split('/');
      date = new Date(year, month - 1, day);
    }
    // ISO con hora
    else if (dateStr.includes('T')) {
      date = new Date(dateStr);
    }
    // Intenta parsing automático
    else {
      date = new Date(dateStr);
    }

    return isNaN(date.getTime()) ? new Date(0) : date;
  }
}

export default EditorReportsEngine;
