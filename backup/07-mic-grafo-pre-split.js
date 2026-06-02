const MIC_Module = {
    ultimaActualizacion: null,
    nodesDS: null,
    edgesDS: null,
    network: null,
    datosNC: {},
    datosPIC: [],
    datosResultados: []
};

function initMIC() {
    console.log('🗺️ Inicializando módulo MIC (Mapa de Investigación Criminal)...');
    cargarDatosParaMIC();
    initMICNetwork();
    actualizarFechaHoraMIC();
    actualizarMIC();
    console.log('✅ Módulo MIC inicializado');
}

function cargarDatosParaMIC() {
    MIC_Module.datosNC = MIC_Module.datosNC || {
        carpeta: 'CI/AGS/CV/2025-001',
        caso: 'Consorcio Vigilante'
    };
    MIC_Module.datosPIC = MIC_Module.datosPIC || [];
    if (typeof currentCase !== 'undefined' && currentCase) {
        if (currentCase.ncNarrativa) MIC_Module.datosNC.narrativa = currentCase.ncNarrativa;
        if (Array.isArray(currentCase.actores)) MIC_Module.datosNC.actores = currentCase.actores;
        if (Array.isArray(currentCase.indicios)) MIC_Module.datosNC.indicios = currentCase.indicios;
    }
}

function safeInitMICNetwork() {
    const micContainer = document.getElementById('mic-network');
    if (micContainer && typeof vis !== 'undefined' && vis.Network) {
        if (!MIC_Module.network) {
            initMICNetwork({
                width: '100%',
                height: '600px',
                apiKey: window.GOOGLE_API_KEY
            });
        } else {
            MIC_Module.network.redraw();
            MIC_Module.network.fit();
        }
        console.log("✅ MIC inicializado/redibujado correctamente.");
    } else {
        console.warn("⚠️ No se encontró el contenedor del MIC o vis.js no está cargado.");
    }
}

function initMICNetwork(config) {
    var container = document.getElementById('mic-network');
    if (!container || typeof vis === 'undefined' || !vis.Network) {
        console.warn('vis-network no disponible para MIC.');
        return;
    }
    if (config) {
        if (config.width) container.style.width = config.width;
        if (config.height) container.style.height = config.height;
    }
    MIC_Module.nodesDS = new vis.DataSet([]);
    MIC_Module.edgesDS = new vis.DataSet([]);
    var data = { nodes: MIC_Module.nodesDS, edges: MIC_Module.edgesDS };
        
        // REPARACIÓN CRÍTICA (MIC): Instanciación correcta del objeto 'options'
        // con parámetros de mapa (zoom, center) para la persona investigadora criminal.
        var options = {
        autoResize: true,
        layout: { hierarchical: { enabled: true, direction: 'UD', sortMethod: 'hubsize', levelSeparation: 150, nodeSpacing: 140 } },
        physics: { enabled: true, hierarchicalRepulsion: { nodeDistance: 170 }, stabilization: { iterations: 200, updateInterval: 25 } },
        interaction: { dragNodes: true, dragView: true, zoomView: true, hover: true, tooltipDelay: 80, hoverConnectedEdges: true, selectable: true },
        zoom: config && config.zoom ? config.zoom : 1,
        center: config && config.center ? config.center : { x: 0, y: 0 },
        nodes: {
            font: { color: '#e5e7eb', size: 14 },
            borderWidth: 1,
            color: { border: '#38bdf8', background: '#020617', highlight: { border: '#e5e7eb', background: '#020617' } }
        },
        edges: {
            smooth: true,
            arrows: { to: { enabled: true, scaleFactor: 0.8 } },
            color: { color: '#64748b' }
        }
    };
        if (typeof options === 'undefined') {
            console.error("Error: options is not defined. No se puede inicializar la vista del mapa para la persona investigadora criminal.");
            return;
        }
        MIC_Module.options = options;
        MIC_Module.network = new vis.Network(container, data, options);

    MIC_Module.network.on('click', function (params) {
        if (!params) return;
        if (params.nodes && params.nodes.length > 0) {
            var nodeId = params.nodes[0];
            var node = MIC_Module.nodesDS && MIC_Module.nodesDS.get(nodeId);
            if (node) {
                abrirPanelInferenciaMic({
                    tipo: 'nodo',
                    tipoMic: node.tipoMic || 'elemento',
                    naturaleza: node.naturaleza || 'Elemento del MIC',
                    descripcion: node.descripcion || node.label || '',
                    explicacion_logica: node.explicacion_logica || 'Sin explicación registrada para este nodo.'
                });
            }
        } else if (params.edges && params.edges.length > 0) {
            var edgeId = params.edges[0];
            var edge = MIC_Module.edgesDS && MIC_Module.edgesDS.get(edgeId);
            if (edge) {
                abrirPanelInferenciaMic({ // Existing function, ensure it can display edge info
                    tipo: 'arista',
                    tipoMic: edge.tipoMic || 'inferencia',
                    naturaleza: edge.naturaleza || 'Relación probatoria',
                    descripcion: edge.descripcion || '',
                    explicacion_logica: edge.explicacion_logica || 'Sin explicación registrada para esta relación.'
                });
            }
        }
    });
}


