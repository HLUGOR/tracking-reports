/**
 * LibraryView.jsx - Gestión de Librería de Datos
 * Permite crear/editar plataformas, categorías, versiones, duraciones
 */

import React, { useState } from 'react';
import '../../styles/LibraryView.css';
import libraryStore from '../../store/libraryStore';

function LibraryView() {
  const [activeTab, setActiveTab] = useState('platforms'); // platforms, categories, versions
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  const platforms = libraryStore((state) => state.platforms);
  const categories = libraryStore((state) => state.categories);
  const versions = libraryStore((state) => state.versions);
  const columnMappings = libraryStore((state) => state.columnMappings);

  // ===== PLATAFORMAS =====
  const handleAddPlatform = () => {
    setEditingId(null);
    setFormData({});
    setShowForm(true);
  };

  const handleSavePlatform = () => {
    if (!formData.name || !formData.logica) return;

    if (editingId) {
      libraryStore.getState().updatePlatform(editingId, formData);
    } else {
      libraryStore.getState().addPlatform(formData);
    }

    setShowForm(false);
    setFormData({});
    setEditingId(null);
  };

  const handleDeletePlatform = (id) => {
    if (window.confirm('¿Eliminar esta plataforma y sus datos asociados?')) {
      libraryStore.getState().deletePlatform(id);
    }
  };

  // ===== CATEGORÍAS =====
  const handleAddCategory = () => {
    setEditingId(null);
    setFormData({ platformId: platforms[0]?.id || null });
    setShowForm(true);
  };

  const handleSaveCategory = () => {
    if (!formData.name || !formData.platformId || !formData.duration) return;

    if (editingId) {
      libraryStore.getState().updateCategory(editingId, formData);
    } else {
      libraryStore.getState().addCategory(formData);
    }

    setShowForm(false);
    setFormData({});
    setEditingId(null);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('¿Eliminar esta categoría y sus versiones asociadas?')) {
      libraryStore.getState().deleteCategory(id);
    }
  };

  // ===== VERSIONES =====
  const handleAddVersion = () => {
    setEditingId(null);
    setFormData({
      platformId: platforms[0]?.id || null,
      categoryId: categories[0]?.id || null,
    });
    setShowForm(true);
  };

  const handleSaveVersion = () => {
    if (!formData.name || !formData.platformId || !formData.categoryId) return;

    if (editingId) {
      libraryStore.getState().updateVersion(editingId, formData);
    } else {
      libraryStore.getState().addVersion(formData);
    }

    setShowForm(false);
    setFormData({});
    setEditingId(null);
  };

  const handleDeleteVersion = (id) => {
    if (window.confirm('¿Eliminar esta versión?')) {
      libraryStore.getState().deleteVersion(id);
    }
  };

  const getPlatformName = (id) => platforms.find((p) => p.id === id)?.name || 'N/A';
  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || 'N/A';

  return (
    <div className="library-view">
      <div className="library-header">
        <h2>📚 Librería de Datos</h2>
        <p>Gesiona plataformas, categorías, versiones y duraciones</p>
      </div>

      <div className="library-tabs">
        <button
          className={`tab-btn ${activeTab === 'platforms' ? 'active' : ''}`}
          onClick={() => setActiveTab('platforms')}
        >
          🌐 Plataformas ({platforms.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          📂 Categorías ({categories.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'versions' ? 'active' : ''}`}
          onClick={() => setActiveTab('versions')}
        >
          📦 Versiones ({versions.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'mappings' ? 'active' : ''}`}
          onClick={() => setActiveTab('mappings')}
        >
          🗺️ Mapeos de Columnas ({columnMappings.length})
        </button>
      </div>

      <div className="library-content">
        {/* PLATAFORMAS */}
        {activeTab === 'platforms' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>Plataformas</h3>
              <button className="btn btn-primary" onClick={handleAddPlatform}>
                ➕ Nueva Plataforma
              </button>
            </div>

            {platforms.length === 0 ? (
              <div className="empty-state">
                <p>Sin plataformas aún. Crea una para empezar.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="library-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Lógica</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platforms.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>
                          <code>{p.logica}</code>
                        </td>
                        <td>
                          <span className={`status ${p.active ? 'active' : 'inactive'}`}>
                            {p.active ? '✓ Activa' : '✗ Inactiva'}
                          </span>
                        </td>
                        <td className="actions">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => {
                              setEditingId(p.id);
                              setFormData(p);
                              setShowForm(true);
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeletePlatform(p.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CATEGORÍAS */}
        {activeTab === 'categories' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>Categorías</h3>
              <button className="btn btn-primary" onClick={handleAddCategory}>
                ➕ Nueva Categoría
              </button>
            </div>

            {categories.length === 0 ? (
              <div className="empty-state">
                <p>Sin categorías aún. Crea una plataforma primero.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="library-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Plataforma</th>
                      <th>Duración</th>
                      <th>Color</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>{getPlatformName(c.platformId)}</td>
                        <td>{c.duration ? `${c.duration} min` : 'N/A'}</td>
                        <td>
                          <div
                            className="color-preview"
                            style={{ backgroundColor: c.color || '#ccc' }}
                          />
                        </td>
                        <td className="actions">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => {
                              setEditingId(c.id);
                              setFormData(c);
                              setShowForm(true);
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteCategory(c.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* VERSIONES */}
        {activeTab === 'versions' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>Versiones</h3>
              <button className="btn btn-primary" onClick={handleAddVersion}>
                ➕ Nueva Versión
              </button>
            </div>

            {versions.length === 0 ? (
              <div className="empty-state">
                <p>Sin versiones aún. Crea categorías primero.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="library-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Plataforma</th>
                      <th>Categoría</th>
                      <th>Duración</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map((v) => (
                      <tr key={v.id}>
                        <td>{v.name}</td>
                        <td>{getPlatformName(v.platformId)}</td>
                        <td>{getCategoryName(v.categoryId)}</td>
                        <td>{v.duration ? `${v.duration} min` : 'N/A'}</td>
                        <td className="actions">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => {
                              setEditingId(v.id);
                              setFormData(v);
                              setShowForm(true);
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteVersion(v.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MAPEOS DE COLUMNAS */}
        {activeTab === 'mappings' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>Mapeos de Columnas</h3>
            </div>

            {columnMappings.length === 0 ? (
              <div className="empty-state">
                <p>Sin mapeos guardados aún. Carga un Excel para crear un mapeo.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="library-table">
                  <thead>
                    <tr>
                      <th>Archivo</th>
                      <th>Mapeo</th>
                      <th>Actualizado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columnMappings.map((m) => (
                      <tr key={m.id}>
                        <td>
                          <code>{m.fileName}</code>
                        </td>
                        <td>
                          <small>
                            {Object.entries(m.mapping)
                              .map(([k, v]) => `${k}→${v}`)
                              .join(', ')}
                          </small>
                        </td>
                        <td>
                          {m.updatedAt
                            ? new Date(m.updatedAt).toLocaleDateString()
                            : new Date(m.createdAt).toLocaleDateString()}
                        </td>
                        <td className="actions">
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => {
                              libraryStore
                                .getState()
                                .deleteColumnMapping(m.fileName);
                            }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="form-modal-overlay">
          <div className="form-modal">
            <h3>
              {editingId
                ? `Editar ${activeTab.slice(0, -1)}`
                : `Crear nuevo ${activeTab.slice(0, -1)}`}
            </h3>

            {activeTab === 'platforms' && (
              <>
                <input
                  type="text"
                  placeholder="Nombre de la plataforma"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Tipo de lógica"
                  value={formData.logica || ''}
                  onChange={(e) => setFormData({ ...formData, logica: e.target.value })}
                />
              </>
            )}

            {activeTab === 'categories' && (
              <>
                <input
                  type="text"
                  placeholder="Nombre de la categoría"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <select
                  value={formData.platformId || ''}
                  onChange={(e) => setFormData({ ...formData, platformId: parseInt(e.target.value) })}
                >
                  <option value="">Selecciona una plataforma</option>
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Duración (minutos)"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
                <input
                  type="color"
                  placeholder="Color"
                  value={formData.color || '#667eea'}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </>
            )}

            {activeTab === 'versions' && (
              <>
                <input
                  type="text"
                  placeholder="Nombre de la versión"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <select
                  value={formData.platformId || ''}
                  onChange={(e) => setFormData({ ...formData, platformId: parseInt(e.target.value) })}
                >
                  <option value="">Selecciona una plataforma</option>
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.categoryId || ''}
                  onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Duración (minutos)"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </>
            )}

            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSavePlatform || handleSaveCategory || handleSaveVersion}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LibraryView;
