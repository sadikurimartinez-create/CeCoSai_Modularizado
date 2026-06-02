// =============================================
// DATOS Y MÉTRICAS POR CSD (INDIVIDUALIZADAS)
// =============================================

const datosCSD = {
    'csd-01': {
        id: 'CSD-01',
        sujeto: 'Ingeniero Roberto "N"',
        delito: 'Peculado',
        articulo: 'Art. 223 CPF',
        grado: 'Autor Intelectual',
        pena: '2-14 años',
        metricas: {
            individualizacion: { valor: 85, estado: 'success', sugerencia: 'Constancia de empleo como servidor público obtenida.' },
            conducta: { valor: 92, estado: 'success', sugerencia: 'Acreditada mediante testimoniales de reuniones clandestinas.' },
            ausenciaConducta: { valor: 100, estado: 'success', sugerencia: 'Descartada. Evidencia de actos voluntarios.' },
            tipicidad: { valor: 88, estado: 'success', sugerencia: 'Elementos del tipo acreditados con expediente de licitación.' },
            atipicidad: { valor: 100, estado: 'success', sugerencia: 'Descartada. Conducta encuadra en Art. 223 CPF.' },
            antijuricidad: { valor: 95, estado: 'success', sugerencia: 'Clara lesión al patrimonio del Estado.' },
            causasJustificacion: { valor: 100, estado: 'success', sugerencia: 'No se aprecian causas de justificación.' },
            culpabilidad: { valor: 90, estado: 'success', sugerencia: 'Dolo directo acreditado (planificación previa).' }
        },
        recomendaciones: [
            'Ampliar investigación patrimonial para identificar cuentas en el extranjero.',
            'Solicitar decomiso de propiedades en Hacienda Nueva #234.',
            'Vincular testimonios de Héctor Luna y Luis Pedroza con su participación directa.'
        ]
    },
    'csd-02': {
        id: 'CSD-02',
        sujeto: 'Ingeniero Roberto "N"',
        delito: 'Fraude',
        articulo: 'Art. 386 CPF',
        grado: 'Autor Intelectual',
        pena: '3-12 años',
        metricas: {
            individualizacion: { valor: 85, estado: 'success', sugerencia: 'Mismo sujeto que CSD-01.' },
            conducta: { valor: 88, estado: 'success', sugerencia: 'Acreditada: diseñó esquema de facturación falsa.' },
            ausenciaConducta: { valor: 100, estado: 'success', sugerencia: 'Descartada.' },
            tipicidad: { valor: 85, estado: 'success', sugerencia: 'Engaño mediante licitación simulada acreditado.' },
            atipicidad: { valor: 100, estado: 'success', sugerencia: 'Descartada.' },
            antijuricidad: { valor: 90, estado: 'success', sugerencia: 'Perjuicio patrimonial al erario demostrado.' },
            causasJustificacion: { valor: 100, estado: 'success', sugerencia: 'No se aprecian.' },
            culpabilidad: { valor: 88, estado: 'success', sugerencia: 'Dolo acreditado con acuerdo de distribución de ganancias.' }
        },
        recomendaciones: [
            'Cuantificar monto exacto del fraude con informe UIF.',
            'Vincular facturas falsas directamente con instrucciones de Roberto.',
            'Obtener declaración de Beatriz Cano sobre irregularidades en pagos.'
        ]
    },
    'csd-03': {
        id: 'CSD-03',
        sujeto: 'Licenciado Marco "N"',
        delito: 'Fraude',
        articulo: 'Art. 386 CPF',
        grado: 'Coautor',
        pena: '3-12 años',
        metricas: {
            individualizacion: { valor: 78, estado: 'warning', sugerencia: 'Falta verificar domicilio actual en Pulgas Pandas.' },
            conducta: { valor: 90, estado: 'success', sugerencia: 'Acreditada: creó empresa fachada y emitió facturas.' },
            ausenciaConducta: { valor: 100, estado: 'success', sugerencia: 'Descartada.' },
            tipicidad: { valor: 92, estado: 'success', sugerencia: 'Es el ejecutor material del engaño documental.' },
            atipicidad: { valor: 100, estado: 'success', sugerencia: 'Descartada.' },
            antijuricidad: { valor: 88, estado: 'success', sugerencia: 'Lesión patrimonial mediante facturación falsa.' },
            causasJustificacion: { valor: 100, estado: 'success', sugerencia: 'No se aprecian.' },
            culpabilidad: { valor: 85, estado: 'success', sugerencia: 'Conocimiento de ilicitud demostrado (recibió ganancias).' }
        },
        recomendaciones: [
            'Verificar domicilio actual mediante informe de CFE.',
            'Investigar otras empresas a nombre de Marco "N".',
            'Analizar estados de cuenta de "Logística y Seguridad del Centro".'
        ]
    },
    'csd-04': {
        id: 'CSD-04',
        sujeto: 'Licenciado Marco "N"',
        delito: 'Falsificación de Documentos',
        articulo: 'Art. 243 CPF',
        grado: 'Autor Material',
        pena: '4-8 años',
        metricas: {
            individualizacion: { valor: 78, estado: 'warning', sugerencia: 'Mismo sujeto que CSD-03.' },
            conducta: { valor: 95, estado: 'success', sugerencia: 'Acreditada: emitió 23 facturas falsas documentadas.' },
            ausenciaConducta: { valor: 100, estado: 'success', sugerencia: 'Descartada.' },
            tipicidad: { valor: 94, estado: 'success', sugerencia: 'Dictamen de documentoscopía confirma falsedad.' },
            atipicidad: { valor: 100, estado: 'success', sugerencia: 'Descartada.' },
            antijuricidad: { valor: 92, estado: 'success', sugerencia: 'Afectación a la fe pública documentada.' },
            causasJustificacion: { valor: 100, estado: 'success', sugerencia: 'No se aprecian.' },
            culpabilidad: { valor: 90, estado: 'success', sugerencia: 'Dolo directo: elaboró documentos a sabiendas de su falsedad.' }
        },
        recomendaciones: [
            'Completar dictamen de autenticidad de todas las facturas.',
            'Identificar origen del papel y sellos utilizados.',
            'Vincular con testimonial de Ricardo Fuentes (mensajero).'
        ]
    },
    'csd-05': {
        id: 'CSD-05',
        sujeto: 'Licenciada Claudia "N"',
        delito: 'Peculado',
        articulo: 'Art. 223 CPF',
        grado: 'Coautor',
        pena: '2-14 años',
        metricas: {
            individualizacion: { valor: 82, estado: 'success', sugerencia: 'Domicilio en Torre Bosques Depto 802 verificado.' },
            conducta: { valor: 88, estado: 'success', sugerencia: 'Autorizó pagos fraudulentos desde su cargo.' },
            ausenciaConducta: { valor: 100, estado: 'success', sugerencia: 'Descartada.' },
            tipicidad: { valor: 85, estado: 'success', sugerencia: 'Calidad de servidor público acreditada.' },
            atipicidad: { valor: 100, estado: 'success', sugerencia: 'Descartada.' },
            antijuricidad: { valor: 90, estado: 'success', sugerencia: 'Disposición indebida de recursos públicos.' },
            causasJustificacion: { valor: 100, estado: 'success', sugerencia: 'No se aprecian.' },
            culpabilidad: { valor: 80, estado: 'warning', sugerencia: 'Falta reforzar conocimiento previo del esquema.' }
        },
        recomendaciones: [
            'Obtener registros de autorizaciones firmadas por Claudia.',
            'Entrevistar a subordinados del área financiera.',
            'Ejecutar cateo en Torre Bosques Depto 802.'
        ]
    },
    'csd-06': {
        id: 'CSD-06',
        sujeto: 'Licenciada Claudia "N"',
        delito: 'Cohecho',
        articulo: 'Art. 222 CPF',
        grado: 'Autor Material',
        pena: '3-8 años',
        metricas: {
            individualizacion: { valor: 82, estado: 'success', sugerencia: 'Mismo sujeto que CSD-05.' },
            conducta: { valor: 75, estado: 'warning', sugerencia: 'Falta evidencia directa de recepción de dinero.' },
            ausenciaConducta: { valor: 100, estado: 'success', sugerencia: 'Descartada.' },
            tipicidad: { valor: 70, estado: 'warning', sugerencia: 'Pendiente acreditar el "solicitar o recibir" dádiva.' },
            atipicidad: { valor: 90, estado: 'success', sugerencia: 'Probable descarte si no se acredita recepción.' },
            antijuricidad: { valor: 85, estado: 'success', sugerencia: 'Afectación a la función pública.' },
            causasJustificacion: { valor: 100, estado: 'success', sugerencia: 'No se aprecian.' },
            culpabilidad: { valor: 72, estado: 'warning', sugerencia: 'Falta acreditar que recibió 20% de ganancias.' }
        },
        recomendaciones: [
            'CRÍTICO: Obtener evidencia de transferencias a cuentas de Claudia.',
            'Entrevistar al contador Luis Pedroza sobre distribución del 20%.',
            'Rastrear movimientos bancarios durante el período de los hechos.'
        ]
    },
    'csd-07': {
        id: 'CSD-07',
        sujeto: 'Comandante Sergio "N"',
        delito: 'Abuso de Autoridad',
        articulo: 'Art. 215 CPF',
        grado: 'Autor Material',
        pena: '1-8 años',
        metricas: {
            individualizacion: { valor: 70, estado: 'warning', sugerencia: 'Falta verificar datos de personal policial.' },
            conducta: { valor: 85, estado: 'success', sugerencia: 'Uso de unidades oficiales para fines ilícitos.' },
            ausenciaConducta: { valor: 100, estado: 'success', sugerencia: 'Descartada.' },
            tipicidad: { valor: 80, estado: 'warning', sugerencia: 'Pendiente constancia de cargo como Comandante.' },
            atipicidad: { valor: 100, estado: 'success', sugerencia: 'Descartada.' },
            antijuricidad: { valor: 88, estado: 'success', sugerencia: 'Uso indebido de recursos y cargo público.' },
            causasJustificacion: { valor: 100, estado: 'success', sugerencia: 'No se aprecian.' },
            culpabilidad: { valor: 82, estado: 'success', sugerencia: 'Conocimiento de la naturaleza ilícita de los actos.' }
        },
        recomendaciones: [
            'URGENTE: Consultar registros de personal policial.',
            'Verificar bitácoras de vehículos oficiales asignados.',
            'Entrevistar al oficial Manuel Esparza sobre órdenes de Sergio.'
        ]
    },
    'csd-08': {
        id: 'CSD-08',
        sujeto: 'Comandante Sergio "N"',
        delito: 'Tentativa de Homicidio',
        articulo: 'Art. 302/63 CPF',
        grado: 'Coautor',
        pena: 'Hasta 20 años',
        metricas: {
            individualizacion: { valor: 70, estado: 'warning', sugerencia: 'Mismo sujeto que CSD-07.' },
            conducta: { valor: 65, estado: 'danger', sugerencia: 'CRÍTICO: Falta vincular directamente con el atentado.' },
            ausenciaConducta: { valor: 85, estado: 'warning', sugerencia: 'Pendiente descartar coartada.' },
            tipicidad: { valor: 60, estado: 'danger', sugerencia: 'CRÍTICO: Pendiente dictamen balístico completo.' },
            atipicidad: { valor: 75, estado: 'warning', sugerencia: 'Riesgo si no se vincula con proyectiles.' },
            antijuricidad: { valor: 90, estado: 'success', sugerencia: 'Atentado contra la vida claramente antijurídico.' },
            causasJustificacion: { valor: 100, estado: 'success', sugerencia: 'No se aprecian.' },
            culpabilidad: { valor: 55, estado: 'danger', sugerencia: 'CRÍTICO: Falta acreditar autoría o participación.' }
        },
        recomendaciones: [
            'MÁXIMA PRIORIDAD: Completar dictamen balístico de proyectiles.',
            'Entrevistar a Juan Carlos Ruiz sobre identificación de agresores.',
            'Analizar videos de CCTV de Av. López Mateos del 20 de enero.',
            'Verificar ubicación de Sergio el día del atentado.'
        ]
    }
};

