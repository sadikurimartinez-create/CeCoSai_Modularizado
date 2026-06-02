// ANÁLISIS IA POR ELEMENTO
// ============================================

// Analizar CONDUCTA con IA
async function analizarConductaIA() {
    if (!EscaleraIA.apiKey) {
        mostrarAlertaConfigAPI('conducta');
        return;
    }
    
    const delitoInfo = CodigoPenalAguascalientes[EscaleraIA.delitoSeleccionado] || {};
    const resultados = EscaleraIA.resultadosInvestigativos.filter(r => r.clasificacion === 'Pertinente');
    
    const prompt = `Eres un experto en derecho penal mexicano especializado en el Código Penal de Aguascalientes.

CONTEXTO:
- Delito: ${EscaleraIA.delitoSeleccionado}
- Sujeto Activo: ${EscaleraIA.csdSeleccionado.sujeto}
- Fundamento Legal: ${delitoInfo.articulo || 'CPA'}
- Elementos Objetivos del Tipo: ${delitoInfo.elementosObjetivos || 'N/A'}

RESULTADOS INVESTIGATIVOS PERTINENTES:
${resultados.map(r => `- ${r.actividad}: ${r.resultado}`).join('\n') || 'Sin resultados aún'}

ACTIVIDADES DEL PIC:
${EscaleraIA.actividadesPIC.slice(0, 10).map(a => `- ${a.actividad}`).join('\n')}

INSTRUCCIONES:
1. Analiza si existe CONDUCTA penalmente relevante (comportamiento humano voluntario)
2. Clasifica el tipo de conducta: Acción, Omisión o Comisión por Omisión
3. Evalúa el porcentaje de acreditación (0-100%) basándote en los resultados investigativos
4. Si la acreditación es menor al 70%, sugiere hasta 3 actividades investigativas específicas

RESPONDE EN JSON:
{
    "tipoConducta": "[Acción|Omisión|Comisión por Omisión]",
    "descripcionConducta": "[Descripción breve de la conducta detectada]",
    "acreditacion": [0-100],
    "fundamentacion": "[Explicación jurídica breve]",
    "alertaFiscal": [true si acreditación < 70%, false si no],
    "sugerenciasActividades": [
        {"actividad": "...", "objetivo": "...", "aportacion": [%]}
    ]
}`;

    try {
        const response = await llamarOpenAI(prompt);
        const resultado = JSON.parse(limpiarJSON(response));
        
        // Actualizar UI
        actualizarUIConducta(resultado);
        EscaleraIA.elementosValidados.conducta.iaResultado = resultado;
        EscaleraIA.elementosValidados.conducta.acreditacion = resultado.acreditacion;
        
        // Mostrar alerta si acreditación < 70%
        if (resultado.alertaFiscal) {
            mostrarSugerenciasElemento('conducta', resultado.sugerenciasActividades);
        }
        
    } catch (error) {
        console.error('Error en análisis IA de Conducta:', error);
        showToast('Error al analizar conducta con IA', 'error');
    }
}

// Actualizar UI de Conducta
function actualizarUIConducta(resultado) {
    document.getElementById('conducta-delito-actual').textContent = EscaleraIA.delitoSeleccionado;
    document.getElementById('conducta-tipo-ia').textContent = resultado.tipoConducta;
    document.getElementById('conducta-tipo-ia').className = 'badge-status badge-success';
    document.getElementById('conducta-acreditacion').textContent = resultado.acreditacion + '%';
    document.getElementById('conducta-acreditacion').className = 'badge-status ' + 
        (resultado.acreditacion >= 70 ? 'badge-success' : resultado.acreditacion >= 40 ? 'badge-warning' : 'badge-danger');
    
    const progressBar = document.getElementById('conducta-progress-bar');
    if (progressBar) {
        progressBar.style.width = resultado.acreditacion + '%';
        progressBar.className = 'progress-fill ' + 
            (resultado.acreditacion >= 70 ? 'high' : resultado.acreditacion >= 40 ? 'medium' : 'low');
    }
    
    // Auto-seleccionar radio según tipo de conducta
    const radioValue = resultado.tipoConducta.toLowerCase().replace(/ /g, '-');
    const radio = document.querySelector(`input[name="conducta"][value="${radioValue === 'acción' ? 'accion' : radioValue}"]`);
    if (radio) {
        radio.checked = true;
        radio.closest('.radio-item').classList.add('selected');
    }
}

