// =============================================
// FUNCIONES PARA BLOQUES DE HIPÓTESIS (TEORÍA DEL CASO)
// =============================================

// Validar bloque (Fáctico, Probatorio o Jurídico)
function validarBloque(tipo) {
    const estadoElem = document.getElementById('estado-bloque-' + tipo);
    const obsElem = document.getElementById('obs-' + tipo);
    const contenidoElem = document.getElementById('contenido-' + tipo);
    
    estadoElem.className = 'badge-status badge-success';
    estadoElem.textContent = 'Validado';
    
    const observacion = obsElem.value.trim();
    if (observacion) {
        const nota = document.createElement('div');
        nota.style.cssText = 'margin-top: 12px; padding: 10px; background: #ecfdf5; border-radius: 6px; font-size: 0.85rem;';
        nota.innerHTML = '<i class="fas fa-user-check" style="color: #10b981;"></i> <strong>Observación del Fiscal:</strong> ' + observacion;
        contenidoElem.appendChild(nota);
    }
    
    if (typeof registrarAccionHipotesis === 'function') registrarAccionHipotesis(tipo, 'VALIDACIÓN', observacion || 'Sin observaciones adicionales');
    if (typeof showToast === 'function') showToast('✓ Bloque ' + tipo.charAt(0).toUpperCase() + tipo.slice(1) + ' validado correctamente', 'success');
    if (typeof verificarBloquesCompletos === 'function') verificarBloquesCompletos();
}

// Modificar bloque
function modificarBloque(tipo) {
    const estadoElem = document.getElementById('estado-bloque-' + tipo);
    const obsElem = document.getElementById('obs-' + tipo);
    
    estadoElem.className = 'badge-status badge-warning';
    estadoElem.textContent = 'En edición';
    
    obsElem.focus();
    obsElem.placeholder = 'Escriba las modificaciones requeridas para este bloque...';
    
    if (typeof showToast === 'function') showToast('⚠️ Bloque ' + tipo.charAt(0).toUpperCase() + tipo.slice(1) + ' en modo edición', 'warning');
}

// Regenerar bloque con IA
function regenerarBloque(tipo) {
    const contenidoElem = document.getElementById('contenido-' + tipo);
    const estadoElem = document.getElementById('estado-bloque-' + tipo);
    const obsElem = document.getElementById('obs-' + tipo);
    
    estadoElem.className = 'badge-status badge-info';
    estadoElem.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Regenerando...';
    
    setTimeout(function() {
        let nuevoContenido = '';
        if (tipo === 'factico') nuevoContenido = generarContenidoFacticoIA(obsElem.value);
        else if (tipo === 'probatorio') nuevoContenido = generarContenidoProbatorioIA(obsElem.value);
        else if (tipo === 'juridico') nuevoContenido = generarContenidoJuridicoIA(obsElem.value);
        
        contenidoElem.innerHTML = nuevoContenido;
        estadoElem.className = 'badge-status badge-warning';
        estadoElem.textContent = 'Regenerado - Pendiente validación';
        
        obsElem.value = '';
        if (typeof registrarAccionHipotesis === 'function') registrarAccionHipotesis(tipo, 'REGENERACIÓN IA', 'Contenido regenerado por solicitud del fiscal');
        if (typeof showToast === 'function') showToast('✓ Bloque ' + tipo.charAt(0).toUpperCase() + tipo.slice(1) + ' regenerado con IA', 'success');
    }, 1500);
}

// Funciones de generación de contenido con IA
function generarContenidoFacticoIA(observaciones) {
    const obs = observaciones ? '<div style="margin-top: 12px; padding: 10px; background: #fef3c7; border-radius: 6px;"><i class="fas fa-lightbulb" style="color: #f59e0b;"></i> <strong>Ajuste aplicado:</strong> ' + observaciones + '</div>' : '';
    return '<p style="line-height: 1.6; text-align: justify;"><strong>HECHOS CRONOLÓGICOS (REGENERADO):</strong></p>' +
    '<ol style="padding-left: 20px; line-height: 1.8;">' +
    '<li><strong>Marzo 2025:</strong> El Ing. Roberto "N", aprovechando su cargo de alto mando, convoca reuniones secretas con los coinculpados para diseñar el esquema de desvío.</li>' +
    '<li><strong>Abril 2025:</strong> Marco "N" constituye "Logística y Seguridad del Centro S.A. de C.V." como vehículo para facturar operaciones ficticias.</li>' +
    '<li><strong>Mayo-Julio 2025:</strong> Se ejecuta licitación simulada LICIT-2025-0347 para adquisición de 15 patrullas y equipo táctico valorado en millones de pesos.</li>' +
    '<li><strong>Agosto 2025:</strong> Entrega de mercancía simulada en bodega de Calle Plomo #105. La Arq. Elena Santoyo documenta discrepancias en el inventario.</li>' +
    '<li><strong>Septiembre 2025:</strong> Inician amenazas sistemáticas contra Elena Santoyo. Sergio "N" utiliza vehículos oficiales para intimidación.</li>' +
    '<li><strong>Octubre-Diciembre 2025:</strong> Distribución de ganancias ilícitas según acuerdo previo: Roberto 40%, Claudia 20%, Sergio 10%, Marco el resto.</li>' +
    '<li><strong>20 de Enero 2026:</strong> Atentado contra el periodista Juan Carlos Ruiz en Av. López Mateos. 3 impactos de bala. Sobrevive con secuelas permanentes.</li>' +
    '</ol>' + obs;
}

