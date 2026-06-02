(function() {
// =============================================
// ESCALERA HEPTATÓMICA - Estado Global y Motor
// =============================================

window.elementos = ['conducta', 'tipicidad', 'antijuridicidad', 'imputabilidad', 'culpabilidad', 'punibilidad'];
window.currentStep = 0;

window.csdSeleccionado = null;
window.delitoSeleccionado = null;
window.estadoEscalera = {
    conducta: 'pendiente',
    tipicidad: 'pendiente',
    antijuridicidad: 'pendiente',
    imputabilidad: 'pendiente',
    culpabilidad: 'pendiente',
    punibilidad: 'pendiente'
};

// Núcleo lógico ligero para la Escalera Heptatómica (sin afectar la UI existente)
window.SAIEngine = {
    escalera: {
        casoId: null,
        csdId: null,
        delito: null,
        estado: {
            conducta: 'pendiente',
            tipicidad: 'pendiente',
            antijuridicidad: 'pendiente',
            imputabilidad: 'pendiente',
            culpabilidad: 'pendiente',
            punibilidad: 'pendiente'
        },
        acreditacion: {
            conducta: null,
            tipicidad: null,
            antijuridicidad: null,
            imputabilidad: null,
            culpabilidad: null,
            punibilidad: null
        },
        log: [],
        init(casoId, csdId, delito, acreditacionInicial) {
            this.casoId = casoId || null;
            this.csdId = csdId || null;
            this.delito = delito || null;
            if (acreditacionInicial) {
                this.acreditacion = { ...this.acreditacion, ...acreditacionInicial };
            }
            this.estado = {
                conducta: 'pendiente', tipicidad: 'pendiente', antijuridicidad: 'pendiente',
                imputabilidad: 'pendiente', culpabilidad: 'pendiente', punibilidad: 'pendiente'
            };
            if (typeof estadoEscalera !== 'undefined') {
                Object.keys(this.estado).forEach(k => {
                    if (estadoEscalera[k]) this.estado[k] = estadoEscalera[k];
                });
            }
        },
        getAcreditacion(paso, fallback) {
            const valor = this.acreditacion && typeof this.acreditacion[paso] === 'number' ? this.acreditacion[paso] : null;
            if (valor !== null && !isNaN(valor)) return valor;
            return typeof fallback === 'number' ? fallback : 0;
        },
        aplicarDelta(paso, delta) {
            const base = this.getAcreditacion(paso, 0);
            const nuevo = Math.max(0, Math.min(100, base + (delta || 0)));
            if (this.acreditacion && paso in this.acreditacion) this.acreditacion[paso] = nuevo;
            this.log.push({ type: 'acreditacion', paso, delta: delta || 0, from: base, to: nuevo, casoId: this.casoId, csdId: this.csdId, delito: this.delito, timestamp: new Date().toISOString() });
            this.renderLog();
            return nuevo;
        },
        registrarDecisionPaso(paso, decision) {
            this.log.push({ type: 'decision', paso, decision, casoId: this.casoId, csdId: this.csdId, delito: this.delito, timestamp: new Date().toISOString() });
            this.renderLog();
        },
        registrarSugerencias(paso, sugerencias) {
            this.log.push({ type: 'sugerencias', paso, sugerencias, casoId: this.casoId, csdId: this.csdId, delito: this.delito, timestamp: new Date().toISOString() });
            this.renderLog();
        },
        renderLog() {
            const tbody = document.getElementById('escalera-log-body');
            const container = document.getElementById('escalera-log-container');
            if (!tbody || !container) return;
            if (!this.log.length) { container.style.display = 'none'; return; }
            container.style.display = 'block';
            const rows = this.log.slice().reverse().map(entry => {
                const fecha = entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '';
                let detalle = '';
                if (entry.type === 'decision') detalle = entry.decision && entry.decision.valor ? `Decisión: ${entry.decision.valor}` : 'Decisión registrada';
                else if (entry.type === 'sugerencias') detalle = (entry.sugerencias || []).join(', ') ? `Sugerencias aceptadas: ${(entry.sugerencias || []).join(', ')}` : 'Sugerencias registradas';
                else if (entry.type === 'acreditacion') detalle = `Acreditación ${entry.from}% → ${entry.to}% (Δ ${entry.delta}%)`;
                return `<tr><td>${fecha}</td><td>${entry.paso || ''}</td><td>${entry.type}</td><td>${detalle}</td></tr>`;
            });
            tbody.innerHTML = rows.join('');
        }
    },
    picMatriz: { log: [], registrarEvento(tipo, datos) { this.log.push({ type: tipo, data: datos || {}, casoId: currentCase && currentCase.id ? currentCase.id : null, timestamp: new Date().toISOString() }); } },
    mic: { log: [], registrarEvento(tipo, datos) { this.log.push({ type: tipo, data: datos || {}, casoId: currentCase && currentCase.id ? currentCase.id : null, timestamp: new Date().toISOString() }); } },
    mmi: { log: [], registrarEvento(tipo, datos) { this.log.push({ type: tipo, data: datos || {}, casoId: currentCase && currentCase.id ? currentCase.id : null, timestamp: new Date().toISOString() }); } }
};

function initEscalera() {
    const selector = document.getElementById('csd-selector');
    const container = document.getElementById('escalera-container');
    if (selector.value) {
        container.style.display = 'block';
        if(typeof resetEscalera === 'function') resetEscalera();
        if(typeof cargarDatosCSDEnEscalera === 'function') cargarDatosCSDEnEscalera(selector.value);
        document.getElementById('row-conducta').classList.remove('disabled-row');
        document.getElementById('row-conducta').classList.add('active-row');
    } else {
        container.style.display = 'none';
    }
}

// Caso SAI en memoria (estructura base para integrar módulos)
window.currentCase = { id: null, carpeta: null, csdId: null, delito: null, escalera: { estado: { conducta: 'pendiente', tipicidad: 'pendiente', antijuridicidad: 'pendiente', imputabilidad: 'pendiente', culpabilidad: 'pendiente', punibilidad: 'pendiente' }, acreditacion: { conducta: null, tipicidad: null, antijuridicidad: null, imputabilidad: null, culpabilidad: null, punibilidad: null } }, matrizIntegracion: { filasTotales: 0, filasValidadas: 0, filasRuido: 0, ultimaActualizacion: null }, mic: { nodos: 0, conexiones: 0, acreditacionGlobal: null, ultimaActualizacion: null }, mmi: { preguntasGeneradas: 0, preguntasRespondidas: 0, preguntasSinContestar: 0, ultimaActualizacion: null } };

window.initEscalera = initEscalera;
})();