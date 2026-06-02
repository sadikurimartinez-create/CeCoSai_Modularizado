// ============================================
// MÓDULO: FRICCIÓN LÓGICA IA - LÓGICA
// ============================================

// Generar nueva pregunta
FriccionIA.generarPregunta = function(tipo) {
    const totalSinContestar = this.estado.imputacion.sinContestar + this.estado.acusacion.sinContestar;
    
    // Validar límite de preguntas sin contestar
    if (totalSinContestar >= 3) {
        showToast('⚠️ Debe contestar preguntas pendientes. Máximo 3 sin contestar permitidas.', 'warning');
        return;
    }
    
    const contenedor = document.getElementById(`contenedor-preguntas-${tipo}`);
    const banco = tipo === 'imputacion' ? this.bancoPreguntasImputacion : this.bancoPreguntasAcusacion;
    const estadoTipo = this.estado[tipo];
    
    // Obtener pregunta aleatoria del banco
    const preguntaTexto = banco[Math.floor(Math.random() * banco.length)];
    
    estadoTipo.contadorId++;
    estadoTipo.generadas++;
    
    const prefijo = tipo === 'imputacion' ? 'imp' : 'acu';
    const prefijoMayus = tipo === 'imputacion' ? 'IMP' : 'ACU';
    const nuevoId = `${prefijo}-${estadoTipo.contadorId}`;
    const numeroFormateado = String(estadoTipo.contadorId).padStart(3, '0');
    
    // Generar opciones de actividades
    let opcionesActividades = '<option value="">-- Seleccione actividad (opcional) --</option>';
    this.actividadesPIC.forEach(act => {
        opcionesActividades += `<option value="${act.id}">${act.id}: ${act.nombre}</option>`;
    });
    
    const nuevaPreguntaHTML = `
    <div class="friccion-pregunta-card" id="pregunta-${nuevoId}" data-tipo="${tipo}" data-estado="pendiente" style="animation: fadeIn 0.5s ease;">
        <div class="pregunta-header">
            <span class="pregunta-numero">${prefijoMayus}-${numeroFormateado}</span>
            <span class="pregunta-estado badge-status badge-warning" id="estado-${nuevoId}">Pendiente</span>
            <span class="badge-status badge-info" style="font-size: 0.6rem;"><i class="fas fa-robot"></i> Generada por IA</span>
        </div>
        <div class="pregunta-texto">
            <i class="fas fa-question-circle" style="color: ${tipo === 'imputacion' ? 'var(--accent-blue)' : 'var(--info)'};"></i>
            <strong>${preguntaTexto}</strong>
        </div>
        <div class="pregunta-respuesta-container" id="respuesta-container-${nuevoId}">
            <label class="form-label">Respuesta del Fiscal:</label>
            <textarea class="form-control respuesta-fiscal" id="respuesta-${nuevoId}" placeholder="Escriba su respuesta fundamentada..." rows="3"></textarea>
            <div class="actividad-probatoria-selector">
                <label class="form-label" style="margin-top: 12px;">Vincular con Actividad Probatoria (PIC):</label>
                <select class="form-control" id="actividad-${nuevoId}">
                    ${opcionesActividades}
                </select>
            </div>
            <div class="decision-group" style="margin-top: 12px;">
                <button class="btn btn-success btn-sm" data-call="FriccionIA.enviarRespuesta" data-call-arg="${nuevoId}">
                    <i class="fas fa-paper-plane"></i> Enviar Respuesta
                </button>
                <button class="btn btn-secondary btn-sm" data-call="FriccionIA.marcarSinContestar" data-call-arg="${nuevoId}">
                    <i class="fas fa-times"></i> No Contestar
                </button>
            </div>
        </div>
        <div class="evaluacion-ia-container" id="evaluacion-${nuevoId}" style="display: none;"></div>
    </div>
    `;
    
    if (contenedor) contenedor.insertAdjacentHTML('beforeend', nuevaPreguntaHTML);
    
    // Registrar trazabilidad
    this.registrarTrazabilidad(nuevoId, 'GENERACIÓN', 'Sistema IA', `Pregunta generada automáticamente: "${preguntaTexto.substring(0, 50)}..."`, '-');
    
    // Actualizar Caso SAI (MMI) y log general
    if (typeof currentCase !== 'undefined' && currentCase && currentCase.mmi) {
        currentCase.mmi.preguntasGeneradas++;
        currentCase.mmi.ultimaActualizacion = new Date().toISOString();
    }
    if (typeof SAIEngine !== 'undefined' && SAIEngine && SAIEngine.mmi) {
        SAIEngine.mmi.registrarEvento('generar_pregunta', { tipo, id: nuevoId, texto: preguntaTexto });
    }
    
    // Actualizar contadores
    if (this.actualizarContadores) this.actualizarContadores();
    if (typeof showToast === 'function') showToast(`✓ Nueva pregunta ${prefijoMayus}-${numeroFormateado} generada`, 'success');
};

