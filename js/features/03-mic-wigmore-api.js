// ============================================
// CONCIENCIA OPERATIVA SAI - Core y APIs
// ============================================
// CONFIGURACIÓN DE ACCESO (EL CEREBRO): Inserte la API Key entre las comillas en el código.
// Inyección automática de llaves para el sistema
window.GOOGLE_API_KEY = "AIzaSyCu8X-N3x2Y_YN6hyeg5cvLIEp_ya-_kJQ";
window.GOOGLE_CSE_ID = "AIzaSyDSO_b0Hi9XEt5eB1vNH9AFoKYQ_a2d0Fc";

var GOOGLE_API_KEY = window.GOOGLE_API_KEY;
var GOOGLE_CSE_ID = window.GOOGLE_CSE_ID;

var GEMINI_MODEL_NAME = "gemini-2.5-flash";

var ConcienciaOperativaSAI = {
    systemInstruction: "Eres el Auditor de la Arquitectura de la Verdad del Sistema SAI. Tu rol es EVALUAR, SUGERIR y AUDITAR. Eres estricto con la metodología SAI. Los filtros infranqueables son: CPEUM, CNPP y el Código Penal aplicable. Para todo dictamen pericial debes preguntar: ¿Cumple con las formalidades del CNPP (Art. 368 y relacionados)? Para toda jurisprudencia: ¿Aplica a la tipicidad del delito en estudio? Responde en español, de forma concisa y técnica.",
    listaJurisprudencias: [],
    alertasInconsistencia: [],
    cronologiaVectorial: [],
    reglasWigmore: [],
    hipotesisAlternativas: [],
    hallazgosDictamenes: [],
    GEMINI_URL: "https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODEL_NAME + ":generateContent",
    CSE_URL: "https://www.googleapis.com/customsearch/v1",
    getKey: function() {
        var k = (typeof GOOGLE_API_KEY !== "undefined" && GOOGLE_API_KEY) ? GOOGLE_API_KEY : (window.GOOGLE_API_KEY || "");
        if (!k && typeof localStorage !== "undefined") k = localStorage.getItem("CeCoSAI_GOOGLE_API_KEY") || "";
        return k || "";
    },
    getGeminiKey: function() {
        return this.getKey();
    },
    getCseId: function() {
        var c = (typeof GOOGLE_CSE_ID !== "undefined" && GOOGLE_CSE_ID) ? GOOGLE_CSE_ID : (window.GOOGLE_CSE_ID || "");
        if (!c && typeof localStorage !== "undefined") c = localStorage.getItem("CeCoSAI_GOOGLE_CSE_ID") || "";
        return c || "";
    },
    getNarrativa: function() { var el = document.getElementById("narrativa-principal"); return el ? el.value : ""; },
    getCodigoPenalNombre: function() { return (typeof marcoJuridico !== "undefined" && marcoJuridico && marcoJuridico.codigoPenal) ? marcoJuridico.codigoPenal.nombre : "no cargado"; },
    llamarGemini: function(parts, systemInstruction) {
        var key = this.getGeminiKey();
        if (!key) return Promise.reject(new Error("Configure GOOGLE_API_KEY para usar análisis con IA."));
        if (!parts || !parts.length) return Promise.reject(new Error("El contenido a enviar no puede estar vacío."));
        var safeParts = parts.filter(function(p) { return p && (p.text || (p.inlineData && p.inlineData.data)); });
        if (!safeParts.length) return Promise.reject(new Error("El contenido a enviar no puede estar vacío."));
        var mergedParts = safeParts.slice();
        if (systemInstruction) mergedParts.unshift({ text: systemInstruction + "\n\n" });
        var body = { contents: [{ role: "user", parts: mergedParts }], generationConfig: { temperature: 0.3, maxOutputTokens: 1024 } };
        return fetch(this.GEMINI_URL + "?key=" + encodeURIComponent(key), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
            .then(function(r) {
                return r.json().then(function(j) {
                    if (!r.ok) {
                        var msg = (j.error && j.error.message) ? j.error.message : "Gemini: " + r.status;
                        if (r.status === 429) msg = "429: Límite de uso. Espere 1–2 min y vuelva a probar.";
                        else if (r.status === 400) msg = "400: Solicitud incorrecta. Revise que la API Key y el modelo sean válidos (v1beta).";
                        throw new Error(msg);
                    }
                    return j;
                });
            })
            .then(function(j) { var t = j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0]; return t ? t.text : ""; });
    },
    analizarDictamen: function(narrativa, codigoNombre, base64, mimeType) {
        var prompt = "Como Auditor de la Arquitectura de la Verdad, analice el dictamen pericial adjunto. Marco legal rector: CPEUM, CNPP (Art. 368 y relacionados) y Código Penal (" + codigoNombre + "). 1) Hallazgos técnicos. 2) Contradicciones o vacíos respecto a la noticia criminal. 3) Auditoría: ¿Cumple formalidades CNPP? ¿Coherencia técnica frente al marco legal? Responde en tres bloques: Hallazgos, Contradicciones/Vacíos, Auditoría.";
        var parts = [{ text: "Contexto: " + (narrativa.slice(0, 1500) || "Sin narración.") + "\n\n" + prompt }];
        if (base64 && mimeType) parts.push({ inlineData: { mimeType: mimeType, data: base64.replace(/^data:[^;]+;base64,/, "") } });
        return this.llamarGemini(parts, this.systemInstruction);
    },
    extraerTextoVisionOCR: function(base64Image) {
        var key = this.getKey();
        if (!key) return Promise.reject(new Error("Sin API Key"));
        var b64 = base64Image.replace(/^data:[^;]+;base64,/, "");
        var url = "https://vision.googleapis.com/v1/images:annotate?key=" + encodeURIComponent(key);
        var body = { requests: [{ image: { content: b64 }, features: [{ type: "DOCUMENT_TEXT_DETECTION" }] }] };
        return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
            .then(function(r) { return r.json(); })
            .then(function(j) {
                var text = "";
                if (j.responses && j.responses[0] && j.responses[0].fullTextAnnotation && j.responses[0].fullTextAnnotation.text) text = j.responses[0].fullTextAnnotation.text;
                return text;
            });
    },
    buscarJurisprudencia: function(query) {
        var key = this.getKey(), cx = this.getCseId();
        if (!key || !cx) return Promise.resolve([]);
        return fetch(this.CSE_URL + "?key=" + encodeURIComponent(key) + "&cx=" + encodeURIComponent(cx) + "&q=" + encodeURIComponent(query) + "&num=3")
            .then(function(r) { return r.ok ? r.json() : { items: [] }; })
            .then(function(j) { return (j.items || []).map(function(i) { return { title: i.title, link: i.link, snippet: i.snippet }; }); });
    },
    renderJurisprudencias: function() {
        var ul = document.getElementById("lista-jurisprudencias-ia"), empty = document.getElementById("jurisprudencias-ia-empty");
        if (!ul) return;
        ul.innerHTML = "";
        if (this.listaJurisprudencias.length === 0) { if (empty) empty.style.display = "block"; return; }
        if (empty) empty.style.display = "none";
        this.listaJurisprudencias.forEach(function(j) {
            var li = document.createElement("li");
            li.innerHTML = "<a href=\"" + (j.link || "#") + "\" target=\"_blank\" rel=\"noopener\">" + (j.title || "Sin título") + "</a>" + (j.snippet ? " — " + j.snippet.slice(0, 120) + "…" : "");
            ul.appendChild(li);
        });
    },
    renderHallazgos: function() {
        var div = document.getElementById("lista-hallazgos-dictamenes"), empty = document.getElementById("hallazgos-dictamenes-empty");
        if (!div) return;
        div.innerHTML = "";
        if (this.hallazgosDictamenes.length === 0) { if (empty) empty.style.display = "block"; return; }
        if (empty) empty.style.display = "none";
        this.hallazgosDictamenes.forEach(function(h) {
            var p = document.createElement("div");
            p.className = "hallazgo-item";
            p.innerHTML = "<strong>" + (h.nombreArchivo || "Dictamen") + "</strong><br>" + (h.texto || "").slice(0, 400) + (h.texto && h.texto.length > 400 ? "…" : "");
            div.appendChild(p);
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    if (typeof ConcienciaOperativaSAI !== 'undefined') {
        ConcienciaOperativaSAI.getKey = function() { return window.GOOGLE_API_KEY; };
        ConcienciaOperativaSAI.getCseId = function() { return window.GOOGLE_CSE_ID; };
    }
});

// Referencias globales
window.ConcienciaOperativaSAI = ConcienciaOperativaSAI;