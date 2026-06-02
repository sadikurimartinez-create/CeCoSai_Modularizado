(function() {
// ============================================
// MÓDULO: RESULTADOS INVESTIGATIVOS - CORE
// ============================================

// Estado global del módulo
const ResultadosInvestigativos = {
    apiKey: localStorage.getItem('ri_api_key') || '',
    resultados: JSON.parse(localStorage.getItem('ri_resultados') || '[]'),
    actividadesPIC: [],
    contadorId: parseInt(localStorage.getItem('ri_contador_id') || '1')
};
window.ResultadosInvestigativos = ResultadosInvestigativos;

// Inicialización del módulo
function initResultadosInvestigativos() {
    console.log('🔧 Inicializando módulo Resultados Investigativos...');
    
    // Cargar actividades del PIC
    cargarActividadesDesdePIC();
    
    // Renderizar resultados existentes
    if (typeof renderizarResultados === 'function') renderizarResultados();
    
    // Actualizar métricas
    if (typeof actualizarMetricasRI === 'function') actualizarMetricasRI();
    
    // Configurar evento de selección de elemento
    const selectElemento = document.getElementById('ri-select-elemento');
    if (selectElemento) {
        selectElemento.addEventListener('change', function() {
            if (typeof cargarActividadesPorElemento === 'function') {
                cargarActividadesPorElemento(this.value);
            }
        });
    }
    
    console.log('✅ Módulo Resultados Investigativos inicializado');
}

// Cargar actividades desde el PIC
function cargarActividadesDesdePIC() {
    ResultadosInvestigativos.actividadesPIC = [];
    
    const tablaActividades = document.getElementById('tabla-actividades');
    if (tablaActividades) {
        const filas = tablaActividades.querySelectorAll('tbody tr');
        filas.forEach((fila, index) => {
            const celdas = fila.querySelectorAll('td');
            if (celdas.length >= 6) {
                const elemento = celdas[1]?.textContent?.trim() || '';
                const actividad = celdas[2]?.textContent?.trim() || '';
                const responsable = celdas[5]?.textContent?.trim() || '';
                
                if (!elemento.includes('RUIDO')) {
                    ResultadosInvestigativos.actividadesPIC.push({
                        id: index + 1,
                        elemento: elemento,
                        actividad: actividad,
                        responsable: responsable
                    });
                }
            }
        });
    }
    
    const selectElemento = document.getElementById('ri-select-elemento');
    const elementosUnicos = [...new Set(ResultadosInvestigativos.actividadesPIC.map(a => a.elemento))];
    
    selectElemento.innerHTML = '<option value="">-- Seleccione un elemento --</option>';
    elementosUnicos.forEach(elem => {
        const option = document.createElement('option');
        option.value = elem;
        option.textContent = elem;
        selectElemento.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initResultadosInvestigativos, 500);
});
})();