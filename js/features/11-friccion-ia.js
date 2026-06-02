// MÓDULO 9: FRICCIÓN LÓGICA IA - SISTEMA COMPLETO
// ============================================
const FriccionIA = {
    // Estado del sistema
    estado: {
        imputacion: {
            generadas: 3,
            respondidas: 0,
            validadas: 0,
            rechazadas: 0,
            sinContestar: 0,
            contadorId: 3
        },
        acusacion: {
            generadas: 3,
            respondidas: 0,
            validadas: 0,
            rechazadas: 0,
            sinContestar: 0,
            contadorId: 3
        }
    },
    
    // Trazabilidad
    trazabilidad: [],
    
    // Banco de preguntas IA para generar nuevas
    bancoPreguntasImputacion: [
        "¿Se acreditó el acuerdo previo entre Roberto, Marco, Claudia y Sergio para simular la licitación?",
        "¿Existe documentación que compruebe que la empresa 'Logística y Seguridad del Centro' fue creada para el fraude?",
        "¿Se verificó que las facturas entregadas a Beatriz Cano carecían de sellos de recepción válidos?",
        "¿Se acreditó que las cajas supuestamente de equipo contenían papel periódico y piedras?",
        "¿Existe constancia del uso de unidades oficiales para transportar dinero ilícito?",
        "¿Se documentaron las amenazas realizadas contra la Arq. Elena Santoyo?",
        "¿Se estableció la calidad de servidor público del Ing. Roberto 'N' al momento de los hechos?",
        "¿Se vinculó a la Lic. Claudia 'N' con las autorizaciones de pago fraudulentas?",
        "¿Existe evidencia de las reuniones clandestinas en la oficina privada de Roberto?",
        "¿Se verificaron los antecedentes del Comandante Sergio 'N' en la corporación policial?"
    ],
    
    bancoPreguntasAcusacion: [
        "¿Se incluyó en la acusación la tentativa de homicidio contra el periodista Juan Carlos Ruiz?",
        "¿Se fundamentó la solicitud de decomiso de propiedades en Hacienda Nueva, Pulgas Pandas y Torre Bosques?",
        "¿Se acreditó el concurso real de delitos (Peculado + Fraude + Asociación Delictuosa)?",
        "¿Se incluyeron las agravantes por calidad de servidores públicos (Art. 213 bis CPF)?",
        "¿Se cuantificó el monto total del daño patrimonial al erario público?",
        "¿Se consideró la protección a los 7 testigos identificados como medida complementaria?",
        "¿Se vinculó el atentado del 20 de enero de 2026 con la organización delictiva?",
        "¿Se fundamentó la autoría intelectual del Ing. Roberto 'N' como líder del esquema?",
        "¿Se solicitó colaboración internacional para rastreo de activos en el extranjero?",
        "¿Se incluyó la reparación del daño moral a Elena Santoyo y Juan Carlos Ruiz?"
    ],
    
    // Actividades probatorias disponibles (conectadas con PIC)
    actividadesPIC: [
        { id: "ACT-01", nombre: "Análisis documental expediente licitación" },
        { id: "ACT-02", nombre: "Dictamen autenticidad documental (facturas)" },
        { id: "ACT-03", nombre: "Rastreo transferencias bancarias UIF" },
        { id: "ACT-04", nombre: "Investigación patrimonial Roberto 'N'" },
        { id: "ACT-05", nombre: "Inspección bodega Calle Plomo #105" },
        { id: "ACT-06", nombre: "Entrevista Héctor Luna (chofer)" },
        { id: "ACT-07", nombre: "Entrevista Beatriz Cano (analista)" },
        { id: "ACT-08", nombre: "Entrevista Ricardo Fuentes (mensajero)" },
        { id: "ACT-09", nombre: "Entrevista Doña Mary (vendedora)" },
        { id: "ACT-10", nombre: "Entrevista Manuel Esparza (oficial)" },
        { id: "ACT-11", nombre: "Entrevista Dra. Ana Paula (médico)" },
        { id: "ACT-12", nombre: "Entrevista Luis Pedroza (contador)" },
        { id: "ACT-13", nombre: "Localización víctima Elena Santoyo" },
        { id: "ACT-14", nombre: "Entrevista periodista Juan Carlos Ruiz" },
        { id: "ACT-15", nombre: "Inspección lugar atentado Av. López Mateos" },
        { id: "ACT-16", nombre: "Dictamen balístico proyectiles" },
        { id: "ACT-17", nombre: "Análisis forense llamadas hospital" },
        { id: "ACT-18", nombre: "Verificación bitácoras vehículos oficiales" },
        { id: "ACT-19", nombre: "Investigación empresa 'Logística y Seguridad'" },
        { id: "ACT-20", nombre: "Investigación patrimonial Marco 'N'" },
        { id: "ACT-21", nombre: "Análisis registros contables dobles" },
        { id: "ACT-22", nombre: "Análisis grabaciones CCTV estacionamiento" },
        { id: "ACT-23", nombre: "Extracción forense celulares asegurados" },
        { id: "ACT-24", nombre: "Cateo domicilio Claudia 'N' Torre Bosques" },
        { id: "ACT-25", nombre: "Consulta registros personal policial Sergio 'N'" }
    ],
    
    // Generar nueva pregunta
    generarPregunta: function(tipo) {
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
        
        contenedor.insertAdjacentHTML('beforeend', nuevaPreguntaHTML);
        
        // Registrar trazabilidad
        this.registrarTrazabilidad(nuevoId, 'GENERACIÓN', 'Sistema IA', `Pregunta generada automáticamente: "${preguntaTexto.substring(0, 50)}..."`, '-');
        
        // Actualizar Caso SAI (MMI) y log general
        if (currentCase && currentCase.mmi) {
            currentCase.mmi.preguntasGeneradas++;
            currentCase.mmi.ultimaActualizacion = new Date().toISOString();
        }
        if (SAIEngine && SAIEngine.mmi) {
            SAIEngine.mmi.registrarEvento('generar_pregunta', {
                tipo,
                id: nuevoId,
                texto: preguntaTexto
            });
        }
        
        // Actualizar contadores
        this.actualizarContadores();
        
        showToast(`✓ Nueva pregunta ${prefijoMayus}-${numeroFormateado} generada`, 'success');
    },
    
    // Enviar respuesta para evaluación IA
    enviarRespuesta: function(preguntaId) {
        const textarea = document.getElementById(`respuesta-${preguntaId}`);
        const actividadSelect = document.getElementById(`actividad-${preguntaId}`);
        const respuesta = textarea.value.trim();
        const actividad = actividadSelect.value;
        
        if (respuesta.length < 20) {
            showToast('⚠️ La respuesta debe tener al menos 20 caracteres', 'warning');
            return;
        }
        
        // Simular evaluación IA
        const evaluacion = this.evaluarRespuestaIA(respuesta, actividad);
        
        // Obtener tipo (imputacion o acusacion)
        const card = document.getElementById(`pregunta-${preguntaId}`);
        const tipo = card.dataset.tipo;
        
        // Actualizar estado de la tarjeta
        card.dataset.estado = evaluacion.resultado;
        
        // Actualizar badge de estado
        const estadoBadge = document.getElementById(`estado-${preguntaId}`);
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
        
        // Mostrar evaluación IA
        const evaluacionContainer = document.getElementById(`evaluacion-${preguntaId}`);
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
                <span class="criterio-badge ${evaluacion.criterios.pertinencia ? 'cumple' : 'no-cumple'}">
                    <i class="fas ${evaluacion.criterios.pertinencia ? 'fa-check' : 'fa-times'}"></i>
                    Pertinencia
                </span>
                <span class="criterio-badge ${evaluacion.criterios.logica ? 'cumple' : 'no-cumple'}">
                    <i class="fas ${evaluacion.criterios.logica ? 'fa-check' : 'fa-times'}"></i>
                    Lógica
                </span>
                <span class="criterio-badge ${evaluacion.criterios.respaldo ? 'cumple' : actividad ? 'parcial' : 'no-cumple'}">
                    <i class="fas ${evaluacion.criterios.respaldo ? 'fa-check' : actividad ? 'fa-minus' : 'fa-times'}"></i>
                    Respaldo Probatorio
                </span>
            </div>
            ${evaluacion.sugerencia ? `<div style="margin-top: 12px; padding: 10px; background: #fff; border-radius: 6px; font-size: 0.8rem;"><strong>💡 Sugerencia IA:</strong> ${evaluacion.sugerencia}</div>` : ''}
        `;
        evaluacionContainer.style.display = 'block';
        
        // Ocultar formulario de respuesta
        document.getElementById(`respuesta-container-${preguntaId}`).style.display = 'none';
        
        // Actualizar contadores
        this.estado[tipo].respondidas++;
        this.actualizarContadores();
        if (currentCase && currentCase.mmi) {
            currentCase.mmi.preguntasRespondidas++;
            currentCase.mmi.ultimaActualizacion = new Date().toISOString();
        }
        if (SAIEngine && SAIEngine.mmi) {
            SAIEngine.mmi.registrarEvento('responder_pregunta', {
                id: preguntaId,
                tipo,
                resultado: evaluacion.resultado,
                actividad
            });
        }
        
        // Registrar trazabilidad
        this.registrarTrazabilidad(
            preguntaId, 
            'RESPUESTA', 
            'Fiscal', 
            `Respuesta enviada (${respuesta.length} caracteres). Actividad: ${actividad || 'Sin vincular'}`, 
            evaluacion.resultado.toUpperCase()
        );
        
        showToast(`✓ Respuesta evaluada: ${evaluacion.resultado.toUpperCase()}`, evaluacion.resultado === 'validada' ? 'success' : evaluacion.resultado === 'rechazada' ? 'error' : 'warning');
    },
    
    // Evaluación IA de la respuesta
    evaluarRespuestaIA: function(respuesta, actividad) {
        // Criterios de evaluación
        const tieneLogica = respuesta.length >= 50 && (
            respuesta.includes('porque') || 
            respuesta.includes('debido') || 
            respuesta.includes('conforme') || 
            respuesta.includes('según') ||
            respuesta.includes('Art.') ||
            respuesta.includes('artículo') ||
            respuesta.includes('fundamento')
        );
        
        const tienePertinencia = respuesta.length >= 30 && (
            respuesta.includes('sí') || 
            respuesta.includes('no') || 
            respuesta.includes('se realizó') ||
            respuesta.includes('consta') ||
            respuesta.includes('obra') ||
            respuesta.includes('existe')
        );
        
        const tieneRespaldo = actividad !== '' && actividad !== null;
        
        let resultado, analisis, sugerencia;
        
        if (tieneLogica && tienePertinencia && tieneRespaldo) {
            resultado = 'validada';
            analisis = 'La respuesta cumple con los criterios de pertinencia, fundamentación lógica y está debidamente respaldada con actividad probatoria del PIC.';
            sugerencia = null;
        } else if ((tieneLogica && tienePertinencia) || (tienePertinencia && tieneRespaldo)) {
            resultado = 'validada';
            analisis = 'La respuesta es aceptable. Cumple con criterios mínimos de validación aunque puede mejorarse.';
            sugerencia = !tieneRespaldo ? 'Se recomienda vincular la respuesta con una actividad probatoria del PIC para mayor solidez.' : null;
        } else if (tieneLogica || tienePertinencia) {
            resultado = 'parcial';
            analisis = 'La respuesta requiere mejoras. Algunos criterios no se cumplen completamente.';
            sugerencia = 'Agregue fundamentación legal (Art. específico) y vincule con actividad probatoria.';
        } else {
            resultado = 'rechazada';
            analisis = 'La respuesta no cumple con los criterios mínimos de pertinencia, lógica y respaldo probatorio.';
            sugerencia = 'Elabore una respuesta más fundamentada que incluya: 1) Respuesta directa a la pregunta, 2) Fundamento legal, 3) Vínculo con actividad probatoria.';
        }
        
        return {
            resultado,
            analisis,
            sugerencia,
            criterios: {
                pertinencia: tienePertinencia,
                logica: tieneLogica,
                respaldo: tieneRespaldo
            }
        };
    },
    
    // Marcar como sin contestar
    marcarSinContestar: function(preguntaId) {
        const totalSinContestar = this.estado.imputacion.sinContestar + this.estado.acusacion.sinContestar;
        
        if (totalSinContestar >= 3) {
            showToast('⚠️ Ya tiene 3 preguntas sin contestar. Debe responder antes de continuar.', 'warning');
            return;
        }
        
        const card = document.getElementById(`pregunta-${preguntaId}`);
        const tipo = card.dataset.tipo;
        
        // Actualizar estado
        card.dataset.estado = 'sin-contestar';
        
        // Actualizar badge
        const estadoBadge = document.getElementById(`estado-${preguntaId}`);
        estadoBadge.className = 'pregunta-estado badge-status badge-warning';
        estadoBadge.innerHTML = '<i class="fas fa-minus-circle"></i> Sin contestar';
        
        // Ocultar formulario
        document.getElementById(`respuesta-container-${preguntaId}`).innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                <i class="fas fa-minus-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>Pregunta marcada como sin contestar</p>
            </div>
        `;
        
        // Actualizar contador
        this.estado[tipo].sinContestar++;
        this.actualizarContadores();
        if (currentCase && currentCase.mmi) {
            currentCase.mmi.preguntasSinContestar++;
            currentCase.mmi.ultimaActualizacion = new Date().toISOString();
        }
        if (SAIEngine && SAIEngine.mmi) {
            SAIEngine.mmi.registrarEvento('marcar_sin_contestar', {
                id: preguntaId,
                tipo
            });
        }
        
        // Registrar trazabilidad
        this.registrarTrazabilidad(preguntaId, 'SIN CONTESTAR', 'Fiscal', 'El Fiscal decidió no contestar esta pregunta', 'N/A');
        
        showToast(`Pregunta marcada como sin contestar (${3 - totalSinContestar - 1} disponibles)`, 'warning');
    },
    
    // Actualizar todos los contadores y métricas
    actualizarContadores: function() {
        const imp = this.estado.imputacion;
        const acu = this.estado.acusacion;
        
        // Calcular totales
        const totalGeneradas = imp.generadas + acu.generadas;
        const totalRespondidas = imp.respondidas + acu.respondidas;
        const totalValidadas = imp.validadas + acu.validadas;
        const totalPendientes = totalGeneradas - totalRespondidas - imp.sinContestar - acu.sinContestar;
        const totalSinContestar = imp.sinContestar + acu.sinContestar;
        const porcentaje = totalGeneradas > 0 ? Math.round((totalRespondidas / totalGeneradas) * 100) : 0;
        
        // Actualizar panel de control (Fricción)
        document.getElementById('total-preguntas-generadas').textContent = totalGeneradas;
        document.getElementById('total-preguntas-respondidas').textContent = totalRespondidas;
        document.getElementById('total-preguntas-pendientes').textContent = totalPendientes;
        document.getElementById('total-preguntas-sin-contestar').textContent = totalSinContestar;
        document.getElementById('friccion-porcentaje').textContent = porcentaje + '%';
        
        const barFriccion = document.getElementById('friccion-progress-bar');
        barFriccion.style.width = porcentaje + '%';
        barFriccion.className = `progress-fill ${porcentaje >= 80 ? 'high' : porcentaje >= 50 ? 'medium' : 'low'}`;
        
        // Contadores individuales
        const impPendientes = imp.generadas - imp.respondidas - imp.sinContestar;
        const acuPendientes = acu.generadas - acu.respondidas - acu.sinContestar;
        
        document.getElementById('contador-imputacion').textContent = `${imp.respondidas} / ${imp.generadas}`;
        document.getElementById('contador-imputacion').className = imp.respondidas >= imp.generadas ? 'badge-status badge-success' : 'badge-status badge-warning';
        
        document.getElementById('contador-acusacion').textContent = `${acu.respondidas} / ${acu.generadas}`;
        document.getElementById('contador-acusacion').className = acu.respondidas >= acu.generadas ? 'badge-status badge-success' : 'badge-status badge-warning';
        
        // Actualizar indicadores en Métricas (si están visibles)
        this.actualizarMetricas(imp, acu, totalGeneradas, totalRespondidas, totalValidadas);
        
        // Sincronizar resumen global en Caso SAI / MMI
        if (currentCase && currentCase.mmi) {
            currentCase.mmi.preguntasGeneradas = totalGeneradas;
            currentCase.mmi.preguntasRespondidas = totalRespondidas;
            currentCase.mmi.preguntasSinContestar = totalSinContestar;
            currentCase.mmi.ultimaActualizacion = new Date().toISOString();
        }
        
        // Guardar estado
        if (typeof CeCoSAI_Storage !== 'undefined') {
            CeCoSAI_Storage.save(false);
        }
    },
    
    // Actualizar sección de Métricas
    actualizarMetricas: function(imp, acu, totalGeneradas, totalRespondidas, totalValidadas) {
        // Imputación
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
        
        // Acusación
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
        
        // Totales
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
    },
    
    // Registrar en trazabilidad
    registrarTrazabilidad: function(preguntaId, accion, usuario, detalle, validacionIA) {
        const timestamp = new Date().toLocaleString('es-MX');
        
        const registro = {
            timestamp,
            preguntaId,
            accion,
            usuario,
            detalle,
            validacionIA
        };
        
        this.trazabilidad.push(registro);
        
        // Agregar a la tabla
        const tbody = document.getElementById('tbody-trazabilidad-friccion');
        if (tbody) {
            // Limpiar mensaje inicial si existe
            if (tbody.querySelector('td[colspan]')) {
                tbody.innerHTML = '';
            }
            
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
    },
    
    // Exportar trazabilidad
    exportarTrazabilidad: function() {
        if (this.trazabilidad.length === 0) {
            showToast('No hay registros de trazabilidad para exportar', 'warning');
            return;
        }
        
        const contenido = {
            sistema: 'CeCoSAI v7.2',
            modulo: 'Fricción Lógica',
            fechaExportacion: new Date().toISOString(),
            estadisticas: {
                imputacion: this.estado.imputacion,
                acusacion: this.estado.acusacion
            },
            registros: this.trazabilidad
        };
        
        const blob = new Blob([JSON.stringify(contenido, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CeCoSAI_Trazabilidad_Friccion_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('✓ Trazabilidad exportada correctamente', 'success');
    }
};

window.FriccionIA = FriccionIA;

// Inicializar contadores al cargar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        FriccionIA.actualizarContadores();
    }, 100);
});