// Enviar respuesta para evaluación IA
FriccionIA.enviarRespuesta = function(preguntaId) {
    const textarea = document.getElementById(`respuesta-${preguntaId}`);
    const actividadSelect = document.getElementById(`actividad-${preguntaId}`);
    if (!textarea || !actividadSelect) return;
    
    const respuesta = textarea.value.trim();
    const actividad = actividadSelect.value;
    
    if (respuesta.length < 20) {
        if (typeof showToast === 'function') showToast('⚠️ La respuesta debe tener al menos 20 caracteres', 'warning');
        return;
    }
    
    // Simular evaluación IA
    const evaluacion = this.evaluarRespuestaIA(respuesta, actividad);
    
    // Obtener tipo (imputacion o acusacion)
    const card = document.getElementById(`pregunta-${preguntaId}`);
    if (!card) return;
    const tipo = card.dataset.tipo;
    
    // Actualizar estado de la tarjeta
    card.dataset.estado = evaluacion.resultado;
    
    // Actualizar badge de estado
    const estadoBadge = document.getElementById(`estado-${preguntaId}`);
    if (estadoBadge) {
        if (evaluacion.resultado === 'validada') {
            estadoBadge.className = 'pregunta-estado badge-status badge-success';
            estadoBadge.innerHTML = '<i class="fas fa-check"></i> Validada';
            this.estado[tipo].validadas++;
        } else if (evaluacion.resultado === 'rechazada') {
            estadoBadge.className = 'pregunta-estado badge-status badge-danger';
            estadoBadge.innerHTML = '<i class="fas fa-times"></i> Rechazada';
            this.estado[tipo].rechazadas++;
        } else {
            estadoBadge.className = 'pregunta-estado badge-status badge-warning';
            estadoBadge.innerHTML = '<i class="fas fa-exclamation"></i> Parcial';
        }
    }
    
    // Mostrar evaluación IA
    const evaluacionContainer = document.getElementById(`evaluacion-${preguntaId}`);
    if (evaluacionContainer) {
        evaluacionContainer.className = `evaluacion-ia-container ${evaluacion.resultado}`;
        evaluacionContainer.innerHTML = `
            <div class="evaluacion-resultado">
                <i class="fas ${evaluacion.resultado === 'validada' ? 'fa-check-circle' : evaluacion.resultado === 'rechazada' ? 'fa-times-circle' : 'fa-exclamation-circle'}" 
                   style="color: ${evaluacion.resultado === 'validada' ? 'var(--success)' : evaluacion.resultado === 'rechazada' ? 'var(--danger)' : 'var(--warning)'}; font-size: 1.2rem;"></i>
                <span style="color: ${evaluacion.resultado === 'validada' ? 'var(--success)' : evaluacion.resultado === 'rechazada' ? 'var(--danger)' : 'var(--warning)'};">
                    ${evaluacion.resultado === 'validada' ? 'RESPUESTA VALIDADA POR IA' : evaluacion.resultado === 'rechazada' ? 'RESPUESTA RECHAZADA POR IA' : 'VALIDACIÓN PARCIAL'}
                </span>
            </div>
            <div class="evaluacion-detalle">
                <strong>Análisis IA:</strong> ${evaluacion.analisis}
            </div>
            <div class="evaluacion-criterios">
                <span class="criterio-badge ${evaluacion.criterios.pertinencia ? 'cumple' : 'no-cumple'}"><i class="fas ${evaluacion.criterios.pertinencia ? 'fa-check' : 'fa-times'}"></i> Pertinencia</span>
                <span class="criterio-badge ${evaluacion.criterios.logica ? 'cumple' : 'no-cumple'}"><i class="fas ${evaluacion.criterios.logica ? 'fa-check' : 'fa-times'}"></i> Lógica</span>
                <span class="criterio-badge ${evaluacion.criterios.respaldo ? 'cumple' : actividad ? 'parcial' : 'no-cumple'}"><i class="fas ${evaluacion.criterios.respaldo ? 'fa-check' : actividad ? 'fa-minus' : 'fa-times'}"></i> Respaldo Probatorio</span>
            </div>
            ${evaluacion.sugerencia ? `<div style="margin-top: 12px; padding: 10px; background: #fff; border-radius: 6px; font-size: 0.8rem;"><strong>💡 Sugerencia IA:</strong> ${evaluacion.sugerencia}</div>` : ''}
        `;
        evaluacionContainer.style.display = 'block';
    }
    
    // Ocultar formulario de respuesta
    const respCont = document.getElementById(`respuesta-container-${preguntaId}`);
    if (respCont) respCont.style.display = 'none';
    
    // Actualizar contadores
    this.estado[tipo].respondidas++;
    if (this.actualizarContadores) this.actualizarContadores();
    
    if (typeof currentCase !== 'undefined' && currentCase && currentCase.mmi) {
        currentCase.mmi.preguntasRespondidas++;
        currentCase.mmi.ultimaActualizacion = new Date().toISOString();
    }
    if (typeof SAIEngine !== 'undefined' && SAIEngine && SAIEngine.mmi) {
        SAIEngine.mmi.registrarEvento('responder_pregunta', { id: preguntaId, tipo, resultado: evaluacion.resultado, actividad });
    }
    
    // Registrar trazabilidad
    this.registrarTrazabilidad(preguntaId, 'RESPUESTA', 'Fiscal', `Respuesta enviada (${respuesta.length} caracteres). Actividad: ${actividad || 'Sin vincular'}`, evaluacion.resultado.toUpperCase());
    
    if (typeof showToast === 'function') showToast(`✓ Respuesta evaluada: ${evaluacion.resultado.toUpperCase()}`, evaluacion.resultado === 'validada' ? 'success' : evaluacion.resultado === 'rechazada' ? 'error' : 'warning');
};

