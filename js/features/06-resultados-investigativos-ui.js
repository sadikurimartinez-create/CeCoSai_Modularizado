(function() {
// ============================================
// MÓDULO: RESULTADOS INVESTIGATIVOS - UI
// ============================================

// Cargar actividades filtradas por elemento
function cargarActividadesPorElemento(elemento) {
    const selectActividad = document.getElementById('ri-select-actividad');
    
    if (!elemento) {
        selectActividad.innerHTML = '<option value="">-- Primero seleccione un elemento --</option>';
        selectActividad.disabled = true;
        return;
    }
    
    const actividadesFiltradas = ResultadosInvestigativos.actividadesPIC.filter(a => a.elemento === elemento);
    
    selectActividad.innerHTML = '<option value="">-- Seleccione una actividad --</option>';
    actividadesFiltradas.forEach(act => {
        const option = document.createElement('option');
        option.value = act.actividad;
        option.textContent = act.actividad;
        option.dataset.responsable = act.responsable;
        selectActividad.appendChild(option);
    });
    
    selectActividad.disabled = false;
}

// Renderizar tabla de resultados
function renderizarResultados() {
    const tbody = document.getElementById('ri-tbody-resultados');
    
    if (ResultadosInvestigativos.resultados.length === 0) {
        tbody.innerHTML = `<tr id="ri-sin-resultados">
            <td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 30px;">
                <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                No hay resultados registrados. Agregue un resultado usando el formulario superior.
            </td>
        </tr>`;
        return;
    }
    
    tbody.innerHTML = '';
    
    ResultadosInvestigativos.resultados.forEach((res, index) => {
        const claseClasificacion = res.clasificacion === 'Pertinente' ? 'badge-success' : 
                                   res.clasificacion === 'Débil' ? 'badge-warning' : 'badge-danger';
        
        const estadoFila = res.clasificacion === 'Ruido' && res.estado === 'retirado' ? 'style="background: #fef2f2;"' :
                          res.clasificacion === 'Ruido' && res.estado === 'ruido-validado' ? 'style="background: #fef3c7;"' : '';
        
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', res.id);
        if (estadoFila) tr.setAttribute('style', estadoFila.replace('style="', '').replace('"', ''));
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${res.elemento}</strong></td>
            <td>${res.actividad}</td>
            <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;" title="${res.resultado}">${res.resultado.substring(0, 100)}${res.resultado.length > 100 ? '...' : ''}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="width: 40px; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${res.pertinencia}%; height: 100%; background: ${res.pertinencia >= 71 ? 'var(--success)' : res.pertinencia >= 31 ? 'var(--warning)' : 'var(--danger)'}; border-radius: 4px;"></div>
                    </div>
                    <span style="font-weight: 600; font-size: 0.75rem;">${res.pertinencia}%</span>
                </div>
            </td>
            <td>
                <span class="badge-status ${claseClasificacion}">${res.clasificacion}</span>
                ${res.estado === 'ruido-validado' ? '<br><small style="color: #92400e;">Validado</small>' : ''}
                ${res.estado === 'retirado' ? '<br><small style="color: #991b1b;">Retirado</small>' : ''}
                ${res.estado === 'debil-entrelazada' ? '<br><small style="color: #0369a1;">Entrelazada</small>' : ''}
            </td>
            <td>
                ${res.actividadEnlace ? `<span style="font-size: 0.75rem; color: var(--accent-blue);">${res.actividadEnlace}</span>` : '-'}
                ${(res.clasificacion === 'Ruido' || res.clasificacion === 'Débil') && res.estado === 'pendiente' ? 
                    `<br><button class="btn btn-sm btn-secondary" style="margin-top: 4px; padding: 4px 8px; font-size: 0.65rem;" data-call="abrirDecisionFiscal" data-call-arg="${res.id}" data-call-arg-type="number">
                        <i class="fas fa-gavel"></i> Decidir
                    </button>` : ''}
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Actualizar métricas
function actualizarMetricasRI() {
    const total = ResultadosInvestigativos.resultados.length;
    
    if (total === 0) {
        document.getElementById('ri-metric-pertinentes').textContent = '0%';
        document.getElementById('ri-metric-debiles').textContent = '0%';
        document.getElementById('ri-metric-ruido').textContent = '0%';
        document.getElementById('ri-metric-eficiencia').textContent = '0%';
        document.getElementById('ri-eficiencia-valor').textContent = '0%';
        document.getElementById('ri-progress-eficiencia').style.width = '0%';
        document.getElementById('ri-count-pertinente').textContent = '0 Pertinentes';
        document.getElementById('ri-count-debil').textContent = '0 Débiles';
        document.getElementById('ri-count-ruido').textContent = '0 Ruido';
        return;
    }
    
    const pertinentes = ResultadosInvestigativos.resultados.filter(r => r.clasificacion === 'Pertinente').length;
    const debiles = ResultadosInvestigativos.resultados.filter(r => r.clasificacion === 'Débil').length;
    const ruido = ResultadosInvestigativos.resultados.filter(r => r.clasificacion === 'Ruido').length;
    
    const pctPertinentes = Math.round((pertinentes / total) * 100);
    const pctDebiles = Math.round((debiles / total) * 100);
    const pctRuido = Math.round((ruido / total) * 100);
    
    const eficiencia = Math.round(((pertinentes + debiles * 0.5) / total) * 100);
    
    document.getElementById('ri-metric-pertinentes').textContent = pctPertinentes + '%';
    document.getElementById('ri-metric-debiles').textContent = pctDebiles + '%';
    document.getElementById('ri-metric-ruido').textContent = pctRuido + '%';
    document.getElementById('ri-metric-eficiencia').textContent = eficiencia + '%';
    document.getElementById('ri-eficiencia-valor').textContent = eficiencia + '%';
    
    const progressBar = document.getElementById('ri-progress-eficiencia');
    progressBar.style.width = eficiencia + '%';
    progressBar.className = 'progress-fill ' + (eficiencia >= 70 ? 'high' : eficiencia >= 40 ? 'medium' : 'low');
    
    document.getElementById('ri-count-pertinente').textContent = pertinentes + ' Pertinentes';
    document.getElementById('ri-count-debil').textContent = debiles + ' Débiles';
    document.getElementById('ri-count-ruido').textContent = ruido + ' Ruido';
}

// Actualizar panel de alertas del fiscal
function actualizarAlertasFiscal() {
    const pendientes = ResultadosInvestigativos.resultados.filter(r => r.estado === 'pendiente');
    
    const contador = document.getElementById('ri-alertas-contador');
    const sinAlertas = document.getElementById('ri-sin-alertas');
    const listaAlertas = document.getElementById('ri-lista-alertas');
    
    if (pendientes.length === 0) {
        contador.textContent = '0 decisiones pendientes';
        sinAlertas.style.display = '';
        listaAlertas.style.display = 'none';
        return;
    }
    
    contador.textContent = pendientes.length + ' decisiones pendientes';
    sinAlertas.style.display = 'none';
    listaAlertas.style.display = 'block';
    
    listaAlertas.innerHTML = pendientes.map(res => `
        <div class="alert ${res.clasificacion === 'Ruido' ? 'alert-danger' : 'alert-warning'}" style="margin-bottom: 12px;">
            <div style="flex: 1;">
                <strong>${res.clasificacion === 'Ruido' ? '⚠️ Ruido Detectado' : '⚡ Resultado Débil'}</strong>
                <p style="font-size: 0.8rem; margin: 8px 0;">
                    <strong>Elemento:</strong> ${res.elemento}<br>
                    <strong>Actividad:</strong> ${res.actividad}<br>
                    <strong>Pertinencia:</strong> ${res.pertinencia}%
                </p>
                ${res.clasificacion === 'Ruido' ? `
                    <div class="decision-group">
                        <button class="btn btn-danger btn-sm" data-call="decidirRuido" data-call-arg="${res.id}" data-call-arg-type="number" data-call-arg2="retirar"><i class="fas fa-trash"></i> Retirar</button>
                        <button class="btn btn-warning btn-sm" data-call="decidirRuido" data-call-arg="${res.id}" data-call-arg-type="number" data-call-arg2="mantener"><i class="fas fa-check"></i> Mantener</button>
                    </div>` : `
                    <div class="decision-group">
                        <button class="btn btn-primary btn-sm" data-call="decidirDebil" data-call-arg="${res.id}" data-call-arg-type="number" data-call-arg2="entrelazar"><i class="fas fa-link"></i> Entrelazar</button>
                        <button class="btn btn-secondary btn-sm" data-call="decidirDebil" data-call-arg="${res.id}" data-call-arg-type="number" data-call-arg2="ignorar"><i class="fas fa-times"></i> Ignorar</button>
                    </div>
                    ${res.actividadEnlace ? `<p style="font-size: 0.75rem; margin-top: 8px; color: var(--accent-blue);"><i class="fas fa-lightbulb"></i> <strong>Sugerencia IA:</strong> ${res.actividadEnlace}</p>` : ''}
                `}
            </div>
        </div>
    `).join('');
}

// Decisión del fiscal para Ruido
function decidirRuido(id, decision) {
    const resultado = ResultadosInvestigativos.resultados.find(r => r.id === id);
    if (!resultado) return;
    
    resultado.estado = (decision === 'retirar') ? 'retirado' : 'ruido-validado';
    showToast(`Resultado marcado como ${resultado.estado}`, 'success');
    
    localStorage.setItem('ri_resultados', JSON.stringify(ResultadosInvestigativos.resultados));
    renderizarResultados();
    actualizarMetricasRI();
    actualizarAlertasFiscal();
}

// Decisión del fiscal para Débil
function decidirDebil(id, decision) {
    const resultado = ResultadosInvestigativos.resultados.find(r => r.id === id);
    if (!resultado) return;
    
    resultado.estado = (decision === 'entrelazar') ? 'debil-entrelazada' : 'validado';
    showToast(`Resultado marcado como ${resultado.estado}`, 'success');
    
    localStorage.setItem('ri_resultados', JSON.stringify(ResultadosInvestigativos.resultados));
    renderizarResultados();
    actualizarMetricasRI();
    actualizarAlertasFiscal();
}

// Abrir modal de decisión (alternativa)
function abrirDecisionFiscal(id) {
    const resultado = ResultadosInvestigativos.resultados.find(r => r.id === id);
    if (!resultado) return;
    
    if (resultado.clasificacion === 'Ruido') {
        if (confirm(`¿Qué desea hacer con este resultado clasificado como RUIDO (${resultado.pertinencia}%)?\n\nOK para RETIRAR, CANCELAR para MANTENER.`)) {
            decidirRuido(id, 'retirar');
        } else {
            decidirRuido(id, 'mantener');
        }
    } else {
        if (confirm(`Este resultado es DÉBIL (${resultado.pertinencia}%).\n\nSugerencia IA: ${resultado.actividadEnlace || 'N/A'}\n\nOK para ENTRELAZAR, CANCELAR para ignorar.`)) {
            decidirDebil(id, 'entrelazar');
        } else {
            decidirDebil(id, 'ignorar');
        }
    }
}

// Limpiar formulario
function limpiarFormularioRI() {
    document.getElementById('ri-select-elemento').value = '';
    const selectActividad = document.getElementById('ri-select-actividad');
    selectActividad.innerHTML = '<option value="">-- Primero seleccione un elemento --</option>';
    selectActividad.disabled = true;
    document.getElementById('ri-resultado-texto').value = '';
    document.getElementById('ri-responsable').value = '';
}

window.cargarActividadesPorElemento = cargarActividadesPorElemento;
window.renderizarResultados = renderizarResultados;
window.actualizarMetricasRI = actualizarMetricasRI;
window.actualizarAlertasFiscal = actualizarAlertasFiscal;
window.decidirRuido = decidirRuido;
window.decidirDebil = decidirDebil;
window.abrirDecisionFiscal = abrirDecisionFiscal;
window.limpiarFormularioRI = limpiarFormularioRI;
})();