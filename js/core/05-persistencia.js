// ============================================
// MÓDULO 1: PERSISTENCIA CON LOCALSTORAGE
// ============================================
const CeCoSAI_Storage = {
    KEY: 'cecosai_data_v7',
    
    // Guardar todos los datos del sistema
    save: function(showIndicator = true) {
        const data = {
            version: '7.0',
            timestamp: new Date().toISOString(),
            narrativa: document.getElementById('narrativa-principal')?.value || '',
            formaRecepcion: document.querySelector('input[name="forma-recepcion"]:checked')?.value || 'escrito',
            tieneDetenidos: document.querySelector('input[name="detenidos"]:checked')?.value === 'si',
            escalera: this.getEscaleraState(),
            csdSeleccionado: document.getElementById('csd-selector')?.value || '',
            escritosHistorial: contadorEscritos,
            actividadesCompletadas: this.getActividadesState(),
            configuracionPersonal: {
                ultimaPestana: document.querySelector('.tab-content.active')?.id?.replace('tab-', '') || 'nc'
            },
            marcoJuridico: (typeof marcoJuridico !== 'undefined' && marcoJuridico) ? {
                codigoPenal: marcoJuridico.codigoPenal ? { nombre: marcoJuridico.codigoPenal.nombre, fecha: marcoJuridico.codigoPenal.fecha } : null,
                legislaciones: Array.isArray(marcoJuridico.legislaciones) ? marcoJuridico.legislaciones.slice() : []
            } : { codigoPenal: null, legislaciones: [] },
            documentosCaso: (typeof documentosCaso !== 'undefined' && Array.isArray(documentosCaso)) ? documentosCaso.slice() : []
        };
        
        try {
            localStorage.setItem(this.KEY, JSON.stringify(data));
            
            // Actualizar indicador de última vez guardado
            const lastSaveEl = document.getElementById('last-save-time');
            if (lastSaveEl) {
                lastSaveEl.textContent = 'Última vez: ' + new Date().toLocaleTimeString('es-MX');
            }
            
            if (showIndicator) {
                this.showSaveIndicator();
            }
            
            return true;
        } catch (e) {
            console.error('Error guardando datos:', e);
            showToast('Error al guardar datos localmente', 'error');
            return false;
        }
    },
    
    // Cargar datos guardados
    load: function() {
        try {
            const data = localStorage.getItem(this.KEY);
            if (!data) return null;
            
            const parsed = JSON.parse(data);
            console.log('Datos cargados de localStorage:', parsed.timestamp);
            return parsed;
        } catch (e) {
            console.error('Error cargando datos:', e);
            return null;
        }
    },
    
    // Restaurar estado del sistema
    restore: function() {
        const data = this.load();
        if (!data) return false;
        
        // Restaurar narrativa
        const narrativa = document.getElementById('narrativa-principal');
        if (narrativa && data.narrativa) {
            narrativa.value = data.narrativa;
        }
        
        // Restaurar forma de recepción
        const formaRadio = document.querySelector(`input[name="forma-recepcion"][value="${data.formaRecepcion}"]`);
        if (formaRadio) {
            formaRadio.checked = true;
            formaRadio.closest('.radio-item')?.classList.add('selected');
        }
        if (typeof toggleDenunciaBaseWrap === 'function') toggleDenunciaBaseWrap();
        
        // Restaurar detenidos
        if (data.tieneDetenidos) {
            toggleDetenidos(true);
        }
        
        // Restaurar Marco Jurídico (nombres en sesión)
        if (data.marcoJuridico && typeof marcoJuridico !== 'undefined') {
            marcoJuridico.codigoPenal = data.marcoJuridico.codigoPenal || null;
            marcoJuridico.legislaciones = Array.isArray(data.marcoJuridico.legislaciones) ? data.marcoJuridico.legislaciones : [];
            if (typeof currentCase !== 'undefined' && currentCase) currentCase.marcoJuridico = marcoJuridico;
            if (typeof actualizarMarcoJuridicoUI === 'function') actualizarMarcoJuridicoUI();
        }
        if (data.documentosCaso && Array.isArray(data.documentosCaso) && typeof documentosCaso !== 'undefined') {
            documentosCaso.length = 0;
            data.documentosCaso.forEach(function(d) { documentosCaso.push(d); });
            if (typeof currentCase !== 'undefined' && currentCase) currentCase.documentosCaso = documentosCaso;
            if (typeof actualizarListaDocumentosCaso === 'function') actualizarListaDocumentosCaso();
        }
        
        // Restaurar CSD seleccionado
        const csdSelector = document.getElementById('csd-selector');
        if (csdSelector && data.csdSeleccionado) {
            csdSelector.value = data.csdSeleccionado;
            initEscalera();
        }
        
        // Restaurar última pestaña
        if (data.configuracionPersonal?.ultimaPestana) {
            showTab(data.configuracionPersonal.ultimaPestana);
        }
        
        showToast('✓ Sesión anterior restaurada', 'success');
        return true;
    },
    
    // Obtener estado de la escalera
    getEscaleraState: function() {
        const state = {};
        const elementos = ['conducta', 'tipicidad', 'antijuridicidad', 'imputabilidad', 'culpabilidad', 'punibilidad'];
        
        elementos.forEach(elem => {
            const select = document.getElementById('select-' + elem);
            const row = document.getElementById('row-' + elem);
            
            state[elem] = {
                valor: select?.value || '',
                completado: row?.classList.contains('completed-row') || false
            };
        });
        
        return state;
    },
    
    // Obtener estado de actividades
    getActividadesState: function() {
        const completadas = document.querySelectorAll('.badge-status.badge-success');
        return completadas.length;
    },
    
    // Mostrar indicador de guardado
    showSaveIndicator: function() {
        const indicator = document.getElementById('autosave-indicator');
        if (indicator) {
            indicator.classList.add('show');
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 2000);
        }
    },
    
    // Exportar datos como JSON
    export: function() {
        const data = this.load();
        if (!data) {
            showToast('No hay datos para exportar', 'warning');
            return;
        }
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CeCoSAI_backup_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('✓ Datos exportados correctamente', 'success');
    },
    
    // Importar datos desde JSON
    import: function(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            if (!data.version) {
                throw new Error('Formato de archivo inválido');
            }
            
            localStorage.setItem(this.KEY, JSON.stringify(data));
            this.restore();
            showToast('✓ Datos importados correctamente', 'success');
            return true;
        } catch (e) {
            console.error('Error importando datos:', e);
            showToast('Error: Archivo no válido', 'error');
            return false;
        }
    },
    
    // Limpiar datos
    clear: function() {
        if (confirm('¿Está seguro de que desea borrar todos los datos guardados?')) {
            localStorage.removeItem(this.KEY);
            showToast('Datos borrados', 'warning');
            location.reload();
        }
    }
};

// Funciones helper para botones
function exportarDatos() {
    CeCoSAI_Storage.export();
}

function importarDatos() {
    document.getElementById('import-file-input').click();
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        CeCoSAI_Storage.import(e.target.result);
    };
    reader.readAsText(file);
}


window.CeCoSAI_Storage = CeCoSAI_Storage;
