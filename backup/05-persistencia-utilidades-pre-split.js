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

// ============================================
// MÓDULO 2: PAGINACIÓN DE TABLAS
// ============================================
const CeCoSAI_Pagination = {
    pageSize: 10,
    currentPage: {},
    
    // Inicializar paginación para una tabla
    init: function(tableId, options = {}) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const totalRows = rows.length;
        
        if (totalRows <= this.pageSize) return; // No necesita paginación
        
        this.currentPage[tableId] = 1;
        
        // Crear contenedor de paginación
        const container = document.createElement('div');
        container.className = 'pagination-container';
        container.id = `pagination-${tableId}`;
        container.innerHTML = `
            <div class="pagination-info">
                <span id="pagination-info-${tableId}">Mostrando 1-${Math.min(this.pageSize, totalRows)} de ${totalRows}</span>
                <select class="page-size-select" data-page-size-table="${tableId}" aria-label="Registros por página">
                    <option value="5">5</option>
                    <option value="10" selected>10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
            <div class="pagination-controls" id="pagination-controls-${tableId}"></div>
        `;
        
        table.parentNode.appendChild(container);
        
        this.render(tableId, rows);
    },
    
    // Renderizar página actual
    render: function(tableId, rows = null) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        if (!rows) {
            rows = Array.from(tbody.querySelectorAll('tr'));
        }
        
        const totalRows = rows.length;
        const totalPages = Math.ceil(totalRows / this.pageSize);
        const currentPage = this.currentPage[tableId] || 1;
        const start = (currentPage - 1) * this.pageSize;
        const end = Math.min(start + this.pageSize, totalRows);
        
        // Ocultar todas las filas y mostrar solo las de la página actual
        rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? '' : 'none';
        });
        
        // Actualizar info
        const infoEl = document.getElementById(`pagination-info-${tableId}`);
        if (infoEl) {
            infoEl.textContent = `Mostrando ${start + 1}-${end} de ${totalRows}`;
        }
        
        // Actualizar controles
        const controlsEl = document.getElementById(`pagination-controls-${tableId}`);
        if (controlsEl) {
            let html = '';
            
            // Botón anterior
            html += `<button class="pagination-btn" data-pagination-table="${tableId}" data-pagination-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Página anterior">
                <i class="fas fa-chevron-left"></i>
            </button>`;
            
            // Números de página
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                    html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-pagination-table="${tableId}" data-pagination-page="${i}" aria-label="Página ${i}">${i}</button>`;
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                    html += `<span style="padding: 0 4px;">...</span>`;
                }
            }
            
            // Botón siguiente
            html += `<button class="pagination-btn" data-pagination-table="${tableId}" data-pagination-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Página siguiente">
                <i class="fas fa-chevron-right"></i>
            </button>`;
            
            controlsEl.innerHTML = html;
        }
    },
    
    // Ir a página específica
    goToPage: function(tableId, page) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const totalPages = Math.ceil(rows.length / this.pageSize);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage[tableId] = page;
        this.render(tableId, rows);
    },
    
    // Cambiar tamaño de página
    changePageSize: function(tableId, newSize) {
        this.pageSize = parseInt(newSize);
        this.currentPage[tableId] = 1;
        this.render(tableId);
    }
};

// ============================================
// MÓDULO 3: AUTOSAVE
// ============================================
let autosaveTimeout = null;

function setupAutosave() {
    // Observar cambios en campos con data-autosave
    document.querySelectorAll('[data-autosave="true"]').forEach(el => {
        el.addEventListener('input', debounceAutosave);
        el.addEventListener('change', debounceAutosave);
    });
    
    // También guardar en cambios de selects y radios importantes
    document.querySelectorAll('select, input[type="radio"]').forEach(el => {
        el.addEventListener('change', debounceAutosave);
    });
}

function debounceAutosave() {
    if (autosaveTimeout) {
        clearTimeout(autosaveTimeout);
    }
    autosaveTimeout = setTimeout(() => {
        CeCoSAI_Storage.save(true);
    }, 2000); // Guardar después de 2 segundos de inactividad
}

// ============================================
// MÓDULO 4: PWA / INSTALACIÓN
// ============================================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('pwa-install-btn')?.classList.add('show');
});

function installPWA() {
    if (!deferredPrompt) {
        showToast('Usa "Agregar a inicio" en el menú del navegador', 'info');
        return;
    }
    
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            showToast('✓ App instalada correctamente', 'success');
        }
        deferredPrompt = null;
        document.getElementById('pwa-install-btn')?.classList.remove('show');
    });
}

// ============================================
// MÓDULO 5: MENÚ MÓVIL
// ============================================
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar?.classList.toggle('mobile-open');
}

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (sidebar?.classList.contains('mobile-open') && 
        !sidebar.contains(e.target) && 
        !menuBtn?.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
    }
});

// ============================================
// MÓDULO 6: VALIDACIÓN DE FORMULARIOS
// ============================================
function setupFormValidation() {
    // Agregar required a campos importantes
    const requiredFields = [
        'narrativa-principal'
    ];
    
    requiredFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.required = true;
        }
    });
    
    // Mostrar mensajes de validación personalizados
    document.querySelectorAll('.form-control[required]').forEach(el => {
        el.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.classList.add('invalid');
            showToast('Por favor complete los campos requeridos', 'warning');
        });
        
        el.addEventListener('input', function() {
            this.classList.remove('invalid');
        });
    });
}

// ============================================
// MÓDULO 7: LAZY LOADING DE PESTAÑAS
// ============================================
const loadedTabs = new Set(['nc']); // NC siempre está cargada

function lazyLoadTab(tabId) {
    if (loadedTabs.has(tabId)) return;
    
    const tabContent = document.getElementById('tab-' + tabId);
    if (!tabContent) return;
    
    // Marcar como cargada
    loadedTabs.add(tabId);
    
    // Inicializar paginación si es necesario
    if (tabId === 'pic') {
        setTimeout(() => {
            CeCoSAI_Pagination.init('tabla-actividades');
        }, 100);
    }
}

// Extender showTab para lazy loading
const originalShowTabFn = showTab;
showTab = function(tabId) {
    lazyLoadTab(tabId);
    originalShowTabFn(tabId);
    
    // Guardar última pestaña
    CeCoSAI_Storage.save(false);
};

// ============================================
// MÓDULO 8: ATAJOS DE TECLADO
// ============================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S = Guardar (toast "Guardado manualmente" solo en Plan de Investigación)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        CeCoSAI_Storage.save(true);
        var activeNav = document.querySelector('.nav-item.active');
        var currentTab = activeNav ? activeNav.getAttribute('data-tab') : '';
        if (currentTab === 'pic') {
            showToast('✓ Guardado manualmente', 'success');
        }
    }
    
    // Escape = Cerrar modales
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Ctrl/Cmd + Shift + D = Modo Demo Automático (Auto-llenado Mágico)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (typeof showToast === 'function') showToast('🚀 Activando Auto-Llenado Comercial (Modo Demo)...', 'info');
        
        // 1. Llenar Noticia Criminal
        const narrativa = document.getElementById('narrativa-principal');
        if (narrativa) {
            narrativa.value = "Durante el período de marzo 2025 a enero 2026, el Ing. Roberto 'N', el Lic. Marco 'N', la Lic. Claudia 'N' y el Cmdte. Sergio 'N' actuaron de común acuerdo para desviar recursos públicos mediante una licitación simulada para la compra de patrullas y equipo táctico. Utilizaron la empresa fachada 'Logística y Seguridad del Centro' para emitir facturas falsas, entregando mercancía simulada (cajas con papel periódico y piedras). Las ganancias ilícitas fueron distribuidas entre los participantes. La Arq. Elena Santoyo fue amenazada y forzada a abandonar el estado. El periodista Juan Carlos Ruiz fue emboscado y disparado el 20 de enero de 2026, resultando con secuelas permanentes.";
        }
        
        // 2. Disparar extracción de Hipótesis y 3. Armar la Escalera
        if (typeof window.generarHipotesisInicialNC === 'function') {
            window.generarHipotesisInicialNC();
        }
        
        setTimeout(() => {
            const csdSelector = document.getElementById('csd-selector');
            if (csdSelector) {
                csdSelector.value = 'csd-01'; // Pre-seleccionar Ing. Roberto "N"
                if (typeof window.seleccionarCSDEscalera === 'function') window.seleccionarCSDEscalera();
                
                setTimeout(() => {
                    const delitoSelector = document.getElementById('delito-selector');
                    if (delitoSelector) {
                        delitoSelector.value = 'Peculado';
                        if (typeof window.seleccionarDelitoEscalera === 'function') window.seleccionarDelitoEscalera();
                    }
                }, 800);
            }
        }, 2500); // 2.5 segundos de espera para lucir la animación del spinner
    }
});

// ============================================
// MÓDULO 9: FRICCIÓN LÓGICA IA - SISTEMA COMPLETO
// ============================================
const FriccionIA = {
    // Estado del sistema
    estado: {
        imputacion: {
            generadas: 3,
            respondidas: 0,
            validadas: 0,
            rechazadas: 0,
            sinContestar: 0,
            contadorId: 3
        },
        acusacion: {
            generadas: 3,
            respondidas: 0,
            validadas: 0,
            rechazadas: 0,
            sinContestar: 0,
            contadorId: 3
        }
    },
    
    // Trazabilidad
    trazabilidad: [],
    
    // Banco de preguntas IA para generar nuevas
    bancoPreguntasImputacion: [
        "¿Se acreditó el acuerdo previo entre Roberto, Marco, Claudia y Sergio para simular la licitación?",
        "¿Existe documentación que compruebe que la empresa 'Logística y Seguridad del Centro' fue creada para el fraude?",
        "¿Se verificó que las facturas entregadas a Beatriz Cano carecían de sellos de recepción válidos?",
        "¿Se acreditó que las cajas supuestamente de equipo contenían papel periódico y piedras?",
        "¿Existe constancia del uso de unidades oficiales para transportar dinero ilícito?",
        "¿Se documentaron las amenazas realizadas contra la Arq. Elena Santoyo?",
        "¿Se estableció la calidad de servidor público del Ing. Roberto 'N' al momento de los hechos?",
        "¿Se vinculó a la Lic. Claudia 'N' con las autorizaciones de pago fraudulentas?",
        "¿Existe evidencia de las reuniones clandestinas en la oficina privada de Roberto?",
        "¿Se verificaron los antecedentes del Comandante Sergio 'N' en la corporación policial?"
    ],
    
    bancoPreguntasAcusacion: [
        "¿Se incluyó en la acusación la tentativa de homicidio contra el periodista Juan Carlos Ruiz?",
        "¿Se fundamentó la solicitud de decomiso de propiedades en Hacienda Nueva, Pulgas Pandas y Torre Bosques?",
        "¿Se acreditó el concurso real de delitos (Peculado + Fraude + Asociación Delictuosa)?",
        "¿Se incluyeron las agravantes por calidad de servidores públicos (Art. 213 bis CPF)?",
        "¿Se cuantificó el monto total del daño patrimonial al erario público?",
        "¿Se consideró la protección a los 7 testigos identificados como medida complementaria?",
        "¿Se vinculó el atentado del 20 de enero de 2026 con la organización delictiva?",
        "¿Se fundamentó la autoría intelectual del Ing. Roberto 'N' como líder del esquema?",
        "¿Se solicitó colaboración internacional para rastreo de activos en el extranjero?",
        "¿Se incluyó la reparación del daño moral a Elena Santoyo y Juan Carlos Ruiz?"
    ],
    
    // Actividades probatorias disponibles (conectadas con PIC)
    actividadesPIC: [
        { id: "ACT-01", nombre: "Análisis documental expediente licitación" },
        { id: "ACT-02", nombre: "Dictamen autenticidad documental (facturas)" },
        { id: "ACT-03", nombre: "Rastreo transferencias bancarias UIF" },
        { id: "ACT-04", nombre: "Investigación patrimonial Roberto 'N'" },
        { id: "ACT-05", nombre: "Inspección bodega Calle Plomo #105" },
        { id: "ACT-06", nombre: "Entrevista Héctor Luna (chofer)" },
        { id: "ACT-07", nombre: "Entrevista Beatriz Cano (analista)" },
        { id: "ACT-08", nombre: "Entrevista Ricardo Fuentes (mensajero)" },
        { id: "ACT-09", nombre: "Entrevista Doña Mary (vendedora)" },
        { id: "ACT-10", nombre: "Entrevista Manuel Esparza (oficial)" },
        { id: "ACT-11", nombre: "Entrevista Dra. Ana Paula (médico)" },
        { id: "ACT-12", nombre: "Entrevista Luis Pedroza (contador)" },
        { id: "ACT-13", nombre: "Localización víctima Elena Santoyo" },
        { id: "ACT-14", nombre: "Entrevista periodista Juan Carlos Ruiz" },
        { id: "ACT-15", nombre: "Inspección lugar atentado Av. López Mateos" },
        { id: "ACT-16", nombre: "Dictamen balístico proyectiles" },
        { id: "ACT-17", nombre: "Análisis forense llamadas hospital" },
        { id: "ACT-18", nombre: "Verificación bitácoras vehículos oficiales" },
        { id: "ACT-19", nombre: "Investigación empresa 'Logística y Seguridad'" },
        { id: "ACT-20", nombre: "Investigación patrimonial Marco 'N'" },
        { id: "ACT-21", nombre: "Análisis registros contables dobles" },
        { id: "ACT-22", nombre: "Análisis grabaciones CCTV estacionamiento" },
        { id: "ACT-23", nombre: "Extracción forense celulares asegurados" },
        { id: "ACT-24", nombre: "Cateo domicilio Claudia 'N' Torre Bosques" },
        { id: "ACT-25", nombre: "Consulta registros personal policial Sergio 'N'" }
    ],
    
    // Generar nueva pregunta
    generarPregunta: function(tipo) {
        const totalSinContestar = this.estado.imputacion.sinContestar + this.estado.acusacion.sinContestar;
        
        // Validar límite de preguntas sin contestar
        if (totalSinContestar >= 3) {
            showToast('⚠️ Debe contestar preguntas pendientes. Máximo 3 sin contestar permitidas.', 'warning');
            return;
        }
        
        const contenedor = document.getElementById(`contenedor-preguntas-${tipo}`);
        const banco = tipo === 'imputacion' ? this.bancoPreguntasImputacion : this.bancoPreguntasAcusacion;
        const estadoTipo = this.estado[tipo];
        
        // Obtener pregunta aleatoria del banco
        const preguntaTexto = banco[Math.floor(Math.random() * banco.length)];
        
        estadoTipo.contadorId++;
        estadoTipo.generadas++;
        
        const prefijo = tipo === 'imputacion' ? 'imp' : 'acu';
        const prefijoMayus = tipo === 'imputacion' ? 'IMP' : 'ACU';
        const nuevoId = `${prefijo}-${estadoTipo.contadorId}`;
        const numeroFormateado = String(estadoTipo.contadorId).padStart(3, '0');
        
        // Generar opciones de actividades
        let opcionesActividades = '<option value="">-- Seleccione actividad (opcional) --</option>';
        this.actividadesPIC.forEach(act => {
            opcionesActividades += `<option value="${act.id}">${act.id}: ${act.nombre}</option>`;
        });
        
        const nuevaPreguntaHTML = `
        <div class="friccion-pregunta-card" id="pregunta-${nuevoId}" data-tipo="${tipo}" data-estado="pendiente" style="animation: fadeIn 0.5s ease;">
            <div class="pregunta-header">
                <span class="pregunta-numero">${prefijoMayus}-${numeroFormateado}</span>
                <span class="pregunta-estado badge-status badge-warning" id="estado-${nuevoId}">Pendiente</span>
                <span class="badge-status badge-info" style="font-size: 0.6rem;"><i class="fas fa-robot"></i> Generada por IA</span>
            </div>
            <div class="pregunta-texto">
                <i class="fas fa-question-circle" style="color: ${tipo === 'imputacion' ? 'var(--accent-blue)' : 'var(--info)'};"></i>
                <strong>${preguntaTexto}</strong>
            </div>
            <div class="pregunta-respuesta-container" id="respuesta-container-${nuevoId}">
                <label class="form-label">Respuesta del Fiscal:</label>
                <textarea class="form-control respuesta-fiscal" id="respuesta-${nuevoId}" placeholder="Escriba su respuesta fundamentada..." rows="3"></textarea>
                <div class="actividad-probatoria-selector">
                    <label class="form-label" style="margin-top: 12px;">Vincular con Actividad Probatoria (PIC):</label>
                    <select class="form-control" id="actividad-${nuevoId}">
                        ${opcionesActividades}
                    </select>
                </div>
                <div class="decision-group" style="margin-top: 12px;">
                    <button class="btn btn-success btn-sm" data-call="FriccionIA.enviarRespuesta" data-call-arg="${nuevoId}">
                        <i class="fas fa-paper-plane"></i> Enviar Respuesta
                    </button>
                    <button class="btn btn-secondary btn-sm" data-call="FriccionIA.marcarSinContestar" data-call-arg="${nuevoId}">
                        <i class="fas fa-times"></i> No Contestar
                    </button>
                </div>
            </div>
            <div class="evaluacion-ia-container" id="evaluacion-${nuevoId}" style="display: none;"></div>
        </div>
        `;
        
        contenedor.insertAdjacentHTML('beforeend', nuevaPreguntaHTML);
        
        // Registrar trazabilidad
        this.registrarTrazabilidad(nuevoId, 'GENERACIÓN', 'Sistema IA', `Pregunta generada automáticamente: "${preguntaTexto.substring(0, 50)}..."`, '-');
        
        // Actualizar Caso SAI (MMI) y log general
        if (currentCase && currentCase.mmi) {
            currentCase.mmi.preguntasGeneradas++;
            currentCase.mmi.ultimaActualizacion = new Date().toISOString();
        }
        if (SAIEngine && SAIEngine.mmi) {
            SAIEngine.mmi.registrarEvento('generar_pregunta', {
                tipo,
                id: nuevoId,
                texto: preguntaTexto
            });
        }
        
        // Actualizar contadores
        this.actualizarContadores();
        
        showToast(`✓ Nueva pregunta ${prefijoMayus}-${numeroFormateado} generada`, 'success');
    },
    
    // Enviar respuesta para evaluación IA
    enviarRespuesta: function(preguntaId) {
        const textarea = document.getElementById(`respuesta-${preguntaId}`);
        const actividadSelect = document.getElementById(`actividad-${preguntaId}`);
        const respuesta = textarea.value.trim();
        const actividad = actividadSelect.value;
        
        if (respuesta.length < 20) {
            showToast('⚠️ La respuesta debe tener al menos 20 caracteres', 'warning');
            return;
        }
        
        // Simular evaluación IA
        const evaluacion = this.evaluarRespuestaIA(respuesta, actividad);
        
        // Obtener tipo (imputacion o acusacion)
        const card = document.getElementById(`pregunta-${preguntaId}`);
        const tipo = card.dataset.tipo;
        
        // Actualizar estado de la tarjeta
        card.dataset.estado = evaluacion.resultado;
        
        // Actualizar badge de estado
        const estadoBadge = document.getElementById(`estado-${preguntaId}`);
        if (evaluacion.resultado === 'validada') {
            estadoBadge.className = 'pregunta-estado badge-status badge-success';
            estadoBadge.innerHTML = '<i class="fas fa-check"></i> Validada';
            this.estado[tipo].validadas++;
        } else if (evaluacion.resultado === 'rechazada') {
            estadoBadge.className = 'pregunta-estado badge-status badge-danger';
            estadoBadge.innerHTML = '<i class="fas fa-times"></i> Rechazada';
            this.estado[tipo].rechazadas++;
        } else {
            estadoBadge.className = 'pregunta-estado badge-status badge-warning';
            estadoBadge.innerHTML = '<i class="fas fa-exclamation"></i> Parcial';
        }
        
        // Mostrar evaluación IA
        const evaluacionContainer = document.getElementById(`evaluacion-${preguntaId}`);
        evaluacionContainer.className = `evaluacion-ia-container ${evaluacion.resultado}`;
        evaluacionContainer.innerHTML = `
            <div class="evaluacion-resultado">
                <i class="fas ${evaluacion.resultado === 'validada' ? 'fa-check-circle' : evaluacion.resultado === 'rechazada' ? 'fa-times-circle' : 'fa-exclamation-circle'}" 
                   style="color: ${evaluacion.resultado === 'validada' ? 'var(--success)' : evaluacion.resultado === 'rechazada' ? 'var(--danger)' : 'var(--warning)'}; font-size: 1.2rem;"></i>
                <span style="color: ${evaluacion.resultado === 'validada' ? 'var(--success)' : evaluacion.resultado === 'rechazada' ? 'var(--danger)' : 'var(--warning)'};">
                    ${evaluacion.resultado === 'validada' ? 'RESPUESTA VALIDADA POR IA' : evaluacion.resultado === 'rechazada' ? 'RESPUESTA RECHAZADA POR IA' : 'VALIDACIÓN PARCIAL'}
                </span>
            </div>
            <div class="evaluacion-detalle">
                <strong>Análisis IA:</strong> ${evaluacion.analisis}
            </div>
            <div class="evaluacion-criterios">
                <span class="criterio-badge ${evaluacion.criterios.pertinencia ? 'cumple' : 'no-cumple'}">
                    <i class="fas ${evaluacion.criterios.pertinencia ? 'fa-check' : 'fa-times'}"></i>
                    Pertinencia
                </span>
                <span class="criterio-badge ${evaluacion.criterios.logica ? 'cumple' : 'no-cumple'}">
                    <i class="fas ${evaluacion.criterios.logica ? 'fa-check' : 'fa-times'}"></i>
                    Lógica
                </span>
                <span class="criterio-badge ${evaluacion.criterios.respaldo ? 'cumple' : actividad ? 'parcial' : 'no-cumple'}">
                    <i class="fas ${evaluacion.criterios.respaldo ? 'fa-check' : actividad ? 'fa-minus' : 'fa-times'}"></i>
                    Respaldo Probatorio
                </span>
            </div>
            ${evaluacion.sugerencia ? `<div style="margin-top: 12px; padding: 10px; background: #fff; border-radius: 6px; font-size: 0.8rem;"><strong>💡 Sugerencia IA:</strong> ${evaluacion.sugerencia}</div>` : ''}
        `;
        evaluacionContainer.style.display = 'block';
        
        // Ocultar formulario de respuesta
        document.getElementById(`respuesta-container-${preguntaId}`).style.display = 'none';
        
        // Actualizar contadores
        this.estado[tipo].respondidas++;
        this.actualizarContadores();
        if (currentCase && currentCase.mmi) {
            currentCase.mmi.preguntasRespondidas++;
            currentCase.mmi.ultimaActualizacion = new Date().toISOString();
        }
        if (SAIEngine && SAIEngine.mmi) {
            SAIEngine.mmi.registrarEvento('responder_pregunta', {
                id: preguntaId,
                tipo,
                resultado: evaluacion.resultado,
                actividad
            });
        }
        
        // Registrar trazabilidad
        this.registrarTrazabilidad(
            preguntaId, 
            'RESPUESTA', 
            'Fiscal', 
            `Respuesta enviada (${respuesta.length} caracteres). Actividad: ${actividad || 'Sin vincular'}`, 
            evaluacion.resultado.toUpperCase()
        );
        
        showToast(`✓ Respuesta evaluada: ${evaluacion.resultado.toUpperCase()}`, evaluacion.resultado === 'validada' ? 'success' : evaluacion.resultado === 'rechazada' ? 'error' : 'warning');
    },
    
    // Evaluación IA de la respuesta
    evaluarRespuestaIA: function(respuesta, actividad) {
        // Criterios de evaluación
        const tieneLogica = respuesta.length >= 50 && (
            respuesta.includes('porque') || 
            respuesta.includes('debido') || 
            respuesta.includes('conforme') || 
            respuesta.includes('según') ||
            respuesta.includes('Art.') ||
            respuesta.includes('artículo') ||
            respuesta.includes('fundamento')
        );
        
        const tienePertinencia = respuesta.length >= 30 && (
            respuesta.includes('sí') || 
            respuesta.includes('no') || 
            respuesta.includes('se realizó') ||
            respuesta.includes('consta') ||
            respuesta.includes('obra') ||
            respuesta.includes('existe')
        );
        
        const tieneRespaldo = actividad !== '' && actividad !== null;
        
        let resultado, analisis, sugerencia;
        
        if (tieneLogica && tienePertinencia && tieneRespaldo) {
            resultado = 'validada';
            analisis = 'La respuesta cumple con los criterios de pertinencia, fundamentación lógica y está debidamente respaldada con actividad probatoria del PIC.';
            sugerencia = null;
        } else if ((tieneLogica && tienePertinencia) || (tienePertinencia && tieneRespaldo)) {
            resultado = 'validada';
            analisis = 'La respuesta es aceptable. Cumple con criterios mínimos de validación aunque puede mejorarse.';
            sugerencia = !tieneRespaldo ? 'Se recomienda vincular la respuesta con una actividad probatoria del PIC para mayor solidez.' : null;
        } else if (tieneLogica || tienePertinencia) {
            resultado = 'parcial';
            analisis = 'La respuesta requiere mejoras. Algunos criterios no se cumplen completamente.';
            sugerencia = 'Agregue fundamentación legal (Art. específico) y vincule con actividad probatoria.';
        } else {
            resultado = 'rechazada';
            analisis = 'La respuesta no cumple con los criterios mínimos de pertinencia, lógica y respaldo probatorio.';
            sugerencia = 'Elabore una respuesta más fundamentada que incluya: 1) Respuesta directa a la pregunta, 2) Fundamento legal, 3) Vínculo con actividad probatoria.';
        }
        
        return {
            resultado,
            analisis,
            sugerencia,
            criterios: {
                pertinencia: tienePertinencia,
                logica: tieneLogica,
                respaldo: tieneRespaldo
            }
        };
    },
    
    // Marcar como sin contestar
    marcarSinContestar: function(preguntaId) {
        const totalSinContestar = this.estado.imputacion.sinContestar + this.estado.acusacion.sinContestar;
        
        if (totalSinContestar >= 3) {
            showToast('⚠️ Ya tiene 3 preguntas sin contestar. Debe responder antes de continuar.', 'warning');
            return;
        }
        
        const card = document.getElementById(`pregunta-${preguntaId}`);
        const tipo = card.dataset.tipo;
        
        // Actualizar estado
        card.dataset.estado = 'sin-contestar';
        
        // Actualizar badge
        const estadoBadge = document.getElementById(`estado-${preguntaId}`);
        estadoBadge.className = 'pregunta-estado badge-status badge-warning';
        estadoBadge.innerHTML = '<i class="fas fa-minus-circle"></i> Sin contestar';
        
        // Ocultar formulario
        document.getElementById(`respuesta-container-${preguntaId}`).innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                <i class="fas fa-minus-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>Pregunta marcada como sin contestar</p>
            </div>
        `;
        
        // Actualizar contador
        this.estado[tipo].sinContestar++;
        this.actualizarContadores();
        if (currentCase && currentCase.mmi) {
            currentCase.mmi.preguntasSinContestar++;
            currentCase.mmi.ultimaActualizacion = new Date().toISOString();
        }
        if (SAIEngine && SAIEngine.mmi) {
            SAIEngine.mmi.registrarEvento('marcar_sin_contestar', {
                id: preguntaId,
                tipo
            });
        }
        
        // Registrar trazabilidad
        this.registrarTrazabilidad(preguntaId, 'SIN CONTESTAR', 'Fiscal', 'El Fiscal decidió no contestar esta pregunta', 'N/A');
        
        showToast(`Pregunta marcada como sin contestar (${3 - totalSinContestar - 1} disponibles)`, 'warning');
    },
    
    // Actualizar todos los contadores y métricas
    actualizarContadores: function() {
        const imp = this.estado.imputacion;
        const acu = this.estado.acusacion;
        
        // Calcular totales
        const totalGeneradas = imp.generadas + acu.generadas;
        const totalRespondidas = imp.respondidas + acu.respondidas;
        const totalValidadas = imp.validadas + acu.validadas;
        const totalPendientes = totalGeneradas - totalRespondidas - imp.sinContestar - acu.sinContestar;
        const totalSinContestar = imp.sinContestar + acu.sinContestar;
        const porcentaje = totalGeneradas > 0 ? Math.round((totalRespondidas / totalGeneradas) * 100) : 0;
        
        // Actualizar panel de control (Fricción)
        document.getElementById('total-preguntas-generadas').textContent = totalGeneradas;
        document.getElementById('total-preguntas-respondidas').textContent = totalRespondidas;
        document.getElementById('total-preguntas-pendientes').textContent = totalPendientes;
        document.getElementById('total-preguntas-sin-contestar').textContent = totalSinContestar;
        document.getElementById('friccion-porcentaje').textContent = porcentaje + '%';
        
        const barFriccion = document.getElementById('friccion-progress-bar');
        barFriccion.style.width = porcentaje + '%';
        barFriccion.className = `progress-fill ${porcentaje >= 80 ? 'high' : porcentaje >= 50 ? 'medium' : 'low'}`;
        
        // Contadores individuales
        const impPendientes = imp.generadas - imp.respondidas - imp.sinContestar;
        const acuPendientes = acu.generadas - acu.respondidas - acu.sinContestar;
        
        document.getElementById('contador-imputacion').textContent = `${imp.respondidas} / ${imp.generadas}`;
        document.getElementById('contador-imputacion').className = imp.respondidas >= imp.generadas ? 'badge-status badge-success' : 'badge-status badge-warning';
        
        document.getElementById('contador-acusacion').textContent = `${acu.respondidas} / ${acu.generadas}`;
        document.getElementById('contador-acusacion').className = acu.respondidas >= acu.generadas ? 'badge-status badge-success' : 'badge-status badge-warning';
        
        // Actualizar indicadores en Métricas (si están visibles)
        this.actualizarMetricas(imp, acu, totalGeneradas, totalRespondidas, totalValidadas);
        
        // Sincronizar resumen global en Caso SAI / MMI
        if (currentCase && currentCase.mmi) {
            currentCase.mmi.preguntasGeneradas = totalGeneradas;
            currentCase.mmi.preguntasRespondidas = totalRespondidas;
            currentCase.mmi.preguntasSinContestar = totalSinContestar;
            currentCase.mmi.ultimaActualizacion = new Date().toISOString();
        }
        
        // Guardar estado
        if (typeof CeCoSAI_Storage !== 'undefined') {
            CeCoSAI_Storage.save(false);
        }
    },
    
    // Actualizar sección de Métricas
    actualizarMetricas: function(imp, acu, totalGeneradas, totalRespondidas, totalValidadas) {
        // Imputación
        const impPorcentaje = imp.generadas > 0 ? Math.round((imp.respondidas / imp.generadas) * 100) : 0;
        if (document.getElementById('metricas-imp-generadas')) {
            document.getElementById('metricas-imp-generadas').textContent = imp.generadas;
            document.getElementById('metricas-imp-respondidas').textContent = imp.respondidas;
            document.getElementById('metricas-imp-porcentaje').textContent = impPorcentaje + '%';
            document.getElementById('metricas-imp-bar').style.width = impPorcentaje + '%';
            document.getElementById('metricas-imp-bar').className = `progress-fill ${impPorcentaje >= 80 ? 'high' : impPorcentaje >= 50 ? 'medium' : 'low'}`;
            document.getElementById('metricas-imp-validadas').textContent = imp.validadas;
            document.getElementById('metricas-imp-pendientes').textContent = imp.generadas - imp.respondidas - imp.sinContestar;
            document.getElementById('metricas-imp-sincontestar').textContent = imp.sinContestar;
        }
        
        // Acusación
        const acuPorcentaje = acu.generadas > 0 ? Math.round((acu.respondidas / acu.generadas) * 100) : 0;
        if (document.getElementById('metricas-acu-generadas')) {
            document.getElementById('metricas-acu-generadas').textContent = acu.generadas;
            document.getElementById('metricas-acu-respondidas').textContent = acu.respondidas;
            document.getElementById('metricas-acu-porcentaje').textContent = acuPorcentaje + '%';
            document.getElementById('metricas-acu-bar').style.width = acuPorcentaje + '%';
            document.getElementById('metricas-acu-bar').className = `progress-fill ${acuPorcentaje >= 80 ? 'high' : acuPorcentaje >= 50 ? 'medium' : 'low'}`;
            document.getElementById('metricas-acu-validadas').textContent = acu.validadas;
            document.getElementById('metricas-acu-pendientes').textContent = acu.generadas - acu.respondidas - acu.sinContestar;
            document.getElementById('metricas-acu-sincontestar').textContent = acu.sinContestar;
        }
        
        // Totales
        const porcentajeGlobal = totalGeneradas > 0 ? Math.round((totalRespondidas / totalGeneradas) * 100) : 0;
        if (document.getElementById('metricas-total-generadas')) {
            document.getElementById('metricas-total-generadas').textContent = totalGeneradas;
            document.getElementById('metricas-total-respondidas').textContent = totalRespondidas;
            document.getElementById('metricas-total-porcentaje').textContent = porcentajeGlobal + '%';
            document.getElementById('metricas-total-porcentaje').style.color = porcentajeGlobal >= 80 ? 'var(--success)' : porcentajeGlobal >= 50 ? 'var(--warning)' : 'var(--danger)';
            document.getElementById('metricas-total-validadas').textContent = totalValidadas;
            document.getElementById('metricas-friccion-global').textContent = porcentajeGlobal + '%';
            document.getElementById('metricas-friccion-bar').style.width = porcentajeGlobal + '%';
            document.getElementById('metricas-friccion-bar').className = `progress-fill ${porcentajeGlobal >= 80 ? 'high' : porcentajeGlobal >= 50 ? 'medium' : 'low'}`;
        }
    },
    
    // Registrar en trazabilidad
    registrarTrazabilidad: function(preguntaId, accion, usuario, detalle, validacionIA) {
        const timestamp = new Date().toLocaleString('es-MX');
        
        const registro = {
            timestamp,
            preguntaId,
            accion,
            usuario,
            detalle,
            validacionIA
        };
        
        this.trazabilidad.push(registro);
        
        // Agregar a la tabla
        const tbody = document.getElementById('tbody-trazabilidad-friccion');
        if (tbody) {
            // Limpiar mensaje inicial si existe
            if (tbody.querySelector('td[colspan]')) {
                tbody.innerHTML = '';
            }
            
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td style="font-size: 0.75rem;">${timestamp}</td>
                <td><span class="pregunta-numero">${preguntaId.toUpperCase()}</span></td>
                <td><span class="badge-status ${accion === 'RESPUESTA' ? 'badge-success' : accion === 'SIN CONTESTAR' ? 'badge-warning' : 'badge-info'}">${accion}</span></td>
                <td style="font-size: 0.8rem;">${usuario}</td>
                <td style="font-size: 0.75rem; max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${detalle}</td>
                <td><span class="badge-status ${validacionIA === 'VALIDADA' ? 'badge-success' : validacionIA === 'RECHAZADA' ? 'badge-danger' : validacionIA === 'PARCIAL' ? 'badge-warning' : 'badge-secondary'}">${validacionIA}</span></td>
            `;
            tbody.insertBefore(fila, tbody.firstChild);
        }
    },
    
    // Exportar trazabilidad
    exportarTrazabilidad: function() {
        if (this.trazabilidad.length === 0) {
            showToast('No hay registros de trazabilidad para exportar', 'warning');
            return;
        }
        
        const contenido = {
            sistema: 'CeCoSAI v7.2',
            modulo: 'Fricción Lógica',
            fechaExportacion: new Date().toISOString(),
            estadisticas: {
                imputacion: this.estado.imputacion,
                acusacion: this.estado.acusacion
            },
            registros: this.trazabilidad
        };
        
        const blob = new Blob([JSON.stringify(contenido, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CeCoSAI_Trazabilidad_Friccion_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('✓ Trazabilidad exportada correctamente', 'success');
    }
};

window.CeCoSAI_Pagination = CeCoSAI_Pagination;
window.FriccionIA = FriccionIA;

// Inicializar contadores al cargar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        FriccionIA.actualizarContadores();
    }, 100);
});

// ============================================
// INICIALIZACIÓN GENERAL v7.0
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 CeCoSAI v7.0 MEJORADO - Inicializando...');
    
    // 1. Restaurar datos guardados
    const restored = CeCoSAI_Storage.restore();
    
    // 2. Configurar autosave
    setupAutosave();
    
    // 3. Configurar validación de formularios
    setupFormValidation();
    
    // 4. Inicializar paginación en tablas visibles
    setTimeout(() => {
        CeCoSAI_Pagination.init('tabla-actividades');
    }, 500);
    
    // 5. Mostrar mensaje de bienvenida
    if (!restored) {
        setTimeout(() => {
            showToast('Bienvenido a CeCoSAI v7.0 MEJORADO', 'success');
        }, 1000);
    }
    
    // 6. Configurar cierre de detenidos por defecto
    toggleDetenidos(false);
    
    // 7. Inicializar módulo de Resultados Investigativos
    if (typeof initResultadosInvestigativos === 'function') {
        initResultadosInvestigativos();
    }
    
    console.log('✅ CeCoSAI v7.0 MEJORADO - Listo');
});

// Guardar antes de cerrar la página
window.addEventListener('beforeunload', () => {
    CeCoSAI_Storage.save(false);
});