// Analizar TIPICIDAD con IA (Clasificación según Porte Petit)
async function analizarTipicidadIA() {
    if (!EscaleraIA.apiKey) {
        mostrarAlertaConfigAPI('tipicidad');
        return;
    }
    
    const delitoInfo = CodigoPenalAguascalientes[EscaleraIA.delitoSeleccionado] || {};
    const resultados = EscaleraIA.resultadosInvestigativos.filter(r => r.clasificacion === 'Pertinente');
    
    const prompt = `Eres un experto en derecho penal mexicano especializado en clasificación de delitos según Celestino Porte Petit.

CONTEXTO:
- Delito: ${EscaleraIA.delitoSeleccionado}
- Fundamento: ${delitoInfo.articulo || 'Código Penal de Aguascalientes'}
- Elementos Objetivos: ${delitoInfo.elementosObjetivos || 'N/A'}
- Elementos Subjetivos: ${delitoInfo.elementosSubjetivos || 'N/A'}
- Elementos Normativos: ${delitoInfo.elementosNormativos || 'N/A'}

RESULTADOS INVESTIGATIVOS:
${resultados.map(r => `- ${r.actividad}: ${r.resultado}`).join('\n') || 'Sin resultados aún'}

INSTRUCCIONES:
Clasifica el delito según los criterios de Porte Petit y evalúa la acreditación de cada elemento del tipo penal.

RESPONDE EN JSON:
{
    "clasificacionPortePetit": {
        "porResultado": {"valor": "[Material|Formal]", "acreditacion": [0-100]},
        "porDano": {"valor": "[Lesión|Peligro]", "acreditacion": [0-100]},
        "porDuracion": {"valor": "[Instantáneo|Permanente|Continuado]", "acreditacion": [0-100]},
        "porCulpabilidad": {"valor": "[Doloso|Culposo]", "acreditacion": [0-100]},
        "porEstructura": {"valor": "[Simple|Complejo]", "acreditacion": [0-100]},
        "porNumeroActos": {"valor": "[Unisubsistente|Plurisubsistente]", "acreditacion": [0-100]},
        "porNumeroSujetos": {"valor": "[Unisubjetivo|Plurisubjetivo]", "acreditacion": [0-100]},
        "porPersecucion": {"valor": "[Oficio|Querella]", "acreditacion": [0-100]}
    },
    "elementosTipo": {
        "objetivo": {"descripcion": "...", "acreditacion": [0-100]},
        "subjetivo": {"descripcion": "...", "acreditacion": [0-100]},
        "normativo": {"descripcion": "...", "acreditacion": [0-100]},
        "calificativa": {"descripcion": "...", "acreditacion": [0-100]}
    },
    "acreditacionGlobal": [0-100],
    "alertaFiscal": [true/false],
    "sugerenciasActividades": [{"elemento": "...", "actividad": "...", "aportacion": [%]}]
}`;

    try {
        const response = await llamarOpenAI(prompt);
        const resultado = JSON.parse(limpiarJSON(response));
        
        actualizarUITipicidad(resultado);
        EscaleraIA.elementosValidados.tipicidad.iaResultado = resultado;
        EscaleraIA.elementosValidados.tipicidad.clasificacion = resultado.clasificacionPortePetit;
        EscaleraIA.elementosValidados.tipicidad.acreditacion = resultado.acreditacionGlobal;
        
        if (resultado.alertaFiscal) {
            mostrarSugerenciasElemento('tipicidad', resultado.sugerenciasActividades);
        }
        
    } catch (error) {
        console.error('Error en análisis IA de Tipicidad:', error);
        showToast('Error al clasificar tipicidad con IA', 'error');
    }
}