// Evaluación IA de la respuesta
FriccionIA.evaluarRespuestaIA = function(respuesta, actividad) {
    const tieneLogica = respuesta.length >= 50 && (respuesta.includes('porque') || respuesta.includes('debido') || respuesta.includes('conforme') || respuesta.includes('según') || respuesta.includes('Art.') || respuesta.includes('artículo') || respuesta.includes('fundamento'));
    const tienePertinencia = respuesta.length >= 30 && (respuesta.includes('sí') || respuesta.includes('no') || respuesta.includes('se realizó') || respuesta.includes('consta') || respuesta.includes('obra') || respuesta.includes('existe'));
    const tieneRespaldo = actividad !== '' && actividad !== null;
    
    let resultado = 'rechazada', analisis = 'La respuesta no cumple con los criterios.', sugerencia = 'Mejore la fundamentación.';
    if (tieneLogica && tienePertinencia && tieneRespaldo) { resultado = 'validada'; analisis = 'La respuesta cumple con todos los criterios.'; sugerencia = null; }
    else if ((tieneLogica && tienePertinencia) || (tienePertinencia && tieneRespaldo)) { resultado = 'validada'; analisis = 'La respuesta es aceptable aunque mejorable.'; sugerencia = !tieneRespaldo ? 'Se recomienda vincular con actividad probatoria.' : null; }
    else if (tieneLogica || tienePertinencia) { resultado = 'parcial'; analisis = 'La respuesta requiere mejoras.'; sugerencia = 'Agregue fundamento legal o actividad probatoria.'; }
    
    return { resultado, analisis, sugerencia, criterios: { pertinencia: tienePertinencia, logica: tieneLogica, respaldo: tieneRespaldo } };
};
