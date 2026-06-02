(function() {
const MIC_Module = {
    ultimaActualizacion: null,
    nodesDS: null,
    edgesDS: null,
    network: null,
    datosNC: {},
    datosPIC: [],
    datosResultados: []
};

MIC_Module.edgeStyles = {
    conclusive: { color: { color: '#22c55e' }, width: 3, dashes: false, arrows: { to: { enabled: true, scaleFactor: 0.9 } }, label: 'CONCLUYENTE', font: { color: '#bbf7d0', size: 11 } },
    strong: { color: { color: '#38bdf8' }, width: 2, dashes: false, arrows: { to: { enabled: true, scaleFactor: 0.8 } }, label: 'FUERTE', font: { color: '#bae6fd', size: 10 } },
    indicia: { color: { color: '#facc15' }, width: 1.5, dashes: true, arrows: { to: { enabled: true, scaleFactor: 0.7 } }, label: 'INDICIARIA', font: { color: '#fef3c7', size: 10 } },
    indiciary: { color: { color: '#facc15' }, width: 1.5, dashes: true, arrows: { to: { enabled: true, scaleFactor: 0.7 } }, label: 'INDICIARIA', font: { color: '#fef3c7', size: 10 } },
    negation: { color: { color: '#ef4444' }, width: 2, dashes: true, arrows: { to: { enabled: true, scaleFactor: 0.8 } }, label: 'NEGACION', font: { color: '#fecaca', size: 10 } },
    dflt: { color: { color: '#64748b' }, width: 1.5, dashes: false, arrows: { to: { enabled: true, scaleFactor: 0.8 } }, label: '', font: { color: '#cbd5e1', size: 10 } }
};
window.MIC_Module = MIC_Module;

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
                if (typeof actualizarMIC === 'function') {
                    actualizarMIC();
                }
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
        layout: { hierarchical: { enabled: true, direction: 'UD', sortMethod: 'directed', levelSeparation: 250, nodeSpacing: 220 } },
        physics: { enabled: true, hierarchicalRepulsion: { nodeDistance: 220, springLength: 150, damping: 0.09 }, solver: 'hierarchicalRepulsion', stabilization: { iterations: 250, updateInterval: 25, fit: true } },
        interaction: { dragNodes: true, dragView: true, zoomView: true, hover: true, tooltipDelay: 50, hoverConnectedEdges: true, selectable: true, navigationButtons: true, keyboard: true },
        nodes: {
            font: { color: '#ffffff', size: 16, face: 'Inter' },
            borderWidth: 2,
            shadow: { enabled: true, color: 'rgba(0,0,0,0.5)', size: 10, x: 4, y: 4 },
            color: { border: '#38bdf8', background: '#0f172a', highlight: { border: '#7dd3fc', background: '#1e293b' } },
            margin: { top: 12, bottom: 12, left: 16, right: 16 }
        },
        edges: {
            smooth: { type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.4 },
            arrows: { to: { enabled: true, scaleFactor: 1.2 } },
            color: { color: '#94a3b8', highlight: '#f8fafc', hover: '#cbd5e1' },
            width: 2,
            shadow: { enabled: true, color: 'rgba(0,0,0,0.3)', size: 5, x: 2, y: 2 }
        }
    };
        if (typeof options === 'undefined') {
            console.error("Error: options is not defined. No se puede inicializar la vista del mapa para la persona investigadora criminal.");
            return;
        }
        MIC_Module.options = options;
        MIC_Module.network = new vis.Network(container, data, options);
        if (config && (config.zoom || config.center)) {
            MIC_Module.network.moveTo({
                scale: config.zoom || 1,
                position: config.center || { x: 0, y: 0 }
            });
        }

    // OPTIMIZACIÓN COURTROOM: Una vez estabilizado el grafo, apagamos las físicas.
    // Esto evita que el grafo rebote si el Fiscal arrastra un nodo para explicarlo.
    MIC_Module.network.on("stabilizationIterationsDone", function () {
        MIC_Module.network.setOptions( { physics: false } );
    });

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

window.initMIC = initMIC;
window.cargarDatosParaMIC = cargarDatosParaMIC;
window.safeInitMICNetwork = safeInitMICNetwork;
window.initMICNetwork = initMICNetwork;
window.actualizarFechaHoraMIC = actualizarFechaHoraMIC;
window.actualizarContadoresMIC = actualizarContadoresMIC;
})();
