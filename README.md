# TrackingReports - Aplicación Standalone

🚀 Aplicación React para procesar reportes, librerías y métricas **sin servidor**.

## ✨ Características

- ✅ **Sin servidor** - 100% funciona en el navegador
- ✅ **Offline first** - Funciona sin Internet
- ✅ **Carga Excel** - Desde la interfaz del navegador
- ✅ **Reportes instantáneos** - Cálculos < 1 segundo
- ✅ **Múltiples exportaciones** - Excel, JSON, CSV, PDF
- ✅ **Gestión de Librerías** - Jerárquica (Lógica → Plataforma → Categoría → Versión)
- ✅ **Privacidad total** - Los datos nunca salen del navegador

## 📦 Stack Tecnológico

- **Frontend:** React 18.3.1
- **Estado:** Zustand
- **Excel I/O:** XLSX + ExcelJS
- **Gráficos:** Chart.js 4.5
- **Persistencia:** IndexedDB + localStorage
- **Fechas:** date-fns

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tuusuario/tracking-reports.git
cd tracking-reports

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

### Build para Producción

```bash
npm run build
```

Genera carpeta `/build` lista para desplegar en cualquier servidor estático o CDN.

## 📚 Documentación

Ver carpeta `/docs/`:
- `GUIA_INICIO.md` - Guía paso a paso
- `ARQUITECTURA.md` - Visión técnica
- `API_MODULOS.md` - Dokumentación de módulos
- `TESTING.md` - Estrategia de testing

## 🏗️ Estructura de Carpetas

```
tracking-reports/
├── src/
│   ├── core/              # Lógica sin UI
│   │   ├── excel/         # Parsing y validación
│   │   ├── reportEngine/  # Cálculo de reportes
│   │   ├── dataStorage/   # Persistencia local
│   │   └── utils/         # Funciones ayuda
│   ├── store/             # Estado global (Zustand)
│   ├── components/        # Componentes React
│   ├── styles/            # CSS
│   └── App.jsx
├── public/                # Assets estáticos
├── docs/                  # Documentación
└── package.json
```

## 🔄 Flujos Principales

### Cargar Excel → Generar Reporte

```
1. Usuario selecciona archivo Excel
2. ExcelParser.parseFile() → convierte a array
3. ExcelValidator.validateColumns() → valida estructura
4. Estado almacenado en excelStore
5. EditorReportsEngine.calculateByEditor() → calcula en cliente
6. Reportes se muestran en < 1 segundo
7. ExcelExporter.exportToExcel() → descargar resultado
```

### Gestionar Librerías

```
1. HierarchicalDataManager → agrupa datos
2. localStorage/IndexedDB → persiste
3. Cambios guardan automáticamente
4. Usuario puede exportar/importar JSON
```

## 🔐 Privacidad y Seguridad

✅ **100% privacidad:** Los datos del Excel nunca viajan al servidor  
✅ **Almacenamiento local:** Datos guardados en IndexedDB del navegador  
✅ **Sin dependencias externas:** Cero Http calls a APIs externas  
✅ **Validación:** Todas las entradas validadas en cliente

## 📊 FASE 1: MVP (Completado)

- [x] Setup inicial
- [x] ExcelParser + ExcelValidator
- [x] EditorReportsEngine
- [x] UI básica
- [x] Exportación Excel/JSON
- [x] Persistencia local

## 📋 FASE 2: Completo (Próxima)

- [ ] Gestión de Librerías
- [ ] Reportes de Producción
- [ ] Cálculo de Métricas
- [ ] Gráficos mejorados
- [ ] Exportación PDF

## 🧪 Testing

```bash
# Correr tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm test -- --coverage
```

## 📞 Soporte y Feedback

Para reportar bugs o sugerir features, abre un [GitHub Issue](https://github.com/tuusuario/tracking-reports/issues)

## 📄 Licencia

MIT

---

**Versión:** 1.0.0  
**Estado:** ALPHA (MVP)  
**Última actualización:** 2 de abril de 2026  
**Autor:** Tu Nombre
