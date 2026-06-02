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
