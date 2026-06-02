// ============================================
// MÓDULO: ESCALERA HEPTATÓMICA CON IA
// ============================================

const EscaleraIA = {
    apiKey: localStorage.getItem('ri_api_key') || '',
    csdSeleccionado: null,
    delitoSeleccionado: null,
    elementosValidados: {
        conducta: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null },
        tipicidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null, clasificacion: null },
        antijuridicidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null },
        imputabilidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null },
        culpabilidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null },
        punibilidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null }
    },
    resultadosInvestigativos: [],
    actividadesPIC: []
};

// Clasificaciones según Porte Petit para Tipicidad
const ClasificacionesPortePetit = {
    porResultado: ['Material', 'Formal', 'De Peligro'],
    porDano: ['De Lesión', 'De Peligro Concreto', 'De Peligro Abstracto'],
    porDuracion: ['Instantáneo', 'Permanente', 'Continuado'],
    porCulpabilidad: ['Doloso', 'Culposo', 'Preterintencional'],
    porEstructura: ['Simple', 'Complejo', 'Especial'],
    porNumeroActos: ['Unisubsistente', 'Plurisubsistente'],
    porNumeroSujetos: ['Unisubjetivo', 'Plurisubjetivo'],
    porPersecucion: ['De Oficio', 'Por Querella']
};

// Elementos del Código Penal de Aguascalientes por delito
const CodigoPenalAguascalientes = {
    'Peculado': {
        articulo: 'Art. 213 CPA',
        elementosObjetivos: 'Servidor público que para sí o para otro, distraiga, disponga o haga uso indebido de dinero, valores, fincas o cualquier otra cosa perteneciente al Estado',
        elementosSubjetivos: 'Dolo directo - Voluntad de disponer indebidamente de bienes públicos',
        elementosNormativos: 'Calidad de servidor público, pertenencia de bienes al Estado',
        bienJuridico: 'Patrimonio del Estado y correcto ejercicio de la función pública',
        pena: '2 a 14 años de prisión y multa de 50 a 300 días'
    },
    'Fraude': {
        articulo: 'Art. 231 CPA',
        elementosObjetivos: 'Engañar a alguien o aprovecharse del error en que se encuentra para hacerse ilícitamente de alguna cosa o alcanzar un lucro indebido',
        elementosSubjetivos: 'Dolo directo - Intención de engañar y obtener lucro indebido',
        elementosNormativos: 'Engaño, error, lucro indebido, cosa ajena',
        bienJuridico: 'Patrimonio',
        pena: '3 meses a 12 años de prisión según monto'
    },
    'Falsificación de Documentos': {
        articulo: 'Art. 243-245 CPA',
        elementosObjetivos: 'Poner una firma o rúbrica falsa, alterar documento público o privado, simular documento',
        elementosSubjetivos: 'Dolo directo - Voluntad de falsificar con propósito de usar',
        elementosNormativos: 'Documento, firma, autenticidad',
        bienJuridico: 'Fe pública y seguridad jurídica documental',
        pena: '6 meses a 6 años de prisión'
    },
    'Cohecho': {
        articulo: 'Art. 217 CPA',
        elementosObjetivos: 'Servidor público que solicite o reciba indebidamente dinero o cualquier otra dádiva, o acepte una promesa, para hacer o dejar de hacer algo justo o injusto',
        elementosSubjetivos: 'Dolo directo - Intención de recibir beneficio a cambio de acto oficial',
        elementosNormativos: 'Calidad de servidor público, acto u omisión oficial',
        bienJuridico: 'Correcto funcionamiento de la administración pública',
        pena: '3 meses a 14 años de prisión'
    },
    'Abuso de Autoridad': {
        articulo: 'Art. 209-210 CPA',
        elementosObjetivos: 'Servidor público que incurra en actos arbitrarios o abusivos contra particulares usando su cargo',
        elementosSubjetivos: 'Dolo - Voluntad de ejercer indebidamente facultades del cargo',
        elementosNormativos: 'Calidad de servidor público, ejercicio de funciones',
        bienJuridico: 'Correcto ejercicio de la función pública',
        pena: '1 a 8 años de prisión'
    },
    'Amenazas': {
        articulo: 'Art. 152 CPA',
        elementosObjetivos: 'Amenazar a otro con causarle un mal en su persona, bienes, honor o derechos',
        elementosSubjetivos: 'Dolo directo - Voluntad de intimidar',
        elementosNormativos: 'Amenaza seria y creíble, mal futuro',
        bienJuridico: 'Libertad y seguridad personal',
        pena: '3 meses a 2 años de prisión'
    },
    'Tentativa de Homicidio': {
        articulo: 'Art. 63 + 123 CPA',
        elementosObjetivos: 'Realizar actos encaminados a privar de la vida sin consumar el resultado',
        elementosSubjetivos: 'Dolo directo - Intención de matar',
        elementosNormativos: 'Idoneidad de medios, peligro real para la vida',
        bienJuridico: 'Vida humana',
        pena: 'Hasta dos terceras partes de la pena del delito consumado'
    },
    'Asociación Delictuosa': {
        articulo: 'Art. 178 CPA',
        elementosObjetivos: 'Formar parte de una asociación o banda de tres o más personas organizada para delinquir',
        elementosSubjetivos: 'Dolo directo - Voluntad de pertenecer a organización delictiva',
        elementosNormativos: 'Organización permanente, fin delictivo',
        bienJuridico: 'Seguridad pública',
        pena: '5 a 10 años de prisión'
    }
};