// Actualizar UI de Tipicidad
function actualizarUITipicidad(resultado) {
    document.getElementById('tipicidad-delito').textContent = EscaleraIA.delitoSeleccionado;
    
    // Actualizar tabla de clasificación Porte Petit
    const tbody = document.getElementById('tbody-clasificacion-porte');
    if (tbody && resultado.clasificacionPortePetit) {
        const cp = resultado.clasificacionPortePetit;
        tbody.innerHTML = `
            <tr><td>Por su Resultado</td><td>${cp.porResultado?.valor || 'N/A'}</td><td>${cp.porResultado?.acreditacion || 0}%</td><td>${getBadgeAcreditacion(cp.porResultado?.acreditacion)}</td></tr>
            <tr><td>Por el Daño</td><td>${cp.porDano?.valor || 'N/A'}</td><td>${cp.porDano?.acreditacion || 0}%</td><td>${getBadgeAcreditacion(cp.porDano?.acreditacion)}</td></tr>
            <tr><td>Por su Duración</td><td>${cp.porDuracion?.valor || 'N/A'}</td><td>${cp.porDuracion?.acreditacion || 0}%</td><td>${getBadgeAcreditacion(cp.porDuracion?.acreditacion)}</td></tr>
            <tr><td>Por Culpabilidad</td><td>${cp.porCulpabilidad?.valor || 'N/A'}</td><td>${cp.porCulpabilidad?.acreditacion || 0}%</td><td>${getBadgeAcreditacion(cp.porCulpabilidad?.acreditacion)}</td></tr>
            <tr><td>Por su Estructura</td><td>${cp.porEstructura?.valor || 'N/A'}</td><td>${cp.porEstructura?.acreditacion || 0}%</td><td>${getBadgeAcreditacion(cp.porEstructura?.acreditacion)}</td></tr>
            <tr><td>Por Número de Actos</td><td>${cp.porNumeroActos?.valor || 'N/A'}</td><td>${cp.porNumeroActos?.acreditacion || 0}%</td><td>${getBadgeAcreditacion(cp.porNumeroActos?.acreditacion)}</td></tr>
            <tr><td>Por Número de Sujetos</td><td>${cp.porNumeroSujetos?.valor || 'N/A'}</td><td>${cp.porNumeroSujetos?.acreditacion || 0}%</td><td>${getBadgeAcreditacion(cp.porNumeroSujetos?.acreditacion)}</td></tr>
            <tr><td>Por Forma de Persecución</td><td>${cp.porPersecucion?.valor || 'N/A'}</td><td>${cp.porPersecucion?.acreditacion || 0}%</td><td>${getBadgeAcreditacion(cp.porPersecucion?.acreditacion)}</td></tr>
        `;
    }
    
    // Actualizar elementos del tipo
    if (resultado.elementosTipo) {
        const et = resultado.elementosTipo;
        document.getElementById('elem-objetivo-desc').textContent = et.objetivo?.descripcion || 'Pendiente';
        document.getElementById('elem-objetivo-pct').textContent = (et.objetivo?.acreditacion || 0) + '%';
        document.getElementById('elem-objetivo-estado').innerHTML = getBadgeAcreditacion(et.objetivo?.acreditacion);
        
        document.getElementById('elem-subjetivo-desc').textContent = et.subjetivo?.descripcion || 'Pendiente';
        document.getElementById('elem-subjetivo-pct').textContent = (et.subjetivo?.acreditacion || 0) + '%';
        document.getElementById('elem-subjetivo-estado').innerHTML = getBadgeAcreditacion(et.subjetivo?.acreditacion);
        
        document.getElementById('elem-normativo-desc').textContent = et.normativo?.descripcion || 'Pendiente';
        document.getElementById('elem-normativo-pct').textContent = (et.normativo?.acreditacion || 0) + '%';
        document.getElementById('elem-normativo-estado').innerHTML = getBadgeAcreditacion(et.normativo?.acreditacion);
        
        document.getElementById('elem-calificativa-desc').textContent = et.calificativa?.descripcion || 'N/A';
        document.getElementById('elem-calificativa-pct').textContent = (et.calificativa?.acreditacion || 0) + '%';
        document.getElementById('elem-calificativa-estado').innerHTML = getBadgeAcreditacion(et.calificativa?.acreditacion);
    }
    
    // Actualizar barra de progreso global
    document.getElementById('tipicidad-acreditacion-global').textContent = resultado.acreditacionGlobal + '%';
    const progressBar = document.getElementById('tipicidad-progress-bar');
    if (progressBar) {
        progressBar.style.width = resultado.acreditacionGlobal + '%';
        progressBar.className = 'progress-fill ' + 
            (resultado.acreditacionGlobal >= 70 ? 'high' : resultado.acreditacionGlobal >= 40 ? 'medium' : 'low');
    }
}