function actualizarFechaHoraMIC() {
    var ahora = new Date();
    var fechaEl = document.getElementById('mic-fecha-actualizacion');
    var horaEl = document.getElementById('mic-hora-actualizacion');
    if (fechaEl) fechaEl.textContent = ahora.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    if (horaEl) horaEl.textContent = ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    MIC_Module.ultimaActualizacion = ahora;
}

function actualizarContadoresMIC() {
    var nodosTotal = document.getElementById('mic-nodos-total');
    var conexionesTotal = document.getElementById('mic-conexiones-total');
    if (MIC_Module.nodesDS && MIC_Module.edgesDS) {
        if (nodosTotal) nodosTotal.textContent = MIC_Module.nodesDS.length || 0;
        if (conexionesTotal) conexionesTotal.textContent = MIC_Module.edgesDS.length || 0;
    }

    // Actualizar biblioteca Wigmore (lista de documentos MIC)
    try {
        var listaEl = document.getElementById('mic-reglas-lista');
        var countEl = document.getElementById('mic-reglas-count');
        if (!listaEl || !countEl) return;
        listaEl.innerHTML = '';
        var reglas = MIC_Module.reglasWigmore || [];
        countEl.textContent = reglas.length + (reglas.length === 1 ? ' documento detectado' : ' documentos detectados');
        if (!reglas.length) {
            var liEmpty = document.createElement('li');
            liEmpty.style.fontSize = '0.72rem';
            liEmpty.style.color = '#6b7280';
            liEmpty.textContent = 'No se han autorizado aún documentos MIC; use el botón "Autorizar lectura carpeta MIC".';
            listaEl.appendChild(liEmpty);
            return;
        }
        reglas.forEach(function(r, idx) {
            var li = document.createElement('li');
            li.style.fontSize = '0.72rem';
            li.style.color = '#e5e7eb';
            li.style.padding = '2px 0';
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.gap = '8px';
            var tipo = (r.tipo || 'desconocido').toUpperCase();
            var spanInfo = document.createElement('span');
            spanInfo.textContent = '[' + tipo + '] ' + (r.nombreArchivo || 'Documento MIC');
            var btn = document.createElement('button');
            btn.textContent = 'Analizar con IA';
            btn.style.fontSize = '0.7rem';
            btn.style.padding = '2px 6px';
            btn.style.borderRadius = '999px';
            btn.style.border = '1px solid rgba(56, 189, 248, 0.8)';
            btn.style.background = 'rgba(15, 23, 42, 0.9)';
            btn.style.color = '#7dd3fc';
            btn.style.cursor = 'pointer';
            btn.onclick = function() {
                analizarReglaWigmoreConIA(idx);
            };
            li.appendChild(spanInfo);
            li.appendChild(btn);
            listaEl.appendChild(li);
        });
    } catch (e) {
        console.warn('No se pudo actualizar la lista de biblioteca Wigmore en MIC:', e);
    }
}

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
        color: { background: '#0f172a', border: '#22c55e', highlight: { background: '#16a34a', border: '#bbf7d0' } },
        font: { color: '#bbf7d0' },
        borderWidth: 3 // Double border for lastProbandum (main conclusion)
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
            color: { background: '#f97316', border: '#ea580c', highlight: { background: '#fb923c', border: '#fed7aa' } },
            font: { color: '#fff7ed' },
            borderWidth: 1
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
            borderWidth: ev.tipo === 'hecho' ? 1 : (ev.tipo === 'testimonio' ? 1 : 1), // Default border width
            font: { color: '#e5e7eb', size: 12 }
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