// Inicialización del módulo Escalera IA
function initEscaleraIA() {
    console.log('🔧 Inicializando módulo Escalera Heptatómica con IA...');
    
    // Verificar si hay API Key configurada
    if (ResultadosInvestigativos && ResultadosInvestigativos.apiKey) {
        EscaleraIA.apiKey = ResultadosInvestigativos.apiKey;
    }
    
    // Cargar resultados investigativos
    cargarResultadosParaEscalera();
    
    // Configurar eventos de los selectores
    const csdSelector = document.getElementById('csd-selector');
    const delitoSelector = document.getElementById('delito-selector');
    
    if (csdSelector) {
        csdSelector.addEventListener('change', function() {
            onCSDSeleccionado(this.value, this.options[this.selectedIndex]);
        });
    }
    
    if (delitoSelector) {
        delitoSelector.addEventListener('change', function() {
            onDelitoSeleccionado(this.value);
        });
    }
    
    console.log('✅ Módulo Escalera IA inicializado');
}

// Cargar resultados investigativos para usar en la Escalera
function cargarResultadosParaEscalera() {
    EscaleraIA.resultadosInvestigativos = JSON.parse(localStorage.getItem('ri_resultados') || '[]');
    // También cargar actividades del PIC
    const tablaActividades = document.getElementById('tabla-actividades');
    if (tablaActividades) {
        const filas = tablaActividades.querySelectorAll('tbody tr');
        EscaleraIA.actividadesPIC = [];
        filas.forEach((fila, index) => {
            const celdas = fila.querySelectorAll('td');
            if (celdas.length >= 5) {
                EscaleraIA.actividadesPIC.push({
                    id: index + 1,
                    elemento: celdas[1]?.textContent?.trim() || '',
                    actividad: celdas[2]?.textContent?.trim() || '',
                    objeto: celdas[3]?.textContent?.trim() || '',
                    responsable: celdas[5]?.textContent?.trim() || ''
                });
            }
        });
    }
}

// Cuando se selecciona un CSD
function onCSDSeleccionado(csdId, opcion) {
    if (!csdId) {
        ocultarEscalera();
        return;
    }
    
    EscaleraIA.csdSeleccionado = {
        id: csdId,
        sujeto: opcion.dataset.sujeto,
        delitos: opcion.dataset.delitos ? opcion.dataset.delitos.split(',') : []
    };
    
    // Si tiene múltiples delitos, mostrar selector
    if (EscaleraIA.csdSeleccionado.delitos.length > 1) {
        mostrarSelectorDelito(EscaleraIA.csdSeleccionado.delitos);
    } else if (EscaleraIA.csdSeleccionado.delitos.length === 1) {
        EscaleraIA.delitoSeleccionado = EscaleraIA.csdSeleccionado.delitos[0].trim();
        iniciarAnalisisEscalera();
    }
}

// Mostrar selector de delito cuando hay múltiples
function mostrarSelectorDelito(delitos) {
    const container = document.getElementById('selector-delito-container');
    const selector = document.getElementById('delito-selector');
    
    if (container && selector) {
        container.style.display = 'block';
        selector.innerHTML = '<option value="">Seleccione el delito...</option>';
        delitos.forEach(delito => {
            const opt = document.createElement('option');
            opt.value = delito.trim();
            opt.textContent = delito.trim();
            selector.appendChild(opt);
        });
    }
}