// Analizar elemento genérico con IA
async function analizarElementoIA(elemento, config) {
    if (!EscaleraIA.apiKey) {
        mostrarAlertaConfigAPI(elemento);
        return;
    }
    
    const delitoInfo = CodigoPenalAguascalientes[EscaleraIA.delitoSeleccionado] || {};
    const resultados = EscaleraIA.resultadosInvestigativos.filter(r => r.clasificacion === 'Pertinente');
    
    const prompt = `Eres un experto en derecho penal mexicano especializado en el Código Penal de Aguascalientes.

CONTEXTO:
- Elemento a Analizar: ${config.nombre}
- Delito: ${EscaleraIA.delitoSeleccionado}
- Sujeto Activo: ${EscaleraIA.csdSeleccionado.sujeto}
- Fundamento: ${delitoInfo.articulo || 'CPA'}

DEFINICIÓN DEL ELEMENTO:
${config.definicion}

RESULTADOS INVESTIGATIVOS PERTINENTES:
${resultados.map(r => `- ${r.actividad}: ${r.resultado}`).join('\n') || 'Sin resultados aún'}

INSTRUCCIONES:
1. Analiza si el elemento ${config.nombre} se acredita conforme al Código Penal de Aguascalientes
2. Evalúa el porcentaje de acreditación basándote en los resultados investigativos
3. Si la acreditación es menor al 70%, genera alerta al Fiscal y sugiere actividades

RESPONDE EN JSON:
{
    "elementoAnalizado": "${config.nombre}",
    "acreditado": [true/false],
    "acreditacion": [0-100],
    "fundamentacion": "[Explicación jurídica basada en CPA]",
    "actividadesSoporte": ["Lista de actividades que soportan la acreditación"],
    "alertaFiscal": [true si acreditación < 70%],
    "sugerenciasActividades": [{"actividad": "...", "objetivo": "...", "aportacion": [%]}]
}`;

    try {
        const response = await llamarOpenAI(prompt);
        const resultado = JSON.parse(limpiarJSON(response));
        
        // Actualizar UI específica del elemento
        actualizarUIElemento(elemento, resultado);
        EscaleraIA.elementosValidados[elemento].iaResultado = resultado;
        EscaleraIA.elementosValidados[elemento].acreditacion = resultado.acreditacion;
        
        if (resultado.alertaFiscal) {
            mostrarSugerenciasElemento(elemento, resultado.sugerenciasActividades);
        }
        
        return resultado;
        
    } catch (error) {
        console.error(`Error en análisis IA de ${elemento}:`, error);
        showToast(`Error al analizar ${elemento} con IA`, 'error');
    }
}