function generarContenidoProbatorioIA(observaciones) {
    const obs = observaciones ? '<div style="margin-top: 12px; padding: 10px; background: #fef3c7; border-radius: 6px;"><i class="fas fa-lightbulb" style="color: #f59e0b;"></i> <strong>Ajuste aplicado:</strong> ' + observaciones + '</div>' : '';
    return '<p style="line-height: 1.6;"><strong>MEDIOS DE PRUEBA (REGENERADO CON IA):</strong></p><div style="margin-top: 12px;"><div style="padding: 10px; background: #dcfce7; border-left: 4px solid #22c55e; margin-bottom: 8px;"><strong>DOCUMENTALES:</strong> Expediente licitación (140 fojas) • 23 facturas falsas • Registros contables dobles • Bitácoras vehículos oficiales</div><div style="padding: 10px; background: #dcfce7; border-left: 4px solid #22c55e; margin-bottom: 8px;"><strong>TESTIMONIALES:</strong> 7 testigos (Héctor Luna, Beatriz Cano, Ricardo Fuentes, Doña Mary, Manuel Esparza, Dra. Ana Paula, Luis Pedroza)</div><div style="padding: 10px; background: #dbeafe; border-left: 4px solid #3b82f6; margin-bottom: 8px;"><strong>PERICIALES:</strong> Dictamen autenticidad documental • Análisis contable • Dictamen balístico (pendiente) • Informática forense</div><div style="padding: 10px; background: #fef3c7; border-left: 4px solid #f59e0b; margin-bottom: 8px;"><strong>INFORMES:</strong> UIF rastreo transferencias • Investigación patrimonial Roberto y Marco • Registros personal policial Sergio</div><div style="padding: 10px; background: #fee2e2; border-left: 4px solid #ef4444; margin-bottom: 8px;"><strong>PENDIENTES:</strong> Testimonio Elena Santoyo (localización) • Dictamen balístico completo • Entrevista Juan Carlos Ruiz (recuperación)</div></div>' + obs;
}

function generarContenidoJuridicoIA(observaciones) {
    const obs = observaciones ? '<div style="margin-top: 12px; padding: 10px; background: #fef3c7; border-radius: 6px;"><i class="fas fa-lightbulb" style="color: #f59e0b;"></i> <strong>Ajuste aplicado:</strong> ' + observaciones + '</div>' : '';
    return '<p style="line-height: 1.6;"><strong>ANÁLISIS JURÍDICO (REGENERADO CON IA):</strong></p><div style="margin-top: 12px;"><table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;"><tr style="background: #f1f5f9;"><th style="padding: 8px; text-align: left;">Delito</th><th style="padding: 8px;">Imputados</th><th style="padding: 8px;">Pena</th><th style="padding: 8px;">Grado</th></tr><tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Peculado</strong> (Art. 223 CPF)</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Roberto, Claudia</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">2-14 años</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Autor/Coautor</td></tr><tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Fraude</strong> (Art. 386 CPF)</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Roberto, Marco</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">3-12 años</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Autor/Coautor</td></tr><tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Asociación Delictuosa</strong> (Art. 164 CPF)</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Los 4</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">5-10 años</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Miembros</td></tr><tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Tentativa Homicidio</strong> (Art. 302/63 CPF)</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Sergio (otros inv.)</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Hasta 20 años</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Coautor</td></tr><tr><td style="padding: 8px;"><strong>Amenazas</strong> (Art. 282 CPF)</td><td style="padding: 8px;">Los 4</td><td style="padding: 8px;">6 meses-2 años</td><td style="padding: 8px;">Coautores</td></tr></table></div><div style="margin-top: 12px; padding: 10px; background: #dbeafe; border-radius: 6px;"><i class="fas fa-balance-scale" style="color: #3b82f6;"></i> <strong>IA:</strong> Concurso real de delitos. Pena máxima estimada: 50+ años (límite 60 años Art. 25 CPF).</div>' + obs;
}

window.validarBloque = validarBloque;
window.modificarBloque = modificarBloque;
window.regenerarBloque = regenerarBloque;