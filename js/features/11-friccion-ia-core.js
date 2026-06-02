// ============================================
// MÓDULO: FRICCIÓN LÓGICA IA - CORE
// ============================================

const FriccionIA = {
    // Estado del sistema
    estado: {
        imputacion: {
            generadas: 3,
            respondidas: 0,
            validadas: 0,
            rechazadas: 0,
            sinContestar: 0,
            contadorId: 3
        },
        acusacion: {
            generadas: 3,
            respondidas: 0,
            validadas: 0,
            rechazadas: 0,
            sinContestar: 0,
            contadorId: 3
        }
    },
    
    // Trazabilidad
    trazabilidad: [],
    
    // Banco de preguntas IA para generar nuevas
    bancoPreguntasImputacion: [
        "¿Se acreditó el acuerdo previo entre Roberto, Marco, Claudia y Sergio para simular la licitación?",
        "¿Existe documentación que compruebe que la empresa 'Logística y Seguridad del Centro' fue creada para el fraude?",
        "¿Se verificó que las facturas entregadas a Beatriz Cano carecían de sellos de recepción válidos?",
        "¿Se acreditó que las cajas supuestamente de equipo contenían papel periódico y piedras?",
        "¿Existe constancia del uso de unidades oficiales para transportar dinero ilícito?",
        "¿Se documentaron las amenazas realizadas contra la Arq. Elena Santoyo?",
        "¿Se estableció la calidad de servidor público del Ing. Roberto 'N' al momento de los hechos?",
        "¿Se vinculó a la Lic. Claudia 'N' con las autorizaciones de pago fraudulentas?",
        "¿Existe evidencia de las reuniones clandestinas en la oficina privada de Roberto?",
        "¿Se verificaron los antecedentes del Comandante Sergio 'N' en la corporación policial?"
    ],
    
    bancoPreguntasAcusacion: [
        "¿Se incluyó en la acusación la tentativa de homicidio contra el periodista Juan Carlos Ruiz?",
        "¿Se fundamentó la solicitud de decomiso de propiedades en Hacienda Nueva, Pulgas Pandas y Torre Bosques?",
        "¿Se acreditó el concurso real de delitos (Peculado + Fraude + Asociación Delictuosa)?",
        "¿Se incluyeron las agravantes por calidad de servidores públicos (Art. 213 bis CPF)?",
        "¿Se cuantificó el monto total del daño patrimonial al erario público?",
        "¿Se consideró la protección a los 7 testigos identificados como medida complementaria?",
        "¿Se vinculó el atentado del 20 de enero de 2026 con la organización delictiva?",
        "¿Se fundamentó la autoría intelectual del Ing. Roberto 'N' como líder del esquema?",
        "¿Se solicitó colaboración internacional para rastreo de activos en el extranjero?",
        "¿Se incluyó la reparación del daño moral a Elena Santoyo y Juan Carlos Ruiz?"
    ],
    
    // Actividades probatorias disponibles (conectadas con PIC)
    actividadesPIC: [
        { id: "ACT-01", nombre: "Análisis documental expediente licitación" },
        { id: "ACT-02", nombre: "Dictamen autenticidad documental (facturas)" },
        { id: "ACT-03", nombre: "Rastreo transferencias bancarias UIF" },
        { id: "ACT-04", nombre: "Investigación patrimonial Roberto 'N'" },
        { id: "ACT-05", nombre: "Inspección bodega Calle Plomo #105" },
        { id: "ACT-06", nombre: "Entrevista Héctor Luna (chofer)" },
        { id: "ACT-07", nombre: "Entrevista Beatriz Cano (analista)" },
        { id: "ACT-08", nombre: "Entrevista Ricardo Fuentes (mensajero)" },
        { id: "ACT-09", nombre: "Entrevista Doña Mary (vendedora)" },
        { id: "ACT-10", nombre: "Entrevista Manuel Esparza (oficial)" },
        { id: "ACT-11", nombre: "Entrevista Dra. Ana Paula (médico)" },
        { id: "ACT-12", nombre: "Entrevista Luis Pedroza (contador)" },
        { id: "ACT-13", nombre: "Localización víctima Elena Santoyo" },
        { id: "ACT-14", nombre: "Entrevista periodista Juan Carlos Ruiz" },
        { id: "ACT-15", nombre: "Inspección lugar atentado Av. López Mateos" },
        { id: "ACT-16", nombre: "Dictamen balístico proyectiles" },
        { id: "ACT-17", nombre: "Análisis forense llamadas hospital" },
        { id: "ACT-18", nombre: "Verificación bitácoras vehículos oficiales" },
        { id: "ACT-19", nombre: "Investigación empresa 'Logística y Seguridad'" },
        { id: "ACT-20", nombre: "Investigación patrimonial Marco 'N'" },
        { id: "ACT-21", nombre: "Análisis registros contables dobles" },
        { id: "ACT-22", nombre: "Análisis grabaciones CCTV estacionamiento" },
        { id: "ACT-23", nombre: "Extracción forense celulares asegurados" },
        { id: "ACT-24", nombre: "Cateo domicilio Claudia 'N' Torre Bosques" },
        { id: "ACT-25", nombre: "Consulta registros personal policial Sergio 'N'" }
    ]
};

window.FriccionIA = FriccionIA;