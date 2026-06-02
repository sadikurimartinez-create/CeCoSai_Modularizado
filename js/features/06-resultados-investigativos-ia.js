// ============================================
// MÓDULO: RESULTADOS INVESTIGATIVOS - IA
// ============================================

// Agregar resultado investigativo
async function agregarResultadoInvestigativo() {
    const elemento = document.getElementById('ri-select-elemento').value;
    const actividad = document.getElementById('ri-select-actividad').value;
    const resultado = document.getElementById('ri-resultado-texto').value.trim();
    const responsable = document.getElementById('ri-responsable').value.trim() || 'Sin asignar';
    
    if (!elemento || !actividad || !resultado) {
        showToast('Complete todos los campos requeridos', 'warning');
        return;
    }

    const btnAgregar = document.getElementById('ri-btn-agregar');
    btnAgregar.classList.add('loading');
    btnAgregar.disabled = true;
    
    try {
        const clasificacion = await clasificarResultadoConIA(elemento, actividad, resultado);
        
        const nuevoResultado = {
            id: ResultadosInvestigativos.contadorId++,
            elemento: elemento,
            actividad: actividad,
            resultado: resultado,
            responsable: responsable,
            pertinencia: clasificacion.pertinencia,
            clasificacion: clasificacion.clasificacion,
            actividadEnlace: clasificacion.actividadEnlace || '',
            estado: clasificacion.clasificacion === 'Ruido' || clasificacion.clasificacion === 'Débil' ? 'pendiente' : 'validado',
            fecha: new Date().toISOString(),
            validadoPorFiscal: clasificacion.clasificacion === 'Pertinente'
        };
        
        ResultadosInvestigativos.resultados.push(nuevoResultado);
        
        localStorage.setItem('ri_resultados', JSON.stringify(ResultadosInvestigativos.resultados));
        localStorage.setItem('ri_contador_id', ResultadosInvestigativos.contadorId.toString());
        
        if (typeof renderizarResultados === 'function') renderizarResultados();
        if (typeof actualizarMetricasRI === 'function') actualizarMetricasRI();
        if (typeof actualizarAlertasFiscal === 'function') actualizarAlertasFiscal();
        if (typeof limpiarFormularioRI === 'function') limpiarFormularioRI();
        
        showToast(`Resultado clasificado como "${clasificacion.clasificacion}" (${clasificacion.pertinencia}%)`, 
            clasificacion.clasificacion === 'Pertinente' ? 'success' : 
            clasificacion.clasificacion === 'Débil' ? 'warning' : 'error');
        
    } catch (error) {
        console.error('Error al clasificar resultado:', error);
        showToast('Error al clasificar: ' + error.message, 'error');
    } finally {
        btnAgregar.classList.remove('loading');
        btnAgregar.disabled = false;
    }
}

// Clasificar resultado con IA (Gemini)
async function clasificarResultadoConIA(elemento, actividad, resultado) {
    const prompt = `Eres un experto en derecho penal mexicano y análisis de investigaciones criminales. Evalúa la pertinencia del siguiente resultado investigativo.

CONTEXTO:
- Elemento Atomizado del Tipo Penal: ${elemento}
- Actividad de Investigación: ${actividad}
- Resultado Obtenido: ${resultado}

INSTRUCCIONES:
1. Evalúa qué tan pertinente es el resultado para probar el elemento del tipo penal.
2. Asigna un porcentaje de pertinencia (0-100%).
3. Clasifica según estos rangos:
   - "Ruido" (0-30%): El resultado NO tiene conexión con el elemento del tipo penal
   - "Débil" (31-70%): El resultado tiene conexión parcial pero requiere fortalecimiento
   - "Pertinente" (71-100%): El resultado tiene conexión directa y fuerte con el elemento

4. Si la clasificación es "Débil", sugiere UNA actividad de investigación adicional para fortalecer el resultado.

RESPONDE ÚNICAMENTE EN FORMATO JSON (sin markdown):
{
    "pertinencia": [número entre 0 y 100],
    "clasificacion": "[Ruido|Débil|Pertinente]",
    "actividadEnlace": "[Solo si es Débil: descripción breve de actividad sugerida]",
    "justificacion": "[Breve explicación de la evaluación]"
}`;

    if (typeof ConcienciaOperativaSAI === 'undefined' || !ConcienciaOperativaSAI.llamarGemini) {
        throw new Error('El módulo de Conciencia Operativa SAI no está disponible.');
    }
    
    const narrativa = ConcienciaOperativaSAI.getNarrativa ? ConcienciaOperativaSAI.getNarrativa() : '';
    const partes = [
        { text: "NARRATIVA DEL CASO (resumen):\n" + (narrativa ? narrativa.slice(0, 1500) : "Sin narrativa registrada.") + "\n\n" },
        { text: prompt }
    ];
    
    const respuestaTexto = await ConcienciaOperativaSAI.llamarGemini(partes, ConcienciaOperativaSAI.systemInstruction);
    
    let jsonStr = respuestaTexto;
    if (respuestaTexto.includes('```')) {
        jsonStr = respuestaTexto.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error('Error parseando respuesta IA:', respuestaTexto);
        return { pertinencia: 50, clasificacion: 'Débil', actividadEnlace: 'Revisión manual requerida', justificacion: 'Error al procesar respuesta de IA' };
    }
}

window.agregarResultadoInvestigativo = agregarResultadoInvestigativo;