// Cuando se selecciona un delito específico
function onDelitoSeleccionado(delito) {
    if (!delito) return;
    EscaleraIA.delitoSeleccionado = delito;
    iniciarAnalisisEscalera();
}

// Iniciar análisis de la escalera
async function iniciarAnalisisEscalera() {
    if (!EscaleraIA.csdSeleccionado || !EscaleraIA.delitoSeleccionado) return;
    
    // Mostrar panel de información
    mostrarInfoCSDEscalera();
    
    // Mostrar contenedor de escalera
    const escaleraContainer = document.getElementById('escalera-container');
    if (escaleraContainer) {
        escaleraContainer.style.display = 'block';
    }
    
    // Habilitar primera fila (Conducta)
    habilitarElemento('conducta');
    
    // Iniciar análisis IA de Conducta
    await analizarConductaIA();
}

// Mostrar información del CSD en el panel
function mostrarInfoCSDEscalera() {
    const panel = document.getElementById('panel-info-csd-escalera');
    const contenido = document.getElementById('info-csd-escalera-content');
    
    if (panel && contenido) {
        const delitosInfo = CodigoPenalAguascalientes[EscaleraIA.delitoSeleccionado] || {};
        panel.style.display = 'block';
        contenido.innerHTML = `
            <p><strong>CSD:</strong> ${EscaleraIA.csdSeleccionado.id.toUpperCase()}</p>
            <p><strong>Sujeto Activo:</strong> ${EscaleraIA.csdSeleccionado.sujeto}</p>
            <p><strong>Delito:</strong> ${EscaleraIA.delitoSeleccionado}</p>
            <p><strong>Fundamento:</strong> ${delitosInfo.articulo || 'Código Penal de Aguascalientes'}</p>
            <p><strong>Bien Jurídico:</strong> ${delitosInfo.bienJuridico || 'Pendiente de análisis'}</p>
        `;
    }
}

// Habilitar un elemento de la escalera
function habilitarElemento(elemento) {
    const row = document.getElementById('row-' + elemento);
    if (row) {
        row.classList.remove('disabled-row');
        row.classList.add('active-row');
    }
    
    // Habilitar selects del elemento
    const selectNeg = document.getElementById('select-' + elemento);
    if (selectNeg) selectNeg.disabled = false;
}

// Ocultar escalera
function ocultarEscalera() {
    const container = document.getElementById('escalera-container');
    const selectorDelito = document.getElementById('selector-delito-container');
    const panelInfo = document.getElementById('panel-info-csd-escalera');
    
    if (container) container.style.display = 'none';
    if (selectorDelito) selectorDelito.style.display = 'none';
    if (panelInfo) panelInfo.style.display = 'none';
    
    // Resetear validaciones
    EscaleraIA.elementosValidados = {
        conducta: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null },
        tipicidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null, clasificacion: null },
        antijuridicidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null },
        imputabilidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null },
        culpabilidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null },
        punibilidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null }
    };
}

// ============================================
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

// Funciones de validación para cada elemento
function validarSugerenciasConducta() { validarSugerenciasYEnviarPIC('conducta'); }
function ignorarSugerenciasConducta() { ignorarSugerencias('conducta'); }
function validarSugerenciasTipicidad() { validarSugerenciasYEnviarPIC('tipicidad'); }
function ignorarSugerenciasTipicidad() { ignorarSugerencias('tipicidad'); }
function validarSugerenciasAntijuridicidad() { validarSugerenciasYEnviarPIC('antijuridicidad'); }
function ignorarSugerenciasAntijuridicidad() { ignorarSugerencias('antijuridicidad'); }
function validarSugerenciasCulpabilidad() { validarSugerenciasYEnviarPIC('culpabilidad'); }
function ignorarSugerenciasCulpabilidad() { ignorarSugerencias('culpabilidad'); }
function validarSugerenciasPunibilidad() { validarSugerenciasYEnviarPIC('punibilidad'); }
function ignorarSugerenciasPunibilidad() { ignorarSugerencias('punibilidad'); }

// Validación de conducta (cuando usuario selecciona opción)
async function validateConducta() {
    const selected = document.querySelector('input[name="conducta"]:checked');
    if (!selected) return;
    
    EscaleraIA.elementosValidados.conducta.positivo = true;
    
    // Si la IA ya analizó, verificar consistencia
    if (EscaleraIA.elementosValidados.conducta.iaResultado) {
        const iaResultado = EscaleraIA.elementosValidados.conducta.iaResultado;
        if (iaResultado.acreditacion >= 70) {
            showToast('✓ Conducta validada por el Fiscal', 'success');
        }
    }
}