async function autorizarCarpetaMIC() {
    if (!window.showDirectoryPicker) {
        if (typeof showToast === 'function') {
            showToast('El navegador no soporta acceso directo a carpetas (File System Access API).', 'warning');
        }
        return;
    }
    try {
        const handle = await window.showDirectoryPicker();
        MIC_Module.directorioMIC = handle;

        // Intentar registrar archivos de la carpeta (y subcarpetas) como reglas Wigmore
        MIC_Module.reglasWigmore = [];
        async function recolectarReglas(desdeHandle) {
            try {
                for await (const entry of desdeHandle.values()) {
                    if (!entry) continue;
                    if (entry.kind === 'directory') {
                        // Recursivo: subcarpetas dentro de MIC
                        await recolectarReglas(entry);
                        continue;
                    }
                    const name = entry.name || '';
                    var lower = name.toLowerCase();
                    // Aceptamos: texto, Word, PDF, imágenes (jpg/jpeg/png)
                    var esTexto = lower.endsWith('.txt') || lower.endsWith('.md');
                    var esWord = lower.endsWith('.doc') || lower.endsWith('.docx');
                    var esPdf  = lower.endsWith('.pdf');
                    var esImg  = lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png');
                    if (!(esTexto || esWord || esPdf || esImg)) continue;

                    const file = await entry.getFile();
                    var registro = {
                        nombreArchivo: name,
                        tipo: esTexto ? 'texto' : (esWord ? 'word' : (esPdf ? 'pdf' : 'imagen')),
                        contenido: '',
                        _fileRef: file // referencia en memoria para uso posterior con APIs de Google
                    };

                    // Solo intentamos leer como texto los .txt/.md
                    if (esTexto) {
                        const text = await file.text();
                        if (text && text.trim().length) {
                            registro.contenido = text.slice(0, 8000); // límite de seguridad
                        }
                    }

                    MIC_Module.reglasWigmore.push(registro);
                }
            } catch (inner) {
                console.warn('No se pudieron leer completamente las reglas Wigmore desde la carpeta MIC:', inner);
            }
        }

        await recolectarReglas(handle);

        if (typeof ConcienciaOperativaSAI !== 'undefined' && ConcienciaOperativaSAI) {
            ConcienciaOperativaSAI.reglasWigmore = MIC_Module.reglasWigmore || [];
        }

        // Refrescar inmediatamente la UI de contadores y biblioteca Wigmore
        try {
            actualizarContadoresMIC();
        } catch (e) {
            console.warn('No se pudieron actualizar contadores MIC tras autorizar carpeta:', e);
        }

        if (typeof showToast === 'function') {
            var msg = 'Carpeta MIC autorizada correctamente.';
            if (MIC_Module.reglasWigmore && MIC_Module.reglasWigmore.length) {
                msg += ' Reglas Wigmore cargadas: ' + MIC_Module.reglasWigmore.length + ' archivo(s) de referencia.';
            } else {
                msg += ' No se encontraron archivos .txt/.md para reglas; solo se autorizó la carpeta.';
            }
            showToast(msg, 'success');
        }
    } catch (err) {
        console.warn('Autorizar carpeta MIC cancelado o fallido:', err);
        if (typeof showToast === 'function') {
            showToast('No se autorizó ninguna carpeta MIC.', 'info');
        }
    }
}

