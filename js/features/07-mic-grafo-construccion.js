(function() {
function actualizarMIC() {
    console.log('🔄 Actualizando MIC (grafo)…');
    cargarDatosParaMIC();
    actualizarFechaHoraMIC();
    construirMICDesdeDatos();
    actualizarContadoresMIC();
    var estadoSync = document.getElementById('mic-estado-sync');
    validateArgumentHealth(); // Call validation after building/updating MIC
    if (estadoSync) {
        estadoSync.innerHTML = '<i class="fas fa-check-circle"></i> Sincronizado';
        estadoSync.classList.remove('badge-warning');
        estadoSync.classList.add('badge-success');
    }
    // Actualizar resumen en currentCase / SAIEngine si existen
    try {
        var nodosTotalEl = document.getElementById('mic-nodos-total'); // Corrected variable name
        var conexionesTotalEl = document.getElementById('mic-conexiones-total');
        var nodos = nodosTotalEl ? (parseInt(nodosTotalEl.textContent || '0', 10) || 0) : 0;
        var conexiones = conexionesTotalEl ? (parseInt(conexionesTotalEl.textContent || '0', 10) || 0) : 0;
        var acreditacionGlobal = calcularAcreditacionGlobal();
        if (typeof currentCase !== 'undefined' && currentCase && currentCase.mic) {
            currentCase.mic.nodos = nodos;
            currentCase.mic.conexiones = conexiones;
            currentCase.mic.acreditacionGlobal = acreditacionGlobal;
            currentCase.mic.ultimaActualizacion = new Date().toISOString();
        }
        if (typeof SAIEngine !== 'undefined' && SAIEngine && SAIEngine.mic && typeof SAIEngine.mic.registrarEvento === 'function') {
            SAIEngine.mic.registrarEvento('actualizar', {
                nodos: nodos,
                conexiones: conexiones,
                acreditacionGlobal: acreditacionGlobal
            });
        }
    } catch (e) {
        console.warn('No se pudo actualizar el resumen MIC en currentCase/SAIEngine:', e);
    }
    if (typeof showToast === 'function') showToast('MIC actualizado (grafo interactivo).', 'success');
}

function construirMICDesdeDatos() {
    if (!MIC_Module.network || !MIC_Module.nodesDS || !MIC_Module.edgesDS) return;
    MIC_Module.nodesDS.clear();
    MIC_Module.edgesDS.clear();

    var nodes = [];
    var edges = [];

    // Probandum
    nodes.push({
        id: 'probandum',
        label: 'Conclusión Jurídica\n(Probandum)',
        level: 0,
        shape: 'box',
        tipoMic: 'probandum',
        naturaleza: 'Conclusión principal del caso',
        descripcion: 'Resultado jurídico que la Célula Investigadora busca acreditar.',
        explicacion_logica: 'Este nodo resume la verdad jurídica que se pretende demostrar ante el juez.',
        color: { background: '#022c22', border: '#22c55e', highlight: { background: '#166534', border: '#bbf7d0' } },
        font: { color: '#bbf7d0', size: 24, bold: true },
        borderWidth: 4,
        margin: 20
    });

    // 7 átomos THD
    var atomos = ['Conducta', 'Tipicidad', 'Antijuridicidad', 'Imputabilidad', 'Culpabilidad', 'Punibilidad', 'Condiciones Objetivas'];
    var atomIds = {};
    atomos.forEach(function (nombre, idx) {
        var id = 'THD-' + (idx + 1);
        atomIds[nombre] = id;
        nodes.push({
            id: id,
            label: nombre,
            level: 1,
            shape: 'triangle',
            tipoMic: 'atomoTHD',
            naturaleza: 'Átomo de la Teoría Heptatómica del Delito',
            descripcion: 'Elemento estructural del delito: ' + nombre + '.',
            explicacion_logica: 'Este nodo representa el átomo ' + nombre + '. La evidencia conectada debe acreditar específicamente este elemento.',
            color: { background: '#7c2d12', border: '#ea580c', highlight: { background: '#9a3412', border: '#fed7aa' } },
            font: { color: '#fff7ed', size: 18 },
            borderWidth: 2,
            margin: 15
        });
        edges.push({
            from: id,
            to: 'probandum',
            tipoMic: 'inferencia',
            naturaleza: 'Inferencia principal',
            descripcion: 'El átomo ' + nombre + ' sustenta la conclusión jurídica.',
            explicacion_logica: 'Si el átomo ' + nombre + ' no se acredita, la conclusión principal pierde solidez en ese componente.',
            color: { color: '#22c55e' }, // Default color, will be overridden by forceProbatoria
            forceProbatoria: 'conclusive', // Default force for THD atoms
            width: 2
        });
    });

    // Evidencias desde NC y PIC
    var evidencias = [];
    var idxEv = 0;
    if (MIC_Module.datosNC && Array.isArray(MIC_Module.datosNC.actores)) {
        MIC_Module.datosNC.actores.forEach(function (a) {
            idxEv++;
            evidencias.push({ id: 'EV-A-' + idxEv, label: (a.nombre || 'Actor') + '\n(Testimonio)', tipo: 'testimonio', level: 2 });
        });
    }
    if (MIC_Module.datosNC && Array.isArray(MIC_Module.datosNC.indicios)) {
        MIC_Module.datosNC.indicios.forEach(function (ind) {
            idxEv++;
            evidencias.push({ id: 'EV-I-' + idxEv, label: (ind.descripcion || 'Indicio') + '\n(Evidencia física)', tipo: 'hecho', level: 2 });
        });
    }
    if (Array.isArray(MIC_Module.datosPIC)) {
        MIC_Module.datosPIC.forEach(function (act) {
            idxEv++;
            evidencias.push({ id: 'EV-P-' + idxEv, label: (act.elemento || act.actividad || 'Actividad PIC') + '\n(PIC)', tipo: 'indicio', level: 2 });
        });
    }

    evidencias.forEach(function (ev) {
        var nodeColor = ev.tipo === 'hecho'
            ? { background: '#16a34a', border: '#22c55e' }
            : ev.tipo === 'testimonio'
                ? { background: '#0ea5e9', border: '#38bdf8' }
                : { background: '#eab308', border: '#facc15' };
        nodes.push({
            id: ev.id,
            label: ev.label,
            level: ev.level,
            shape: ev.tipo === 'testimonio' ? 'diamond' : (ev.tipo === 'hecho' ? 'dot' : 'box'), // diamond for inference, dot for circumstantial, box for evidenceSource
            tipoMic: ev.tipo === 'testimonio' ? 'testimonio' : (ev.tipo === 'hecho' ? 'hecho' : 'indicio'),
            naturaleza: ev.tipo === 'testimonio'
                ? 'Inferencia (Rombo)'
                : (ev.tipo === 'hecho' ? 'Hecho probatorio' : 'Indicio / actividad de investigación'),
            descripcion: ev.label.replace(/\n/g, ' '),
            explicacion_logica: ev.tipo === 'testimonio'
                ? 'Este testimonio aporta información sobre la participación o conocimiento de un actor en los hechos.'
                : (ev.tipo === 'hecho'
                    ? 'Este hecho probatorio representa un componente objetivo de la conducta o del resultado.'
                    : 'Este indicio o actividad del PIC orienta la búsqueda de evidencia corroborativa.'),
            color: { background: nodeColor.background, border: nodeColor.border, highlight: { background: nodeColor.background, border: '#fefce8' } }, // Default color, will be overridden by validation
            borderWidth: 2,
            font: { color: '#f8fafc', size: 14 },
            margin: 10
        });
        var targetAtom = ev.tipo === 'hecho'
            ? atomIds['Conducta']
            : ev.tipo === 'testimonio'
                ? atomIds['Culpabilidad']
                : atomIds['Tipicidad'];
        edges.push({
            from: ev.id,
            to: targetAtom,
            tipoMic: 'inferencia',
            naturaleza: 'Inferencia probatoria',
            descripcion: 'Conexión entre la evidencia y el átomo correspondiente.',
            explicacion_logica: 'La evidencia "' + ev.label.replace(/\n/g, ' ') + '" aporta soporte al átomo asociado. Si se debilita esta evidencia, disminuye la fuerza del átomo en el MIC.',
            color: { color: '#22c55e' }, // Default color, will be overridden by forceProbatoria
            forceProbatoria: 'strong', // Default force for evidence to atom
            width: 1.5
        });
    });

    // Eslabones perdidos
    Object.keys(atomIds).forEach(function (nombre) {
        var id = atomIds[nombre];
        var tieneHijos = edges.some(function (e) { return e.to === id; });
        if (!tieneHijos) {
            var missingId = 'MISS-' + id;
            nodes.push({
                id: missingId,
                label: 'Eslabón perdido\nSe requiere prueba\ncorroborativa aquí',
                level: 2,
                shape: 'diamond',
                tipoMic: 'eslabon',
                naturaleza: 'Advertencia metodológica',
                descripcion: 'Falta evidencia directa o corroborativa para el átomo ' + nombre + '.',
                explicacion_logica: 'Este nodo indica que el átomo ' + nombre + ' no tiene pruebas suficientes conectadas. La Célula Investigadora debe generar evidencia corroborativa.',
                color: { background: '#0f172a', border: '#f97316', highlight: { background: '#1f2937', border: '#fed7aa' } },
                font: { color: '#fed7aa', size: 12 },
                borderWidth: 1
            });
            edges.push({
                from: missingId,
                to: id,
                tipoMic: 'inferencia',
                naturaleza: 'Llamado a prueba faltante',
                descripcion: 'Conexión lógica entre el eslabón perdido y el átomo ' + nombre + '.',
                explicacion_logica: 'Esta flecha advierte que el átomo ' + nombre + ' está pendiente de acreditación, generando un riesgo en la cadena inferencial.',
                color: { color: '#ef4444' }, // Default color, will be overridden by forceProbatoria
                forceProbatoria: 'indiciary', // Default force for missing links
                dashes: true,
                width: 2
            });
        }
    });

    MIC_Module.nodesDS.add(nodes);
    MIC_Module.edgesDS.add(edges);

    // Apply initial edge styles based on forceProbatoria
    MIC_Module.edgesDS.forEach(edge => applyEdgeStyle(edge.id, edge.forceProbatoria));
    validateArgumentHealth(); // Initial validation
}

function calcularAcreditacionGlobal() {
    var fuentes = [];
    try {
        if (typeof currentCase !== 'undefined' && currentCase && currentCase.escalera && currentCase.escalera.acreditacion) {
            var vals = Object.values(currentCase.escalera.acreditacion).filter(function (v) { return typeof v === 'number'; });
            if (vals.length) {
                var promEscalera = vals.reduce(function (a, b) { return a + b; }, 0) / vals.length;
                fuentes.push({ peso: 0.4, valor: promEscalera });
            }
        }
        if (typeof currentCase !== 'undefined' && currentCase && currentCase.matrizIntegracion && currentCase.matrizIntegracion.filasTotales > 0) {
            var ratio = currentCase.matrizIntegracion.filasValidadas / currentCase.matrizIntegracion.filasTotales;
            fuentes.push({ peso: 0.3, valor: Math.round(ratio * 100) });
        }
        if (Array.isArray(MIC_Module.datosPIC) && MIC_Module.datosPIC.length > 0) {
            var completadas = 0;
            var total = MIC_Module.datosPIC.length;
            MIC_Module.datosPIC.forEach(function (act) {
                if (act.estado === 'Completa') completadas++;
                else if (act.estado === 'En proceso' || act.estado === 'Parcial') completadas += 0.5;
            });
            var valorPIC = Math.round((completadas / total) * 100);
            fuentes.push({ peso: 0.3, valor: valorPIC });
        }
        if (!fuentes.length) return 0;
        var sumaPesos = fuentes.reduce(function (a, f) { return a + f.peso; }, 0);
        var acreditacion = fuentes.reduce(function (acum, f) {
            return acum + (f.valor * (f.peso / sumaPesos));
        }, 0);
        return Math.round(acreditacion);
    } catch (e) {
        console.warn('No se pudo calcular la acreditación global MIC:', e);
        return 0;
    }
}

window.actualizarMIC = actualizarMIC;
window.construirMICDesdeDatos = construirMICDesdeDatos;
window.calcularAcreditacionGlobal = calcularAcreditacionGlobal;
})();
