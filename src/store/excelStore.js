/**
 * excelStore.js - Estado global con Zustand
 * Maneja: archivos Excel cargados, datos, validaciones
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const excelStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        excelFiles: [],
        currentFileId: null,
        excelRows: [],
        headers: [],
        columnMappings: {},
        loading: false,
        error: null,
        validationResult: null,

        // Actions
        setExcelFile: (file) =>
          set((state) => ({
            excelFiles: [...state.excelFiles, file],
            currentFileId: file.id,
          })),

        setExcelRows: (rows) => set({ excelRows: rows }),

        setHeaders: (headers) => set({ headers }),

        setColumnMapping: (mapping) =>
          set((state) => ({
            columnMappings: { ...state.columnMappings, ...mapping },
          })),

        setLoading: (loading) => set({ loading }),

        setError: (error) => set({ error }),

        setValidationResult: (result) => set({ validationResult: result }),

        clearExcelData: () =>
          set({
            excelRows: [],
            headers: [],
            excelFiles: [],
            currentFileId: null,
            error: null,
            validationResult: null,
          }),

        getExcelDataById: (fileId) => {
          const file = get().excelFiles.find((f) => f.id === fileId);
          return file;
        },

        getRowCount: () => get().excelRows.length,
      }),
      {
        name: 'excel-store',
        partialize: (state) => ({
          excelFiles: state.excelFiles,
          columnMappings: state.columnMappings,
        }),
      }
    )
  )
);

export default excelStore;