// Verificar aspecto negativo de conducta
async function checkNegativoConducta() {
    const select = document.getElementById('select-conducta');
    const value = select.value;
    
    if (value === 'ninguna') {
        EscaleraIA.elementosValidados.conducta.negativo = true;
        habilitarElemento('tipicidad');
        
        // Analizar Tipicidad con IA
        await analizarTipicidadIA();
        
        document.getElementById('conducta-status').textContent = '✓ Conducta acreditada - Tipicidad habilitada';
        document.getElementById('conducta-status').classList.add('success');
    } else if (value) {
        // Hay causa de ausencia de conducta - bloquear
        bloquearPorCausaExcluyente('Ausencia de Conducta: ' + select.options[select.selectedIndex].text);
    }
}

// Verificar aspecto negativo de tipicidad
async function checkNegativoTipicidad() {
    const select = document.getElementById('select-tipicidad');
    const value = select.value;
    
    if (value === 'ninguna') {
        EscaleraIA.elementosValidados.tipicidad.negativo = true;
        habilitarElemento('antijuridicidad');
        
        // Analizar Antijuridicidad con IA
        await analizarElementoIA('antijuridicidad', {
            nombre: 'ANTIJURIDICIDAD',
            definicion: 'La conducta típica es contraria al ordenamiento jurídico. Se verifica que no existan causas de justificación.'
        });
        
        document.getElementById('tipicidad-status').textContent = '✓ Tipicidad acreditada - Antijuridicidad habilitada';
        document.getElementById('tipicidad-status').classList.add('success');
    } else if (value) {
        bloquearPorCausaExcluyente('Atipicidad: ' + select.options[select.selectedIndex].text);
    }
}

// Verificar aspecto negativo de antijuridicidad
async function checkNegativoAntijuridicidad() {
    const select = document.getElementById('select-antijuridicidad');
    const value = select.value;
    
    if (value === 'ninguna') {
        EscaleraIA.elementosValidados.antijuridicidad.negativo = true;
        habilitarElemento('imputabilidad');
        
        // Habilitar selector de imputabilidad
        document.getElementById('imputabilidad-capacidad').disabled = false;
        
        document.getElementById('antijuridicidad-status').textContent = '✓ Antijuridicidad acreditada - Imputabilidad habilitada';
        document.getElementById('antijuridicidad-status').classList.add('success');
    } else if (value) {
        bloquearPorCausaExcluyente('Causa de Justificación: ' + select.options[select.selectedIndex].text);
    }
}

// Verificar imputabilidad
async function verificarImputabilidad() {
    const select = document.getElementById('imputabilidad-capacidad');
    const value = select.value;
    
    if (value === 'mayor-capaz') {
        document.getElementById('select-imputabilidad').disabled = false;
        
        // Analizar imputabilidad con IA
        await analizarElementoIA('imputabilidad', {
            nombre: 'IMPUTABILIDAD',
            definicion: 'Capacidad del sujeto activo de comprender la ilicitud de su conducta y de autodeterminarse conforme a esa comprensión.'
        });
    } else if (value === 'menor-12' || value === 'adolescente-12-18') {
        document.getElementById('imputabilidad-bloqueo-edad').style.display = 'block';
        document.getElementById('imputabilidad-bloqueo-mensaje').textContent = 
            value === 'menor-12' ? 'Menores de 12 años son inimputables. No procede juicio penal.' :
            'Adolescentes entre 12-18 años son sujetos al Sistema Integral de Justicia para Adolescentes.';
    }
}

// Verificar aspecto negativo de imputabilidad
async function checkNegativoImputabilidad() {
    const select = document.getElementById('select-imputabilidad');
    const value = select.value;
    
    if (value === 'ninguna') {
        EscaleraIA.elementosValidados.imputabilidad.negativo = true;
        habilitarElemento('culpabilidad');
        
        // Habilitar radios de culpabilidad
        document.querySelectorAll('input[name="culpabilidad-forma"]').forEach(r => r.disabled = false);
        
        // Analizar culpabilidad con IA
        await analizarElementoIA('culpabilidad', {
            nombre: 'CULPABILIDAD',
            definicion: 'Reprochabilidad de la conducta al autor. Se manifiesta como Dolo (directo o eventual) o Culpa (consciente o inconsciente).'
        });
        
        document.getElementById('imputabilidad-status').textContent = '✓ Imputabilidad acreditada - Culpabilidad habilitada';
        document.getElementById('imputabilidad-status').classList.add('success');
    } else if (value) {
        bloquearPorCausaExcluyente('Inimputabilidad: ' + select.options[select.selectedIndex].text);
    }
}

