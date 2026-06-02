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
