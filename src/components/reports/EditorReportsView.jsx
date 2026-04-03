/**
 * EditorReportsView.jsx - Vista de reportes por editor
 */

import React, { useState, useEffect } from 'react';
import excelStore from '../../store/excelStore';
import EditorReportsEngine from '../../core/reportEngine/EditorReportsEngine';
import ExcelExporter from '../../core/excel/ExcelExporter';
import DataTable from '../shared/DataTable';
import './EditorReportsView.css';

function EditorReportsView() {
  const excelRows = excelStore((state) => state.excelRows);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [columnConfig, setColumnConfig] = useState({
    editorColumn: 'editor',
    hoursColumn: 'horas',
    dateColumn: 'fecha',
  });

  /**
   * Genera reporte
   */
  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      alert('Selecciona ambas fechas');
      return;
    }

    setLoading(true);

    try {
      const start = new Date(startDate);
      const end = new Date(endDate + 'T23:59:59');

      const result = EditorReportsEngine.calculateByEditor(
        excelRows,
        start,
        end,
        columnConfig
      );

      setReportData(result);
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Exporta reporte
   */
  const handleExport = async (format) => {
    if (!reportData) return;

    const fileName = `reporte_editores_${startDate}_${endDate}`;

    try {
      if (format === 'excel') {
        await ExcelExporter.exportToExcel(reportData.editors, {
          title: `Reporte de Horas por Editor (${startDate} a ${endDate})`,
          fileName: `${fileName}.xlsx`,
          columnWidths: {
            editor: 20,
            totalHours: 15,
            tasksCompleted: 15,
            averageHoursPerTask: 20,
            productivity: 15,
          },
        });
      } else if (format === 'json') {
        ExcelExporter.exportToJSON(reportData, `${fileName}.json`);
      } else if (format === 'csv') {
        ExcelExporter.exportToCSV(reportData.editors, `${fileName}.csv`);
      }
    } catch (error) {
      console.error('Error exportando:', error);
      alert('Error: ' + error.message);
    }
  };

  // Auto-generar reporte al montar
  useEffect(() => {
    if (excelRows.length > 0) {
      handleGenerateReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excelRows.length]);

  return (
    <div className="editor-reports">
      <h2>📊 Reportes por Editor</h2>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Fecha Inicio:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="filter-group">
          <label>Fecha Fin:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="filter-group">
          <label>Columna Editor:</label>
          <input
            type="text"
            value={columnConfig.editorColumn}
            onChange={(e) =>
              setColumnConfig({
                ...columnConfig,
                editorColumn: e.target.value,
              })
            }
            disabled={loading}
            placeholder="ej: editor"
          />
        </div>

        <div className="filter-group">
          <label>Columna Horas:</label>
          <input
            type="text"
            value={columnConfig.hoursColumn}
            onChange={(e) =>
              setColumnConfig({
                ...columnConfig,
                hoursColumn: e.target.value,
              })
            }
            disabled={loading}
            placeholder="ej: horas"
          />
        </div>

        <button
          onClick={handleGenerateReport}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? '⏳ Generando...' : '📈 Generar Reporte'}
        </button>
      </div>

      {/* Report Results */}
      {reportData && (
        <div className="report-results">
          {/* Summary Stats */}
          <div className="summary">
            <h3>📋 Resumen</h3>
            <div className="stats-grid">
              <div className="stat">
                <div className="label">Total Editores</div>
                <div className="value">{reportData.summary.totalEditors}</div>
              </div>
              <div className="stat">
                <div className="label">Total Horas</div>
                <div className="value">{reportData.summary.totalHours}</div>
              </div>
              <div className="stat">
                <div className="label">Promedio por Editor</div>
                <div className="value">
                  {reportData.summary.averageHoursPerEditor}
                </div>
              </div>
              <div className="stat">
                <div className="label">Total Tareas</div>
                <div className="value">{reportData.summary.totalTasks}</div>
              </div>
              <div className="stat">
                <div className="label">Promedio Horas/Tarea</div>
                <div className="value">
                  {reportData.summary.averageHoursPerTask}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-section">
            <h3>📊 Detalle por Editor</h3>
            <DataTable
              columns={[
                { key: 'editor', label: 'Editor' },
                { key: 'totalHours', label: 'Total Horas' },
                { key: 'tasksCompleted', label: 'Tareas' },
                { key: 'averageHoursPerTask', label: 'Promedio Horas/Tarea' },
                { key: 'productivity', label: 'Productividad %' },
              ]}
              data={reportData.editors}
            />
          </div>

          {/* Export Options */}
          <div className="export-section">
            <h3>💾 Exportar Reporte</h3>
            <div className="export-buttons">
              <button
                onClick={() => handleExport('excel')}
                className="btn btn-success"
              >
                📥 Descargar Excel
              </button>
              <button
                onClick={() => handleExport('json')}
                className="btn btn-info"
              >
                📝 Descargar JSON
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="btn btn-warning"
              >
                📊 Descargar CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && !reportData && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Generando reporte...</p>
        </div>
      )}
    </div>
  );
}

export default EditorReportsView;