// Verificar aspecto negativo de culpabilidad
async function checkNegativoCulpabilidad() {
    const select = document.getElementById('select-culpabilidad');
    const value = select.value;
    
    if (value === 'ninguna') {
        EscaleraIA.elementosValidados.culpabilidad.negativo = true;
        habilitarElemento('punibilidad');
        
        // Analizar punibilidad con IA
        await analizarPunibilidadIA();
        
        document.getElementById('culpabilidad-status').textContent = '✓ Culpabilidad acreditada - Punibilidad habilitada';
        document.getElementById('culpabilidad-status').classList.add('success');
    } else if (value) {
        bloquearPorCausaExcluyente('Inculpabilidad: ' + select.options[select.selectedIndex].text);
    }
}

// Analizar Punibilidad con IA
async function analizarPunibilidadIA() {
    if (!EscaleraIA.apiKey) {
        mostrarAlertaConfigAPI('punibilidad');
        return;
    }
    
    const delitoInfo = CodigoPenalAguascalientes[EscaleraIA.delitoSeleccionado] || {};
    
    const prompt = `Eres un experto en derecho penal mexicano especializado en el Código Penal de Aguascalientes.

CONTEXTO:
- Delito: ${EscaleraIA.delitoSeleccionado}
- Sujeto Activo: ${EscaleraIA.csdSeleccionado.sujeto}
- Fundamento: ${delitoInfo.articulo || 'CPA'}
- Pena establecida: ${delitoInfo.pena || 'Ver CPA'}

INSTRUCCIONES:
Calcula las penas aplicables según el Código Penal de Aguascalientes considerando:
1. Pena de prisión (mínima y máxima)
2. Multa (en días o UMA)
3. Reparación del daño
4. Medidas de seguridad aplicables

RESPONDE EN JSON:
{
    "prision": {"sugerida": "X años", "rango": "mínimo - máximo años"},
    "multa": {"sugerida": "X días/UMA", "rango": "mínimo - máximo"},
    "reparacionDano": {"monto": "...", "concepto": "..."},
    "medidasSeguridad": ["lista de medidas aplicables"],
    "acreditacion": [0-100],
    "fundamentacion": "[Artículos aplicables del CPA]"
}`;

    try {
        const response = await llamarOpenAI(prompt);
        const resultado = JSON.parse(limpiarJSON(response));
        
        // Actualizar UI de punibilidad
        document.getElementById('punibilidad-delito').textContent = EscaleraIA.delitoSeleccionado;
        document.getElementById('punibilidad-prision').textContent = resultado.prision?.sugerida || 'Pendiente';
        document.getElementById('punibilidad-prision-rango').textContent = 'Rango: ' + (resultado.prision?.rango || 'Ver CPA');
        document.getElementById('punibilidad-multa').textContent = resultado.multa?.sugerida || 'Pendiente';
        document.getElementById('punibilidad-multa-rango').textContent = 'Rango: ' + (resultado.multa?.rango || 'Ver CPA');
        document.getElementById('punibilidad-reparacion').textContent = resultado.reparacionDano?.monto || 'Por determinar';
        document.getElementById('punibilidad-reparacion-detalle').textContent = resultado.reparacionDano?.concepto || '';
        document.getElementById('punibilidad-medidas').textContent = resultado.medidasSeguridad?.join(', ') || 'N/A';
        
        document.getElementById('punibilidad-acreditacion').textContent = resultado.acreditacion + '%';
        const progressBar = document.getElementById('punibilidad-progress-bar');
        if (progressBar) {
            progressBar.style.width = resultado.acreditacion + '%';
            progressBar.className = 'progress-fill ' + 
                (resultado.acreditacion >= 70 ? 'high' : resultado.acreditacion >= 40 ? 'medium' : 'low');
        }
        
        EscaleraIA.elementosValidados.punibilidad.iaResultado = resultado;
        EscaleraIA.elementosValidados.punibilidad.acreditacion = resultado.acreditacion;
        
        // Habilitar selector de excusas absolutorias
        document.getElementById('select-punibilidad').disabled = false;
        
    } catch (error) {
        console.error('Error en análisis IA de Punibilidad:', error);
    }
}