// Actualizar UI de un elemento genérico
function actualizarUIElemento(elemento, resultado) {
    const delitoSpan = document.getElementById(`${elemento}-delito`);
    if (delitoSpan) delitoSpan.textContent = EscaleraIA.delitoSeleccionado;
    
    const acreditacionSpan = document.getElementById(`${elemento}-acreditacion`);
    if (acreditacionSpan) {
        acreditacionSpan.textContent = resultado.acreditacion + '%';
        acreditacionSpan.className = 'badge-status ' + 
            (resultado.acreditacion >= 70 ? 'badge-success' : resultado.acreditacion >= 40 ? 'badge-warning' : 'badge-danger');
    }
    
    const progressBar = document.getElementById(`${elemento}-progress-bar`);
    if (progressBar) {
        progressBar.style.width = resultado.acreditacion + '%';
        progressBar.className = 'progress-fill ' + 
            (resultado.acreditacion >= 70 ? 'high' : resultado.acreditacion >= 40 ? 'medium' : 'low');
    }
    
    // Actualizar contenido de análisis IA
    const contenidoIA = document.getElementById(`${elemento}-ia-contenido`);
    if (contenidoIA && resultado.fundamentacion) {
        contenidoIA.innerHTML += `<p style="margin-top: 8px; font-style: italic;">${resultado.fundamentacion}</p>`;
    }
}

// Mostrar sugerencias de actividades
function mostrarSugerenciasElemento(elemento, sugerencias) {
    const container = document.getElementById(`${elemento}-sugerencias-container`);
    const tbody = document.getElementById(`tbody-sugerencias-${elemento}`);
    
    if (container && tbody && sugerencias && sugerencias.length > 0) {
        container.style.display = 'block';
        tbody.innerHTML = sugerencias.map((sug, idx) => `
            <tr>
                <td>${sug.elemento || elemento}</td>
                <td>${sug.actividad}</td>
                <td><strong>${sug.aportacion || 15}%</strong></td>
                <td>
                    <label class="checkbox-item" style="margin: 0; padding: 4px 8px;">
                        <input type="checkbox" name="sug-${elemento}-${idx}" value="${sug.actividad}">
                        <span style="font-size: 0.7rem;">Aceptar</span>
                    </label>
                </td>
            </tr>
        `).join('');
        
        // Mostrar alerta al Fiscal
        showToast(`⚠️ Alerta Fiscal: ${elemento.toUpperCase()} con acreditación menor al 70%`, 'warning');
    }
}

// Validar sugerencias y enviar al PIC
function validarSugerenciasYEnviarPIC(elemento) {
    const checkboxes = document.querySelectorAll(`input[name^="sug-${elemento}"]:checked`);
    const actividadesAceptadas = [];
    
    checkboxes.forEach(cb => {
        actividadesAceptadas.push({
            elemento: elemento,
            actividad: cb.value,
            origen: 'Sugerencia IA - Escalera Heptatómica',
            fecha: new Date().toISOString()
        });
    });
    
    if (actividadesAceptadas.length > 0) {
        // Guardar en localStorage para que el PIC las reciba
        const actividadesIA = JSON.parse(localStorage.getItem('actividades_sugeridas_ia') || '[]');
        actividadesIA.push(...actividadesAceptadas);
        localStorage.setItem('actividades_sugeridas_ia', JSON.stringify(actividadesIA));
        
        showToast(`✅ ${actividadesAceptadas.length} actividad(es) enviada(s) al PIC`, 'success');
        
        // Ocultar contenedor de sugerencias
        const container = document.getElementById(`${elemento}-sugerencias-container`);
        if (container) container.style.display = 'none';
    } else {
        showToast('Seleccione al menos una actividad para enviar al PIC', 'warning');
    }
}

// Ignorar sugerencias (registrar trazabilidad)
function ignorarSugerencias(elemento) {
    const trazabilidad = JSON.parse(localStorage.getItem('trazabilidad_sugerencias_ignoradas') || '[]');
    trazabilidad.push({
        elemento: elemento,
        fecha: new Date().toISOString(),
        csd: EscaleraIA.csdSeleccionado?.id,
        delito: EscaleraIA.delitoSeleccionado
    });
    localStorage.setItem('trazabilidad_sugerencias_ignoradas', JSON.stringify(trazabilidad));
    
    const container = document.getElementById(`${elemento}-sugerencias-container`);
    if (container) container.style.display = 'none';
    
    showToast('Sugerencias ignoradas. Se registró en trazabilidad.', 'info');
}