// Función para actualizar métricas según CSD seleccionado
function actualizarMetricasCSD() {
    const selector = document.getElementById('selector-csd-metricas');
    const csdId = selector.value;
    
    const panelInfo = document.getElementById('panel-info-csd');
    const panelMetricas = document.getElementById('panel-metricas-csd');
    const panelResumen = document.getElementById('panel-resumen-ia-csd');
    const mensajeInicial = document.getElementById('mensaje-inicial-metricas');
    
    if (!csdId) {
        // Ocultar paneles y mostrar mensaje inicial
        panelInfo.style.display = 'none';
        panelMetricas.style.display = 'none';
        panelResumen.style.display = 'none';
        mensajeInicial.style.display = 'block';
        return;
    }
    
    // Ocultar mensaje inicial y mostrar paneles
    mensajeInicial.style.display = 'none';
    panelInfo.style.display = 'block';
    panelMetricas.style.display = 'block';
    panelResumen.style.display = 'block';
    
    const datos = datosCSD[csdId];
    if (!datos) return;
    
    // Actualizar información del CSD
    document.getElementById('titulo-csd-info').textContent = datos.id + ': ' + datos.sujeto;
    document.getElementById('badge-grado-participacion').textContent = datos.grado;
    document.getElementById('info-sujeto-activo').textContent = datos.sujeto;
    document.getElementById('info-delito').textContent = datos.delito;
    document.getElementById('info-articulo').textContent = datos.articulo + ' | Pena: ' + datos.pena;
    
    // Calcular métrica global
    const metricas = datos.metricas;
    let suma = 0;
    let count = 0;
    for (let key in metricas) {
        suma += metricas[key].valor;
        count++;
    }
    const promedioGlobal = Math.round(suma / count);
    
    document.getElementById('metrica-global-csd').textContent = promedioGlobal + '%';
    document.getElementById('barra-global-csd').style.width = promedioGlobal + '%';
    
    const estadoGlobal = document.getElementById('estado-global-csd');
    if (promedioGlobal >= 85) {
        estadoGlobal.className = 'badge-status badge-success';
        estadoGlobal.textContent = 'ACREDITACIÓN ALTA';
    } else if (promedioGlobal >= 70) {
        estadoGlobal.className = 'badge-status badge-warning';
        estadoGlobal.textContent = 'ACREDITACIÓN MEDIA';
    } else {
        estadoGlobal.className = 'badge-status badge-danger';
        estadoGlobal.textContent = 'ACREDITACIÓN BAJA';
    }
    
    // Generar tabla de métricas
    const tbody = document.getElementById('tbody-metricas-csd');
    tbody.innerHTML = '';
    
    const elementosOrden = [
        { key: 'individualizacion', nombre: 'INDIVIDUALIZACIÓN SUJETO ACTIVO' },
        { key: 'conducta', nombre: 'Conducta' },
        { key: 'ausenciaConducta', nombre: 'Ausencia de Conducta' },
        { key: 'tipicidad', nombre: 'Tipicidad' },
        { key: 'atipicidad', nombre: 'Atipicidad' },
        { key: 'antijuricidad', nombre: 'Antijuricidad' },
        { key: 'causasJustificacion', nombre: 'Causas de Justificación' },
        { key: 'culpabilidad', nombre: 'Culpabilidad' }
    ];
    
    elementosOrden.forEach(function(elem) {
        const m = metricas[elem.key];
        const fillClass = m.valor >= 85 ? 'high' : m.valor >= 70 ? 'medium' : 'low';
        const badgeClass = m.estado === 'success' ? 'badge-success' : m.estado === 'warning' ? 'badge-warning' : 'badge-danger';
        
        const row = document.createElement('tr');
        row.innerHTML = 
            '<td><strong>' + elem.nombre + '</strong></td>' +
            '<td>' +
            '<div class="progress-container">' +
            '<div class="progress-bar">' +
            '<div class="progress-fill ' + fillClass + '" style="width: ' + m.valor + '%;"></div>' +
            '</div>' +
            '<div class="progress-label">' +
            '<span></span>' +
            '<span><strong>' + m.valor + '%</strong></span>' +
            '</div>' +
            '</div>' +
            '</td>' +
            '<td><span class="badge-status ' + badgeClass + '">' + m.sugerencia + '</span></td>';
        
        tbody.appendChild(row);
    });
    
    // Generar recomendaciones IA
    const contenedorRec = document.getElementById('contenido-recomendaciones-ia');
    let htmlRec = '<ul style="padding-left: 20px; margin: 0;">';
    datos.recomendaciones.forEach(function(rec) {
        const esUrgente = rec.includes('CRÍTICO') || rec.includes('URGENTE') || rec.includes('MÁXIMA');
        htmlRec += '<li style="margin-bottom: 8px;' + (esUrgente ? ' color: #dc2626; font-weight: 600;' : '') + '">' + rec + '</li>';
    });
    htmlRec += '</ul>';
    contenedorRec.innerHTML = htmlRec;
    
    showToast('Métricas de ' + datos.id + ' cargadas', 'success');
}

// Aceptar recomendaciones IA y agregar al PIC
function aceptarRecomendacionesIA() {
    showToast('✓ Recomendaciones aceptadas y agregadas al PIC', 'success');
}

// Rechazar recomendaciones IA
function rechazarRecomendacionesIA() {
    showToast('Recomendaciones rechazadas. Registrado en trazabilidad.', 'warning');
}

// Exportar métricas del CSD
function exportarMetricasCSD() {
    const selector = document.getElementById('selector-csd-metricas');
    const csdId = selector.value;
    
    if (!csdId) {
        showToast('⚠️ Seleccione un CSD primero', 'warning');
        return;
    }
    
    showToast('✓ Métricas de ' + datosCSD[csdId].id + ' exportadas a PDF', 'success');
}

