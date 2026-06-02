(function() {
// =============================================
// FUNCIONES PARA HIPÓTESIS INICIAL EN NC
// =============================================

// Generar hipótesis inicial con IA
function generarHipotesisInicialNC() {
    const btnGenerar = document.getElementById('btn-generar-hipotesis');
    const contenedorGenerar = document.getElementById('contenedor-generar-hipotesis');
    const contenedorGenerada = document.getElementById('contenedor-hipotesis-generada');
    const estadoHipotesis = document.getElementById('estado-hipotesis-nc');
    
    // Mostrar cargando
    btnGenerar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analizando Noticia Criminal...';
    btnGenerar.disabled = true;
    estadoHipotesis.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando IA...';
    estadoHipotesis.className = 'badge-status badge-info';
    
    // Simular procesamiento IA
    setTimeout(function() {
        // Generar texto de hipótesis
        const textoHipotesis = 'Durante el período comprendido entre marzo de 2025 y enero de 2026, el <strong>Ingeniero Roberto "N"</strong>, aprovechando su posición como alto mando en la administración pública, en coautoría con el <strong>Licenciado Marco "N"</strong> (propietario de la empresa fachada "Logística y Seguridad del Centro"), la <strong>Licenciada Claudia "N"</strong> (encargada de autorizaciones de pago) y el <strong>Comandante Sergio "N"</strong> (elemento policial), ejecutaron de manera concertada y sistemática un esquema de extracción de recursos públicos mediante la simulación de un proceso de licitación para la adquisición de patrullas y equipo táctico. Los imputados utilizaron facturación falsa y entregaron mercancía simulada (cajas con papel periódico y piedras en lugar del equipo real), distribuyendo posteriormente las ganancias ilícitas según acuerdo previo: Roberto 40%, Claudia 20%, Sergio 10% y Marco el resto. Ante el descubrimiento de las irregularidades por parte de la <strong>Arq. Elena Santoyo</strong> (jefa de almacén), procedieron a amenazarla hasta forzarla a abandonar el estado. Posteriormente, el 20 de enero de 2026, tras la publicación de una investigación periodística, emboscaron y dispararon contra el periodista <strong>Juan Carlos Ruiz</strong> en Av. López Mateos, resultando este con secuelas permanentes.';
        
        document.getElementById('texto-hipotesis-generada').innerHTML = textoHipotesis;
        
        // Llenar lista de sujetos
        const listaSujetos = document.getElementById('lista-sujetos-hipotesis');
        listaSujetos.innerHTML = '';
        datosHipotesisNC.sujetos.forEach(function(sujeto) {
            listaSujetos.innerHTML += '<li><strong>' + sujeto.nombre + '</strong> (' + sujeto.rol + ')</li>';
        });
        
        // Llenar lista de delitos
        const listaDelitos = document.getElementById('lista-delitos-hipotesis');
        listaDelitos.innerHTML = '';
        datosHipotesisNC.delitos.forEach(function(delito) {
            listaDelitos.innerHTML += '<li>' + delito.nombre + ' (' + delito.articulo + ')</li>';
        });
        
        // Llenar lista de pendientes
        const listaPendientes = document.getElementById('lista-pendientes-hipotesis');
        listaPendientes.innerHTML = '';
        datosHipotesisNC.pendientes.forEach(function(pendiente) {
            listaPendientes.innerHTML += '<li>' + pendiente + '</li>';
        });
        
        // Mostrar contenedor de hipótesis generada
        contenedorGenerar.style.display = 'none';
        contenedorGenerada.style.display = 'block';
        
        // Actualizar estado
        estadoHipotesis.className = 'badge-status badge-warning';
        estadoHipotesis.textContent = 'Pendiente Validación';
        
        // Habilitar botones
        document.getElementById('btn-validar-hipotesis').disabled = false;
        document.getElementById('btn-modificar-hipotesis').disabled = false;
        document.getElementById('btn-exportar-hipotesis').disabled = false;
        document.getElementById('btn-regenerar-hipotesis').style.display = 'inline-block';
        
        if (typeof showToast === 'function') showToast('✓ Hipótesis inicial generada exitosamente por IA', 'success');
        
        // Registrar en trazabilidad
        if (typeof FriccionIA !== 'undefined' && FriccionIA.trazabilidad) {
            FriccionIA.trazabilidad.push({
                fecha: new Date().toLocaleString('es-MX'),
                elemento: 'NC-HIPÓTESIS-INICIAL',
                accion: 'GENERACIÓN IA',
                detalle: 'Hipótesis inicial generada a partir del análisis de la Noticia Criminal',
                usuario: 'Sistema IA'
            });
        }
    }, 2000);
}

// Validar hipótesis NC
function validarHipotesisNC() {
    const estadoHipotesis = document.getElementById('estado-hipotesis-nc');
    const obsHipotesis = document.getElementById('obs-hipotesis-nc');
    const observacion = obsHipotesis.value.trim();
    
    // Actualizar estado
    estadoHipotesis.className = 'badge-status badge-success';
    estadoHipotesis.textContent = 'Validada por Fiscal';
    
    // Si hay observaciones, agregarlas visualmente
    if (observacion) {
        const contenedor = document.getElementById('contenedor-hipotesis-generada');
        const nota = document.createElement('div');
        nota.style.cssText = 'margin-top: 16px; padding: 12px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;';
        nota.innerHTML = '<i class="fas fa-user-check" style="color: #10b981;"></i> <strong>Observación del Fiscal:</strong> ' + observacion;
        contenedor.appendChild(nota);
    }
    
    // Deshabilitar botones de modificación
    document.getElementById('btn-validar-hipotesis').disabled = true;
    document.getElementById('btn-modificar-hipotesis').disabled = true;
    document.getElementById('btn-regenerar-hipotesis').style.display = 'none';
    
    // Actualizar hipótesis heredada en pestaña Hipótesis
    const hipotesisHeredada = document.querySelector('#tab-hipotesis .hypothesis-card p');
    if (hipotesisHeredada) {
        hipotesisHeredada.innerHTML = document.getElementById('texto-hipotesis-generada').innerHTML;
    }
    
    if (typeof showToast === 'function') showToast('✓ Hipótesis validada y sincronizada con pestaña Hipótesis', 'success');
    if (typeof registrarAccionHipotesis === 'function') registrarAccionHipotesis('NC-HIPÓTESIS-INICIAL', 'VALIDACIÓN', observacion || 'Hipótesis validada sin observaciones adicionales');
}

// Modificar hipótesis NC
function modificarHipotesisNC() {
    const estadoHipotesis = document.getElementById('estado-hipotesis-nc');
    const obsHipotesis = document.getElementById('obs-hipotesis-nc');
    
    estadoHipotesis.className = 'badge-status badge-warning';
    estadoHipotesis.textContent = 'En Modificación';
    
    obsHipotesis.focus();
    obsHipotesis.placeholder = 'Describa las modificaciones requeridas a la hipótesis. Al hacer clic en "Regenerar con IA", se aplicarán sus observaciones...';
    
    if (typeof showToast === 'function') showToast('⚠️ Hipótesis en modo modificación. Escriba sus observaciones y regenere.', 'warning');
}

// Regenerar hipótesis NC
function regenerarHipotesisNC() {
    const estadoHipotesis = document.getElementById('estado-hipotesis-nc');
    const obsHipotesis = document.getElementById('obs-hipotesis-nc');
    const observacion = obsHipotesis.value.trim();
    
    estadoHipotesis.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Regenerando...';
    estadoHipotesis.className = 'badge-status badge-info';
    
    setTimeout(function() {
        let textoAjustado = 'Durante el período comprendido entre <strong>marzo de 2025</strong> y <strong>enero de 2026</strong>, el <strong>Ingeniero Roberto "N"</strong>, en su calidad de servidor público de alto rango, diseñó y ejecutó en coautoría con <strong>Marco "N"</strong>, <strong>Claudia "N"</strong> y <strong>Sergio "N"</strong>, un esquema delictivo para la extracción sistemática de recursos del erario público. El modus operandi consistió en: (1) simular un proceso de licitación pública, (2) crear una empresa fachada para facturar operaciones ficticias, (3) entregar mercancía simulada, y (4) distribuir las ganancias ilícitas. Ante el riesgo de exposición, los imputados procedieron a intimidar testigos y atentar contra la vida del periodista que investigaba el caso.';
        
        if (observacion) {
            textoAjustado += '<br><br><em style="color: #3b82f6;">[Ajuste aplicado según observaciones del Fiscal: ' + observacion + ']</em>';
        }
        
        document.getElementById('texto-hipotesis-generada').innerHTML = textoAjustado;
        estadoHipotesis.className = 'badge-status badge-warning';
        estadoHipotesis.textContent = 'Regenerada - Pendiente Validación';
        obsHipotesis.value = '';
        
        document.getElementById('btn-validar-hipotesis').disabled = false;
        
        if (typeof showToast === 'function') showToast('✓ Hipótesis regenerada con las observaciones aplicadas', 'success');
        if (typeof registrarAccionHipotesis === 'function') registrarAccionHipotesis('NC-HIPÓTESIS-INICIAL', 'REGENERACIÓN IA', 'Regenerada con observaciones: ' + (observacion || 'ninguna'));
    }, 1500);
}

// Exportar hipótesis al PIC
function exportarHipotesisPIC() {
    const estadoHipotesis = document.getElementById('estado-hipotesis-nc');
    
    if (!estadoHipotesis.textContent.includes('Validada')) {
        if (typeof showToast === 'function') showToast('⚠️ Debe validar la hipótesis antes de exportarla al PIC', 'warning');
        return;
    }
    
    if (typeof showToast === 'function') showToast('✓ Hipótesis exportada al Plan de Investigación Criminal (PIC)', 'success');
    
    setTimeout(function() {
        if (typeof showTab === 'function') showTab('tab-pic');
    }, 1000);
    
    if (typeof registrarAccionHipotesis === 'function') registrarAccionHipotesis('NC-HIPÓTESIS-INICIAL', 'EXPORTACIÓN A PIC', 'Hipótesis validada exportada al Plan de Investigación Criminal');
}

// Generar más cuestionamientos
function generarMasCuestionamientos() {
    if (typeof showToast === 'function') showToast('Generando nuevos cuestionamientos con IA...', 'success');
}

window.generarHipotesisInicialNC = generarHipotesisInicialNC;
window.validarHipotesisNC = validarHipotesisNC;
window.modificarHipotesisNC = modificarHipotesisNC;
window.regenerarHipotesisNC = regenerarHipotesisNC;
window.exportarHipotesisPIC = exportarHipotesisPIC;
window.generarMasCuestionamientos = generarMasCuestionamientos;
})();