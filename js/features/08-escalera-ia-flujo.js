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
