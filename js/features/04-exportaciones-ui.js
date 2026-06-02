// ============================================
// UI DE ESCRITOS PROCESALES
// ============================================

// Actualizar barras de progreso en la pestaña Escritos
function actualizarAcreditacionEscritos() {
    var tipos = ['audiencia', 'acusacion', 'descubrimiento'];
    var ids = ['escrito1', 'escrito2', 'escrito3'];
    
    tipos.forEach(function(tipo, idx) {
        var pct = calcularAcreditacionPorTipo(tipo);
        var barElem = document.getElementById(ids[idx] + '-bar');
        var pctElem = document.getElementById(ids[idx] + '-pct');
        
        if (barElem && pctElem) {
            barElem.style.width = pct + '%';
            pctElem.textContent = pct + '%';
            barElem.className = 'progress-fill ' + (pct >= 80 ? 'high' : pct >= 60 ? 'medium' : 'low');
        }
    });
}

// Función principal para generar y mostrar escrito
function generarEscrito(tipo) {
    var title = document.getElementById('modal-escrito-title');
    var docBody = document.getElementById('documento-read-only');
    var iaContainer = document.getElementById('ai-suggestions-container');
    var listaSugerencias = document.getElementById('lista-sugerencias-escrito');
    var scoreDisplay = document.getElementById('acreditacion-score-display');
    
    // Títulos según tipo
    var titulos = {
        'audiencia': '<i class="fas fa-gavel"></i> Vista Previa: Solicitud de Audiencia Inicial',
        'acusacion': '<i class="fas fa-file-signature"></i> Vista Previa: Escrito de Acusación',
        'descubrimiento': '<i class="fas fa-folder-open"></i> Vista Previa: Constancia de Descubrimiento Probatorio'
    };
    
    if (title) title.innerHTML = titulos[tipo] || '<i class="fas fa-file-contract"></i> Vista Previa';
    if (docBody) docBody.innerHTML = generarContenidoEscrito(tipo);
    
    var acreditacion = calcularAcreditacionPorTipo(tipo);
    if (scoreDisplay) scoreDisplay.textContent = acreditacion + "%";
    if (listaSugerencias) listaSugerencias.innerHTML = "";
    
    if (acreditacion < 80) {
        if (iaContainer) iaContainer.style.display = "block";
        if (tipo === 'audiencia' && listaSugerencias) {
            listaSugerencias.innerHTML += '<li><strong>Individualización (75%):</strong> Completar investigación patrimonial de los 4 imputados (Roberto, Marco, Claudia, Sergio).</li>';
            listaSugerencias.innerHTML += '<li><strong>Hechos:</strong> Obtener testimonio de Elena Santoyo (víctima de amenazas, localización pendiente).</li>';
            listaSugerencias.innerHTML += '<li><strong>Medidas Cautelares:</strong> Documentar riesgo de obstaculización (atentado contra periodista Juan Carlos Ruiz).</li>';
        } else if (tipo === 'acusacion' && listaSugerencias) {
            listaSugerencias.innerHTML += '<li><strong>Individualización (60%):</strong> Consulta de registros de personal policial para Sergio "N" y constancia de servidor público para Roberto "N" y Claudia "N".</li>';
            listaSugerencias.innerHTML += '<li><strong>Medios de Prueba (72%):</strong> Completar: Dictamen balístico (atentado), Entrevista Juan Carlos Ruiz, Análisis contable doble.</li>';
            listaSugerencias.innerHTML += '<li><strong>Clasificación Jurídica (78%):</strong> Validar concurso real: Peculado + Fraude + Asociación Delictuosa + Tentativa Homicidio.</li>';
        } else if (tipo === 'descubrimiento' && listaSugerencias) {
            listaSugerencias.innerHTML += '<li><strong>Documentos Financieros:</strong> Incluir informes UIF de rastreo de transferencias bancarias.</li>';
            listaSugerencias.innerHTML += '<li><strong>Facturas Falsas:</strong> Agregar dictamen de autenticidad documental de las facturas de "Logística y Seguridad del Centro".</li>';
            listaSugerencias.innerHTML += '<li><strong>Registros Contables:</strong> Incorporar análisis de registros contables dobles del contador Luis Pedroza.</li>';
        }
    } else {
        if (iaContainer) iaContainer.style.display = "none";
    }
    
    registrarEscritoEnHistorial(tipo, acreditacion);
    if (typeof openModal === 'function') openModal('modal-escrito-preview');
}

var contadorEscritos = 0;
function registrarEscritoEnHistorial(tipo, acreditacion) {
    contadorEscritos++;
    var tbody = document.getElementById('historial-escritos-body');
    if (!tbody) return;
    var fechaActual = new Date().toLocaleString('es-MX');
    var tiposNombres = { 'audiencia': 'Solicitud de Audiencia Inicial', 'acusacion': 'Escrito de Acusación', 'descubrimiento': 'Constancia de Descubrimiento' };
    var estadoClass = acreditacion >= 80 ? 'badge-success' : 'badge-warning';
    var estadoTexto = acreditacion >= 80 ? 'Completo' : 'Con Sugerencias IA';
    
    if (tbody.querySelector('td[colspan]')) tbody.innerHTML = '';
    
    var newRow = document.createElement('tr');
    newRow.innerHTML = 
        '<td><strong>ESC-' + String(contadorEscritos).padStart(3, '0') + '</strong></td>' +
        '<td>' + (tiposNombres[tipo] || tipo) + '</td>' +
        '<td>' + fechaActual + '</td>' +
        '<td><strong>' + acreditacion + '%</strong></td>' +
        '<td><span class="badge-status ' + estadoClass + '">' + estadoTexto + '</span></td>' +
        '<td>' +
            '<button class="btn btn-primary btn-sm" data-call="generarEscrito" data-call-arg="' + tipo + '"><i class="fas fa-eye"></i></button> ' +
            '<button class="btn btn-secondary btn-sm" data-call="exportarWordReal"><i class="fas fa-download"></i></button>' +
        '</td>';
    tbody.insertBefore(newRow, tbody.firstChild);
}

function validarSugerenciasEscritosAI() {
    if (typeof showToast === 'function') showToast('✓ Sugerencias validadas y exportadas al PIC', 'success');
    var iaContainer = document.getElementById('ai-suggestions-container');
    if (iaContainer) iaContainer.style.display = "none";
    setTimeout(function() { actualizarAcreditacionEscritos(); }, 500);
}

function rechazarSugerenciasEscritosAI() { if (typeof showToast === 'function') showToast('Sugerencias rechazadas. Registrado para trazabilidad.', 'warning'); }
function validarSugerenciasEscrito() { validarSugerenciasEscritosAI(); }

document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.showTab === 'function') {
        var originalShowTab = window.showTab;
        window.showTab = function(tabId) { originalShowTab(tabId); if (tabId === 'escritos') actualizarAcreditacionEscritos(); };
    }
});

window.actualizarAcreditacionEscritos = actualizarAcreditacionEscritos;
window.generarEscrito = generarEscrito;
window.registrarEscritoEnHistorial = registrarEscritoEnHistorial;
window.validarSugerenciasEscrito = validarSugerenciasEscrito;