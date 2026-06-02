(function() {
// ============================================
// LÓGICA DE INTERCONEXIÓN Y DATOS DE ESCRITOS
// ============================================

// Datos del sistema (interconectados con otras pestañas)
var datosDelSistema = {
    carpeta: "CI/AGS/CV/2025-001",
    causaPenal: "CP/2025/001054",
    fiscal: "Lic. Willy",
    unidadInvestigacion: "UI-03 - Delitos contra el Patrimonio del Estado",
    domicilioFiscalia: "Av. Aguascalientes Norte #901, Col. Centro",
    correoFiscalia: "fiscalia.ui03@ags.gob.mx",
    ciudad: "Aguascalientes",
    imputados: [
        { nombre: "Ingeniero Roberto \"N\"", domicilio: "Hacienda Nueva #234, Fraccionamiento Bosques", telefono: "[Reservado]", delito: "Peculado, Fraude, Asociación Delictuosa", grado: "Autor Intelectual" },
        { nombre: "Licenciado Marco \"N\"", domicilio: "Pulgas Pandas #567, Col. Norte", telefono: "[Reservado]", delito: "Fraude, Falsificación de Documentos, Amenazas", grado: "Coautor Material" },
        { nombre: "Licenciada Claudia \"N\"", domicilio: "Torre Bosques Depto 802", telefono: "[Reservado]", delito: "Peculado, Cohecho, Amenazas", grado: "Coautor Material" },
        { nombre: "Comandante Sergio \"N\"", domicilio: "[En investigación]", telefono: "[Reservado]", delito: "Abuso de Autoridad, Amenazas, Tentativa de Homicidio", grado: "Coautor Material" }
    ],
    victima: { nombre: "Erario Público / Elena Santoyo / Juan Carlos Ruiz", domicilio: "[RESERVADO]", asesor: "Lic. María González" },
    defensor: { nombre: "[Por designar]", cedula: "[Pendiente]", domicilio: "[Pendiente]" },
    fechaHechos: "Marzo 2025 a Enero 2026",
    horaHechos: "Diversos horarios",
    lugarHechos: "Oficinas gubernamentales, Bodega Calle Plomo #105, Av. López Mateos (atentado)",
    delitoPrincipal: "Peculado y Fraude",
    articuloDelito: "Art. 223 y 386 CPF",
    bienJuridico: "Patrimonio del Estado, Fe Pública, Administración Pública, Vida",
    montoAfectacion: "Millones de pesos (en cuantificación por UIF)"
};

// Calcular acreditación basada en el estado del sistema
function calcularAcreditacionPorTipo(tipo) {
    var pctElem = document.getElementById('ncx-percent');
    var basePct = pctElem ? parseInt(pctElem.textContent) : 0;
    var step6 = document.getElementById('select-punibilidad');
    if(step6 && step6.value === 'ninguna') basePct = 92;
    else if (basePct === 0 || isNaN(basePct)) { if (tipo === 'audiencia') return 75; if (tipo === 'acusacion') return 68; if (tipo === 'descubrimiento') return 85; }
    return basePct;
}
window.datosDelSistema = datosDelSistema;
window.calcularAcreditacionPorTipo = calcularAcreditacionPorTipo;
})();