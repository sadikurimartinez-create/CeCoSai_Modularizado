(function() {
function abrirPanelInferenciaMic(info) {
    var backdrop = document.getElementById('mic-inferencia-backdrop');
    if (!backdrop) return;
    var chip = document.getElementById('mic-inferencia-tipo-chip');
    var naturalezaEl = document.getElementById('mic-inferencia-naturaleza');
    var descripcionEl = document.getElementById('mic-inferencia-descripcion');
    var explicacionEl = document.getElementById('mic-inferencia-explicacion-texto');
    var icono = document.getElementById('mic-inferencia-icono');

    var tipoMic = info.tipoMic || 'elemento';
    var esArista = info.tipo === 'arista';

    if (chip) {
        chip.textContent = (esArista ? 'Arista' : 'Nodo') + ' · ' + (tipoMic || '').toString().toUpperCase();
    }
    if (naturalezaEl) naturalezaEl.textContent = info.naturaleza || 'Elemento del MIC';
    if (descripcionEl) descripcionEl.textContent = info.descripcion || 'Sin descripción registrada.';
    if (explicacionEl) explicacionEl.innerHTML = '<strong>Explicación lógica:</strong> ' + (info.explicacion_logica || 'Sin explicación registrada para este elemento.');

    if (icono) {
        var fondo = '#0f172a';
        var borde = '#38bdf8';
        var color = '#7dd3fc';
        var iconClass = 'fas fa-project-diagram';

        if (tipoMic === 'probandum') {
            fondo = '#022c22'; borde = '#22c55e'; color = '#bbf7d0'; iconClass = 'fas fa-balance-scale';
        } else if (tipoMic === 'atomoTHD') {
            fondo = '#451a03'; borde = '#f97316'; color = '#fed7aa'; iconClass = 'fas fa-layer-group';
        } else if (tipoMic === 'testimonio') {
            fondo = '#0b1120'; borde = '#38bdf8'; color = '#bfdbfe'; iconClass = 'fas fa-user-edit';
        } else if (tipoMic === 'hecho') {
            fondo = '#052e16'; borde = '#22c55e'; color = '#bbf7d0'; iconClass = 'fas fa-gavel';
        } else if (tipoMic === 'indicio') {
            fondo = '#111827'; borde = '#eab308'; color = '#facc15'; iconClass = 'fas fa-search';
        } else if (tipoMic === 'eslabon') {
            fondo = '#111827'; borde = '#f97316'; color = '#fed7aa'; iconClass = 'fas fa-exclamation-triangle';
        } else if (tipoMic === 'inferencia') {
            fondo = '#020617'; borde = '#38bdf8'; color = '#38bdf8'; iconClass = 'fas fa-share-alt';
        }

        icono.style.background = fondo;
        icono.style.border = '1px solid ' + borde;
        icono.style.color = color;
        icono.innerHTML = '<i class="' + iconClass + '"></i>';
    }

    backdrop.classList.add('visible');
}

function cerrarPanelInferenciaMic(event) {
    if (event) event.preventDefault();
    var backdrop = document.getElementById('mic-inferencia-backdrop');
    if (backdrop) {
        backdrop.classList.remove('visible');
    }
}

window.descargarMIC = function () {
    if (typeof showToast === 'function') showToast('Descarga PNG del grafo MIC se implementará en una versión siguiente.', 'info');
};

function exportarMICWord() {
    if (!window.MIC_Module || !window.MIC_Module.nodesDS) {
        if (typeof showToast === 'function') showToast('No hay datos en el MIC para exportar.', 'warning');
        return;
    }

    var nodos = window.MIC_Module.nodesDS.get();
    var probandum = nodos.find(function(n) { return n.tipoMic === 'probandum'; });
    var atomos = nodos.filter(function(n) { return n.tipoMic === 'atomoTHD'; });
    var evidencias = nodos.filter(function(n) { return n.tipoMic === 'hecho' || n.tipoMic === 'testimonio' || n.tipoMic === 'indicio'; });
    var eslabones = nodos.filter(function(n) { return n.tipoMic === 'eslabon'; });

    var htmlContent = '<h1 style="text-align: center; font-family: Arial;">Informe de Mapa de Investigación Criminal (MIC)</h1>' +
        '<p><strong>Fecha de exportación:</strong> ' + new Date().toLocaleString('es-MX') + '</p><hr>' +
        '<h2>1. Conclusión Principal (Probandum)</h2>' +
        '<p>' + (probandum ? probandum.descripcion : 'No definido') + '</p>' +
        '<h2>2. Átomos de la Teoría Heptatómica (THD)</h2><ul>' +
        atomos.map(function(a) { return '<li><strong>' + (a.label || '').replace(/\n/g, ' ') + ':</strong> ' + a.descripcion + '</li>'; }).join('') +
        '</ul><h2>3. Elementos Probatorios e Indiciarios</h2>' +
        '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial; font-size: 11pt;">' +
        '<tr style="background-color: #f2f2f2;"><th>Tipo</th><th>Descripción</th><th>Naturaleza</th></tr>' +
        evidencias.map(function(e) { return '<tr><td>' + (e.tipoMic || '').toUpperCase() + '</td><td>' + e.descripcion + '</td><td>' + e.naturaleza + '</td></tr>'; }).join('') +
        '</table><h2>4. Eslabones Perdidos (Riesgos Metodológicos)</h2><ul>' +
        (eslabones.length > 0 ? eslabones.map(function(e) { return '<li>' + e.descripcion + '</li>'; }).join('') : '<li>No se detectaron eslabones perdidos.</li>') +
        '</ul><br><p style="font-size: 10pt; color: #666; text-align: center;">Generado automáticamente por CeCoSAI v9.0</p>';

    var blob = new Blob(['\ufeff', '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Informe MIC</title></head><body>' + htmlContent + '</body></html>'], { type: 'application/msword' });

    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Informe_MIC_CeCoSAI_' + new Date().toISOString().slice(0,10) + '.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof showToast === 'function') showToast('✓ Informe MIC exportado a Word correctamente.', 'success');
}

window.exportarMICPDF = function () {
    if (typeof showToast === 'function') showToast('La exportación a PDF ha sido reemplazada por el Informe Word.', 'info');
};
console.log("✅ Motor de Valoración MWA Activo y Validado");

window.abrirPanelInferenciaMic = abrirPanelInferenciaMic;
window.cerrarPanelInferenciaMic = cerrarPanelInferenciaMic;
window.exportarMICWord = exportarMICWord;
})();
