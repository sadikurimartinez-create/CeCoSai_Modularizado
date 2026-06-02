(function() {
// ============================================
// MÓDULO: ESCALERA HEPTATÓMICA CON IA
// ============================================

const EscaleraIA = {
    apiKey: localStorage.getItem('ri_api_key') || '',
    csdSeleccionado: null,
    delitoSeleccionado: null,
    elementosValidados: {
        conducta: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null },
        tipicidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null, clasificacion: null },
        antijuridicidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null },
        imputabilidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null },
        culpabilidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null },
        punibilidad: { positivo: false, negativo: false, acreditacion: 0, iaResultado: null }
    },
    resultadosInvestigativos: [],
    actividadesPIC: []
};

// Clasificaciones según Porte Petit para Tipicidad
const ClasificacionesPortePetit = {
    porResultado: ['Material', 'Formal', 'De Peligro'],
    porDano: ['De Lesión', 'De Peligro Concreto', 'De Peligro Abstracto'],
    porDuracion: ['Instantáneo', 'Permanente', 'Continuado'],
    porCulpabilidad: ['Doloso', 'Culposo', 'Preterintencional'],
    porEstructura: ['Simple', 'Complejo', 'Especial'],
    porNumeroActos: ['Unisubsistente', 'Plurisubsistente'],
    porNumeroSujetos: ['Unisubjetivo', 'Plurisubjetivo'],
    porPersecucion: ['De Oficio', 'Por Querella']
};

// Elementos del Código Penal de Aguascalientes por delito
const CodigoPenalAguascalientes = {
    'Peculado': {
        articulo: 'Art. 213 CPA',
        elementosObjetivos: 'Servidor público que para sí o para otro, distraiga, disponga o haga uso indebido de dinero, valores, fincas o cualquier otra cosa perteneciente al Estado',
        elementosSubjetivos: 'Dolo directo - Voluntad de disponer indebidamente de bienes públicos',
        elementosNormativos: 'Calidad de servidor público, pertenencia de bienes al Estado',
        bienJuridico: 'Patrimonio del Estado y correcto ejercicio de la función pública',
        pena: '2 a 14 años de prisión y multa de 50 a 300 días'
    },
    'Fraude': {
        articulo: 'Art. 231 CPA',
        elementosObjetivos: 'Engañar a alguien o aprovecharse del error en que se encuentra para hacerse ilícitamente de alguna cosa o alcanzar un lucro indebido',
        elementosSubjetivos: 'Dolo directo - Intención de engañar y obtener lucro indebido',
        elementosNormativos: 'Engaño, error, lucro indebido, cosa ajena',
        bienJuridico: 'Patrimonio',
        pena: '3 meses a 12 años de prisión según monto'
    },
    'Falsificación de Documentos': {
        articulo: 'Art. 243-245 CPA',
        elementosObjetivos: 'Poner una firma o rúbrica falsa, alterar documento público o privado, simular documento',
        elementosSubjetivos: 'Dolo directo - Voluntad de falsificar con propósito de usar',
        elementosNormativos: 'Documento, firma, autenticidad',
        bienJuridico: 'Fe pública y seguridad jurídica documental',
        pena: '6 meses a 6 años de prisión'
    },
    'Cohecho': {
        articulo: 'Art. 217 CPA',
        elementosObjetivos: 'Servidor público que solicite o reciba indebidamente dinero o cualquier otra dádiva, o acepte una promesa, para hacer o dejar de hacer algo justo o injusto',
        elementosSubjetivos: 'Dolo directo - Intención de recibir beneficio a cambio de acto oficial',
        elementosNormativos: 'Calidad de servidor público, acto u omisión oficial',
        bienJuridico: 'Correcto funcionamiento de la administración pública',
        pena: '3 meses a 14 años de prisión'
    },
    'Abuso de Autoridad': {
        articulo: 'Art. 209-210 CPA',
        elementosObjetivos: 'Servidor público que incurra en actos arbitrarios o abusivos contra particulares usando su cargo',
        elementosSubjetivos: 'Dolo - Voluntad de ejercer indebidamente facultades del cargo',
        elementosNormativos: 'Calidad de servidor público, ejercicio de funciones',
        bienJuridico: 'Correcto ejercicio de la función pública',
        pena: '1 a 8 años de prisión'
    },
    'Amenazas': {
        articulo: 'Art. 152 CPA',
        elementosObjetivos: 'Amenazar a otro con causarle un mal en su persona, bienes, honor o derechos',
        elementosSubjetivos: 'Dolo directo - Voluntad de intimidar',
        elementosNormativos: 'Amenaza seria y creíble, mal futuro',
        bienJuridico: 'Libertad y seguridad personal',
        pena: '3 meses a 2 años de prisión'
    },
    'Tentativa de Homicidio': {
        articulo: 'Art. 63 + 123 CPA',
        elementosObjetivos: 'Realizar actos encaminados a privar de la vida sin consumar el resultado',
        elementosSubjetivos: 'Dolo directo - Intención de matar',
        elementosNormativos: 'Idoneidad de medios, peligro real para la vida',
        bienJuridico: 'Vida humana',
        pena: 'Hasta dos terceras partes de la pena del delito consumado'
    },
    'Asociación Delictuosa': {
        articulo: 'Art. 178 CPA',
        elementosObjetivos: 'Formar parte de una asociación o banda de tres o más personas organizada para delinquir',
        elementosSubjetivos: 'Dolo directo - Voluntad de pertenecer a organización delictiva',
        elementosNormativos: 'Organización permanente, fin delictivo',
        bienJuridico: 'Seguridad pública',
        pena: '5 a 10 años de prisión'
    }
};


// Referencias globales para otros archivos de la Escalera IA.
window.EscaleraIA = EscaleraIA;
window.ClasificacionesPortePetit = ClasificacionesPortePetit;
window.CodigoPenalAguascalientes = CodigoPenalAguascalientes;
})();
