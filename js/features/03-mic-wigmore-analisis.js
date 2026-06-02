// ============================================
// ANÁLISIS IA (Vigilancia, Consistencia, Hipótesis, Cronología)
// ============================================
function analizarDictamenConIA(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    if (typeof showToast === "function") showToast("Analizando dictamen con IA…", "success");
    var reader = new FileReader();
    reader.onload = function() {
        var base64 = reader.result, mime = file.type || "image/jpeg";
        if (!/^data:image\//.test(base64) && !/^data:application\/pdf/.test(base64)) mime = "image/jpeg";
        ConcienciaOperativaSAI.analizarDictamen(ConcienciaOperativaSAI.getNarrativa(), ConcienciaOperativaSAI.getCodigoPenalNombre(), base64, mime)
            .then(function(texto) {
                ConcienciaOperativaSAI.hallazgosDictamenes.push({ nombreArchivo: file.name, texto: texto, fecha: new Date().toISOString() });
                ConcienciaOperativaSAI.renderHallazgos();
                if (typeof actualizarResumenDashboard === "function") actualizarResumenDashboard();
                if (typeof showToast === "function") showToast("Análisis de dictamen completado. Revise el Dashboard de IA.", "success");
            })
            .catch(function(err) {
                if (typeof showToast === "function") showToast(err.message || "Error en análisis con IA.", "error");
            });
    };
    if (/^image\//.test(file.type)) reader.readAsDataURL(file);
    else if (file.type === "application/pdf") reader.readAsDataURL(file);
    else reader.readAsDataURL(file);
    event.target.value = "";
}

function ejecutarVigilanciaJuridica() {
    var narrativa = ConcienciaOperativaSAI.getNarrativa(), codigo = ConcienciaOperativaSAI.getCodigoPenalNombre();
    if (typeof showToast === "function") showToast("Ejecutando Vigilancia Jurídica (3-4 búsquedas)…", "success");
    var queries = [
        "SCJN jurisprudencia " + (narrativa.slice(0, 80) || "delito") + " tesis",
        "SCJN tesis tipicidad " + codigo,
        "Contradicción de tesis SCJN derecho penal",
        "Jurisprudencia obligatoria SCJN proceso penal"
    ];
    var key = ConcienciaOperativaSAI.getKey(), cse = ConcienciaOperativaSAI.getCseId();
    if (!key || !cse) {
        queries.forEach(function(q, i) {
            ConcienciaOperativaSAI.listaJurisprudencias.push({ title: "[Simulado] Búsqueda " + (i + 1) + ": " + q.slice(0, 50), link: "#", snippet: "Configure GOOGLE_API_KEY y GOOGLE_CSE_ID para búsquedas reales." });
        });
        ConcienciaOperativaSAI.renderJurisprudencias();
        if (typeof showToast === "function") showToast("Vigilancia Jurídica (simulada). Configure API Key y CSE ID para búsquedas reales.", "warning");
        return;
    }
    var done = 0;
    queries.slice(0, 4).forEach(function(q) {
        ConcienciaOperativaSAI.buscarJurisprudencia(q).then(function(items) {
            items.forEach(function(it) { ConcienciaOperativaSAI.listaJurisprudencias.push(it); });
        ConcienciaOperativaSAI.renderJurisprudencias();
        done++;
            if (done >= 4) { if (typeof showToast === "function") showToast("Vigilancia Jurídica completada. Revise Alerta de Jurisprudencia.", "success"); if (typeof actualizarResumenDashboard === "function") actualizarResumenDashboard(); }
        });
    });
}

function analizarConsistenciaActoresIndicios() {
    var actores = ConcienciaOperativaSAI.getNarrativa();
    var tb = document.getElementById("ri-tbody-resultados");
    if (tb) actores += "\n[Resultados/Testimonios]\n" + (tb.innerText || "");
    var indicios = "";
    if (ConcienciaOperativaSAI.hallazgosDictamenes && ConcienciaOperativaSAI.hallazgosDictamenes.length) {
        ConcienciaOperativaSAI.hallazgosDictamenes.forEach(function(h) { indicios += (h.nombreArchivo || "") + ": " + (h.texto || "").slice(0, 500) + "\n"; });
    }
    var prompt = "Contexto SAI – Análisis de consistencia cruzada (Actores vs Indicios).\n\nACTORES/TESTIMONIOS:\n" + (actores.slice(0, 3000) || "Sin datos.") + "\n\nINDICIOS/DICTÁMENES:\n" + (indicios.slice(0, 3000) || "Sin datos.") + "\n\nIdentifica si algún testimonio o declaración contradice los hallazgos periciales o físicos (ej: distancia declarada vs quemadura por contacto). Lista cada Alerta de Inconsistencia Metodológica en una línea breve. Si no hay contradicciones, responde: No se detectaron inconsistencias.";
    if (typeof showToast === "function") showToast("Analizando consistencia Actores vs Indicios…", "success");
    ConcienciaOperativaSAI.llamarGemini([{ text: prompt }], ConcienciaOperativaSAI.systemInstruction)
        .then(function(texto) {
            ConcienciaOperativaSAI.alertasInconsistencia = texto.split(/\n+/).filter(function(l) { return l.trim().length > 0 && !/^no se detectaron/i.test(l); });
            if (ConcienciaOperativaSAI.alertasInconsistencia.length === 0 && texto) ConcienciaOperativaSAI.alertasInconsistencia = [{ texto: texto.slice(0, 300) }];
            else if (ConcienciaOperativaSAI.alertasInconsistencia.length === 0) ConcienciaOperativaSAI.alertasInconsistencia = [{ texto: "No se detectaron inconsistencias metodológicas." }];
            else ConcienciaOperativaSAI.alertasInconsistencia = ConcienciaOperativaSAI.alertasInconsistencia.map(function(t) { return { texto: t }; });
            
            // Llama a la función global en lugar de local
            if (typeof renderPanelAlertasInconsistencia === 'function') renderPanelAlertasInconsistencia();
            if (typeof actualizarResumenDashboard === "function") actualizarResumenDashboard();
            if (typeof showToast === "function") showToast("Análisis de consistencia completado. Revise el Dashboard.", "success");
        })
        .catch(function(err) { if (typeof showToast === "function") showToast(err.message || "Error en análisis.", "error"); });
}

function desafiarHipotesis() {
    var hipEl = document.querySelector(".hypothesis-card p") || document.getElementById("contenido-factico");
    var hipotesisTexto = hipEl ? (hipEl.textContent || "").slice(0, 2500) : ConcienciaOperativaSAI.getNarrativa().slice(0, 1500);
    var prompt = "Como Auditor de la Arquitectura de la Verdad (MMI – escepticismo disciplinado), propón exactamente 3 HIPÓTESIS ALTERNATIVAS al siguiente caso:\n\n" + hipotesisTexto + "\n\nCada hipótesis debe ser un escenario donde: (1) el imputado sea inocente, o (2) los hechos hayan ocurrido de forma distinta. Objetivo: que la Célula Investigadora busque pruebas que descarten estas alternativas. Numera 1, 2 y 3. Sé conciso.";
    if (typeof showToast === "function") showToast("Generando hipótesis alternativas (MMI)…", "success");
    ConcienciaOperativaSAI.llamarGemini([{ text: prompt }], ConcienciaOperativaSAI.systemInstruction)
        .then(function(texto) {
            ConcienciaOperativaSAI.hipotesisAlternativas = texto;
            var div = document.getElementById("lista-hipotesis-alternativas"), empty = document.getElementById("hipotesis-alternativas-empty");
            if (div) { div.innerHTML = "<div class=\"hipotesis-alternativas\">" + (texto.replace(/\n/g, "<br>")) + "</div>"; }
            if (empty) empty.style.display = "none";
            if (typeof showToast === "function") showToast("Hipótesis alternativas generadas. Revise el Dashboard.", "success");
        })
        .catch(function(err) { if (typeof showToast === "function") showToast(err.message || "Error.", "error"); });
}

function extraerCronologiaVectorial() {
    var narrativa = ConcienciaOperativaSAI.getNarrativa();
    var factico = document.getElementById("contenido-factico");
    if (factico) narrativa += "\n[Bloque fáctico]\n" + (factico.innerText || "");
    if (ConcienciaOperativaSAI.hallazgosDictamenes && ConcienciaOperativaSAI.hallazgosDictamenes.length) {
        ConcienciaOperativaSAI.hallazgosDictamenes.forEach(function(h) { narrativa += "\n" + (h.texto || "").slice(0, 400); });
    }
    var prompt = "Extrae de este texto todas las FECHAS y HORAS mencionadas, y el evento asociado. Devuélvelas en formato lista, una por línea: FECHA – descripción breve del evento. Ordena cronológicamente. Solo fechas/eventos explícitos.\n\n" + narrativa.slice(0, 4000);
    if (typeof showToast === "function") showToast("Extrayendo cronología…", "success");
    ConcienciaOperativaSAI.llamarGemini([{ text: prompt }], ConcienciaOperativaSAI.systemInstruction)
        .then(function(texto) {
            var lineas = texto.split(/\n+/).filter(function(l) { return l.trim().length > 0; });
            ConcienciaOperativaSAI.cronologiaVectorial = lineas;
            var ul = document.getElementById("lista-cronologia-vectorial"), empty = document.getElementById("cronologia-vectorial-empty");
            if (ul) { ul.innerHTML = ""; lineas.forEach(function(l) { var li = document.createElement("li"); li.innerHTML = l.replace(/^(\d[\d\/\-\.a-z ]+)/i, "<span class=\"fecha\">$1</span>"); ul.appendChild(li); }); }
            if (empty) empty.style.display = lineas.length ? "none" : "block";
            if (typeof showToast === "function") showToast("Cronología vectorial generada.", "success");
        })
        .catch(function(err) { if (typeof showToast === "function") showToast(err.message || "Error.", "error"); });
}

window.analizarDictamenConIA = analizarDictamenConIA;
window.ejecutarVigilanciaJuridica = ejecutarVigilanciaJuridica;
window.analizarConsistenciaActoresIndicios = analizarConsistenciaActoresIndicios;
window.desafiarHipotesis = desafiarHipotesis;
window.extraerCronologiaVectorial = extraerCronologiaVectorial;