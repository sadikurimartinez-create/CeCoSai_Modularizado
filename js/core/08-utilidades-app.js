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
});