async function generarMICConIAWigmore() {
    // 1) Reconstruir el grafo base con datos del caso
    actualizarMIC();

    // 2) Si hay reglas Wigmore y Gemini disponible, pedir una revisión de alto nivel
    if (typeof ConcienciaOperativaSAI !== 'undefined' &&
        ConcienciaOperativaSAI &&
        typeof ConcienciaOperativaSAI.llamarGemini === 'function' &&
        ConcienciaOperativaSAI.reglasWigmore &&
        ConcienciaOperativaSAI.reglasWigmore.length) {

        try {
            var narrativa = (typeof ConcienciaOperativaSAI.getNarrativa === 'function')
                ? ConcienciaOperativaSAI.getNarrativa()
                : '';
            var resumenReglas = ConcienciaOperativaSAI.reglasWigmore.map(function(r) {
                var tipo = r.tipo || 'desconocido';
                var base = '--- ' + (r.nombreArchivo || 'Regla') + ' [' + tipo.toUpperCase() + '] ---\n';
                if (r.contenido) {
                    return base + (r.contenido || '').slice(0, 2000);
                }
                return base + '(Documento binario sin extracción local: PDF/Word/Imagen. Debe tomarse como filtro metodológico y legal externo.)';
            }).join('\n\n');
            var prompt = "Actúa como Auditor de la Arquitectura de la Verdad y experto en gráficos de Wigmore.\n" +
                "Se te proporciona: (1) una narrativa resumida de la Noticia Criminal; (2) extractos de reglas Wigmore de la carpeta MIC.\n" +
                "Indica en formato de lista breve: \n" +
                "a) qué tipos de nodos no deben faltar en el MIC (Probandum, átomos, evidencias críticas, eslabones perdidos claves);\n" +
                "b) qué relaciones probatorias deben cuidarse especialmente;\n" +
                "c) alertas metodológicas si detectas riesgos de sobreinferencia.\n\n" +
                "Responde de forma muy concreta para que la Célula Investigadora ajuste manualmente el mapa.";

            var parts = [
                { text: "NARRATIVA (resumen):\n" + (narrativa ? narrativa.slice(0, 2000) : "Sin narrativa capturada.") + "\n\n" },
                { text: "REGLAS WIGMORE (extractos):\n" + resumenReglas.slice(0, 6000) + "\n\n" },
                { text: prompt }
            ];

            ConcienciaOperativaSAI.llamarGemini(parts, ConcienciaOperativaSAI.systemInstruction)
                .then(function(texto) {
                    console.log('Sugerencias Wigmore para MIC:', texto);
                    if (typeof showToast === 'function') {
                        showToast('IA Wigmore: se generaron sugerencias para ajustar el MIC. Revise la consola.', 'info');
                    }
                })
                .catch(function(err) {
                    console.warn('Error al consultar Gemini para MIC Wigmore:', err);
                    if (typeof showToast === 'function') {
                        showToast('MIC generado. No se pudieron obtener sugerencias IA Wigmore: ' + (err.message || err), 'warning');
                    }
                });
        } catch (e) {
            console.warn('Error en flujo IA de generarMICConIAWigmore:', e);
        }
    } else if (typeof showToast === 'function') {
        showToast('MIC generado con la información actual (modo Wigmore básico, sin IA adicional).', 'success');
    }
}

