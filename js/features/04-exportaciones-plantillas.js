(function() {
// ============================================
// PLANTILLAS DE ESCRITOS PROCESALES
// ============================================

// Generar contenido del escrito según el tipo
function generarContenidoEscrito(tipo) {
        var d = window.datosDelSistema || {};
    var narrativaElem = document.getElementById('narrativa-principal');
    var narrativa = (narrativaElem && narrativaElem.value) ? narrativaElem.value : "[No se ha redactado narrativa para este caso]";
    var fechaActual = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    var horaActual = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        var acreditacion = typeof window.calcularAcreditacionPorTipo === 'function' ? window.calcularAcreditacionPorTipo(tipo) : 80;
        
        // Extracción de Conclusiones Integradoras de la Escalera IA (si existen)
        var iaConducta = (window.EscaleraIA && window.EscaleraIA.elementosValidados.conducta.iaResultado && window.EscaleraIA.elementosValidados.conducta.iaResultado.conclusionIntegradora) 
            ? window.EscaleraIA.elementosValidados.conducta.iaResultado.conclusionIntegradora 
            : "La conducta ha sido acreditada como una acción voluntaria, sin que medie causa de ausencia de conducta.";
        var iaTipicidad = (window.EscaleraIA && window.EscaleraIA.elementosValidados.tipicidad.iaResultado && window.EscaleraIA.elementosValidados.tipicidad.iaResultado.conclusionIntegradora) 
            ? window.EscaleraIA.elementosValidados.tipicidad.iaResultado.conclusionIntegradora 
            : "Los hechos encuadran perfectamente en los elementos objetivos, subjetivos y normativos del tipo penal en estudio.";
        var iaAntijuridicidad = (window.EscaleraIA && window.EscaleraIA.elementosValidados.antijuridicidad.iaResultado && window.EscaleraIA.elementosValidados.antijuridicidad.iaResultado.conclusionIntegradora) 
            ? window.EscaleraIA.elementosValidados.antijuridicidad.iaResultado.conclusionIntegradora 
            : "La conducta es antijurídica al no existir causa de justificación alguna a favor de los imputados.";
        var iaPunibilidad = (window.EscaleraIA && window.EscaleraIA.elementosValidados.punibilidad.iaResultado)
            ? window.EscaleraIA.elementosValidados.punibilidad.iaResultado
            : null;
            
        // Extracción Dinámica de Testigos y Peritos del PIC (Resultados Investigativos)
        var testigosDinamicos = "";
        var peritosDinamicos = "";
        
        if (window.ResultadosInvestigativos && window.ResultadosInvestigativos.actividadesPIC) {
            var actTestimoniales = window.ResultadosInvestigativos.actividadesPIC.filter(function(a) { return a.actividad.toLowerCase().includes('entrevista') || a.actividad.toLowerCase().includes('testigo'); });
            var actPericiales = window.ResultadosInvestigativos.actividadesPIC.filter(function(a) { return a.actividad.toLowerCase().includes('dictamen') || a.actividad.toLowerCase().includes('peritaje') || a.actividad.toLowerCase().includes('pericial') || a.actividad.toLowerCase().includes('análisis'); });

            if (actTestimoniales.length > 0) {
                testigosDinamicos = actTestimoniales.map(function(t) { return '<li style="margin-left: 20px;"><strong>Testimonial:</strong> ' + t.actividad + ' (' + (t.responsable || 'Testigo') + ') - Pertinente para el esclarecimiento de los hechos.</li>'; }).join('');
            }
            if (actPericiales.length > 0) {
                peritosDinamicos = actPericiales.map(function(p) { return '<li style="margin-left: 20px;"><strong>Pericial:</strong> ' + p.actividad + ' (a cargo de ' + (p.responsable || 'Perito') + ') - Dictamen técnico correspondiente.</li>'; }).join('');
            }
        }

        // Fallbacks si no hay dinámicos
        if (!testigosDinamicos) testigosDinamicos = '<li style="margin-left: 20px;"><strong>Testimonial de ' + (d.victima ? d.victima.nombre : "Víctima") + ':</strong> Sobre los hechos, circunstancias de modo, tiempo y lugar.</li>';
        if (!peritosDinamicos) peritosDinamicos = '<li style="margin-left: 20px;"><strong>Dictamen Técnico de Especialidad:</strong> Sobre la materialidad del hecho delictivo.</li>';

    var contenido = '';
    if (tipo === 'audiencia') {
        contenido = `
                <p style="text-align:right; font-size:10pt;"><strong>CARPETA DE INVESTIGACIÓN:</strong> ${d.carpeta}</p>
                <p style="text-align:right; font-size:10pt;"><strong>ASUNTO:</strong> SE SOLICITA FECHA Y HORA PARA AUDIENCIA INICIAL (FORMULACIÓN DE IMPUTACIÓN).</p>
                <br>
                <p><strong>C. JUEZ DE CONTROL DEL SISTEMA PENAL ACUSATORIO Y ORAL DEL DISTRITO JUDICIAL DE ${d.ciudad ? d.ciudad.toUpperCase() : ''}</strong></p>
                <p style="text-align:center;"><strong>P R E S E N T E</strong></p>
                <br>
                <p style="text-align:justify; text-indent: 40px;">El suscrito Licenciado <strong>${d.fiscal}</strong>, Agente del Ministerio Público adscrito a la <strong>${d.unidadInvestigacion}</strong>, señalando como domicilio para oír y recibir notificaciones el ubicado en <strong>${d.domicilioFiscalia}</strong>, y correo electrónico <strong>${d.correoFiscalia}</strong>, ante Usted con el debido respeto comparezco y expongo:</p>
                <br>
                <p style="text-align:justify; text-indent: 40px;">Que con fundamento en los artículos <strong>16, 19 y 20 apartado A y B</strong> de la Constitución Política de los Estados Unidos Mexicanos; en relación con los diversos <strong>127, 131 fracción V, 141 fracción I, 309, 310, 311 y 313</strong> del Código Nacional de Procedimientos Penales (CNPP), acudo ante este H. Tribunal a efecto de <strong>SOLICITAR SE FIJE FECHA Y HORA PARA LA CELEBRACIÓN DE LA AUDIENCIA INICIAL</strong>, con la finalidad de formular imputación, solicitar vinculación a proceso y requerir la imposición de medidas cautelares en contra de las siguientes personas:</p>
                <br>
                <p><strong>I. INDIVIDUALIZACIÓN DE LOS IMPUTADOS Y LA VÍCTIMA (Arts. 311 Fracc. I y 109 CNPP)</strong></p>
                ${d.imputados ? d.imputados.map(function(imp) { return `
                    <p style="margin-left: 20px;"><strong>Imputado:</strong> ${imp.nombre}<br>
                    <strong>Domicilio para citación:</strong> ${imp.domicilio}</p>
                `;}).join('') : ''}
                <br>
                <p style="margin-left: 20px;"><strong>Víctima u Ofendido:</strong> ${d.victima ? d.victima.nombre : ''}<br>
                <strong>Asesor Jurídico:</strong> ${d.victima ? d.victima.asesor : ''}</p>
                <br>
                <p><strong>II. RELACIÓN CLARA, PRECISA Y CIRCUNSTANCIADA DE LOS HECHOS (Art. 311 Fracc. II CNPP)</strong></p>
                <p style="text-align:justify;">"${narrativa}"</p>
                <br>
                <p><strong>III. CLASIFICACIÓN JURÍDICA PRELIMINAR Y FORMA DE INTERVENCIÓN (Art. 311 Fracc. III y IV CNPP)</strong></p>
                <p style="text-align:justify;">Los hechos narrados revisten, preliminarmente, las características del delito de <strong>${d.delitoPrincipal}</strong>, previsto y sancionado en el <strong>${d.articuloDelito}</strong>. La forma de intervención atribuida a los imputados es de <strong>${d.imputados && d.imputados[0] && d.imputados[0].grado ? d.imputados[0].grado : 'COAUTORES MATERIALES'}</strong> en términos del Código Penal, al haberse consumado el hecho de forma dolosa.</p>
                <br>
                <p><strong>IV. PERSONAS QUE DEPONEN EN SU CONTRA</strong></p>
                <p style="text-align:justify;">Las personas que deponen en contra de los investigados, cuyos registros obran en la presente carpeta, son:</p>
                <ul style="padding-left: 20px; text-align:justify;">
                    ${testigosDinamicos}
                </ul>
                <br>
                <p><strong>V. JUSTIFICACIÓN DE NECESIDAD DE MEDIDAS CAUTELARES (Art. 153 y 154 CNPP)</strong></p>
                <p style="text-align:justify;">Conforme al análisis de riesgo extraído en las labores investigativas de la presente causa, esta representación social adelantará, en el momento procesal oportuno, la solicitud de medidas cautelares fundadas en el <strong>Art. 155 del CNPP</strong>, derivado del riesgo inminente de obstaculización del proceso y peligro para las víctimas.</p>
                <br>
                <p>Por lo anteriormente expuesto y fundado a Usted C. Juez de Control, <strong>ATENTAMENTE PIDO:</strong></p>
                <p><strong>PRIMERO:</strong> Tenerme por presentado en tiempo y forma solicitando audiencia inicial.</p>
                <p><strong>SEGUNDO:</strong> Ordenar la CITACIÓN del imputado en el domicilio señalado.</p>
                <p><strong>TERCERO:</strong> Citar de igual forma a la Víctima/Ofendido y su Asesor Jurídico.</p>
                <br>
                <p style="text-align:center;"><strong>PROTESTO LO NECESARIO</strong></p>
                <p style="text-align:center;">${d.ciudad}, a ${fechaActual}</p>
                <br><br><br>
                <p style="text-align:center;">__________________________<br><strong>${d.fiscal}</strong><br>AGENTE DEL MINISTERIO PÚBLICO<br>UNIDAD DE INVESTIGACIÓN ${d.unidadInvestigacion}</p>
            `;
    } else if (tipo === 'acusacion') {
        contenido = `
                <p style="text-align:right; font-size:10pt;"><strong>CAUSA PENAL:</strong> ${d.causaPenal}</p>
                <p style="text-align:right; font-size:10pt;"><strong>CARPETA DE INVESTIGACIÓN:</strong> ${d.carpeta}</p>
                <p style="text-align:right; font-size:10pt;"><strong>ASUNTO:</strong> SE FORMULA ACUSACIÓN (ART. 335 CNPP).</p>
                <br>
                <p><strong>C. JUEZ DE CONTROL DEL SISTEMA PENAL ACUSATORIO Y ORAL DEL DISTRITO JUDICIAL DE ${d.ciudad ? d.ciudad.toUpperCase() : ''}</strong></p>
                <p style="text-align:center;"><strong>P R E S E N T E</strong></p>
                <br>
                <p style="text-align:justify; text-indent: 40px;">El suscrito Licenciado <strong>${d.fiscal}</strong>, Agente del Ministerio Público adscrito a la <strong>${d.unidadInvestigacion}</strong> de esta Fiscalía, con datos de identificación y notificación debidamente registrados ante la Administración de este H. Tribunal, comparezco respetuosamente para exponer:</p>
                <br>
                <p style="text-align:justify; text-indent: 40px;">Que con fundamento en el artículo <strong>21</strong> de la Constitución Política de los Estados Unidos Mexicanos, y en cumplimiento a lo dispuesto por los artículos <strong>335 y 336</strong> del Código Nacional de Procedimientos Penales (CNPP), habiéndose declarado el cierre de la investigación complementaria en la presente causa, ocurro mediante el presente escrito a formular <strong>ACUSACIÓN</strong> en contra de los procesados, procediendo a satisfacer los requisitos legales de la siguiente manera:</p>
                <br>
                <p><strong>I. LA INDIVIDUALIZACIÓN DE LOS ACUSADOS Y DE SU DEFENSOR (Art. 335 Fracción I)</strong></p>
                ${d.imputados ? d.imputados.map(function(imp) { return `
                    <p style="margin-left: 20px;"><strong>Acusado:</strong> ${imp.nombre} (Actualmente bajo medida cautelar pertinente en esta causa).</p>
                `;}).join('') : ''}
                <p style="margin-left: 20px;"><strong>Defensor:</strong> ${d.defensor ? d.defensor.nombre : ''}, con cédula ${d.defensor ? d.defensor.cedula : ''} y domicilio de notificación debidamente registrado en autos.</p>
                <br>
                <p><strong>II. LA IDENTIFICACIÓN DE LA VÍCTIMA U OFENDIDO Y SU ASESOR JURÍDICO (Fracción II)</strong></p>
                <p style="margin-left: 20px;"><strong>Víctima(s):</strong> ${d.victima ? d.victima.nombre : ''}</p>
                <p style="margin-left: 20px;"><strong>Asesor Jurídico:</strong> ${d.victima ? d.victima.asesor : ''}</p>
                <br>
                <p><strong>III. RELACIÓN CLARA, PRECISA, CIRCUNSTANCIADA Y ESPECÍFICA DE LOS HECHOS ATRIBUIDOS EN MODO, TIEMPO Y LUGAR, ASÍ COMO SU CLASIFICACIÓN JURÍDICA (Fracción III)</strong></p>
                <p style="text-align:justify;"><strong>Hechos:</strong> ${narrativa}</p>
                <p style="text-align:justify;"><strong>Clasificación Jurídica y Subsunción Heptatómica:</strong> En la fase investigativa, la Arquitectura de la Verdad (SAI) acreditó sólidamente los elementos del tipo penal en estudio:</p>
                <ul style="padding-left: 30px; text-align:justify;">
                    <li><strong>Conducta y Tipicidad:</strong> ${iaConducta} ${iaTipicidad}</li>
                    <li><strong>Antijuridicidad:</strong> ${iaAntijuridicidad}</li>
                </ul>
                <br>
                <p><strong>IV. LA RELACIÓN DE LAS MODALIDADES DEL DELITO QUE CONCURRIEREN (Fracción IV)</strong></p>
                <p style="text-align:justify; margin-left: 20px;">El delito se consumó con las agravantes propias de su ejecución, actualizándose concurso real de delitos entre ${d.delitoPrincipal}.</p>
                <br>
                <p><strong>V. LA AUTORÍA O PARTICIPACIÓN CONCRETA QUE SE ATRIBUYE AL ACUSADO (Fracción V)</strong></p>
                <p style="text-align:justify; margin-left: 20px;">Conforme al Código Penal del Estado, la participación se atribuye en calidad de Coautores Materiales e Intelectuales, existiendo un codominio funcional del hecho.</p>
                <br>
                <p><strong>VI. LA EXPRESIÓN DE LOS PRECEPTOS LEGALES APLICABLES (Fracción VI)</strong></p>
                <p style="text-align:justify; margin-left: 20px;">Los hechos descritos se encuentran tipificados y sancionados por los artículos <strong>${d.articuloDelito}</strong> del Código Penal, en relación directa con el artículo 13 (formas de intervención).</p>
                <br>
                <p><strong>VII. EL SEÑALAMIENTO DE LOS MEDIOS DE PRUEBA QUE PRETENDA OFRECER, ASÍ COMO LA PRUEBA ANTICIPADA (Fracción VII)</strong></p>
                <p style="text-align:justify; margin-left: 20px;">Esta Fiscalía se valdrá de los siguientes medios de prueba, recabados formalmente durante el Plan de Investigación (PIC) y validados en el Mapa de Investigación Criminal (MIC):</p>
                <p style="margin-left: 30px;"><strong>A. PRUEBA TESTIMONIAL:</strong></p>
                <ul style="padding-left:20px;">
                    ${testigosDinamicos}
                </ul>
                <p style="margin-left: 30px;"><strong>B. PRUEBA PERICIAL Y DOCUMENTAL:</strong></p>
                <ul style="padding-left:20px;">
                    ${peritosDinamicos}
                </ul>
                <br>
                <p><strong>VIII. EL MONTO DE LA REPARACIÓN DEL DAÑO Y LOS MEDIOS DE PRUEBA QUE OFRECE PARA PROBARLO (Fracción VIII)</strong></p>
                <p style="text-align:justify; margin-left: 20px;">Se solicita la reparación integral del daño patrimonial, cuyo monto cuantificable asciende a <strong>${d.montoAfectacion}</strong>.</p>
                <br>
                <p><strong>IX. LA PENA O MEDIDA DE SEGURIDAD CUYA APLICACIÓN SE SOLICITA INCLUYENDO EN SU CASO LA CORRESPONDIENTE AL CONCURSO DE DELITOS (Fracción IX)</strong></p>
                <p style="text-align:justify; margin-left: 20px;">${iaPunibilidad ? 'Con base en el análisis lógico, se solicita <strong>' + (iaPunibilidad.prision && iaPunibilidad.prision.sugerida ? iaPunibilidad.prision.sugerida : 'la pena privativa de libertad aplicable') + '</strong>, así como <strong>' + (iaPunibilidad.multa && iaPunibilidad.multa.sugerida ? iaPunibilidad.multa.sugerida : 'la multa correspondiente') + '</strong> y las medidas de seguridad pertinentes.' : 'Se solicita la pena máxima de prisión aplicable al tipo penal base y sus agravantes por concurso, así como inhabilitación permanente para ejercer cargos públicos.'}</p>
                <br>
                <p><strong>X. LOS MEDIOS DE PRUEBA PARA LA INDIVIDUALIZACIÓN DE LA PENA Y LA REPARACIÓN DEL DAÑO (Fracción X)</strong></p>
                <p style="text-align:justify; margin-left: 20px;">Se ofrecen los mismos medios de prueba detallados en la Fracción VII del presente escrito, debiendo valorarse conforme al grado de reprochabilidad de la conducta.</p>
                <br>
                <p><strong>XI. LA SOLICITUD DE DECOMISO DE LOS BIENES ASEGURADOS (Fracción XI)</strong></p>
                <p style="text-align:justify; margin-left: 20px;">Esta Fiscalía solicita el decomiso en favor del Estado de todos los bienes, cuentas bancarias e instrumentos relacionados que han sido materia de aseguramiento durante la fase investigativa.</p>
                <br>
                <p><strong>XII. LA PROPUESTA DE ACUERDOS PROBATORIOS (Fracción XII)</strong></p>
                <p style="text-align:justify; margin-left: 20px;">De manera preliminar, esta Representación Social propondrá como acuerdos probatorios la existencia constitutiva de la empresa mencionada y la calidad de servidores públicos de los acusados Roberto "N" y Claudia "N".</p>
                <br>
                <p><strong>XIII. LA SOLICITUD DE QUE SE APLIQUE EL PROCEDIMIENTO ABREVIADO (Fracción XIII)</strong></p>
                <p style="text-align:justify; margin-left: 20px;">Se reserva el derecho de esta Fiscalía para, en el momento procesal oportuno y previo a la emisión del auto de apertura a juicio oral, solicitar o consentir la apertura de un procedimiento abreviado si se cumplen las condiciones legales para ello.</p>
                <br>
                <p>Por lo expuesto y fundado, a Usted C. Juez <strong>ATENTAMENTE PIDO:</strong></p>
                <p><strong>ÚNICO:</strong> Tenerme por presentado formulando acusación formal en contra de los imputados de mérito, cumpliendo con las formalidades del artículo 335 del CNPP, y ordenando que se corra traslado a las partes en términos del 336 del mismo ordenamiento, ordenando fijar fecha para la celebración de la Audiencia Intermedia.</p>
                <p style="text-align:center;"><strong>PROTESTO LO NECESARIO</strong></p>
                <p style="text-align:center;">${d.ciudad}, a ${fechaActual}</p>
                <br><br><br>
                <p style="text-align:center;">__________________________<br><strong>${d.fiscal}</strong><br>AGENTE DEL MINISTERIO PÚBLICO</p>
            `;
    } else if (tipo === 'descubrimiento') {
        contenido = `
                <p style="text-align:right; font-size:10pt;"><strong>CARPETA DE INVESTIGACIÓN:</strong> ${d.carpeta}</p>
                <p style="text-align:right; font-size:10pt;"><strong>CAUSA PENAL:</strong> ${d.causaPenal}</p>
                <p style="text-align:right; font-size:10pt;"><strong>ASUNTO:</strong> CONSTANCIA DE DESCUBRIMIENTO PROBATORIO (ART. 337 CNPP) Y PROPUESTA DE ACUERDOS PROBATORIOS (ART. 345 CNPP).</p>
                <br>
                <p style="text-align:justify; text-indent: 40px;">En la ciudad de <strong>${d.ciudad}</strong>, siendo las <strong>${horaActual}</strong> horas del día <strong>${fechaActual}</strong>, constituidos en las oficinas que ocupa la <strong>${d.unidadInvestigacion}</strong> de la Fiscalía General de Justicia, comparece ante el Licenciado <strong>${d.fiscal}</strong> (Agente del Ministerio Público Titular), el Licenciado <strong>${d.defensor ? d.defensor.nombre : ''}</strong>, en su calidad de Defensor del acusado, con la finalidad de dar estricto cumplimiento al deber de <strong>DESCUBRIMIENTO PROBATORIO</strong> establecido en el artículo 337 del Código Nacional de Procedimientos Penales.</p>
                <br>
                <p style="text-align:justify;">Por medio de la presente, esta Fiscalía acredita la entrega material, fidedigna y completa de los registros de investigación a la Defensa, así como el acceso ininterrumpido a la evidencia resguardada en cadena de custodia, desglosada a continuación:</p>
                <br>
                <p><strong>I. COPIAS DE REGISTROS DE INVESTIGACIÓN (DOCUMENTAL Y TESTIMONIAL)</strong></p>
                <ul style="padding-left: 20px;">
                    <li>Copia íntegra de la Carpeta de Investigación debidamente foliada y sellada.</li>
                    ${testigosDinamicos}
                    ${peritosDinamicos}
                </ul>
                <br>
                <p><strong>II. REGISTROS DIGITALES Y ELECTRÓNICOS</strong></p>
                <ul style="padding-left:20px;">
                    <li>1 Dispositivo USB conteniendo extracciones forenses en video y audio.</li>
                    <li>Copia espejo de los vaciados de CCTV del estacionamiento en formato original (HASH verificado).</li>
                </ul>
                <br>
                <p><strong>III. ACCESO A EVIDENCIA FÍSICA Y MATERIAL (CADENA DE CUSTODIA)</strong></p>
                <p style="text-align:justify;">Se ha facilitado el acceso irrestricto a los objetos asegurados con Registro de Cadena de Custodia (RCC) que obran físicamente en la Bodega de Evidencias de esta Fiscalía.</p>
                <br>
                <p style="text-align:center; background:#e0f2fe; padding:10px; border-radius:6px;"><strong>PROPUESTA DE ACUERDOS PROBATORIOS (Art. 345 CNPP)</strong></p>
                <p style="text-align:justify;">Al margen de la entrega documental referida, esta representación social somete a consideración de esa Defensa la aceptación de los siguientes <strong>ACUERDOS PROBATORIOS</strong>, por tratarse de hechos probados e incontrovertibles, con el afán de depurar el debate en el eventual Juicio Oral:</p>
                <ol style="padding-left:20px;">
                    <li>Se tenga por probada y acreditada la calidad de servidor público de los acusados.</li>
                    <li>Se tenga por probada y acreditada la autenticidad formal de las documentales públicas recabadas en la carpeta.</li>
                </ol>
                <br>
                <p><strong>DECLARACIÓN DE INTEGRIDAD (Art. 216 CNPP)</strong></p>
                <p style="text-align:justify;">El Ministerio Público actúa en estricto apego al principio de lealtad procesal, manifestando no reservarse evidencia o registro alguno de carácter inculpatorio o exculpatorio para los imputados.</p>
                <br>
                <div style="display:flex; justify-content:space-between; margin-top:30px;">
                    <div style="text-align:center; width:45%;">
                        <p><strong>ENTREGA (MINISTERIO PÚBLICO)</strong></p>
                        <br><br>
                        <p>__________________________</p>
                        <p><strong>${d.fiscal}</strong></p>
                        <p>Agente del Ministerio Público Titular</p>
                    </div>
                    <div style="text-align:center; width:45%;">
                        <p><strong>RECIBE DE CONFORMIDAD (DEFENSA)</strong></p>
                        <br><br>
                        <p>__________________________</p>
                        <p><strong>${d.defensor ? d.defensor.nombre : ''}</strong></p>
                        <p>Cédula Profesional: ${d.defensor ? d.defensor.cedula : ''}</p>
                    </div>
                </div>
            `;
    }
    return contenido;
}
window.generarContenidoEscrito = generarContenidoEscrito;
})();