// Verificar aspecto negativo de punibilidad
function checkNegativoPunibilidad() {
    const select = document.getElementById('select-punibilidad');
    const value = select.value;
    
    if (value === 'ninguna') {
        EscaleraIA.elementosValidados.punibilidad.negativo = true;
        
        // Mostrar resultado final - Delito acreditado
        document.getElementById('resultado-final').style.display = 'block';
        document.getElementById('punibilidad-status').textContent = '✓ Punibilidad acreditada - DELITO COMPLETAMENTE ACREDITADO';
        document.getElementById('punibilidad-status').classList.add('success');
        
        showToast('🎉 ¡Validación Heptatómica Completa! El delito ha sido acreditado.', 'success');
    } else if (value) {
        bloquearPorCausaExcluyente('Excusa Absolutoria: ' + select.options[select.selectedIndex].text);
    }
}

// Bloquear por causa excluyente
function bloquearPorCausaExcluyente(causa) {
    document.getElementById('bloqueo-excluyente').style.display = 'block';
    document.getElementById('causa-excluyente-texto').textContent = causa;
    document.getElementById('consecuencia-texto').textContent = 
        'El análisis ha sido detenido. No procede la acreditación del delito debido a la causa excluyente detectada.';
    
    showToast('⚠️ Análisis detenido por causa excluyente', 'warning');
}

// Reset de la escalera
function resetEscalera() {
    ocultarEscalera();
    document.getElementById('csd-selector').value = '';
    document.getElementById('bloqueo-excluyente').style.display = 'none';
    document.getElementById('resultado-final').style.display = 'none';
    
    // Resetear todos los rows
    ['conducta', 'tipicidad', 'antijuridicidad', 'imputabilidad', 'culpabilidad', 'punibilidad'].forEach(elem => {
        const row = document.getElementById('row-' + elem);
        if (row) {
            row.classList.add('disabled-row');
            row.classList.remove('active-row', 'completed-row');
        }
        const status = document.getElementById(elem + '-status');
        if (status) {
            status.textContent = '';
            status.classList.remove('success', 'blocked');
        }
    });
    
    showToast('Escalera reiniciada', 'info');
}

// Utilidades
function getBadgeAcreditacion(porcentaje) {
    const pct = porcentaje || 0;
    if (pct >= 70) return '<span class="badge-status badge-success">Acreditado</span>';
    if (pct >= 40) return '<span class="badge-status badge-warning">Parcial</span>';
    return '<span class="badge-status badge-danger">Insuficiente</span>';
}

function mostrarAlertaConfigAPI(elemento) {
    showToast('Configure la API Key de OpenAI en la pestaña "Resultados Investigativos"', 'warning');
}

async function llamarOpenAI(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${EscaleraIA.apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'Eres un experto en derecho penal mexicano. Responde SOLO en formato JSON válido.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 1500
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error en la API de OpenAI');
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
}

function limpiarJSON(texto) {
    let json = texto;
    if (texto.includes('```')) {
        json = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    return json.trim();
}

// Hacer funciones disponibles globalmente
window.validateConducta = validateConducta;
window.checkNegativoConducta = checkNegativoConducta;
window.checkNegativoTipicidad = checkNegativoTipicidad;
window.checkNegativoAntijuridicidad = checkNegativoAntijuridicidad;
window.verificarImputabilidad = verificarImputabilidad;
window.checkNegativoImputabilidad = checkNegativoImputabilidad;
window.checkNegativoCulpabilidad = checkNegativoCulpabilidad;
window.checkNegativoPunibilidad = checkNegativoPunibilidad;
window.resetEscalera = resetEscalera;
window.validarSugerenciasConducta = validarSugerenciasConducta;
window.ignorarSugerenciasConducta = ignorarSugerenciasConducta;
window.validarSugerenciasTipicidad = validarSugerenciasTipicidad;
window.ignorarSugerenciasTipicidad = ignorarSugerenciasTipicidad;
window.validarSugerenciasAntijuridicidad = validarSugerenciasAntijuridicidad;
window.ignorarSugerenciasAntijuridicidad = ignorarSugerenciasAntijuridicidad;
window.validarSugerenciasCulpabilidad = validarSugerenciasCulpabilidad;
window.ignorarSugerenciasCulpabilidad = ignorarSugerenciasCulpabilidad;
window.validarSugerenciasPunibilidad = validarSugerenciasPunibilidad;
window.ignorarSugerenciasPunibilidad = ignorarSugerenciasPunibilidad;