async function analizarReglaWigmoreConIA(idx) {
    try {
        if (!MIC_Module.reglasWigmore || !MIC_Module.reglasWigmore.length) {
            if (typeof showToast === 'function') showToast('No hay documentos MIC registrados para análisis.', 'warning');
            return;
        }
        var regla = MIC_Module.reglasWigmore[idx];
        if (!regla) {
            if (typeof showToast === 'function') showToast('No se encontró el documento seleccionado.', 'error');
            return;
        }
        if (!regla._fileRef) {
            if (typeof showToast === 'function') showToast('Este documento MIC no está disponible como archivo en memoria.', 'warning');
            return;
        }
        if (typeof ConcienciaOperativaSAI === 'undefined' || !ConcienciaOperativaSAI || typeof ConcienciaOperativaSAI.analizarDictamen !== 'function') {
            if (typeof showToast === 'function') showToast('El módulo de Conciencia Operativa SAI no está disponible.', 'error');
            return;
        }

        var file = regla._fileRef;
        var lower = (regla.nombreArchivo || '').toLowerCase();
        var mime = file.type || '';
        if (!mime) {
            if (lower.endsWith('.pdf')) mime = 'application/pdf';
            else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) mime = 'image/jpeg';
            else if (lower.endsWith('.png')) mime = 'image/png';
        }
        if (!mime) {
            if (typeof showToast === 'function') showToast('Tipo de archivo no soportado para análisis IA.', 'warning');
            return;
        }

        if (typeof showToast === 'function') {
            showToast('Analizando "' + (regla.nombreArchivo || 'documento MIC') + '" con IA. Esto puede tardar unos segundos…', 'info');
        }

        var dataUrl = await new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onload = function(e) { resolve(e.target.result); };
            reader.onerror = function(err) { reject(err); };
            reader.readAsDataURL(file);
        });

        var narrativa = (typeof ConcienciaOperativaSAI.getNarrativa === 'function')
            ? ConcienciaOperativaSAI.getNarrativa()
            : '';
        var codigo = (typeof ConcienciaOperativaSAI.getCodigoPenalNombre === 'function')
            ? ConcienciaOperativaSAI.getCodigoPenalNombre()
            : 'no cargado';

        var texto = await ConcienciaOperativaSAI.analizarDictamen(narrativa, codigo, dataUrl, mime);

        if (!ConcienciaOperativaSAI.hallazgosDictamenes) ConcienciaOperativaSAI.hallazgosDictamenes = [];
        ConcienciaOperativaSAI.hallazgosDictamenes.push({
            nombreArchivo: regla.nombreArchivo || 'Documento MIC',
            texto: texto,
            fecha: new Date().toISOString(),
            origen: 'MIC'
        });
        if (typeof ConcienciaOperativaSAI.renderHallazgos === 'function') {
            ConcienciaOperativaSAI.renderHallazgos();
        }

        if (typeof showToast === 'function') {
            showToast('Análisis IA del documento MIC completado. Revise el panel de dictámenes en Conciencia Operativa.', 'success');
        }
    } catch (e) {
        console.warn('Error al analizar documento MIC con IA:', e);
        if (typeof showToast === 'function') {
            showToast('Error al analizar documento MIC con IA: ' + (e.message || e), 'error');
        }
    }
}

// Function to apply visual style to an edge based on its forceProbatoria
function applyEdgeStyle(edgeId, forceProbatoria) {
    if (!MIC_Module.edgesDS || !MIC_Module.options) return;

    const edge = MIC_Module.edgesDS.get(edgeId);
    if (!edge) return;

    const style = MIC_Module.options.edges[forceProbatoria] || MIC_Module.options.edges.dflt;

    const updatedEdge = {
        id: edgeId,
        forceProbatoria: forceProbatoria, // Persist the forceProbatoria
        color: style.color,
        width: style.width,
        dashes: style.dashes,
        arrows: style.arrows,
        font: style.font,
        label: style.label
    };

    MIC_Module.edgesDS.update(updatedEdge);
}

