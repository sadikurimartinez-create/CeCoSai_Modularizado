// ==========================================
// ACTIVACIÓN Y CONTROL DE SEMÁFOROS Y UI
// ==========================================
function actualizarSemaforos() {
    const aplicarEstado = (idBase, estado) => {
        const semaforo = document.getElementById(idBase);
        const texto = document.getElementById('text-' + idBase);
        
        if (semaforo) {
            semaforo.className = 'led-indicator'; // Reset
            semaforo.classList.add(estado === 'optimo' ? 'led-verde' : 'led-rojo');
        }
        if (texto) {
            texto.textContent = estado === 'optimo' ? 'CONECTADO' : 'DESCONECTADO';
            texto.style.color = estado === 'optimo' ? '#4ade80' : '#f87171';
        }
    };

    // 1. ESTADO DE RED
    const actualizarEstadoRed = () => aplicarEstado('status-network', navigator.onLine ? 'optimo' : 'desconectado');
    window.removeEventListener('online', actualizarEstadoRed); // Prevenir duplicados
    window.removeEventListener('offline', actualizarEstadoRed);
    window.addEventListener('online', actualizarEstadoRed);
    window.addEventListener('offline', actualizarEstadoRed);
    actualizarEstadoRed();

    // 2. MOTOR IA (GEMINI)
    const validarConexionGemini = async () => {
        const apiKey = (window.GOOGLE_API_KEY || '').trim();
        if (!apiKey || apiKey === 'TU_API_KEY_DE_GEMINI_AQUI') {
            aplicarEstado('status-gemini', 'desconectado');
            return;
        }
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            aplicarEstado('status-gemini', response.ok ? 'optimo' : 'desconectado');
            if (!response.ok) console.error(`CEIPOL: Error de conexión con Gemini para la persona investigadora criminal. Estado: ${response.status}`);
        } catch (error) {
            aplicarEstado('status-gemini', 'desconectado');
            console.error("CEIPOL: Falla de red al intentar conectar con Gemini para la persona investigadora criminal.", error);
        }
    };
    validarConexionGemini();

    // 3. BUSCADOR (GOOGLE CSE)
    const validarConexionCSE = async () => {
        const apiKey = (window.GOOGLE_API_KEY || '').trim();
        const cseId = (window.GOOGLE_CSE_ID || '').trim();
        if (!apiKey || apiKey === 'TU_API_KEY_DE_GEMINI_AQUI' || !cseId || cseId === 'TU_CSE_ID_AQUI') {
            aplicarEstado('status-cse', 'desconectado');
            return;
        }
        try {
            const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=test`);
            aplicarEstado('status-cse', response.ok ? 'optimo' : 'desconectado');
            if (!response.ok) console.error(`CEIPOL: Error de conexión con Google CSE para la persona investigadora criminal. Estado: ${response.status}`);
        } catch (error) {
            aplicarEstado('status-cse', 'desconectado');
            console.error("CEIPOL: Falla de red al intentar conectar con Google CSE para la persona investigadora criminal.", error);
        }
    };
    validarConexionCSE();
}

function toggleDashboardIA() {
    var header = document.getElementById("dashboard-ia-header"), body = document.getElementById("dashboard-ia-body");
    if (header && body) { header.classList.toggle("active"); body.classList.toggle("show"); header.setAttribute("aria-expanded", body.classList.contains("show")); }
}

function actualizarSemaforoSAI() {
    var r = document.getElementById("semaforo-rojo"), a = document.getElementById("semaforo-amarillo"), v = document.getElementById("semaforo-verde"), leyenda = document.getElementById("semaforo-leyenda");
    if (!r || !a || !v) return;
    r.classList.remove("activo"); a.classList.remove("activo"); v.classList.remove("activo");
    var completados = 0;
    if (typeof estadoEscalera === "object" && estadoEscalera) {
        ["conducta","tipicidad","antijuridicidad","imputabilidad","culpabilidad","punibilidad"].forEach(function(k) { if (estadoEscalera[k] === "completado") completados++; });
    }
    var total = 6, pct = total ? (completados / total) * 100 : 0;
    if (pct >= 80) { v.classList.add("activo"); if (leyenda) leyenda.textContent = "Caso robusto (THD)"; }
    else if (pct >= 40) { a.classList.add("activo"); if (leyenda) leyenda.textContent = "Caso en construcción"; }
    else { r.classList.add("activo"); if (leyenda) leyenda.textContent = "Caso débil – reforzar átomos THD"; }
}

function actualizarResumenDashboard() {
    var busquedas = document.getElementById("resumen-busquedas"), alertas = document.getElementById("resumen-alertas"), hip = document.getElementById("resumen-hipotesis");
    if (busquedas) busquedas.textContent = (ConcienciaOperativaSAI.listaJurisprudencias && ConcienciaOperativaSAI.listaJurisprudencias.length) || 0;
    if (alertas) alertas.textContent = (ConcienciaOperativaSAI.alertasInconsistencia && ConcienciaOperativaSAI.alertasInconsistencia.length) || 0;
    if (hip) {
        var h = document.querySelector(".hypothesis-card p") || document.getElementById("contenido-factico");
        hip.textContent = h ? (h.textContent || "").slice(0, 80) + "…" : "—";
    }
}

function renderPanelAlertasInconsistencia() {
    var panel = document.getElementById("panel-alertas-inconsistencia");
    if (!panel) return;
    panel.innerHTML = "";
    if (!ConcienciaOperativaSAI.alertasInconsistencia || !ConcienciaOperativaSAI.alertasInconsistencia.length) return;
    var h4 = document.createElement("h4");
    h4.style.fontSize = "0.9rem";
    h4.innerHTML = "<i class=\"fas fa-exclamation-triangle\"></i> Alertas de Inconsistencia Metodológica";
    panel.appendChild(h4);
    ConcienciaOperativaSAI.alertasInconsistencia.forEach(function(al) {
        var d = document.createElement("div");
        d.className = "alerta-inconsistencia";
        d.textContent = al.texto || al;
        panel.appendChild(d);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('tab-conexiones')) {
        actualizarSemaforos();
        setInterval(actualizarSemaforos, 60000); // Refrescar cada 60 segundos
    }
    actualizarSemaforoSAI(); 
    actualizarResumenDashboard();
});

window.toggleDashboardIA = toggleDashboardIA;
window.actualizarResumenDashboard = actualizarResumenDashboard;