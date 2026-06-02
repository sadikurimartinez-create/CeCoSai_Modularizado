// ============================================
// PLANTILLAS DE ESCRITOS PROCESALES
// ============================================

// Generar contenido del escrito según el tipo
function generarContenidoEscrito(tipo) {
    var d = datosDelSistema;
    var narrativaElem = document.getElementById('narrativa-principal');
    var narrativa = (narrativaElem && narrativaElem.value) ? narrativaElem.value : "Durante el período de marzo 2025 a enero 2026, el Ing. Roberto 'N', el Lic. Marco 'N', la Lic. Claudia 'N' y el Cmdte. Sergio 'N' actuaron de común acuerdo para desviar recursos públicos mediante una licitación simulada para la compra de patrullas y equipo táctico. Utilizaron la empresa fachada 'Logística y Seguridad del Centro' para emitir facturas falsas, entregando mercancía simulada (cajas con papel periódico y piedras). Las ganancias ilícitas fueron distribuidas entre los participantes. La Arq. Elena Santoyo fue amenazada y forzada a abandonar el estado. El periodista Juan Carlos Ruiz fue emboscado y disparado el 20 de enero de 2026, resultando con secuelas permanentes.";
    var fechaActual = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    var horaActual = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    var acreditacion = calcularAcreditacionPorTipo(tipo);
    var contenido = '';
    if (tipo === 'audiencia') {
        contenido = `
            <p style="text-align:center; font-weight:bold; font-size:1.1rem;">FORMATO DE SOLICITUD DE AUDIENCIA INICIAL</p>
            <p style="text-align:center; font-size:0.9rem;">(PARA FORMULAR IMPUTACIÓN Y MEDIDAS CAUTELARES)</p>
            <br>
            <p><strong>CARPETA DE INVESTIGACIÓN:</strong> ${acreditacion >= 80 ? d.carpeta : '<span style="background:#fef3c7; padding:2px 8px; border-radius:4px;">[PENDIENTE - IA sugiere verificar]</span>'}</p>
            <p><strong>ASUNTO:</strong> SE SOLICITA CITACIÓN A AUDIENCIA INICIAL PARA FORMULACIÓN DE IMPUTACIÓN Y DISCUSIÓN DE MEDIDAS CAUTELARES.</p>
            <br>
            <p><strong>C. JUEZ DE CONTROL DEL SISTEMA PENAL ACUSATORIO DEL DISTRITO JUDICIAL DE ${d.ciudad.toUpperCase()}</strong></p>
            <p style="text-align:center;"><strong>P R E S E N T E</strong></p>
            <br>
            <p style="text-align:justify;">El Licenciado <strong>${d.fiscal}</strong>, Agente del Ministerio Público adscrito a la Unidad de Investigación <strong>${d.unidadInvestigacion}</strong>, señalando como domicilio para oír y recibir notificaciones el ubicado en <strong>${d.domicilioFiscalia}</strong>, y con medios electrónicos de contacto <strong>${d.correoFiscalia}</strong>, ante Usted con el debido respeto comparezco y expongo:</p>
            <br>
            <p style="text-align:justify;">Que con fundamento en los artículos <strong>16 y 20 apartado B y C</strong> de la Constitución Política de los Estados Unidos Mexicanos; así como los artículos <strong>127, 131 fracción V y XVIII, 141 fracción I, 309, 310 y 311</strong> del Código Nacional de Procedimientos Penales (CNPP), por medio del presente escrito solicito se fije fecha y hora para la celebración de <strong>AUDIENCIA INICIAL</strong> con la finalidad de <strong>FORMULAR IMPUTACIÓN</strong> en contra de la persona señalada a continuación, y agotar las etapas procesales correspondientes, incluyendo la solicitud de <strong>MEDIDAS CAUTELARES</strong>.</p>
            <br>
            <p><strong>I. DATOS DEL IMPUTADO (Art. 311 Fracc. I CNPP)</strong></p>
            ${d.imputados.map(imp => `
                <div style="background:#f8fafc; padding:10px; margin:8px 0; border-left:4px solid #2563eb;">
                    <p><strong>Nombre:</strong> ${imp.nombre}</p>
                    <p><strong>Domicilio:</strong> ${imp.domicilio}</p>
                    <p><strong>Teléfono/Contacto:</strong> ${imp.telefono}</p>
                </div>
            `).join('')}
            <br>
            <p><strong>II. DATOS DE LA VÍCTIMA U OFENDIDO (Art. 109 CNPP)</strong></p>
            <div style="background:#f8fafc; padding:10px; margin:8px 0; border-left:4px solid #10b981;">
                <p><strong>Nombre:</strong> ${d.victima.nombre}</p>
                <p><strong>Domicilio:</strong> ${d.victima.domicilio}</p>
                <p><strong>Asesor Jurídico:</strong> ${d.victima.asesor}</p>
            </div>
            <br>
            <p><strong>III. HECHOS MATERIA DE LA IMPUTACIÓN (Art. 311 Fracc. II y III CNPP)</strong></p>
            <p style="text-align:justify; background:#f8fafc; padding:12px; border-left:4px solid #6366f1;">"${narrativa}"</p>
            ${acreditacion < 80 ? '<div style="background:#fef3c7; padding:10px; margin:8px 0; border-radius:6px;"><i class="fas fa-robot" style="color:#f59e0b;"></i> <strong>IA:</strong> La narrativa requiere mayor detalle sobre circunstancias de modo, tiempo y lugar. Se sugiere ampliar entrevista a víctima.</div>' : ''}
            <br>
            <p><strong>IV. CLASIFICACIÓN JURÍDICA PRELIMINAR (Art. 141 y 311 Fracc. IV CNPP)</strong></p>
            <p style="text-align:justify;">Los hechos anteriormente narrados se clasifican jurídicamente como el delito de <strong>${d.delitoPrincipal}</strong>, previsto y sancionado en el <strong>${d.articuloDelito}</strong>.</p>
            <p><strong>Forma de intervención:</strong> ${d.imputados[0] && d.imputados[0].grado ? d.imputados[0].grado : ''}</p>
            <p><strong>Grado de ejecución:</strong> CONSUMADO</p>
            <p><strong>Naturaleza:</strong> DOLOSO</p>
            <br>
            <p><strong>V. SOLICITUD DE MEDIDAS CAUTELARES (Art. 153, 154 y 155 CNPP)</strong></p>
            <ul style="padding-left:20px;">
                <li>Presentación periódica ante el Juez (Fracción I, Art. 155 CNPP)</li>
                <li>Prohibición de acercarse a la víctima (Fracción VIII, Art. 155 CNPP)</li>
                <li>Prisión Preventiva Justificada (Fracción XIV, Art. 155 CNPP) - En virtud de riesgo de fuga</li>
            </ul>
            <br>
            <p><strong>VI. SOLICITUD DE VINCULACIÓN A PROCESO (Art. 313 y 316 CNPP)</strong></p>
            <p style="text-align:justify;">Se manifiesta la intención de esta Fiscalía de solicitar la <strong>Vinculación a Proceso</strong> del imputado en la misma audiencia.</p>
            <br>
            <p><strong>PIDO:</strong></p>
            <p><strong>PRIMERO:</strong> Tenerme por presentado en tiempo y forma solicitando audiencia inicial.</p>
            <p><strong>SEGUNDO:</strong> Ordenar la CITACIÓN del imputado en el domicilio señalado.</p>
            <p><strong>TERCERO:</strong> Convocar a la Defensa y a la Víctima/Ofendido para la celebración de la audiencia.</p>
            <br>
            <p style="text-align:center;"><strong>PROTESTO LO NECESARIO</strong></p>
            <p style="text-align:center;">${d.ciudad}, a ${fechaActual}</p>
            <br>
            <p style="text-align:center;">__________________________<br><strong>${d.fiscal}</strong><br>AGENTE DEL MINISTERIO PÚBLICO<br>UNIDAD DE INVESTIGACIÓN ${d.unidadInvestigacion}</p>
        `;
    } else if (tipo === 'acusacion') {
        contenido = `
            <p style="text-align:center; font-weight:bold; font-size:1.1rem;">ESCRITO DE ACUSACIÓN</p>
            <br>
            <p><strong>CARPETA DE INVESTIGACIÓN:</strong> ${d.carpeta}</p>
            <p><strong>CAUSA PENAL:</strong> ${d.causaPenal}</p>
            <p><strong>ASUNTO:</strong> SE FORMULA ACUSACIÓN.</p>
            <br>
            <p><strong>C. JUEZ DE CONTROL DEL SISTEMA PENAL ACUSATORIO DEL DISTRITO JUDICIAL DE ${d.ciudad.toUpperCase()}</strong></p>
            <p style="text-align:center;"><strong>P R E S E N T E</strong></p>
            <br>
            <p style="text-align:justify;">El Licenciado <strong>${d.fiscal}</strong>, Agente del Ministerio Público adscrito a la Unidad de Investigación <strong>${d.unidadInvestigacion}</strong>, comparezco respetuosamente para exponer:</p>
            <br>
            <p style="text-align:justify;">Que con fundamento en el artículo <strong>21</strong> de la Constitución Política de los Estados Unidos Mexicanos y el artículo <strong>335</strong> del Código Nacional de Procedimientos Penales, y habiéndose cerrado la investigación complementaria, por este conducto presento formal <strong>ACUSACIÓN</strong>.</p>
            <br>
            <p><strong>I. INDIVIDUALIZACIÓN DEL ACUSADO Y SU DEFENSOR (Fracción I)</strong></p>
            ${d.imputados.map(imp => `
                <div style="background:#fef2f2; padding:10px; margin:8px 0; border-left:4px solid #ef4444;">
                    <p><strong>Acusado:</strong> ${imp.nombre}</p>
                    <p><strong>Situación:</strong> EN PRISIÓN PREVENTIVA</p>
                </div>
            `).join('')}
            <p><strong>Defensor:</strong> ${d.defensor.nombre}, con domicilio en ${d.defensor.domicilio}</p>
            ${acreditacion < 80 ? '<div style="background:#fef3c7; padding:10px; margin:8px 0; border-radius:6px;"><i class="fas fa-robot" style="color:#f59e0b;"></i> <strong>IA (60%):</strong> Individualización insuficiente. Se sugiere: Ficha signalética actualizada, Constancia de antecedentes penales.</div>' : ''}
            <br>
            <p><strong>II. INDIVIDUALIZACIÓN DE LA VÍCTIMA U OFENDIDO (Fracción II)</strong></p>
            <p><strong>Víctima/Ofendido:</strong> ${d.victima.nombre}</p>
            <p><strong>Asesor Jurídico:</strong> ${d.victima.asesor}</p>
            <br>
            <p><strong>III. RELACIÓN CLARA, PRECISA Y CIRCUNSTANCIADA DE LOS HECHOS (Fracción III)</strong></p>
            <p style="text-align:justify; background:#f8fafc; padding:12px; border-left:4px solid #6366f1;">"${narrativa}"</p>
            <br>
            <p><strong>IV. MODALIDADES DEL DELITO (Fracción IV)</strong></p>
            <p><strong>Tipo de Delito:</strong> ${d.delitoPrincipal}</p>
            <p><strong>Agravantes:</strong> Violencia moral mediante amenazas con arma de fuego</p>
            <br>
            <p><strong>V. AUTORÍA O PARTICIPACIÓN (Fracción V)</strong></p>
            <p>Se atribuye a los acusados la forma de intervención penal como <strong>COAUTORES MATERIALES</strong>, de conformidad con el artículo 13 del Código Penal.</p>
            <br>
            <p><strong>VI. PRECEPTOS LEGALES APLICABLES (Fracción VI)</strong></p>
            <p>La conducta constituye el delito de <strong>${d.delitoPrincipal}</strong>, previsto en el <strong>${d.articuloDelito}</strong>.</p>
            <br>
            <p><strong>VII. MEDIOS DE PRUEBA PARA EL JUICIO (Fracción VII)</strong></p>
            ${acreditacion < 80 ? '<div style="background:#fef3c7; padding:10px; margin:8px 0; border-radius:6px;"><i class="fas fa-robot" style="color:#f59e0b;"></i> <strong>IA (72%):</strong> Medios de prueba incompletos. Faltan: Dictamen balístico, Rueda de personas, Análisis CCTV.</div>' : ''}
            <p><strong>A) PRUEBA TESTIMONIAL:</strong></p>
            <ul style="padding-left:20px;">
                <li>Testimonio de ${d.victima.nombre}: Para acreditar circunstancias de modo, tiempo y lugar</li>
                <li>Testimonio del Policía Aprehensor: Para acreditar circunstancias de la detención</li>
            </ul>
            <p><strong>B) PRUEBA PERICIAL:</strong></p>
            <ul style="padding-left:20px;">
                <li>Dictamen en Criminalística de Campo</li>
                <li>Dictamen Psicológico de la víctima</li>
                <li>Dictamen de Avalúo</li>
            </ul>
            <p><strong>C) PRUEBA DOCUMENTAL:</strong></p>
            <ul style="padding-left:20px;">
                <li>Acta de inspección del lugar de los hechos</li>
                <li>Informe Policial Homologado</li>
            </ul>
            <br>
            <p><strong>VIII. PENA SOLICITADA (Fracción VIII)</strong></p>
            <p><strong>Pena de Prisión:</strong> 8 a 10 años de prisión (tercio medio)</p>
            <p><strong>Multa:</strong> 200 días multa</p>
            <br>
            <p><strong>IX. REPARACIÓN DEL DAÑO (Fracción IX)</strong></p>
            <p>Se solicita condena al pago de <strong>${d.montoAfectacion}</strong> en favor de la víctima.</p>
            <br>
            <p style="text-align:center;"><strong>PROTESTO LO NECESARIO</strong></p>
            <p style="text-align:center;">${d.ciudad}, a ${fechaActual}</p>
            <br>
            <p style="text-align:center;">__________________________<br><strong>${d.fiscal}</strong><br>AGENTE DEL MINISTERIO PÚBLICO</p>
        `;
    } else if (tipo === 'descubrimiento') {
        contenido = `
            <p style="text-align:center; font-weight:bold; font-size:1.1rem;">CONSTANCIA DE DESCUBRIMIENTO PROBATORIO</p>
            <p style="text-align:center; font-size:0.9rem;">(ENTREGA DE COPIAS Y ACCESO A REGISTROS)</p>
            <br>
            <p><strong>CARPETA DE INVESTIGACIÓN:</strong> ${d.carpeta}</p>
            <p><strong>CAUSA PENAL:</strong> ${d.causaPenal}</p>
            <p><strong>ASUNTO:</strong> SE CUMPLE CON EL DESCUBRIMIENTO PROBATORIO (ART. 337 CNPP).</p>
            <br>
            <p style="text-align:justify;">En la ciudad de <strong>${d.ciudad}</strong>, siendo las <strong>${horaActual}</strong> horas del día <strong>${fechaActual}</strong>, constituidos en las oficinas que ocupa la Unidad de Investigación <strong>${d.unidadInvestigacion}</strong> de la Fiscalía General de Justicia, ante la presencia del Licenciado <strong>${d.fiscal}</strong>, Agente del Ministerio Público, comparece el Licenciado <strong>${d.defensor.nombre}</strong>, quien se ostenta como Defensor del acusado <strong>${d.imputados[0] && d.imputados[0].nombre ? d.imputados[0].nombre : ''}</strong>, con la finalidad de dar cumplimiento a lo establecido en el <strong>artículo 337, primer párrafo, del Código Nacional de Procedimientos Penales</strong>.</p>
            <br>
            <p style="text-align:center; background:#e0f2fe; padding:10px; border-radius:6px;"><strong>ACTO DE ENTREGA - RECEPCIÓN</strong></p>
            <br>
            <p style="text-align:justify;">Por medio del presente acto, esta Fiscalía realiza el <strong>DESCUBRIMIENTO PROBATORIO</strong> a favor de la defensa, consistente en la entrega material y digital de los registros de investigación, así como el acceso a las evidencias materiales, bajo el siguiente inventario:</p>
            <br>
            <p><strong>I. COPIAS DE REGISTROS DE INVESTIGACIÓN (DOCUMENTAL)</strong></p>
            <div style="background:#f8fafc; padding:10px; margin:8px 0; border-left:4px solid #2563eb;">
                <p>Se hace entrega de <strong>245</strong> fojas útiles (copias certificadas), que comprenden la totalidad de las actuaciones contenidas en la Carpeta de Investigación.</p>
                <p><strong>Contenido:</strong> Desde la noticia criminal (IPH) hasta el acuerdo de cierre de investigación.</p>
                <p><strong>Incluye:</strong> Dictámenes periciales, entrevistas de testigos, actas de inspección y documentos diversos.</p>
            </div>
            <br>
            <p><strong>II. REGISTROS DIGITALES Y ELECTRÓNICOS</strong></p>
            <div style="background:#f8fafc; padding:10px; margin:8px 0; border-left:4px solid #10b981;">
                <p>Se hace entrega de <strong>2</strong> dispositivos de almacenamiento (USB), conteniendo:</p>
                <ul style="padding-left:20px;">
                    <li><strong>Videos:</strong> Grabaciones de cámaras de videovigilancia del C5, correspondientes al día de los hechos.</li>
                    <li><strong>Audios:</strong> Entrevistas grabadas.</li>
                    <li><strong>Fotografías:</strong> Fijación fotográfica del lugar de los hechos y criminalística de campo.</li>
                </ul>
            </div>
            <br>
            <p><strong>III. ACCESO A EVIDENCIA FÍSICA Y MATERIAL (CADENA DE CUSTODIA)</strong></p>
            <div style="background:#f8fafc; padding:10px; margin:8px 0; border-left:4px solid #f59e0b;">
                <p>Los objetos e instrumentos del delito se encuentran resguardados en la <strong>Bodega de Evidencias</strong> ubicada en Av. Aguascalientes Sur #500:</p>
                <ul style="padding-left:20px;">
                    <li><strong>Indicio 1:</strong> Expediente completo de licitación simulada (140 fojas), Folio CC: AGS-2025-CV-001</li>
                    <li><strong>Indicio 2:</strong> Facturas falsas de "Logística y Seguridad del Centro" (23 documentos), Folio CC: AGS-2025-CV-002</li>
                    <li><strong>Indicio 3:</strong> Proyectiles extraídos (atentado periodista), Folio CC: AGS-2025-CV-003</li>
                    <li><strong>Indicio 4:</strong> Dispositivos móviles asegurados (4 celulares), Folio CC: AGS-2025-CV-004</li>
                    <li><strong>Indicio 5:</strong> Registros contables dobles, Folio CC: AGS-2025-CV-005</li>
                    <li><strong>Indicio 6:</strong> Grabaciones CCTV estacionamiento, Folio CC: AGS-2025-CV-006</li>
                </ul>
            </div>
            ${acreditacion < 80 ? '<div style="background:#fef3c7; padding:10px; margin:8px 0; border-radius:6px;"><i class="fas fa-robot" style="color:#f59e0b;"></i> <strong>IA:</strong> Se detecta que el Indicio 3 (proyectiles) requiere dictamen balístico completo para vincular con el atentado. Se sugiere ampliar peritaje.</div>' : ''}
            <br>
            <p><strong>IV. DECLARACIÓN DE INTEGRIDAD</strong></p>
            <p style="text-align:justify; background:#ecfdf5; padding:12px; border-left:4px solid #10b981;">El Ministerio Público manifiesta bajo el principio de lealtad y buena fe (Art. 216 CNPP) que la información entregada corresponde a <strong>la totalidad</strong> de los registros con los que cuenta esta representación social, no reservándose dato de prueba alguno, incluyendo aquellos que pudieran resultar favorables a la defensa o exculpatorios.</p>
            <br>
            <p style="text-align:center; background:#e0f2fe; padding:10px; border-radius:6px;"><strong>CIERRE DE LA CONSTANCIA</strong></p>
            <p style="text-align:justify;">No habiendo otro asunto que tratar, se levanta la presente constancia, firmando al calce y al margen los que en ella intervinieron, sirviendo la presente como <strong>ACUSE DE RECIBO</strong>.</p>
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
                    <p><strong>${d.defensor.nombre}</strong></p>
                    <p>Cédula Profesional: ${d.defensor.cedula}</p>
                </div>
            </div>
        `;
    }
    return contenido;
}
window.generarContenidoEscrito = generarContenidoEscrito;