// Function to cycle through forceProbatoria types
function cycleEdgeForceProbatoria(edgeId) {
    if (!MIC_Module.edgesDS) return;

    const edge = MIC_Module.edgesDS.get(edgeId);
    if (!edge) return;

    const forceTypes = ['conclusive', 'strong', 'indiciary', 'negation'];
    let currentIndex = forceTypes.indexOf(edge.forceProbatoria);
    if (currentIndex === -1) currentIndex = 0; // Default to conclusive if not set

    const nextIndex = (currentIndex + 1) % forceTypes.length;
    const nextForce = forceTypes[nextIndex];

    applyEdgeStyle(edgeId, nextForce);
    validateArgumentHealth(); // Re-validate after changing edge style
    if (typeof showToast === 'function') showToast(`Fuerza probatoria de vínculo actualizada a: ${nextForce.toUpperCase()}`, 'info');
}

// Function to validate argument health (node colors and alerts)
function validateArgumentHealth() {
    if (!MIC_Module.nodesDS || !MIC_Module.edgesDS) return;

    // Reset all nodes to their default colors/borders first
    MIC_Module.nodesDS.forEach(node => {
        const originalNode = MIC_Module.nodesDS.get(node.id);
        let defaultColor = { background: '#020617', border: '#38bdf8' }; // Default for most nodes
        let defaultBorderWidth = 1;

        if (originalNode.tipoMic === 'probandum') {
            defaultColor = { background: '#0f172a', border: '#22c55e' };
            defaultBorderWidth = 3; // Double border
        } else if (originalNode.tipoMic === 'atomoTHD') {
            defaultColor = { background: '#f97316', border: '#ea580c' };
        } else if (originalNode.tipoMic === 'testimonio') {
            defaultColor = { background: '#0b1120', border: '#38bdf8' };
        } else if (originalNode.tipoMic === 'hecho') {
            defaultColor = { background: '#052e16', border: '#22c55e' };
        } else if (originalNode.tipoMic === 'indicio') {
            defaultColor = { background: '#111827', border: '#eab308' };
        } else if (originalNode.tipoMic === 'eslabon') {
            defaultColor = { background: '#0f172a', border: '#f97316' };
        }

        MIC_Module.nodesDS.update({
            id: node.id,
            color: { ...defaultColor, highlight: { background: defaultColor.background, border: '#fefce8' } },
            borderWidth: defaultBorderWidth,
            borderDashes: false, // Reset dashed border
            image: undefined // Remove custom image if any
        });
    });

    // Validate Inference (Rombo) nodes
    MIC_Module.nodesDS.forEach(node => {
        if (node.shape === 'diamond') { // Inference node
            const connectedEdges = MIC_Module.network.getConnectedEdges(node.id);
            let hasSolidConnectionFromEvidenceSource = false;

            for (const edgeId of connectedEdges) {
                const edge = MIC_Module.edgesDS.get(edgeId);
                if (!edge) continue;

                const fromNodeId = edge.from;
                const fromNode = MIC_Module.nodesDS.get(fromNodeId);

                if (fromNode && fromNode.shape === 'box' && (edge.forceProbatoria === 'conclusive' || edge.forceProbatoria === 'strong')) {
                    hasSolidConnectionFromEvidenceSource = true;
                    break;
                }
            }

            if (!hasSolidConnectionFromEvidenceSource) {
                // Change color to soft red
                MIC_Module.nodesDS.update({
                    id: node.id,
                    color: { background: '#fef2f2', border: '#ef4444', highlight: { background: '#fef2f2', border: '#dc2626' } }
                });
            }
        }

        // Validate Probandum (Rectángulo Doble) nodes
        if (node.tipoMic === 'probandum') { // Main Conclusion node
            const connectedEdges = MIC_Module.network.getConnectedEdges(node.id);
            let hasNegationIncoming = false;

            for (const edgeId of connectedEdges) {
                const edge = MIC_Module.edgesDS.get(edgeId);
                if (!edge) continue;

                // Check only incoming edges
                if (edge.to === node.id && edge.forceProbatoria === 'negation') {
                    hasNegationIncoming = true;
                    break;
                }
            }

            if (hasNegationIncoming) {
                // Display alert icon (e.g., change border to dashed red or add an image)
                MIC_Module.nodesDS.update({
                    id: node.id,
                    color: { background: '#0f172a', border: '#ef4444', highlight: { background: '#16a34a', border: '#dc2626' } },
                    borderWidth: 3,
                    borderDashes: [5, 5] // Punteado para alerta
                    // Could also use a custom image: image: 'path/to/alert_icon.png', shape: 'image'
                });
            }
        }
    });
}


