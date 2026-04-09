/**
 * Script para generar el archivo Excel de importación de versiones
 * Ejecutar: node import_versions_template.js
 *
 * Columnas:
 *   A = name       (nombre exacto de la versión)
 *   B = category   (nombre de categoría en el store; vacío = auto-asignar después)
 *   C = platform   (nombre exacto de la plataforma en el store)
 *   D = duration   (minutos explícitos; vacío = detectado por sufijo numérico del nombre)
 */

const XLSX = require('xlsx');

// Versiones LATAM/BRAZIL — duración detectada automáticamente por sufijo (1-4→30, 5-6→60, 9-10→120)
const latBraVersions = [
  // 120 min
  'BRA_ORI_SQZ_HD 10',
  'BRA_SAP_CC_CEN_SQZ_HD 10',
  'BRA_SAP_CC_CEN_SQZ_HD 9',
  'BRA_SAP_CC_CREDITS_HD 10',
  'BRA_SAP_CC_CREDITS_HD 9',
  'BRA_SAP_CC_SQZ_CREDITS_HD 10',
  'BRA_SAP_CC_SQZ_CREDITS_HD 9',
  'BRA_SAP_CC_SQZ_HD 10',
  'BRA_SAP_CC_SQZ_HD 9',
  'BRA_ORI_HD 9',
  'BRA_ORI_SQZ_CREDITS_HD 9',
  'BRA_SAP_CC_CEN_SQZ_CREDITS_HD 9',
  'BRA_SAP_CC_CEN_SQZ_CREDITS_HD 10',
  'BRA_ORI_CC_SQZ_CREDITS_HD 9',
  'BRA_ORI_CC_SQZ_CREDITS_HD 10',
  'LAT_ORI_SQZ_HD 10',
  'LAT_SAP_CC_CEN_SQZ_HD 10',
  'LAT_SAP_CC_CEN_SQZ_HD 9',
  'LAT_SAP_CC_CREDITS_HD 10',
  'LAT_SAP_CC_CREDITS_HD 9',
  'LAT_SAP_CC_SQZ_CREDITS_HD 10',
  'LAT_SAP_CC_SQZ_CREDITS_HD 9',
  'LAT_SAP_CC_SQZ_HD 10',
  'LAT_SAP_CC_SQZ_HD 9',
  'LAT_ORI_HD 9',
  'LAT_ORI_SQZ_CREDITS_HD 9',
  'LAT_SAP_CC_CEN_SQZ_CREDITS_HD 9',
  'LAT_SAP_CC_CEN_SQZ_CREDITS_HD 10',
  'LAT_ORI_CC_SQZ_CREDITS_HD 9',
  'LAT_ORI_CC_SQZ_CREDITS_HD 10',
  'LAT_ORI_CEN_SQZ_CREDITS_HD 9',
  // 60 minutos
  'BRA_ORI_HD 5',
  'BRA_ORI_HD 6',
  'BRA_SAP_CC_HD 5',
  'BRA_SAP_CC_HD 6',
  'BRA_SAP_CC_SQZ_HD 5',
  'BRA_SAP_CC_SQZ_HD 6',
  'LAT_ORI_HD 5',
  'LAT_ORI_HD 6',
  'LAT_SAP_CC_HD 5',
  'LAT_SAP_CC_HD 6',
  'LAT_SAP_CC_SQZ_HD 5',
  'LAT_SAP_CC_SQZ_HD 6',
  // 30 minutos
  'BRA_ORI_SQZ_HD 4',
  'BRA_SAP_CC_HD 3',
  'BRA_SAP_CC_HD 4',
  'BRA_ORI_SQZ_HD 3',
  'BRA_ORI_HD 3',
  'BRA_ORI_HD 4',
  'LAT_ORI_HD 1 AXN',
  'LAT_ORI_HD 1 SONY',
  'LAT_ORI_SQZ_HD 4',
  'LAT_SAP_CC_HD 3',
  'LAT_SAP_CC_HD 4',
  'LAT_ORI_SQZ_HD 3',
  'LAT_ORI_HD 3',
  'LAT_ORI_HD 4',
  'BRA_ORI_SQZ_HD 2',
];

// Versiones IBERIA — duración explícita (nombres no tienen sufijo numérico estándar)
const iberiaVersions = [
  // 60 minutos
  { name: 'e- F HD4Bsubt-OpSCr',   duration: 60 },
  { name: 'p- FHD4BVOAFRISCTUR',    duration: 60 },
  { name: 'p- FHD4BVOAFRISCr',      duration: 60 },
  { name: 'e- FHD4Bsubt-OpSCAD',    duration: 60 },
  // 120 minutos
  { name: 'e- FCHD1BSubtOpSCr',     duration: 120 },
  { name: 'p- F HD Ci5BAFRISCr',    duration: 120 },
  { name: 'p- FHD5BlocuAFRISCr',    duration: 120 },
  { name: 'p- F HD Ci6BAFRISCr',    duration: 120 },
  { name: 'e- FCHD1BSubt-OpSCr',    duration: 120 },
];

// Construir filas: [name, category, platform, duration]
const dataRows = [
  // LATAM/BRAZIL — detectar plataforma por prefijo, duración auto por sufijo
  ...latBraVersions.map((v) => {
    const platform = v.includes('LAT_') ? 'LATAM' : (v.includes('BRA_') ? 'BRAZIL' : 'LATAM');
    return [v, '', platform, ''];
  }),
  // IBERIA — plataforma e duración explícitas
  ...iberiaVersions.map(({ name, duration }) => [name, '', 'IBERIA', duration]),
];

// Crear datos para Excel con encabezados
const data = [
  ['name', 'category', 'platform', 'duration'],
  ...dataRows,
];

// Crear worksheet y workbook
const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();

// Ancho de columnas
ws['!cols'] = [{ wch: 40 }, { wch: 25 }, { wch: 15 }, { wch: 10 }];

// Agregar worksheet
XLSX.utils.book_append_sheet(wb, ws, 'Versiones');

// Escribir archivo
const filename = 'import_versions.xlsx';
XLSX.writeFile(wb, filename);

const total = dataRows.length;
console.log(`✅ Archivo generado: ${filename}`);
console.log(`📊 Total de versiones: ${total} (${latBraVersions.length} LAT/BRA + ${iberiaVersions.length} IBERIA)`);
console.log(`💾 Ubicación: ${process.cwd()}/${filename}`);
