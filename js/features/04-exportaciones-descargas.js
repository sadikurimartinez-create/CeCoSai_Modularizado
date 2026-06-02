(function() {
// ============================================
// DESCARGA DE ESCRITOS PROCESALES (WORD)
// ============================================

function exportarWordReal() {
    var docBody = document.getElementById('documento-read-only');
    var docContent = docBody ? docBody.innerHTML : '';
    var blob = new Blob(['\
        <!DOCTYPE html>\
        <html>\
        <head>\
            <meta charset="utf-8">\
            <title>Escrito Procesal - CeCoSAI</title>\
            <style>\
                body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.8; padding: 40px; }\
                strong { font-weight: bold; }\
            </style>\
        </head>\
        <body>\
            ' + docContent + '\
            <hr style="margin-top:50px;">\
            <p style="font-size:9pt; color:#666;">Generado por CeCoSAI v7.2 - Sistema Integral de Gestión de Investigación Criminal</p>\
            <p style="font-size:9pt; color:#666;">Trazabilidad ID: ESC-' + Date.now() + '</p>\
        </body>\
        </html>\
    '], { type: 'application/msword' });
    
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Escrito_CeCoSAI_' + new Date().toISOString().slice(0,10) + '.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (typeof showToast === 'function') showToast('✓ Documento exportado correctamente', 'success');
}

function exportarEscritoDirecto(tipo) {
    var nombreArchivos = {
        'audiencia': 'Solicitud_Audiencia_Inicial',
        'acusacion': 'Escrito_Acusacion',
        'descubrimiento': 'Constancia_Descubrimiento_Probatorio'
    };
    var contenido = typeof generarContenidoEscrito === 'function' ? generarContenidoEscrito(tipo) : '';
    var blob = new Blob(['\
        <!DOCTYPE html>\
        <html>\
        <head>\
            <meta charset="utf-8">\
            <title>' + (nombreArchivos[tipo] || 'Escrito') + ' - CeCoSAI</title>\
            <style>\
                body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.8; padding: 40px; max-width: 800px; margin: 0 auto; }\
                strong { font-weight: bold; }\
                p { margin-bottom: 10px; text-align: justify; }\
                ul { margin: 10px 0; padding-left: 25px; }\
                li { margin-bottom: 5px; }\
                table { width: 100%; border-collapse: collapse; margin: 15px 0; }\
                td, th { border: 1px solid #ccc; padding: 8px; }\
                th { background: #f0f0f0; }\
            </style>\
        </head>\
        <body>\
            ' + contenido + '\
            <hr style="margin-top:50px; border: 1px solid #ccc;">\
            <p style="font-size:9pt; color:#666; text-align:center;">Generado por CeCoSAI v7.2 - Sistema Integral de Gestión de Investigación Criminal</p>\
            <p style="font-size:9pt; color:#666; text-align:center;">Trazabilidad ID: ESC-' + tipo.toUpperCase() + '-' + Date.now() + '</p>\
            <p style="font-size:9pt; color:#666; text-align:center;">Fecha de generación: ' + new Date().toLocaleString('es-MX') + '</p>\
        </body>\
        </html>\
    '], { type: 'application/msword' });
    var url = URL.createObjectURL(blob); var a = document.createElement('a'); a.href = url; var filename = nombreArchivos[tipo] || 'Escrito'; a.download = filename + '_CeCoSAI_' + new Date().toISOString().slice(0,10) + '.doc'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    if (typeof registrarEscritoEnHistorial === 'function' && typeof calcularAcreditacionPorTipo === 'function') registrarEscritoEnHistorial(tipo, calcularAcreditacionPorTipo(tipo));
    if (typeof showToast === 'function') showToast('✓ ' + filename.replace(/_/g, ' ') + ' exportado correctamente a Word', 'success');
}
window.exportarWordReal = exportarWordReal; 
window.exportarEscritoDirecto = exportarEscritoDirecto;
})();