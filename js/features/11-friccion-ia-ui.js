// ============================================
// MÓDULO: FRICCIÓN LÓGICA IA - UI Y TRAZABILIDAD
// ============================================

FriccionIA.actualizarContadores = function() {
    const imp = this.estado.imputacion;
    const acu = this.estado.acusacion;
    
    const totalGeneradas = imp.generadas + acu.generadas;
    const totalRespondidas = imp.respondidas + acu.respondidas;
    const totalValidadas = imp.validadas + acu.validadas;
    const totalPendientes = totalGeneradas - totalRespondidas - imp.sinContestar - acu.sinContestar;
    const totalSinContestar = imp.sinContestar + acu.sinContestar;
    const porcentaje = totalGeneradas > 0 ? Math.round((totalRespondidas / totalGeneradas) * 100) : 0;
    
    // Panel principal Fricción
    if (document.getElementById('total-preguntas-generadas')) document.getElementById('total-preguntas-generadas').textContent = totalGeneradas;
    if (document.getElementById('total-preguntas-respondidas')) document.getElementById('total-preguntas-respondidas').textContent = totalRespondidas;
    if (document.getElementById('total-preguntas-pendientes')) document.getElementById('total-preguntas-pendientes').textContent = totalPendientes;
    if (document.getElementById('total-preguntas-sin-contestar')) document.getElementById('total-preguntas-sin-contestar').textContent = totalSinContestar;
    if (document.getElementById('friccion-porcentaje')) document.getElementById('friccion-porcentaje').textContent = porcentaje + '%';
    
    const barFriccion = document.getElementById('friccion-progress-bar');
    if (barFriccion) {
        barFriccion.style.width = porcentaje + '%';
        barFriccion.className = `progress-fill ${porcentaje >= 80 ? 'high' : porcentaje >= 50 ? 'medium' : 'low'}`;
    }
    
    const contImp = document.getElementById('contador-imputacion');
    if (contImp) {
        contImp.textContent = `${imp.respondidas} / ${imp.generadas}`;
        contImp.className = imp.respondidas >= imp.generadas ? 'badge-status badge-success' : 'badge-status badge-warning';
    }
    const contAcu = document.getElementById('contador-acusacion');
    if (contAcu) {
        contAcu.textContent = `${acu.respondidas} / ${acu.generadas}`;
        contAcu.className = acu.respondidas >= acu.generadas ? 'badge-status badge-success' : 'badge-status badge-warning';
    }
    
    // Métricas en la vista global
    if (this.actualizarMetricas) this.actualizarMetricas(imp, acu, totalGeneradas, totalRespondidas, totalValidadas);
    
    // Sincronizar Caso SAI
    if (typeof currentCase !== 'undefined' && currentCase && currentCase.mmi) {
        currentCase.mmi.preguntasGeneradas = totalGeneradas;
        currentCase.mmi.preguntasRespondidas = totalRespondidas;
        currentCase.mmi.preguntasSinContestar = totalSinContestar;
        currentCase.mmi.ultimaActualizacion = new Date().toISOString();
    }
    
    // Guardar estado local
    if (typeof CeCoSAI_Storage !== 'undefined' && CeCoSAI_Storage.save) {
        CeCoSAI_Storage.save(false);
    }
};

FriccionIA.actualizarMetricas = function(imp, acu, totalGeneradas, totalRespondidas, totalValidadas) {
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
};

FriccionIA.registrarTrazabilidad = function(preguntaId, accion, usuario, detalle, validacionIA) {
    const timestamp = new Date().toLocaleString('es-MX');
    const registro = { timestamp, preguntaId, accion, usuario, detalle, validacionIA };
    this.trazabilidad.push(registro);
    
    const tbody = document.getElementById('tbody-trazabilidad-friccion');
    if (tbody) {
        if (tbody.querySelector('td[colspan]')) tbody.innerHTML = '';
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
};

FriccionIA.marcarSinContestar = function(preguntaId) {
    const totalSinContestar = this.estado.imputacion.sinContestar + this.estado.acusacion.sinContestar;
    if (totalSinContestar >= 3) {
        if (typeof showToast === 'function') showToast('⚠️ Ya tiene 3 preguntas sin contestar. Debe responder antes de continuar.', 'warning');
        return;
    }
    const card = document.getElementById(`pregunta-${preguntaId}`);
    if (!card) return;
    const tipo = card.dataset.tipo;
    
    card.dataset.estado = 'sin-contestar';
    const estadoBadge = document.getElementById(`estado-${preguntaId}`);
    if (estadoBadge) { estadoBadge.className = 'pregunta-estado badge-status badge-warning'; estadoBadge.innerHTML = '<i class="fas fa-minus-circle"></i> Sin contestar'; }
    
    const respCont = document.getElementById(`respuesta-container-${preguntaId}`);
    if (respCont) {
        respCont.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-secondary);"><i class="fas fa-minus-circle" style="font-size: 2rem; margin-bottom: 10px;"></i><p>Pregunta marcada como sin contestar</p></div>`;
    }
    
    this.estado[tipo].sinContestar++;
    if (this.actualizarContadores) this.actualizarContadores();
    
    if (typeof currentCase !== 'undefined' && currentCase && currentCase.mmi) { currentCase.mmi.preguntasSinContestar++; currentCase.mmi.ultimaActualizacion = new Date().toISOString(); }
    if (typeof SAIEngine !== 'undefined' && SAIEngine && SAIEngine.mmi) { SAIEngine.mmi.registrarEvento('marcar_sin_contestar', { id: preguntaId, tipo }); }
    
    this.registrarTrazabilidad(preguntaId, 'SIN CONTESTAR', 'Fiscal', 'El Fiscal decidió no contestar esta pregunta', 'N/A');
    if (typeof showToast === 'function') showToast(`Pregunta marcada como sin contestar (${3 - totalSinContestar - 1} disponibles)`, 'warning');
};

FriccionIA.exportarTrazabilidad = function() {
    if (this.trazabilidad.length === 0) { if (typeof showToast === 'function') showToast('No hay registros de trazabilidad para exportar', 'warning'); return; }
    const contenido = { sistema: 'CeCoSAI v7.2', modulo: 'Fricción Lógica', fechaExportacion: new Date().toISOString(), estadisticas: { imputacion: this.estado.imputacion, acusacion: this.estado.acusacion }, registros: this.trazabilidad };
    const blob = new Blob([JSON.stringify(contenido, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `CeCoSAI_Trazabilidad_Friccion_${new Date().toISOString().slice(0,10)}.json`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    if (typeof showToast === 'function') showToast('✓ Trazabilidad exportada correctamente', 'success');
};

document.addEventListener('DOMContentLoaded', function() { setTimeout(() => { if (typeof FriccionIA !== 'undefined' && FriccionIA.actualizarContadores) { FriccionIA.actualizarContadores(); } }, 100); });
