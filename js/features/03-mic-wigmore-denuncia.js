(function() {
// ============================================
// DENUNCIA BASE (Disparador Maestro)
// ============================================
function toggleDenunciaBaseWrap() {
    var wrap = document.getElementById("denuncia-base-wrap");
    var escrito = document.querySelector('input[name="forma-recepcion"][value="escrito"]');
    if (!wrap) return;
    if (escrito && escrito.checked) { wrap.classList.add("visible"); }
    else { wrap.classList.remove("visible"); }
}

function initDenunciaBaseRecepcion() {
    toggleDenunciaBaseWrap();
    var radios = document.querySelectorAll('input[name="forma-recepcion"]');
    var prevEscrito = document.querySelector('input[name="forma-recepcion"][value="escrito"]') && document.querySelector('input[name="forma-recepcion"][value="escrito"]').checked;
    radios.forEach(function(r) {
        r.removeEventListener("change", onFormaRecepcionChange);
        r.addEventListener("change", onFormaRecepcionChange);
    });
    function onFormaRecepcionChange() {
        var ahoraEscrito = document.querySelector('input[name="forma-recepcion"][value="escrito"]') && document.querySelector('input[name="forma-recepcion"][value="escrito"]').checked;
        if (prevEscrito && !ahoraEscrito && typeof showToast === "function") showToast("El análisis de la IA basado en el documento se detendrá si cambia el método de recepción.", "warning");
        toggleDenunciaBaseWrap();
        prevEscrito = ahoraEscrito;
        var items = document.querySelectorAll('.radio-item');
        if (items && items.length) items.forEach(function(it) { it.classList.remove('selected'); });
        var checked = document.querySelector('input[name="forma-recepcion"]:checked');
        if (checked && checked.closest('.radio-item')) checked.closest('.radio-item').classList.add('selected');
    }
}

function handleDenunciaBaseFile(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    var indicator = document.getElementById("celula-activa-indicator");
    var nombreSpan = document.getElementById("denuncia-base-nombre");
    if (nombreSpan) nombreSpan.textContent = file.name;
    if (indicator) indicator.classList.add("activo");
    if (typeof showToast === "function") showToast("Procesando Denuncia Base: Célula Investigadora Digital Activa…", "success");
    var reader = new FileReader();
    reader.onload = function() {
        var base64 = reader.result;
        var mime = file.type || "application/octet-stream";
        if (file.type === "text/plain") {
            procesarDenunciaBaseConIA(reader.result, "text/plain", file.name, indicator);
            return;
        }
        if (!/^data:image\//.test(base64) && !/^data:application\/pdf/.test(base64)) mime = "image/jpeg";
        procesarDenunciaBaseConIA(base64, mime, file.name, indicator);
    };
    if (file.type === "text/plain") reader.readAsText(file);
    else reader.readAsDataURL(file);
    event.target.value = "";
}

function procesarDenunciaBaseConIA(base64OrText, mimeType, fileName, indicatorEl) {
    var sysInst = "Eres el Auditor de la Arquitectura de la Verdad (SAI). Este documento es la Denuncia o Noticia Criminal Base. Extrae y estructura la información para alimentar la Matriz SAI y la THD (7 átomos). Responde en español.";
    var promptTHD = " Del siguiente documento (Denuncia o Noticia Criminal), extrae y escribe:\n\n1) NARRATIVA: La narración íntegra de los hechos (texto completo).\n2) HIPÓTESIS: Un párrafo con la hipótesis investigativa inicial.\n3) SIETE_ÁTOMOS_THD: Para cada uno (Conducta, Tipicidad, Antijuridicidad, Imputabilidad, Culpabilidad, Punibilidad, Condiciones objetivas de punibilidad) indique brevemente si el documento aporta elementos o está ausente.\n4) SUJETOS: Lista nombre y rol (imputados, víctimas, testigos). Formato: - Nombre (rol).\n5) DELITOS: Tipos penales mencionados.\n6) INDICIOS_SUGERIDOS: Objetos o lugares para la pestaña de Indicios.\n\nUsa exactamente estos encabezados: NARRATIVA:, HIPÓTESIS:, SIETE_ÁTOMOS_THD:, SUJETOS:, DELITOS:, INDICIOS_SUGERIDOS:";
    var prompt = "Del siguiente documento (Denuncia o Noticia Criminal), extrae y escribe:\n\n1) NARRATIVA: La narración íntegra de los hechos (texto completo para el campo de narración).\n2) HIPÓTESIS: Un párrafo con la hipótesis investigativa inicial.\n3) SUJETOS: Lista con nombre y rol de cada persona (imputados, víctimas, testigos). Formato: - Nombre (rol).\n4) DELITOS: Tipos penales mencionados.\n5) INDICIOS_SUGERIDOS: Objetos o lugares que sugieran registros para la pestaña de Indicios.\n\nUsa exactamente estos encabezados: NARRATIVA:, HIPÓTESIS:, SUJETOS:, DELITOS:, INDICIOS_SUGERIDOS:";
    var parts = [];
    var runGemini = function(textoParaGemini) {
        var p = textoParaGemini ? promptTHD + "\n\n[TEXTO DEL DOCUMENTO]\n" + textoParaGemini.slice(0, 28000) : prompt;
        var partList = [{ text: (textoParaGemini ? promptTHD : prompt) + (textoParaGemini ? "\n\n[TEXTO DEL DOCUMENTO]\n" + textoParaGemini.slice(0, 28000) : "") }];
        if (!textoParaGemini && base64OrText && (mimeType.indexOf("image") !== -1 || mimeType.indexOf("pdf") !== -1)) {
            partList = [{ text: promptTHD }];
            partList.push({ inlineData: { mimeType: mimeType.indexOf("pdf") !== -1 ? "application/pdf" : "image/jpeg", data: base64OrText.replace(/^data:[^;]+;base64,/, "") } });
        }
        return ConcienciaOperativaSAI.llamarGemini(partList.length ? partList : [{ text: p }], sysInst);
    };
    if (mimeType === "text/plain" && typeof base64OrText === "string" && base64OrText.indexOf("data:") !== 0) {
        parts = [{ text: promptTHD + "\n\n[TEXTO DEL DOCUMENTO]\n" + base64OrText.slice(0, 28000) }];
        ConcienciaOperativaSAI.llamarGemini(parts, sysInst)
        .then(function(texto) { distribuirResultadoDenunciaBase(texto, fileName, indicatorEl); })
        .catch(function(err) { if (indicatorEl) indicatorEl.classList.remove("activo"); if (typeof showToast === "function") showToast(err.message || "Error al procesar Denuncia Base.", "error"); });
        return;
    }
    if (base64OrText && mimeType.indexOf("image") === -1 && mimeType.indexOf("pdf") === -1) {
        try {
            var b64 = base64OrText.split("base64,")[1];
            if (b64) { var bin = atob(b64); var t = ""; for (var i = 0; i < bin.length; i++) t += String.fromCharCode(bin.charCodeAt(i)); runGemini(t.slice(0, 15000)).then(function(texto) { distribuirResultadoDenunciaBase(texto, fileName, indicatorEl); }).catch(function(err) { if (indicatorEl) indicatorEl.classList.remove("activo"); if (typeof showToast === "function") showToast(err.message || "Error.", "error"); }); return; }
        } catch (e) {}
    }
    if (base64OrText && mimeType.indexOf("image") !== -1 && typeof ConcienciaOperativaSAI.extraerTextoVisionOCR === "function") {
        ConcienciaOperativaSAI.extraerTextoVisionOCR(base64OrText).then(function(textoOCR) {
            if (textoOCR && textoOCR.length > 50) runGemini(textoOCR).then(function(texto) { distribuirResultadoDenunciaBase(texto, fileName, indicatorEl); }).catch(function(err) {
                parts = [{ text: promptTHD }]; parts.push({ inlineData: { mimeType: "image/jpeg", data: base64OrText.replace(/^data:[^;]+;base64,/, "") } });
                ConcienciaOperativaSAI.llamarGemini(parts, sysInst).then(function(t) { distribuirResultadoDenunciaBase(t, fileName, indicatorEl); }).catch(function(e2) { if (indicatorEl) indicatorEl.classList.remove("activo"); if (typeof showToast === "function") showToast(e2.message || "Error.", "error"); });
            });
            else { parts = [{ text: promptTHD }]; parts.push({ inlineData: { mimeType: "image/jpeg", data: base64OrText.replace(/^data:[^;]+;base64,/, "") } }); ConcienciaOperativaSAI.llamarGemini(parts, sysInst).then(function(t) { distribuirResultadoDenunciaBase(t, fileName, indicatorEl); }).catch(function(e2) { if (indicatorEl) indicatorEl.classList.remove("activo"); if (typeof showToast === "function") showToast(e2.message || "Error.", "error"); }); }
        }).catch(function() {
            parts = [{ text: promptTHD }]; parts.push({ inlineData: { mimeType: "image/jpeg", data: base64OrText.replace(/^data:[^;]+;base64,/, "") } });
            ConcienciaOperativaSAI.llamarGemini(parts, sysInst).then(function(t) { distribuirResultadoDenunciaBase(t, fileName, indicatorEl); }).catch(function(e2) { if (indicatorEl) indicatorEl.classList.remove("activo"); if (typeof showToast === "function") showToast(e2.message || "Error.", "error"); });
        });
        return;
    }
    parts = base64OrText && (mimeType.indexOf("image") !== -1 || mimeType.indexOf("pdf") !== -1) ? [{ text: promptTHD }, { inlineData: { mimeType: mimeType.indexOf("pdf") !== -1 ? "application/pdf" : "image/jpeg", data: base64OrText.replace(/^data:[^;]+;base64,/, "") } }] : [{ text: promptTHD }];
    ConcienciaOperativaSAI.llamarGemini(parts, sysInst)
        .then(function(texto) { distribuirResultadoDenunciaBase(texto, fileName, indicatorEl); })
        .catch(function(err) {
            if (indicatorEl) indicatorEl.classList.remove("activo");
            if (typeof showToast === "function") showToast(err.message || "Error al procesar Denuncia Base.", "error");
        });
}

function distribuirResultadoDenunciaBase(texto, fileName, indicatorEl) {
    var narrativa = "", hipotesis = "", sujetos = [], delitos = [], indicios = [];
    var blocs = texto.split(/(?=HIPÓTESIS:|SIETE_ÁTOMOS_THD:|SUJETOS:|DELITOS:|INDICIOS_SUGERIDOS:)/i);
    blocs.forEach(function(bloc) {
        if (/^NARRATIVA:/i.test(bloc)) narrativa = bloc.replace(/^NARRATIVA:\s*/i, "").replace(/\s*(HIPÓTESIS:|SIETE_ÁTOMOS_THD:|SUJETOS:).*/s, "").trim();
        else if (/^HIPÓTESIS:/i.test(bloc)) hipotesis = bloc.replace(/^HIPÓTESIS:\s*/i, "").replace(/\s*(SIETE_ÁTOMOS_THD:|SUJETOS:|DELITOS:).*/s, "").trim();
        else if (/^SUJETOS:/i.test(bloc)) sujetos = bloc.replace(/^SUJETOS:\s*/i, "").replace(/\s*DELITOS:.*/s, "").trim().split(/\n+/).filter(function(l) { return l.trim().length > 0; });
        else if (/^DELITOS:/i.test(bloc)) delitos = bloc.replace(/^DELITOS:\s*/i, "").replace(/\s*INDICIOS_SUGERIDOS:.*/s, "").trim().split(/\n+/).filter(function(l) { return l.trim().length > 0; });
        else if (/^INDICIOS_SUGERIDOS:/i.test(bloc)) indicios = bloc.replace(/^INDICIOS_SUGERIDOS:\s*/i, "").trim().split(/\n+/).filter(function(l) { return l.trim().length > 0; });
    });
    if (!narrativa && texto.length > 100) narrativa = texto.slice(0, 4000);
    var np = document.getElementById("narrativa-principal");
    if (np && narrativa) np.value = narrativa;
    var thg = document.getElementById("texto-hipotesis-generada");
    if (thg && hipotesis) thg.innerHTML = hipotesis.replace(/\n/g, "<br>");
    var lsh = document.getElementById("lista-sujetos-hipotesis");
    if (lsh && sujetos.length) { lsh.innerHTML = ""; sujetos.forEach(function(s) { var li = document.createElement("li"); li.textContent = s.replace(/^-\s*/, ""); lsh.appendChild(li); }); }
    var ldh = document.getElementById("lista-delitos-hipotesis");
    if (ldh && delitos.length) { ldh.innerHTML = ""; delitos.forEach(function(d) { var li = document.createElement("li"); li.textContent = d.replace(/^-\s*/, ""); ldh.appendChild(li); }); }
    var lph = document.getElementById("lista-pendientes-hipotesis");
    if (lph && indicios.length) { lph.innerHTML = ""; indicios.forEach(function(i) { var li = document.createElement("li"); li.textContent = "Indicio sugerido: " + i.replace(/^-\s*/, ""); lph.appendChild(li); }); }
    var contenedorGenerada = document.getElementById("contenedor-hipotesis-generada");
    var contenedorGenerar = document.getElementById("contenedor-generar-hipotesis");
    if (contenedorGenerada) contenedorGenerada.style.display = "block";
    if (contenedorGenerar) contenedorGenerar.style.display = "none";
    ConcienciaOperativaSAI.hallazgosDictamenes.push({ nombreArchivo: "Denuncia Base: " + (fileName || ""), texto: "Documento procesado. Narrativa, hipótesis y 7 átomos THD extraídos.", fecha: new Date().toISOString() });
    if (typeof ConcienciaOperativaSAI.renderHallazgos === "function") ConcienciaOperativaSAI.renderHallazgos();
    if (typeof ejecutarVigilanciaJuridica === "function") ejecutarVigilanciaJuridica();
    if (typeof actualizarResumenDashboard === "function") actualizarResumenDashboard();
    if (indicatorEl) indicatorEl.classList.remove("activo");
    if (typeof showToast === "function") showToast("Denuncia Base procesada. Datos distribuidos a la Matriz SAI.", "success");
}

document.addEventListener("DOMContentLoaded", function() {
    initDenunciaBaseRecepcion();
});

window.handleDenunciaBaseFile = handleDenunciaBaseFile;
window.toggleDenunciaBaseWrap = toggleDenunciaBaseWrap;
})();