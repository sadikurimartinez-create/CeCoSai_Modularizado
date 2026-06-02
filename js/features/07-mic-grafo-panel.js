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

window.initMIC = initMIC;
window.actualizarMIC = actualizarMIC;
window.descargarMIC = function () {
    if (typeof showToast === 'function') showToast('Descarga PNG del grafo MIC se implementará en una versión siguiente.', 'info');
};
window.exportarMICPDF = function () {
    if (typeof showToast === 'function') showToast('Exportación PDF del MIC pendiente de implementación.', 'info');
};
console.log("✅ Motor de Valoración MWA Activo y Validado");
window.autorizarCarpetaMIC = autorizarCarpetaMIC;
window.generarMICConIAWigmore = generarMICConIAWigmore;