function abrirPanelInferenciaMic(info) {
    var backdrop = document.getElementById('mic-inferencia-backdrop');
    if (!backdrop) return;
    var chip = document.getElementById('mic-inferencia-tipo-chip');
    var naturalezaEl = document.getElementById('mic-inferencia-naturaleza');
    var descripcionEl = document.getElementById('mic-inferencia-descripcion');
    var explicacionEl = document.getElementById('mic-inferencia-explicacion-texto');
    var icono = document.getElementById('mic-inferencia-icono');

    var tipoMic = info.tipoMic || 'elemento';
    var esArista = info.tipo === 'arista';

    if (chip) {
        chip.textContent = (esArista ? 'Arista' : 'Nodo') + ' · ' + (tipoMic || '').toString().toUpperCase();
    }
    if (naturalezaEl) naturalezaEl.textContent = info.naturaleza || 'Elemento del MIC';
    if (descripcionEl) descripcionEl.textContent = info.descripcion || 'Sin descripción registrada.';
    if (explicacionEl) explicacionEl.innerHTML = '<strong>Explicación lógica:</strong> ' + (info.explicacion_logica || 'Sin explicación registrada para este elemento.');

    if (icono) {
        var fondo = '#0f172a';
        var borde = '#38bdf8';
        var color = '#7dd3fc';
        var iconClass = 'fas fa-project-diagram';

        if (tipoMic === 'probandum') {
            fondo = '#022c22'; borde = '#22c55e'; color = '#bbf7d0'; iconClass = 'fas fa-balance-scale';
        } else if (tipoMic === 'atomoTHD') {
            fondo = '#451a03'; borde = '#f97316'; color = '#fed7aa'; iconClass = 'fas fa-layer-group';
        } else if (tipoMic === 'testimonio') {
            fondo = '#0b1120'; borde = '#38bdf8'; color = '#bfdbfe'; iconClass = 'fas fa-user-edit';
        } else if (tipoMic === 'hecho') {
            fondo = '#052e16'; borde = '#22c55e'; color = '#bbf7d0'; iconClass = 'fas fa-gavel';
        } else if (tipoMic === 'indicio') {
            fondo = '#111827'; borde = '#eab308'; color = '#facc15'; iconClass = 'fas fa-search';
        } else if (tipoMic === 'eslabon') {
            fondo = '#111827'; borde = '#f97316'; color = '#fed7aa'; iconClass = 'fas fa-exclamation-triangle';
        } else if (tipoMic === 'inferencia') {
            fondo = '#020617'; borde = '#38bdf8'; color = '#38bdf8'; iconClass = 'fas fa-share-alt';
        }

        icono.style.background = fondo;
        icono.style.border = '1px solid ' + borde;
        icono.style.color = color;
        icono.innerHTML = '<i class="' + iconClass + '"></i>';
    }

    backdrop.classList.add('visible');
}

function cerrarPanelInferenciaMic(event) {
    if (event) event.preventDefault();
    var backdrop = document.getElementById('mic-inferencia-backdrop');
    if (backdrop) {
        backdrop.classList.remove('visible');
    }
}

window.initMIC = initMIC;
window.actualizarMIC = actualizarMIC;
window.descargarMIC = function () {
    if (typeof showToast === 'function') showToast('Descarga PNG del grafo MIC se implementará en una versión siguiente.', 'info');
};
window.exportarMICPDF = function () {
    if (typeof showToast === 'function') showToast('Exportación PDF del MIC pendiente de implementación.', 'info');
};
console.log("✅ Motor de Valoración MWA Activo y Validado");
window.autorizarCarpetaMIC = autorizarCarpetaMIC;
window.generarMICConIAWigmore = generarMICConIAWigmore;
