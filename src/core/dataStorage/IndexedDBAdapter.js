/**
 * IndexedDBAdapter.js - Adaptador para persistencia en IndexedDB
 */

class IndexedDBAdapter {
  static DB_NAME = 'TrackingReportsDB';
  static DB_VERSION = 1;

  /**
   * Inicializa la base de datos
   * @returns {Promise<IDBDatabase>}
   */
  static async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store: excelData
        if (!db.objectStoreNames.contains('excelData')) {
          const excelStore = db.createObjectStore('excelData', {
            keyPath: 'id',
            autoIncrement: true,
          });
          excelStore.createIndex('uploadDate', 'uploadDate', { unique: false });
          excelStore.createIndex('fileName', 'fileName', { unique: false });
        }

        // Store: reports
        if (!db.objectStoreNames.contains('reports')) {
          const reportStore = db.createObjectStore('reports', {
            keyPath: 'reportId',
          });
          reportStore.createIndex('createdAt', 'createdAt', { unique: false });
          reportStore.createIndex('reportType', 'reportType', { unique: false });
        }

        // Store: library
        if (!db.objectStoreNames.contains('library')) {
          const libStore = db.createObjectStore('library', {
            keyPath: 'id',
          });
          libStore.createIndex('lastModified', 'lastModified', { unique: false });
        }
      };
    });
  }

  /**
   * Guarda datos en un store
   * @param {string} storeName
   * @param {Object} data
   * @returns {Promise<*>}
   */
  static async saveData(storeName, data) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Obtiene todos los datos de un store
   * @param {string} storeName
   * @returns {Promise<Array>}
   */
  static async getAllData(storeName) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Busca por índice
   * @param {string} storeName
   * @param {string} indexName
   * @param {*} value
   * @returns {Promise<Array>}
   */
  static async searchByIndex(storeName, indexName, value) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Limpia un store completamente
   * @param {string} storeName
   * @returns {Promise<void>}
   */
  static async clearStore(storeName) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export default IndexedDBAdapter;
