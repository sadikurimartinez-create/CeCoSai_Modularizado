        // ESCALERA HEPTATÓMICA - Lógica de Habilitación
        // =============================================
        
        const elementos = ['conducta', 'tipicidad', 'antijuridicidad', 'imputabilidad', 'culpabilidad', 'punibilidad'];
        let currentStep = 0;
        
        const causasExcluyentes = {
            'vis-absoluta': { nombre: 'Vis Absoluta (Fuerza física irresistible)', consecuencia: 'La conducta no es voluntaria. No existe delito por ausencia del primer elemento.' },
            'vis-maior': { nombre: 'Vis Maior (Fuerza mayor)', consecuencia: 'La conducta fue producto de una fuerza externa irresistible. Se excluye la responsabilidad penal.' },
            'hipnotismo': { nombre: 'Hipnotismo / Sonambulismo', consecuencia: 'El sujeto actuó sin voluntad consciente. No hay conducta penalmente relevante.' },
            'reflejos': { nombre: 'Actos Reflejos', consecuencia: 'Movimiento involuntario sin control de la voluntad. Se excluye la conducta.' },
            'ausencia-elementos': { nombre: 'Ausencia de elementos del tipo', consecuencia: 'La conducta no encuadra en el tipo penal. Procede el sobreseimiento.' },
            'error-tipo': { nombre: 'Error de Tipo', consecuencia: 'El sujeto desconocía un elemento esencial del tipo. Puede excluir el dolo.' },
            'consentimiento': { nombre: 'Consentimiento del titular', consecuencia: 'El titular del bien jurídico consintió la afectación. Excluye la tipicidad en bienes disponibles.' },
            'legitima-defensa': { nombre: 'Legítima Defensa', consecuencia: 'La conducta fue en defensa propia o de terceros. La acción está justificada (Art. 15 Fr. IV CNPP).' },
            'estado-necesidad': { nombre: 'Estado de Necesidad Justificante', consecuencia: 'Se sacrificó un bien jurídico menor para salvar uno mayor. Conducta justificada.' },
            'cumplimiento-deber': { nombre: 'Cumplimiento de un Deber', consecuencia: 'La conducta fue en cumplimiento de un deber legal. Está justificada.' },
            'ejercicio-derecho': { nombre: 'Ejercicio de un Derecho', consecuencia: 'La conducta fue ejercicio legítimo de un derecho. Está justificada.' },
            'consentimiento-just': { nombre: 'Consentimiento Justificante', consecuencia: 'Consentimiento válido sobre bienes jurídicos disponibles.' },
            'trastorno-permanente': { nombre: 'Trastorno Mental Permanente', consecuencia: 'El sujeto es inimputable. Procede medida de seguridad, no pena.' },
            'trastorno-transitorio': { nombre: 'Trastorno Mental Transitorio', consecuencia: 'Inimputabilidad temporal. Se analiza si fue provocado por el sujeto.' },
            'desarrollo-retardado': { nombre: 'Desarrollo Intelectual Retardado', consecuencia: 'Incapacidad de comprensión. Procede medida de seguridad.' },
            'miedo-grave': { nombre: 'Miedo Grave', consecuencia: 'El sujeto actuó bajo miedo grave fundado. Puede excluir imputabilidad.' },
            'error-prohibicion-inv': { nombre: 'Error de Prohibición Invencible', consecuencia: 'El sujeto desconocía invenciblemente la ilicitud. Excluye culpabilidad.' },
            'error-prohibicion-ven': { nombre: 'Error de Prohibición Vencible', consecuencia: 'Error superable. Atenúa la pena pero no excluye responsabilidad.' },
            'inexigibilidad': { nombre: 'Inexigibilidad de otra conducta', consecuencia: 'No era exigible al sujeto actuar de otra manera. Excluye reproche.' },
            'estado-necesidad-disc': { nombre: 'Estado de Necesidad Disculpante', consecuencia: 'Bienes de igual valor en conflicto. Disculpa la conducta.' },
            'excusa-parentesco': { nombre: 'Excusa por parentesco', consecuencia: 'Relación de parentesco excluye la punibilidad en delitos patrimoniales sin violencia.' },
            'excusa-encubrimiento': { nombre: 'Encubrimiento entre parientes', consecuencia: 'No se sanciona el encubrimiento entre ciertos familiares.' },
            'excusa-especifica': { nombre: 'Excusa absolutoria específica', consecuencia: 'Causal específica del tipo penal que excluye la pena.' }
        };

        // Núcleo lógico ligero para la Escalera Heptatómica (sin afectar la UI existente)
        const SAIEngine = {
            escalera: {
                casoId: null,
                csdId: null,
                delito: null,
                estado: {
                    conducta: 'pendiente',
                    tipicidad: 'pendiente',
                    antijuridicidad: 'pendiente',
                    imputabilidad: 'pendiente',
                    culpabilidad: 'pendiente',
                    punibilidad: 'pendiente'
                },
                acreditacion: {
                    conducta: null,
                    tipicidad: null,
                    antijuridicidad: null,
                    imputabilidad: null,
                    culpabilidad: null,
                    punibilidad: null
                },
                log: [],
                init(casoId, csdId, delito, acreditacionInicial) {
                    this.casoId = casoId || null;
                    this.csdId = csdId || null;
                    this.delito = delito || null;
                    if (acreditacionInicial) {
                        this.acreditacion = { ...this.acreditacion, ...acreditacionInicial };
                    }
                    // Sincronizar estado lógico con el estado global existente
                    this.estado = {
                        conducta: 'pendiente',
                        tipicidad: 'pendiente',
                        antijuridicidad: 'pendiente',
                        imputabilidad: 'pendiente',
                        culpabilidad: 'pendiente',
                        punibilidad: 'pendiente'
                    };
                    if (typeof estadoEscalera !== 'undefined') {
                        Object.keys(this.estado).forEach(k => {
                            if (estadoEscalera[k]) this.estado[k] = estadoEscalera[k];
                        });
                    }
                },
                getAcreditacion(paso, fallback) {
                    const valor = this.acreditacion && typeof this.acreditacion[paso] === 'number'
                        ? this.acreditacion[paso]
                        : null;
                    if (valor !== null && !isNaN(valor)) return valor;
                    return typeof fallback === 'number' ? fallback : 0;
                },
                aplicarDelta(paso, delta) {
                    const base = this.getAcreditacion(paso, 0);
                    const nuevo = Math.max(0, Math.min(100, base + (delta || 0)));
                    if (this.acreditacion && paso in this.acreditacion) {
                        this.acreditacion[paso] = nuevo;
                    }
                    this.log.push({
                        type: 'acreditacion',
                        paso,
                        delta: delta || 0,
                        from: base,
                        to: nuevo,
                        casoId: this.casoId,
                        csdId: this.csdId,
                        delito: this.delito,
                        timestamp: new Date().toISOString()
                    });
                    this.renderLog();
                    return nuevo;
                },
                registrarDecisionPaso(paso, decision) {
                    this.log.push({
                        type: 'decision',
                        paso,
                        decision,
                        casoId: this.casoId,
                        csdId: this.csdId,
                        delito: this.delito,
                        timestamp: new Date().toISOString()
                    });
                    this.renderLog();
                },
                registrarSugerencias(paso, sugerencias) {
                    this.log.push({
                        type: 'sugerencias',
                        paso,
                        sugerencias,
                        casoId: this.casoId,
                        csdId: this.csdId,
                        delito: this.delito,
                        timestamp: new Date().toISOString()
                    });
                    this.renderLog();
                },
                renderLog() {
                    const tbody = document.getElementById('escalera-log-body');
                    const container = document.getElementById('escalera-log-container');
                    if (!tbody || !container) return;
                    
                    if (!this.log.length) {
                        container.style.display = 'none';
                        return;
                    }
                    
                    container.style.display = 'block';
                    const rows = this.log.slice().reverse().map(entry => {
                        const fecha = entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '';
                        let detalle = '';
                        if (entry.type === 'decision') {
                            detalle = entry.decision && entry.decision.valor
                                ? `Decisión: ${entry.decision.valor}`
                                : 'Decisión registrada';
                        } else if (entry.type === 'sugerencias') {
                            const lista = (entry.sugerencias || []).join(', ');
                            detalle = lista ? `Sugerencias aceptadas: ${lista}` : 'Sugerencias registradas';
                        } else if (entry.type === 'acreditacion') {
                            detalle = `Acreditación ${entry.from}% → ${entry.to}% (Δ ${entry.delta}%)`;
                        }
                        return `
                            <tr>
                                <td>${fecha}</td>
                                <td>${entry.paso || ''}</td>
                                <td>${entry.type}</td>
                                <td>${detalle}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows.join('');
                }
            },
            picMatriz: {
                log: [],
                registrarEvento(tipo, datos) {
                    this.log.push({
                        type: tipo,
                        data: datos || {},
                        casoId: currentCase && currentCase.id ? currentCase.id : null,
                        timestamp: new Date().toISOString()
                    });
                }
            },
            mic: {
                log: [],
                registrarEvento(tipo, datos) {
                    this.log.push({
                        type: tipo,
                        data: datos || {},
                        casoId: currentCase && currentCase.id ? currentCase.id : null,
                        timestamp: new Date().toISOString()
                    });
                }
            },
            mmi: {
                log: [],
                registrarEvento(tipo, datos) {
                    this.log.push({
                        type: tipo,
                        data: datos || {},
                        casoId: currentCase && currentCase.id ? currentCase.id : null,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        };

        function initEscalera() {
            const selector = document.getElementById('csd-selector');
            const container = document.getElementById('escalera-container');
            
            if (selector.value) {
                container.style.display = 'block';
                resetEscalera();
                // Cargar datos específicos del CSD y actualizar sugerencias IA
                cargarDatosCSDEnEscalera(selector.value);
                // Habilitar primer elemento
                document.getElementById('row-conducta').classList.remove('disabled-row');
                document.getElementById('row-conducta').classList.add('active-row');
            } else {
                container.style.display = 'none';
            }
        }

        // =============================================
        // DATOS DE DELITOS Y CLASIFICACIÓN PORTE PETIT
        // =============================================
        const datosDelitosPorte = {
            'Peculado': {
                articulo: 'Art. 223 CPF',
                resultado: { tipo: 'Material', descripcion: 'Requiere apropiación efectiva de recursos' },
                dano: { tipo: 'Lesión', descripcion: 'Afectación patrimonial al Estado' },
                duracion: { tipo: 'Instantáneo', descripcion: 'Se consuma al momento de la apropiación' },
                culpabilidad: { tipo: 'Doloso', descripcion: 'Requiere intención de apropiarse' },
                estructura: { tipo: 'Complejo', descripcion: 'Múltiples elementos del tipo' },
                actos: { tipo: 'Plurisubsistente', descripcion: 'Requiere varios actos' },
                sujetos: { tipo: 'Unisubjetivo', descripcion: 'Puede cometerse por un sujeto' },
                persecucion: { tipo: 'Oficio', descripcion: 'Perseguible de oficio' },
                bienJuridico: 'Patrimonio del Estado + Administración Pública',
                pena: { minimo: 2, maximo: 14, unidad: 'años' },
                multa: { minimo: 100, maximo: 300, tipo: 'UMA' },
                elementos: {
                    objetivo: 'Disposición indebida de recursos públicos para beneficio propio o de terceros',
                    subjetivo: 'Dolo directo - ánimo de apropiación',
                    normativo: 'Calidad de servidor público con funciones de administración',
                    calificativa: 'Monto superior o asociación delictuosa'
                }
            },
            'Fraude': {
                articulo: 'Art. 386 CPF',
                resultado: { tipo: 'Material', descripcion: 'Requiere obtención de cosa, lucro o beneficio' },
                dano: { tipo: 'Lesión', descripcion: 'Perjuicio patrimonial' },
                duracion: { tipo: 'Instantáneo', descripcion: 'Se consuma al obtener el lucro' },
                culpabilidad: { tipo: 'Doloso', descripcion: 'Engaño intencional' },
                estructura: { tipo: 'Complejo', descripcion: 'Engaño + error + disposición' },
                actos: { tipo: 'Plurisubsistente', descripcion: 'Serie de actos engañosos' },
                sujetos: { tipo: 'Plurisubjetivo', descripcion: 'Puede requerir varios participantes' },
                persecucion: { tipo: 'Querella', descripcion: 'Perseguible por querella (excepto erario)' },
                bienJuridico: 'Patrimonio + Fe Pública',
                pena: { minimo: 3, maximo: 12, unidad: 'años' },
                multa: { minimo: 100, maximo: 400, tipo: 'veces lo defraudado' },
                elementos: {
                    objetivo: 'Obtención de cosa, lucro o beneficio indebido mediante engaño',
                    subjetivo: 'Dolo directo - intención de defraudar',
                    normativo: 'Uso de artificio o error para obtener consentimiento',
                    calificativa: 'Calidad del sujeto o cuantía'
                }
            },
            'Falsificación de Documentos': {
                articulo: 'Art. 243 CPF',
                resultado: { tipo: 'Formal', descripcion: 'Se consuma con la alteración' },
                dano: { tipo: 'Peligro', descripcion: 'Pone en riesgo la fe pública' },
                duracion: { tipo: 'Instantáneo', descripcion: 'Se consuma al falsificar' },
                culpabilidad: { tipo: 'Doloso', descripcion: 'Intención de alterar' },
                estructura: { tipo: 'Simple', descripcion: 'Un solo verbo rector' },
                actos: { tipo: 'Unisubsistente', descripcion: 'Un solo acto puede consumarlo' },
                sujetos: { tipo: 'Unisubjetivo', descripcion: 'Cualquier persona' },
                persecucion: { tipo: 'Oficio', descripcion: 'Perseguible de oficio' },
                bienJuridico: 'Fe Pública',
                pena: { minimo: 4, maximo: 8, unidad: 'años' },
                multa: { minimo: 200, maximo: 360, tipo: 'días multa' },
                elementos: {
                    objetivo: 'Crear documento falso o alterar uno verdadero',
                    subjetivo: 'Dolo - conocimiento de la falsedad',
                    normativo: 'Documento público o privado con efectos jurídicos',
                    calificativa: 'Carácter del documento alterado'
                }
            },
            'Cohecho': {
                articulo: 'Art. 222 CPF',
                resultado: { tipo: 'Formal', descripcion: 'Se consuma con la solicitud o aceptación' },
                dano: { tipo: 'Peligro', descripcion: 'Pone en riesgo la función pública' },
                duracion: { tipo: 'Instantáneo', descripcion: 'Se consuma al momento del acuerdo' },
                culpabilidad: { tipo: 'Doloso', descripcion: 'Acuerdo voluntario' },
                estructura: { tipo: 'Simple', descripcion: 'Solicitar o aceptar dádiva' },
                actos: { tipo: 'Unisubsistente', descripcion: 'Un acto lo consuma' },
                sujetos: { tipo: 'Unisubjetivo', descripcion: 'Servidor público' },
                persecucion: { tipo: 'Oficio', descripcion: 'Perseguible de oficio' },
                bienJuridico: 'Administración Pública + Función Pública',
                pena: { minimo: 3, maximo: 8, unidad: 'años' },
                multa: { minimo: 30, maximo: 300, tipo: 'veces el beneficio' },
                elementos: {
                    objetivo: 'Solicitar o recibir dádiva para hacer u omitir acto',
                    subjetivo: 'Dolo - voluntad de corromper la función',
                    normativo: 'Calidad de servidor público',
                    calificativa: 'Cuantía del beneficio o acto omitido'
                }
            },
            'Abuso de Autoridad': {
                articulo: 'Art. 215 CPF',
                resultado: { tipo: 'Formal', descripcion: 'Se consuma con el acto abusivo' },
                dano: { tipo: 'Lesión', descripcion: 'Afectación a derechos de terceros' },
                duracion: { tipo: 'Instantáneo', descripcion: 'Se consuma al realizar el acto' },
                culpabilidad: { tipo: 'Doloso', descripcion: 'Intención de excederse' },
                estructura: { tipo: 'Simple', descripcion: 'Exceso en funciones' },
                actos: { tipo: 'Unisubsistente', descripcion: 'Un acto puede consumarlo' },
                sujetos: { tipo: 'Unisubjetivo', descripcion: 'Servidor público' },
                persecucion: { tipo: 'Oficio', descripcion: 'Perseguible de oficio' },
                bienJuridico: 'Administración Pública + Derechos individuales',
                pena: { minimo: 1, maximo: 8, unidad: 'años' },
                multa: { minimo: 50, maximo: 300, tipo: 'días multa' },
                elementos: {
                    objetivo: 'Realizar actos que excedan las facultades legales',
                    subjetivo: 'Dolo - conocimiento del exceso',
                    normativo: 'Calidad de servidor público',
                    calificativa: 'Gravedad del abuso'
                }
            },
            'Amenazas': {
                articulo: 'Art. 282 CPF',
                resultado: { tipo: 'Formal', descripcion: 'Se consuma con la amenaza' },
                dano: { tipo: 'Peligro', descripcion: 'Pone en riesgo la seguridad' },
                duracion: { tipo: 'Instantáneo', descripcion: 'Se consuma al proferir' },
                culpabilidad: { tipo: 'Doloso', descripcion: 'Intención de intimidar' },
                estructura: { tipo: 'Simple', descripcion: 'Amenaza de causar mal' },
                actos: { tipo: 'Unisubsistente', descripcion: 'Una amenaza lo consuma' },
                sujetos: { tipo: 'Unisubjetivo', descripcion: 'Cualquier persona' },
                persecucion: { tipo: 'Querella', descripcion: 'Perseguible por querella' },
                bienJuridico: 'Seguridad Personal + Libertad',
                pena: { minimo: 0.25, maximo: 2, unidad: 'años' },
                multa: { minimo: 10, maximo: 100, tipo: 'días multa' },
                elementos: {
                    objetivo: 'Amenazar con causar un mal a persona o bienes',
                    subjetivo: 'Dolo - intención de causar temor',
                    normativo: 'Mal futuro determinable',
                    calificativa: 'Forma de comisión o sujeto amenazado'
                }
            },
            'Tentativa de Homicidio': {
                articulo: 'Arts. 302 y 63 CPF',
                resultado: { tipo: 'Material (no consumado)', descripcion: 'No se produce la muerte' },
                dano: { tipo: 'Peligro', descripcion: 'Pone en riesgo la vida' },
                duracion: { tipo: 'Instantáneo', descripcion: 'Actos ejecutivos' },
                culpabilidad: { tipo: 'Doloso', descripcion: 'Intención de matar' },
                estructura: { tipo: 'Complejo', descripcion: 'Actos ejecutivos sin resultado' },
                actos: { tipo: 'Plurisubsistente', descripcion: 'Serie de actos ejecutivos' },
                sujetos: { tipo: 'Unisubjetivo', descripcion: 'Cualquier persona' },
                persecucion: { tipo: 'Oficio', descripcion: 'Perseguible de oficio' },
                bienJuridico: 'Vida',
                pena: { minimo: 12, maximo: 25, unidad: 'años (reducida por tentativa)' },
                multa: { minimo: 0, maximo: 0, tipo: 'No aplica' },
                elementos: {
                    objetivo: 'Actos ejecutivos idóneos para privar de la vida',
                    subjetivo: 'Dolo directo - animus necandi',
                    normativo: 'Idoneidad de los medios empleados',
                    calificativa: 'Premeditación, alevosía, ventaja'
                }
            },
            'Asociación Delictuosa': {
                articulo: 'Art. 164 CPF',
                resultado: { tipo: 'Formal', descripcion: 'Se consuma con la organización' },
                dano: { tipo: 'Peligro', descripcion: 'Amenaza a la seguridad pública' },
                duracion: { tipo: 'Permanente', descripcion: 'Mientras exista la organización' },
                culpabilidad: { tipo: 'Doloso', descripcion: 'Acuerdo voluntario' },
                estructura: { tipo: 'Complejo', descripcion: 'Organización + fines delictivos' },
                actos: { tipo: 'Plurisubsistente', descripcion: 'Pluralidad de actos' },
                sujetos: { tipo: 'Plurisubjetivo', descripcion: 'Mínimo 3 personas' },
                persecucion: { tipo: 'Oficio', descripcion: 'Perseguible de oficio' },
                bienJuridico: 'Seguridad Pública',
                pena: { minimo: 5, maximo: 10, unidad: 'años' },
                multa: { minimo: 100, maximo: 300, tipo: 'días multa' },
                elementos: {
                    objetivo: 'Formar parte de organización para delinquir',
                    subjetivo: 'Dolo - conocimiento de fines ilícitos',
                    normativo: 'Estructura organizacional',
                    calificativa: 'Rol dentro de la organización'
                }
            }
        };

        // Datos de CSD con información de edad y delitos múltiples
        const datosCSDCompletos = {
            'csd-01': {
                id: 'CSD-01',
                sujeto: 'Ingeniero Roberto "N"',
                fechaNacimiento: '1975-03-15',
                edadHechos: 48,
                delitos: ['Peculado', 'Fraude', 'Asociación Delictuosa'],
                delitoActual: 'Peculado',
                grado: 'Autor Intelectual',
                acreditacion: { conducta: 92, tipicidad: 95, antijuridicidad: 90, culpabilidad: 88, punibilidad: 85 }
            },
            'csd-02': {
                id: 'CSD-02',
                sujeto: 'Ingeniero Roberto "N"',
                fechaNacimiento: '1975-03-15',
                edadHechos: 48,
                delitos: ['Fraude'],
                delitoActual: 'Fraude',
                grado: 'Autor Intelectual',
                acreditacion: { conducta: 88, tipicidad: 90, antijuridicidad: 85, culpabilidad: 82, punibilidad: 80 }
            },
            'csd-03': {
                id: 'CSD-03',
                sujeto: 'Licenciado Marco "N"',
                fechaNacimiento: '1980-07-22',
                edadHechos: 43,
                delitos: ['Fraude', 'Falsificación de Documentos', 'Amenazas'],
                delitoActual: 'Fraude',
                grado: 'Coautor',
                acreditacion: { conducta: 85, tipicidad: 82, antijuridicidad: 78, culpabilidad: 75, punibilidad: 72 }
            },
            'csd-04': {
                id: 'CSD-04',
                sujeto: 'Licenciado Marco "N"',
                fechaNacimiento: '1980-07-22',
                edadHechos: 43,
                delitos: ['Falsificación de Documentos'],
                delitoActual: 'Falsificación de Documentos',
                grado: 'Autor Material',
                acreditacion: { conducta: 90, tipicidad: 88, antijuridicidad: 85, culpabilidad: 80, punibilidad: 78 }
            },
            'csd-05': {
                id: 'CSD-05',
                sujeto: 'Licenciada Claudia "N"',
                fechaNacimiento: '1978-11-10',
                edadHechos: 45,
                delitos: ['Peculado', 'Cohecho', 'Amenazas'],
                delitoActual: 'Peculado',
                grado: 'Coautor',
                acreditacion: { conducta: 82, tipicidad: 78, antijuridicidad: 75, culpabilidad: 70, punibilidad: 68 }
            },
            'csd-06': {
                id: 'CSD-06',
                sujeto: 'Licenciada Claudia "N"',
                fechaNacimiento: '1978-11-10',
                edadHechos: 45,
                delitos: ['Cohecho'],
                delitoActual: 'Cohecho',
                grado: 'Autor Material',
                acreditacion: { conducta: 88, tipicidad: 85, antijuridicidad: 82, culpabilidad: 78, punibilidad: 75 }
            },
            'csd-07': {
                id: 'CSD-07',
                sujeto: 'Comandante Sergio "N"',
                fechaNacimiento: '1970-05-08',
                edadHechos: 53,
                delitos: ['Abuso de Autoridad', 'Amenazas', 'Tentativa de Homicidio'],
                delitoActual: 'Abuso de Autoridad',
                grado: 'Autor Material',
                acreditacion: { conducta: 78, tipicidad: 75, antijuridicidad: 72, culpabilidad: 68, punibilidad: 65 }
            },
            'csd-08': {
                id: 'CSD-08',
                sujeto: 'Comandante Sergio "N"',
                fechaNacimiento: '1970-05-08',
                edadHechos: 53,
                delitos: ['Tentativa de Homicidio'],
                delitoActual: 'Tentativa de Homicidio',
                grado: 'Coautor',
                acreditacion: { conducta: 72, tipicidad: 70, antijuridicidad: 68, culpabilidad: 65, punibilidad: 62 }
            }
        };

        // Caso SAI en memoria (estructura base para integrar módulos)
        let currentCase = {
            id: null,
            carpeta: null,
            csdId: null,
            delito: null,
            escalera: {
                estado: {
                    conducta: 'pendiente',
                    tipicidad: 'pendiente',
                    antijuridicidad: 'pendiente',
                    imputabilidad: 'pendiente',
                    culpabilidad: 'pendiente',
                    punibilidad: 'pendiente'
                },
                acreditacion: {
                    conducta: null,
                    tipicidad: null,
                    antijuridicidad: null,
                    imputabilidad: null,
                    culpabilidad: null,
                    punibilidad: null
                }
            },
            matrizIntegracion: {
                filasTotales: 0,
                filasValidadas: 0,
                filasRuido: 0,
                ultimaActualizacion: null
            },
            mic: {
                nodos: 0,
                conexiones: 0,
                acreditacionGlobal: null,
                ultimaActualizacion: null
            },
            mmi: {
                preguntasGeneradas: 0,
                preguntasRespondidas: 0,
                preguntasSinContestar: 0,
                ultimaActualizacion: null
            }
        };

        // =============================================
        // FUNCIONES DE SELECCIÓN CSD Y DELITO
        // =============================================
        function seleccionarCSDEscalera() {
            const selector = document.getElementById('csd-selector');
            const selectorDelito = document.getElementById('selector-delito-container');
            const panelInfo = document.getElementById('panel-info-csd-escalera');
            const container = document.getElementById('escalera-container');

            if (!selector.value) {
                selectorDelito.style.display = 'none';
                panelInfo.style.display = 'none';
                container.style.display = 'none';
                return;
            }

            csdSeleccionado = datosCSDCompletos[selector.value];
            // Actualizar Caso SAI en memoria
            currentCase.id = currentCase.id || ('CASO-' + selector.value);
            currentCase.csdId = csdSeleccionado.id;
            
            // Verificar si tiene múltiples delitos
            if (csdSeleccionado.delitos.length > 1) {
                selectorDelito.style.display = 'block';
                poblarSelectorDelitos(csdSeleccionado.delitos);
                panelInfo.style.display = 'none';
                container.style.display = 'none';
            } else {
                selectorDelito.style.display = 'none';
                delitoSeleccionado = csdSeleccionado.delitos[0];
                iniciarAnalisisEscalera();
            }
        }

        function poblarSelectorDelitos(delitos) {
            const selectorDelito = document.getElementById('delito-selector');
            selectorDelito.innerHTML = '<option value="">Seleccione el delito...</option>';
            
            delitos.forEach(delito => {
                const datos = datosDelitosPorte[delito];
                const option = document.createElement('option');
                option.value = delito;
                option.textContent = `${delito} (${datos ? datos.articulo : 'S/A'})`;
                selectorDelito.appendChild(option);
            });
        }

        function seleccionarDelitoEscalera() {
            const selectorDelito = document.getElementById('delito-selector');
            
            if (!selectorDelito.value) return;
            
            delitoSeleccionado = selectorDelito.value;
            currentCase.delito = delitoSeleccionado;
            iniciarAnalisisEscalera();
        }

        function iniciarAnalisisEscalera() {
            const panelInfo = document.getElementById('panel-info-csd-escalera');
            const container = document.getElementById('escalera-container');
            
            // Inicializar núcleo lógico de Escalera para este CSD/delito
            if (typeof SAIEngine !== 'undefined' && SAIEngine.escalera) {
                SAIEngine.escalera.init(
                    currentCase.id || null,
                    csdSeleccionado && csdSeleccionado.id ? csdSeleccionado.id : null,
                    delitoSeleccionado || null,
                    csdSeleccionado && csdSeleccionado.acreditacion ? csdSeleccionado.acreditacion : null
                );
                // Sincronizar acreditación en currentCase
                if (currentCase.escalera && currentCase.escalera.acreditacion) {
                    currentCase.escalera.acreditacion = {
                        ...currentCase.escalera.acreditacion,
                        ...csdSeleccionado.acreditacion
                    };
                }
            }
            
            // Mostrar panel de información
            panelInfo.style.display = 'block';
            actualizarPanelInfoCSD();
            
            // Mostrar escalera
            container.style.display = 'block';
            resetEscaleraCompleta();
            
            // Cargar datos en cada elemento
            cargarDatosConducta();
            cargarDatosTipicidad();
            cargarDatosAntijuridicidad();
            cargarDatosImputabilidad();
            cargarDatosCulpabilidad();
            cargarDatosPunibilidad();
            
            // Habilitar primer elemento
            document.getElementById('row-conducta').classList.remove('disabled-row');
            document.getElementById('row-conducta').classList.add('active-row');
        }

        function actualizarPanelInfoCSD() {
            const contenido = document.getElementById('info-csd-escalera-content');
            const datosDelito = datosDelitosPorte[delitoSeleccionado];
            
            contenido.innerHTML = `
                <div class="grid-2" style="gap: 16px;">
                    <div>
                        <p><strong><i class="fas fa-user"></i> Sujeto Activo:</strong> ${csdSeleccionado.sujeto}</p>
                        <p style="margin-top: 6px;"><strong><i class="fas fa-gavel"></i> Delito:</strong> ${delitoSeleccionado} (${datosDelito ? datosDelito.articulo : 'S/A'})</p>
                        <p style="margin-top: 6px;"><strong><i class="fas fa-users"></i> Grado de Participación:</strong> ${csdSeleccionado.grado}</p>
                    </div>
                    <div>
                        <p><strong><i class="fas fa-calendar"></i> Fecha de Nacimiento:</strong> ${csdSeleccionado.fechaNacimiento}</p>
                        <p style="margin-top: 6px;"><strong><i class="fas fa-clock"></i> Edad al Momento de los Hechos:</strong> ${csdSeleccionado.edadHechos} años</p>
                        <p style="margin-top: 6px;"><strong><i class="fas fa-balance-scale"></i> Bien Jurídico:</strong> ${datosDelito ? datosDelito.bienJuridico : 'Pendiente'}</p>
                    </div>
                </div>
            `;
        }

        // =============================================
        // FUNCIONES DE CONDUCTA
        // =============================================
        function cargarDatosConducta() {
            const datosDelito = datosDelitosPorte[delitoSeleccionado];
            const base = csdSeleccionado.acreditacion.conducta;
            const acreditacion = (typeof SAIEngine !== 'undefined' && SAIEngine.escalera)
                ? SAIEngine.escalera.getAcreditacion('conducta', base)
                : base;
            
            document.getElementById('conducta-delito-actual').textContent = delitoSeleccionado;
            document.getElementById('conducta-tipo-ia').textContent = datosDelito ? datosDelito.culpabilidad.tipo : 'Pendiente';
            document.getElementById('conducta-tipo-ia').className = 'badge-status badge-info';
            
            actualizarAcreditacionElemento('conducta', acreditacion);
            
            // Mostrar sugerencias si acreditación < 80%
            if (acreditacion < 80) {
                mostrarSugerenciasConducta();
            }
            
            // Análisis de ausencia de conducta
            document.getElementById('ausencia-conducta-ia-resultado').innerHTML = `
                <span class="badge-status badge-success"><i class="fas fa-check"></i> Sin causales detectadas</span><br>
                <span style="margin-top: 4px; display: block;">La IA no detecta ninguna causal de ausencia de conducta en las actividades investigativas del PIC.</span>
            `;
        }

        function validateConducta() {
            const selected = document.querySelector('input[name="conducta"]:checked');
            if (selected) {
                showToast('Tipo de conducta seleccionado: ' + selected.value.toUpperCase(), 'success');
            }
        }

        function mostrarSugerenciasConducta() {
            const container = document.getElementById('conducta-sugerencias-container');
            const tbody = document.getElementById('tbody-sugerencias-conducta');
            
            tbody.innerHTML = `
                <tr>
                    <td><input type="checkbox" class="sugerencia-conducta" value="1"> Reconstrucción de hechos</td>
                    <td>Determinar secuencia de actos realizados</td>
                    <td>+12%</td>
                    <td><span class="badge-status badge-info">Sugerida</span></td>
                </tr>
                <tr>
                    <td><input type="checkbox" class="sugerencia-conducta" value="2"> Análisis de videovigilancia</td>
                    <td>Documentar conducta activa del sujeto</td>
                    <td>+10%</td>
                    <td><span class="badge-status badge-info">Sugerida</span></td>
                </tr>
                <tr>
                    <td><input type="checkbox" class="sugerencia-conducta" value="3"> Entrevista a testigos presenciales</td>
                    <td>Confirmar voluntariedad de los actos</td>
                    <td>+8%</td>
                    <td><span class="badge-status badge-info">Sugerida</span></td>
                </tr>
            `;
            container.style.display = 'block';
        }

        function validarSugerenciasConducta() {
            const checkboxes = document.querySelectorAll('.sugerencia-conducta:checked');
            if (checkboxes.length === 0) {
                showToast('Seleccione al menos una actividad para validar', 'warning');
                return;
            }
            
            if (typeof SAIEngine !== 'undefined' && SAIEngine.escalera) {
                const sugerencias = Array.from(checkboxes).map(cb => cb.value);
                SAIEngine.escalera.registrarSugerencias('conducta', sugerencias);
                const delta = checkboxes.length * 10;
                const nuevoPct = SAIEngine.escalera.aplicarDelta('conducta', delta);
                actualizarAcreditacionElemento('conducta', nuevoPct);
            } else {
                actualizarAcreditacionElemento('conducta', csdSeleccionado.acreditacion.conducta + (checkboxes.length * 10));
            }
            
            showToast(`${checkboxes.length} actividad(es) agregada(s) al PIC`, 'success');
            document.getElementById('conducta-sugerencias-container').style.display = 'none';
        }

        function ignorarSugerenciasConducta() {
            showToast('Sugerencias ignoradas. Registrado para trazabilidad.', 'warning');
            document.getElementById('conducta-sugerencias-container').style.display = 'none';
        }

        function checkNegativoConducta() {
            const select = document.getElementById('select-conducta');
            const status = document.getElementById('conducta-status');
            const row = document.getElementById('row-conducta');
            
            if (typeof SAIEngine !== 'undefined' && SAIEngine.escalera) {
                SAIEngine.escalera.registrarDecisionPaso('conducta', { valor: select.value });
            }
            
            if (select.value === 'ninguna') {
                status.className = 'step-status success';
                status.innerHTML = '<i class="fas fa-check-circle"></i> Sin causa excluyente. Tipicidad habilitada.';
                row.classList.remove('active-row');
                row.classList.add('completed-row');
                
                // Habilitar Tipicidad
                const nextRow = document.getElementById('row-tipicidad');
                nextRow.classList.remove('disabled-row');
                nextRow.classList.add('active-row');
                document.getElementById('select-tipicidad').disabled = false;
                
                estadoEscalera.conducta = 'completado';
                if (currentCase && currentCase.escalera && currentCase.escalera.estado) {
                    currentCase.escalera.estado.conducta = 'completado';
                }
            } else if (select.value !== '') {
                bloquearEscalera('conducta', select.value);
            }
        }

        // =============================================
        // FUNCIONES DE TIPICIDAD (Clasificación Porte Petit)
        // =============================================
        function cargarDatosTipicidad() {
            const datosDelito = datosDelitosPorte[delitoSeleccionado];
            const baseTipicidad = csdSeleccionado.acreditacion.tipicidad;
            const acreditacion = (typeof SAIEngine !== 'undefined' && SAIEngine.escalera)
                ? SAIEngine.escalera.getAcreditacion('tipicidad', baseTipicidad)
                : baseTipicidad;
            
            document.getElementById('tipicidad-delito').textContent = delitoSeleccionado;
            document.getElementById('tipicidad-delito-articulo').textContent = `${delitoSeleccionado} (${datosDelito ? datosDelito.articulo : 'S/A'})`;
            
            if (datosDelito) {
                // Clasificación Porte Petit
                const tbody = document.getElementById('tbody-clasificacion-porte');
                const criterios = [
                    { nombre: 'Por su Resultado', valor: datosDelito.resultado },
                    { nombre: 'Por el Daño', valor: datosDelito.dano },
                    { nombre: 'Por su Duración', valor: datosDelito.duracion },
                    { nombre: 'Por Culpabilidad', valor: datosDelito.culpabilidad },
                    { nombre: 'Por su Estructura', valor: datosDelito.estructura },
                    { nombre: 'Por Número de Actos', valor: datosDelito.actos },
                    { nombre: 'Por Número de Sujetos', valor: datosDelito.sujetos },
                    { nombre: 'Por Forma de Persecución', valor: datosDelito.persecucion }
                ];
                
                tbody.innerHTML = criterios.map((c, i) => {
                    const base = acreditacion || 80;
                    const pct = Math.max(60, Math.min(100, base - 5 + (i * 2)));
                    const estado = pct >= 80 ? 'badge-success' : 'badge-warning';
                    return `
                        <tr>
                            <td>${c.nombre}</td>
                            <td><strong>${c.valor.tipo}</strong> - ${c.valor.descripcion}</td>
                            <td>${pct}%</td>
                            <td><span class="badge-status ${estado}">${pct >= 80 ? 'Acreditado' : 'Pendiente'}</span></td>
                        </tr>
                    `;
                }).join('');
                
                // Elementos del tipo
                document.getElementById('elem-objetivo-desc').textContent = datosDelito.elementos.objetivo;
                document.getElementById('elem-subjetivo-desc').textContent = datosDelito.elementos.subjetivo;
                document.getElementById('elem-normativo-desc').textContent = datosDelito.elementos.normativo;
                document.getElementById('elem-calificativa-desc').textContent = datosDelito.elementos.calificativa;
                
                // Porcentajes de elementos
                const pcts = [acreditacion - 2, acreditacion, acreditacion - 5, acreditacion - 8];
                ['objetivo', 'subjetivo', 'normativo', 'calificativa'].forEach((elem, i) => {
                    const pct = Math.max(60, pcts[i]);
                    document.getElementById(`elem-${elem}-pct`).textContent = `${pct}%`;
                    const estado = document.getElementById(`elem-${elem}-estado`);
                    estado.className = `badge-status ${pct >= 80 ? 'badge-success' : 'badge-warning'}`;
                    estado.textContent = pct >= 80 ? 'Acreditado' : 'Pendiente';
                });
            }
            
            actualizarAcreditacionElemento('tipicidad', acreditacion);
            
            if (acreditacion < 80) {
                mostrarSugerenciasTipicidad();
            }
            
            // Análisis de atipicidad
            document.getElementById('atipicidad-ia-resultado').innerHTML = `
                <span class="badge-status badge-success"><i class="fas fa-check"></i> Sin causales detectadas</span><br>
                <span style="margin-top: 4px; display: block;">La IA no detecta ninguna causal de atipicidad. Todos los elementos del tipo penal están presentes.</span>
            `;
        }

        function mostrarSugerenciasTipicidad() {
            const container = document.getElementById('tipicidad-sugerencias-container');
            const tbody = document.getElementById('tbody-sugerencias-tipicidad');
            
            tbody.innerHTML = `
                <tr>
                    <td>Elemento Normativo</td>
                    <td><input type="checkbox" class="sugerencia-tipicidad" value="1"> Solicitar constancia de servidor público</td>
                    <td>+15%</td>
                    <td><span class="badge-status badge-info">Sugerida</span></td>
                </tr>
                <tr>
                    <td>Calificativa</td>
                    <td><input type="checkbox" class="sugerencia-tipicidad" value="2"> Análisis de estructura organizacional</td>
                    <td>+12%</td>
                    <td><span class="badge-status badge-info">Sugerida</span></td>
                </tr>
                <tr>
                    <td>Elemento Objetivo</td>
                    <td><input type="checkbox" class="sugerencia-tipicidad" value="3"> Dictamen contable de recursos desviados</td>
                    <td>+10%</td>
                    <td><span class="badge-status badge-info">Sugerida</span></td>
                </tr>
            `;
            container.style.display = 'block';
        }

        function validarSugerenciasTipicidad() {
            const checkboxes = document.querySelectorAll('.sugerencia-tipicidad:checked');
            if (checkboxes.length === 0) {
                showToast('Seleccione al menos una actividad', 'warning');
                return;
            }
            if (typeof SAIEngine !== 'undefined' && SAIEngine.escalera) {
                const valores = { '1': 15, '2': 12, '3': 10 };
                const sugerencias = Array.from(checkboxes).map(cb => cb.value);
                SAIEngine.escalera.registrarSugerencias('tipicidad', sugerencias);
                const delta = sugerencias.reduce((acc, v) => acc + (valores[v] || 0), 0);
                const nuevoPct = SAIEngine.escalera.aplicarDelta('tipicidad', delta);
                actualizarAcreditacionElemento('tipicidad', nuevoPct);
            }
            showToast(`${checkboxes.length} actividad(es) agregada(s) al PIC`, 'success');
            document.getElementById('tipicidad-sugerencias-container').style.display = 'none';
        }

        function ignorarSugerenciasTipicidad() {
            showToast('Sugerencias ignoradas. Registrado para trazabilidad.', 'warning');
            document.getElementById('tipicidad-sugerencias-container').style.display = 'none';
        }

        function checkNegativoTipicidad() {
            const select = document.getElementById('select-tipicidad');
            const status = document.getElementById('tipicidad-status');
            const row = document.getElementById('row-tipicidad');
            
            if (typeof SAIEngine !== 'undefined' && SAIEngine.escalera) {
                SAIEngine.escalera.registrarDecisionPaso('tipicidad', { valor: select.value });
            }
            
            if (select.value === 'ninguna') {
                status.className = 'step-status success';
                status.innerHTML = '<i class="fas fa-check-circle"></i> Sin causa excluyente. Antijuridicidad habilitada.';
                row.classList.remove('active-row');
                row.classList.add('completed-row');
                
                const nextRow = document.getElementById('row-antijuridicidad');
                nextRow.classList.remove('disabled-row');
                nextRow.classList.add('active-row');
                document.getElementById('select-antijuridicidad').disabled = false;
                
                estadoEscalera.tipicidad = 'completado';
                if (currentCase && currentCase.escalera && currentCase.escalera.estado) {
                    currentCase.escalera.estado.tipicidad = 'completado';
                }
            } else if (select.value !== '') {
                bloquearEscalera('tipicidad', select.value);
            }
        }

        // =============================================
        // FUNCIONES DE ANTIJURIDICIDAD
        // =============================================
        function cargarDatosAntijuridicidad() {
            const datosDelito = datosDelitosPorte[delitoSeleccionado];
            const baseAntijuridicidad = csdSeleccionado.acreditacion.antijuridicidad;
            const acreditacion = (typeof SAIEngine !== 'undefined' && SAIEngine.escalera)
                ? SAIEngine.escalera.getAcreditacion('antijuridicidad', baseAntijuridicidad)
                : baseAntijuridicidad;
            
            document.getElementById('antijuridicidad-delito').textContent = delitoSeleccionado;
            document.getElementById('antijuridicidad-bien-juridico').textContent = datosDelito ? datosDelito.bienJuridico : 'Pendiente';
            document.getElementById('bien-juridico-tutelado').textContent = datosDelito ? datosDelito.bienJuridico : 'Pendiente';
            
            actualizarAcreditacionElemento('antijuridicidad', acreditacion);
            
            if (acreditacion < 80) {
                mostrarSugerenciasAntijuridicidad();
            }
            
            document.getElementById('causas-justificacion-ia-resultado').innerHTML = `
                <span class="badge-status badge-success"><i class="fas fa-check"></i> Sin causales detectadas</span><br>
                <span style="margin-top: 4px; display: block;">La IA no detecta indicios de causas de justificación en la narrativa ni en las declaraciones.</span>
            `;
        }

        function mostrarSugerenciasAntijuridicidad() {
            const container = document.getElementById('antijuridicidad-sugerencias-container');
            const tbody = document.getElementById('tbody-sugerencias-antijuridicidad');
            
            tbody.innerHTML = `
                <tr>
                    <td><input type="checkbox" class="sugerencia-antijuridicidad" value="1"> Peritaje sobre daño patrimonial</td>
                    <td>Acreditar lesión al bien jurídico</td>
                    <td>+15%</td>
                    <td><span class="badge-status badge-info">Sugerida</span></td>
                </tr>
                <tr>
                    <td><input type="checkbox" class="sugerencia-antijuridicidad" value="2"> Informe de auditoría interna</td>
                    <td>Documentar afectación institucional</td>
                    <td>+10%</td>
                    <td><span class="badge-status badge-info">Sugerida</span></td>
                </tr>
            `;
            container.style.display = 'block';
        }

        function validarSugerenciasAntijuridicidad() {
            const checkboxes = document.querySelectorAll('.sugerencia-antijuridicidad:checked');
            if (checkboxes.length === 0) {
                showToast('Seleccione al menos una actividad', 'warning');
                return;
            }
            if (typeof SAIEngine !== 'undefined' && SAIEngine.escalera) {
                const valores = { '1': 15, '2': 10 };
                const sugerencias = Array.from(checkboxes).map(cb => cb.value);
                SAIEngine.escalera.registrarSugerencias('antijuridicidad', sugerencias);
                const delta = sugerencias.reduce((acc, v) => acc + (valores[v] || 0), 0);
                const nuevoPct = SAIEngine.escalera.aplicarDelta('antijuridicidad', delta);
                actualizarAcreditacionElemento('antijuridicidad', nuevoPct);
            }
            showToast(`${checkboxes.length} actividad(es) agregada(s) al PIC`, 'success');
            document.getElementById('antijuridicidad-sugerencias-container').style.display = 'none';
        }

        function ignorarSugerenciasAntijuridicidad() {
            showToast('Sugerencias ignoradas. Registrado para trazabilidad.', 'warning');
            document.getElementById('antijuridicidad-sugerencias-container').style.display = 'none';
        }

        function checkNegativoAntijuridicidad() {
            const select = document.getElementById('select-antijuridicidad');
            const status = document.getElementById('antijuridicidad-status');
            const row = document.getElementById('row-antijuridicidad');
            
            if (typeof SAIEngine !== 'undefined' && SAIEngine.escalera) {
                SAIEngine.escalera.registrarDecisionPaso('antijuridicidad', { valor: select.value });
            }
            
            if (select.value === 'ninguna') {
                status.className = 'step-status success';
                status.innerHTML = '<i class="fas fa-check-circle"></i> Sin causa excluyente. Imputabilidad habilitada.';
                row.classList.remove('active-row');
                row.classList.add('completed-row');
                
                const nextRow = document.getElementById('row-imputabilidad');
                nextRow.classList.remove('disabled-row');
                nextRow.classList.add('active-row');
                document.getElementById('imputabilidad-capacidad').disabled = false;
                document.getElementById('select-imputabilidad').disabled = false;
                
                estadoEscalera.antijuridicidad = 'completado';
                if (currentCase && currentCase.escalera && currentCase.escalera.estado) {
                    currentCase.escalera.estado.antijuridicidad = 'completado';
                }
            } else if (select.value !== '') {
                // Mostrar actividades de soporte
                document.getElementById('causas-justificacion-actividades').style.display = 'block';
                document.getElementById('lista-actividades-causas-justificacion').innerHTML = `
                    <li><i class="fas fa-file-alt"></i> Declaración del imputado - Alegación de ${select.options[select.selectedIndex].text}</li>
                    <li><i class="fas fa-search"></i> Inspección del lugar de los hechos</li>
                    <li><i class="fas fa-users"></i> Testimoniales de terceros</li>
                `;
                bloquearEscalera('antijuridicidad', select.value);
            }
        }

        // =============================================
        // FUNCIONES DE IMPUTABILIDAD
        // =============================================
        function cargarDatosImputabilidad() {
            document.getElementById('imputabilidad-sujeto').textContent = csdSeleccionado.sujeto;
            document.getElementById('imputabilidad-fecha-nac').textContent = csdSeleccionado.fechaNacimiento;
            document.getElementById('imputabilidad-edad').textContent = `${csdSeleccionado.edadHechos} años`;
            document.getElementById('imputabilidad-edad').className = 'badge-status badge-success';
            
            // Determinar estado de imputabilidad por edad
            if (csdSeleccionado.edadHechos >= 18) {
                document.getElementById('imputabilidad-estado-ia').textContent = 'Mayor de edad - IMPUTABLE';
                document.getElementById('imputabilidad-estado-ia').className = 'badge-status badge-success';
                document.getElementById('imputabilidad-resultado-contenido').innerHTML = `
                    <strong>${csdSeleccionado.sujeto}:</strong> Mayor de edad con plena capacidad de goce y ejercicio. 
                    <strong>Imputabilidad presumida.</strong>
                `;
            }
            
            document.getElementById('inimputabilidad-ia-resultado').innerHTML = `
                <span class="badge-status badge-success"><i class="fas fa-check"></i> Sin causales detectadas</span><br>
                <span style="margin-top: 4px; display: block;">La IA no detecta ninguna causal de inimputabilidad en las actividades de investigación.</span>
            `;
        }

        function verificarImputabilidad() {
            const select = document.getElementById('imputabilidad-capacidad');
            const bloqueoDiv = document.getElementById('imputabilidad-bloqueo-edad');
            
            if (select.value === 'menor-12') {
                bloqueoDiv.style.display = 'block';
                document.getElementById('imputabilidad-bloqueo-titulo').textContent = 'MENOR DE 12 AÑOS DETECTADO';
                document.getElementById('imputabilidad-bloqueo-mensaje').innerHTML = `
                    El sujeto activo es <strong>menor de 12 años</strong>. 
                    <br>Conforme al artículo 18 constitucional, no es sujeto de responsabilidad penal.
                    <br><strong>El análisis no puede continuar.</strong>
                `;
                bloquearPorEdad();
            } else if (select.value === 'adolescente-12-18') {
                bloqueoDiv.style.display = 'block';
                document.getElementById('imputabilidad-bloqueo-titulo').textContent = 'ADOLESCENTE (12-18 AÑOS) DETECTADO';
                document.getElementById('imputabilidad-bloqueo-mensaje').innerHTML = `
                    El sujeto activo tiene entre <strong>12 y 18 años</strong>.
                    <br>Debe canalizarse al <strong>Sistema Integral de Justicia para Adolescentes</strong>.
                    <br><strong>El análisis en este sistema no puede continuar.</strong>
                `;
                bloquearPorEdad();
            } else if (select.value === 'mayor-capaz') {
                bloqueoDiv.style.display = 'none';
                showToast('Imputabilidad verificada: Mayor de edad con plena capacidad', 'success');
            }
        }

        function bloquearPorEdad() {
            document.getElementById('bloqueo-excluyente').style.display = 'block';
            document.getElementById('causa-excluyente-texto').textContent = 'Inimputabilidad por edad';
            document.getElementById('consecuencia-texto').textContent = 'El sujeto no puede ser procesado en el sistema penal ordinario.';
            document.getElementById('bloqueo-excluyente').scrollIntoView({ behavior: 'smooth' });
        }

        function checkNegativoImputabilidad() {
            const select = document.getElementById('select-imputabilidad');
            const status = document.getElementById('imputabilidad-status');
            const row = document.getElementById('row-imputabilidad');
            
            if (typeof SAIEngine !== 'undefined' && SAIEngine.escalera) {
                SAIEngine.escalera.registrarDecisionPaso('imputabilidad', { valor: select.value });
            }
            
            if (select.value === 'ninguna') {
                status.className = 'step-status success';
                status.innerHTML = '<i class="fas fa-check-circle"></i> Sin causa excluyente. Culpabilidad habilitada.';
                row.classList.remove('active-row');
                row.classList.add('completed-row');
                
                const nextRow = document.getElementById('row-culpabilidad');
                nextRow.classList.remove('disabled-row');
                nextRow.classList.add('active-row');
                document.querySelectorAll('input[name="culpabilidad-forma"]').forEach(r => r.disabled = false);
                document.getElementById('select-culpabilidad').disabled = false;
                
                estadoEscalera.imputabilidad = 'completado';
                if (currentCase && currentCase.escalera && currentCase.escalera.estado) {
                    currentCase.escalera.estado.imputabilidad = 'completado';
                }
            } else if (select.value !== '') {
                document.getElementById('inimputabilidad-actividades').style.display = 'block';
                document.getElementById('lista-actividades-inimputabilidad').innerHTML = `
                    <li><i class="fas fa-file-medical"></i> Dictamen psiquiátrico</li>
                    <li><i class="fas fa-brain"></i> Evaluación psicológica</li>
                    <li><i class="fas fa-notes-medical"></i> Historial clínico</li>
                `;
                bloquearEscalera('imputabilidad', select.value);
            }
        }

        // =============================================
        // FUNCIONES DE CULPABILIDAD
        // =============================================
        function cargarDatosCulpabilidad() {
            const datosDelito = datosDelitosPorte[delitoSeleccionado];
            const baseCulpabilidad = csdSeleccionado.acreditacion.culpabilidad;
            const acreditacion = (typeof SAIEngine !== 'undefined' && SAIEngine.escalera)
                ? SAIEngine.escalera.getAcreditacion('culpabilidad', baseCulpabilidad)
                : baseCulpabilidad;
            
            document.getElementById('culpabilidad-delito').textContent = delitoSeleccionado;
            
            if (datosDelito) {
                const formaCulp = datosDelito.culpabilidad.tipo === 'Doloso' ? 'DOLO DIRECTO' : 'CULPA';
                document.getElementById('culpabilidad-forma-ia').textContent = formaCulp;
                document.getElementById('culpabilidad-forma-ia').className = 'badge-status badge-info';
            }
            
            actualizarAcreditacionElemento('culpabilidad', acreditacion);
            
            if (acreditacion < 80) {
                mostrarSugerenciasCulpabilidad();
            }
            
            document.getElementById('inculpabilidad-ia-resultado').innerHTML = `
                <span class="badge-status badge-success"><i class="fas fa-check"></i> Sin causales detectadas</span><br>
                <span style="margin-top: 4px; display: block;">La IA no detecta ninguna causal de inculpabilidad.</span>
            `;
        }

        function seleccionarFormaCulpabilidad() {
            const selected = document.querySelector('input[name="culpabilidad-forma"]:checked');
            if (!selected) return;
            
            const descripcionDiv = document.getElementById('culpabilidad-descripcion-forma');
            descripcionDiv.style.display = 'block';
            
            const descripciones = {
                'dolo-directo': { clasificacion: 'Dolo Directo', explicacion: 'El sujeto conoce los elementos del tipo y quiere el resultado.' },
                'dolo-eventual': { clasificacion: 'Dolo Eventual', explicacion: 'El sujeto prevé el resultado como posible y lo acepta.' },
                'culpa-consciente': { clasificacion: 'Culpa Consciente (con representación)', explicacion: 'El sujeto prevé el resultado pero confía en que no ocurrirá.' },
                'culpa-inconsciente': { clasificacion: 'Culpa Inconsciente (sin representación)', explicacion: 'El sujeto no prevé el resultado que era previsible.' }
            };
            
            const desc = descripciones[selected.value];
            document.getElementById('culpabilidad-clasificacion-texto').textContent = desc.clasificacion;
            document.getElementById('culpabilidad-explicacion-texto').textContent = desc.explicacion;
        }

        function mostrarSugerenciasCulpabilidad() {
            const container = document.getElementById('culpabilidad-sugerencias-container');
            const tbody = document.getElementById('tbody-sugerencias-culpabilidad');
            
            tbody.innerHTML = `
                <tr>
                    <td><input type="checkbox" class="sugerencia-culpabilidad" value="1"> Análisis de comunicaciones</td>
                    <td>Acreditar conocimiento previo del plan</td>
                    <td>+15%</td>
                    <td><span class="badge-status badge-info">Sugerida</span></td>
                </tr>
                <tr>
                    <td><input type="checkbox" class="sugerencia-culpabilidad" value="2"> Testimonio de coconspirador</td>
                    <td>Documentar acuerdo previo</td>
                    <td>+12%</td>
                    <td><span class="badge-status badge-info">Sugerida</span></td>
                </tr>
            `;
            container.style.display = 'block';
        }

        function validarSugerenciasCulpabilidad() {
            const checkboxes = document.querySelectorAll('.sugerencia-culpabilidad:checked');
            if (checkboxes.length === 0) {
                showToast('Seleccione al menos una actividad', 'warning');
                return;
            }
            if (typeof SAIEngine !== 'undefined' && SAIEngine.escalera) {
                const valores = { '1': 15, '2': 12 };
                const sugerencias = Array.from(checkboxes).map(cb => cb.value);
                SAIEngine.escalera.registrarSugerencias('culpabilidad', sugerencias);
                const delta = sugerencias.reduce((acc, v) => acc + (valores[v] || 0), 0);
                const nuevoPct = SAIEngine.escalera.aplicarDelta('culpabilidad', delta);
                actualizarAcreditacionElemento('culpabilidad', nuevoPct);
            }
            showToast(`${checkboxes.length} actividad(es) agregada(s) al PIC`, 'success');
            document.getElementById('culpabilidad-sugerencias-container').style.display = 'none';
        }

        function ignorarSugerenciasCulpabilidad() {
            showToast('Sugerencias ignoradas. Registrado para trazabilidad.', 'warning');
            document.getElementById('culpabilidad-sugerencias-container').style.display = 'none';
        }

        function checkNegativoCulpabilidad() {
            const select = document.getElementById('select-culpabilidad');
            const status = document.getElementById('culpabilidad-status');
            const row = document.getElementById('row-culpabilidad');
            
            if (typeof SAIEngine !== 'undefined' && SAIEngine.escalera) {
                SAIEngine.escalera.registrarDecisionPaso('culpabilidad', { valor: select.value });
            }
            
            if (select.value === 'ninguna') {
                status.className = 'step-status success';
                status.innerHTML = '<i class="fas fa-check-circle"></i> Sin causa excluyente. Punibilidad habilitada.';
                row.classList.remove('active-row');
                row.classList.add('completed-row');
                
                const nextRow = document.getElementById('row-punibilidad');
                nextRow.classList.remove('disabled-row');
                nextRow.classList.add('active-row');
                document.getElementById('select-punibilidad').disabled = false;
                
                estadoEscalera.culpabilidad = 'completado';
                if (currentCase && currentCase.escalera && currentCase.escalera.estado) {
                    currentCase.escalera.estado.culpabilidad = 'completado';
                }
            } else if (select.value !== '') {
                document.getElementById('inculpabilidad-actividades').style.display = 'block';
                document.getElementById('lista-actividades-inculpabilidad').innerHTML = `
                    <li><i class="fas fa-file-alt"></i> Declaración del imputado alegando ${select.options[select.selectedIndex].text}</li>
                    <li><i class="fas fa-search"></i> Investigación de contexto</li>
                `;
                bloquearEscalera('culpabilidad', select.value);
            }
        }

        // =============================================
        // FUNCIONES DE PUNIBILIDAD
        // =============================================
        function cargarDatosPunibilidad() {
            const datosDelito = datosDelitosPorte[delitoSeleccionado];
            const basePunibilidad = csdSeleccionado.acreditacion.punibilidad;
            const acreditacion = (typeof SAIEngine !== 'undefined' && SAIEngine.escalera)
                ? SAIEngine.escalera.getAcreditacion('punibilidad', basePunibilidad)
                : basePunibilidad;
            
            document.getElementById('punibilidad-delito').textContent = `${delitoSeleccionado} (${datosDelito ? datosDelito.articulo : 'S/A'})`;
            
            if (datosDelito) {
                // Calcular pena sugerida (tercio superior para autor intelectual)
                const tercioSuperior = datosDelito.pena.maximo - ((datosDelito.pena.maximo - datosDelito.pena.minimo) / 3);
                
                document.getElementById('punibilidad-prision').textContent = `${Math.round(tercioSuperior)} - ${datosDelito.pena.maximo} ${datosDelito.pena.unidad}`;
                document.getElementById('punibilidad-prision-rango').textContent = `Rango legal: ${datosDelito.pena.minimo} a ${datosDelito.pena.maximo} ${datosDelito.pena.unidad}`;
                
                document.getElementById('punibilidad-multa').textContent = datosDelito.multa.maximo > 0 ? `${datosDelito.multa.minimo} - ${datosDelito.multa.maximo} ${datosDelito.multa.tipo}` : 'No aplica';
                document.getElementById('punibilidad-multa-rango').textContent = datosDelito.multa.tipo;
                
                document.getElementById('punibilidad-reparacion').textContent = 'Procede';
                document.getElementById('punibilidad-reparacion-detalle').textContent = 'Restitución integral del daño causado';
                
                document.getElementById('punibilidad-medidas').textContent = 'Decomiso + Inhabilitación';
                document.getElementById('punibilidad-medidas-detalle').textContent = 'Inhabilitación para cargos públicos';
                
                document.getElementById('lista-actividades-punibilidad').innerHTML = `
                    <li><i class="fas fa-file-invoice-dollar"></i> Dictamen contable de daño patrimonial</li>
                    <li><i class="fas fa-search-dollar"></i> Rastreo de transferencias UIF</li>
                    <li><i class="fas fa-building"></i> Inventario de bienes decomisables</li>
                `;
            }
            
            actualizarAcreditacionElemento('punibilidad', acreditacion);
            
            if (acreditacion < 80) {
                mostrarSugerenciasPunibilidad();
            }
            
            document.getElementById('excusas-absolutorias-ia-resultado').innerHTML = `
                <span class="badge-status badge-success"><i class="fas fa-check"></i> Sin causales detectadas</span><br>
                <span style="margin-top: 4px; display: block;">La IA no detecta ninguna excusa absolutoria aplicable al caso.</span>
            `;
        }

        function mostrarSugerenciasPunibilidad() {
            const container = document.getElementById('punibilidad-sugerencias-container');
            const tbody = document.getElementById('tbody-sugerencias-punibilidad');
            
            tbody.innerHTML = `
                <tr>
                    <td>Reparación del Daño</td>
                    <td><input type="checkbox" class="sugerencia-punibilidad" value="1"> Avalúo pericial de daños</td>
                    <td>+12%</td>
                    <td><span class="badge-status badge-info">Sugerida</span></td>
                </tr>
                <tr>
                    <td>Medidas de Seguridad</td>
                    <td><input type="checkbox" class="sugerencia-punibilidad" value="2"> Inventario patrimonial del imputado</td>
                    <td>+10%</td>
                    <td><span class="badge-status badge-info">Sugerida</span></td>
                </tr>
            `;
            container.style.display = 'block';
        }

        function validarSugerenciasPunibilidad() {
            const checkboxes = document.querySelectorAll('.sugerencia-punibilidad:checked');
            if (checkboxes.length === 0) {
                showToast('Seleccione al menos una actividad', 'warning');
                return;
            }
            if (typeof SAIEngine !== 'undefined' && SAIEngine.escalera) {
                const valores = { '1': 12, '2': 10 };
                const sugerencias = Array.from(checkboxes).map(cb => cb.value);
                SAIEngine.escalera.registrarSugerencias('punibilidad', sugerencias);
                const delta = sugerencias.reduce((acc, v) => acc + (valores[v] || 0), 0);
                const nuevoPct = SAIEngine.escalera.aplicarDelta('punibilidad', delta);
                actualizarAcreditacionElemento('punibilidad', nuevoPct);
            }
            showToast(`${checkboxes.length} actividad(es) agregada(s) al PIC`, 'success');
            document.getElementById('punibilidad-sugerencias-container').style.display = 'none';
        }

        function ignorarSugerenciasPunibilidad() {
            showToast('Sugerencias ignoradas. Registrado para trazabilidad.', 'warning');
            document.getElementById('punibilidad-sugerencias-container').style.display = 'none';
        }

        function checkNegativoPunibilidad() {
            const select = document.getElementById('select-punibilidad');
            const status = document.getElementById('punibilidad-status');
            const row = document.getElementById('row-punibilidad');
            
            if (typeof SAIEngine !== 'undefined' && SAIEngine.escalera) {
                SAIEngine.escalera.registrarDecisionPaso('punibilidad', { valor: select.value });
            }
            
            if (select.value === 'ninguna') {
                status.className = 'step-status success';
                status.innerHTML = '<i class="fas fa-check-circle"></i> Validación Heptatómica Completa.';
                row.classList.remove('active-row');
                row.classList.add('completed-row');
                
                // Mostrar resultado final
                document.getElementById('resultado-final').style.display = 'block';
                document.getElementById('resultado-final').scrollIntoView({ behavior: 'smooth' });
                
                estadoEscalera.punibilidad = 'completado';
                showToast('¡Análisis Heptatómico completado exitosamente!', 'success');
                if (currentCase && currentCase.escalera && currentCase.escalera.estado) {
                    currentCase.escalera.estado.punibilidad = 'completado';
                }
            } else if (select.value !== '') {
                document.getElementById('excusas-absolutorias-actividades').style.display = 'block';
                document.getElementById('lista-actividades-excusas').innerHTML = `
                    <li><i class="fas fa-users"></i> Verificación de parentesco</li>
                    <li><i class="fas fa-file-alt"></i> Documentación de relación familiar</li>
                `;
                bloquearEscalera('punibilidad', select.value);
            }
        }

        // =============================================
        // FUNCIONES AUXILIARES
        // =============================================
        function actualizarAcreditacionElemento(elemento, porcentaje) {
            const progressBar = document.getElementById(`${elemento}-progress-bar`);
            const acreditacionSpan = document.getElementById(`${elemento}-acreditacion`) || document.getElementById(`${elemento}-acreditacion-global`);
            
            if (progressBar) {
                progressBar.style.width = `${porcentaje}%`;
                progressBar.className = `progress-fill ${porcentaje >= 80 ? 'high' : (porcentaje >= 50 ? 'medium' : 'low')}`;
            }
            
            if (acreditacionSpan) {
                acreditacionSpan.textContent = `${porcentaje}%`;
                acreditacionSpan.className = `badge-status ${porcentaje >= 80 ? 'badge-success' : (porcentaje >= 50 ? 'badge-warning' : 'badge-danger')}`;
            }
        }

        function bloquearEscalera(elemento, causal) {
            const causaTexto = document.getElementById('causa-excluyente-texto');
            const consecuenciaTexto = document.getElementById('consecuencia-texto');
            
            const causa = causasExcluyentes[causal];
            if (causa) {
                causaTexto.textContent = causa.nombre;
                consecuenciaTexto.textContent = causa.consecuencia;
            } else {
                causaTexto.textContent = causal;
                consecuenciaTexto.textContent = 'Causa excluyente detectada. El análisis no puede continuar.';
            }
            
            document.getElementById('bloqueo-excluyente').style.display = 'block';
            document.getElementById('resultado-final').style.display = 'none';
            document.getElementById('bloqueo-excluyente').scrollIntoView({ behavior: 'smooth' });
        }

        function resetEscaleraCompleta() {
            const elementos = ['conducta', 'tipicidad', 'antijuridicidad', 'imputabilidad', 'culpabilidad', 'punibilidad'];
            
            elementos.forEach((elem, index) => {
                const row = document.getElementById('row-' + elem);
                row.classList.remove('active-row', 'completed-row');
                if (index > 0) row.classList.add('disabled-row');
                
                const select = document.getElementById('select-' + elem);
                if (select) {
                    select.value = '';
                    select.disabled = (index > 0);
                }
                
                const status = document.getElementById(elem + '-status');
                if (status) {
                    status.className = 'step-status';
                    status.innerHTML = '';
                }
                
                // Ocultar sugerencias
                const sugerencias = document.getElementById(`${elem}-sugerencias-container`);
                if (sugerencias) sugerencias.style.display = 'none';
            });
            
            // Resetear radios
            document.querySelectorAll('#escalera-container input[type="radio"]').forEach(r => {
                r.checked = false;
                r.disabled = false;
            });
            
            // Resetear imputabilidad
            document.getElementById('imputabilidad-capacidad').disabled = true;
            document.getElementById('imputabilidad-bloqueo-edad').style.display = 'none';
            
            // Resetear culpabilidad
            document.querySelectorAll('input[name="culpabilidad-forma"]').forEach(r => r.disabled = true);
            document.getElementById('culpabilidad-descripcion-forma').style.display = 'none';
            
            // Ocultar resultados
            document.getElementById('resultado-final').style.display = 'none';
            document.getElementById('bloqueo-excluyente').style.display = 'none';
            
            // Resetear estado
            Object.keys(estadoEscalera).forEach(k => estadoEscalera[k] = 'pendiente');
        }

        // Función original de initEscalera (mantener compatibilidad)
        
        // Función para cargar datos del CSD en los elementos de la Escalera
        function cargarDatosCSDEnEscalera(csdId) {
            if (typeof datosCSD === 'undefined' || !datosCSD[csdId]) return;
            
            const datos = datosCSD[csdId];
            const metricas = datos.metricas;
            
            // Mapeo de elementos de la escalera con métricas del CSD
            const mapeoElementos = {
                'conducta': { metrica: metricas.conducta, negativa: metricas.ausenciaConducta },
                'tipicidad': { metrica: metricas.tipicidad, negativa: metricas.atipicidad },
                'antijuricidad': { metrica: metricas.antijuricidad, negativa: metricas.causasJustificacion },
                'imputabilidad': { metrica: metricas.individualizacion, negativa: { valor: 100, estado: 'success', sugerencia: 'No hay causas de inimputabilidad.' } },
                'culpabilidad': { metrica: metricas.culpabilidad, negativa: { valor: 100, estado: 'success', sugerencia: 'No hay causas de inculpabilidad.' } },
                'punibilidad': { metrica: { valor: 85, estado: 'success', sugerencia: 'Condiciones objetivas verificadas.' }, negativa: { valor: 100, estado: 'success', sugerencia: 'No hay excusas absolutorias.' } }
            };
            
            // Actualizar cada elemento de la escalera con su sugerencia IA
            Object.keys(mapeoElementos).forEach(elem => {
                const aiBox = document.querySelector(`#pos-${elem} .ai-box-content`);
                if (aiBox && mapeoElementos[elem].metrica) {
                    const metrica = mapeoElementos[elem].metrica;
                    const estadoBadge = metrica.estado === 'success' ? 'badge-success' : (metrica.estado === 'warning' ? 'badge-warning' : 'badge-danger');
                    aiBox.innerHTML = `
                        <strong>CSD: ${datos.id} - ${datos.sujeto}</strong><br>
                        <strong>Delito:</strong> ${datos.delito} (${datos.articulo})<br>
                        <span class="badge-status ${estadoBadge}" style="margin: 4px 0; display: inline-block;">Acreditación: ${metrica.valor}%</span><br>
                        <strong>Sugerencia IA:</strong> ${metrica.sugerencia}
                    `;
                }
            });
            
            // Mostrar información del CSD en la parte superior
            const csdInfo = document.createElement('div');
            csdInfo.id = 'csd-info-header';
            csdInfo.className = 'ai-box';
            csdInfo.style.marginBottom = '16px';
            csdInfo.innerHTML = `
                <div class="ai-box-header"><i class="fas fa-robot"></i> Análisis IA para ${datos.id}</div>
                <div class="ai-box-content">
                    <strong>Sujeto Activo:</strong> ${datos.sujeto}<br>
                    <strong>Delito:</strong> ${datos.delito} - ${datos.articulo}<br>
                    <strong>Grado de Participación:</strong> ${datos.grado}<br>
                    <strong>Pena Proyectada:</strong> ${datos.pena}<br>
                    <hr style="margin: 8px 0; border-color: var(--border-color);">
                    <strong>Recomendaciones IA:</strong>
                    <ul style="margin: 4px 0 0 16px; font-size: 0.8rem;">
                        ${datos.recomendaciones.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>
            `;
            
            // Remover info anterior si existe
            const existingInfo = document.getElementById('csd-info-header');
            if (existingInfo) existingInfo.remove();
            
            // Insertar antes del primer row
            const firstRow = document.getElementById('row-conducta');
            if (firstRow && firstRow.parentNode) {
                firstRow.parentNode.insertBefore(csdInfo, firstRow);
            }
        }

        function resetEscalera() {
            currentStep = 0;
            
            // Resetear todos los rows
            elementos.forEach((elem, index) => {
                const row = document.getElementById('row-' + elem);
                row.classList.remove('active-row', 'completed-row');
                if (index > 0) row.classList.add('disabled-row');
                
                // Resetear selects
                const select = document.getElementById('select-' + elem);
                if (select) {
                    select.value = '';
                    select.disabled = (index > 0);
                }
                
                // Resetear status
                const status = document.getElementById(elem + '-status');
                if (status) {
                    status.className = 'step-status';
                    status.innerHTML = '';
                }
            });
            
            // Resetear radios y otros inputs
            document.querySelectorAll('#escalera-container input[type="radio"]').forEach(r => {
                r.checked = false;
                r.disabled = false;
            });
            document.querySelectorAll('#escalera-container input[type="radio"]').forEach(r => {
                r.closest('.radio-item')?.classList.remove('selected');
            });
            
            // Resetear selects de imputabilidad y culpabilidad
            const impCap = document.getElementById('imputabilidad-capacidad');
            if (impCap) impCap.disabled = true;
            
            document.querySelectorAll('input[name="culpabilidad-forma"]').forEach(r => r.disabled = true);
            
            // Ocultar resultados
            document.getElementById('resultado-final').style.display = 'none';
            document.getElementById('bloqueo-excluyente').style.display = 'none';
            
            // Habilitar primer row
            document.getElementById('row-conducta').classList.remove('disabled-row');
            document.getElementById('row-conducta').classList.add('active-row');
        }

        function validateStep(step) {
            // Validación adicional cuando se selecciona algo en el aspecto positivo
            console.log('Validando paso positivo:', step);
        }

        function checkNegative(step) {
            const elemName = elementos[step - 1];
            const select = document.getElementById('select-' + elemName);
            const status = document.getElementById(elemName + '-status');
            const row = document.getElementById('row-' + elemName);
            
            if (select.value === 'ninguna') {
                // NINGUNA seleccionada - habilitar siguiente
                status.className = 'step-status success';
                status.innerHTML = '<i class="fas fa-check-circle"></i> Sin causa excluyente. Siguiente elemento habilitado.';
                row.classList.remove('active-row');
                row.classList.add('completed-row');

                // Habilitar siguiente elemento
                if (step < elementos.length) {
                    const nextElem = elementos[step];
                    const nextRow = document.getElementById('row-' + nextElem);
                    const nextSelect = document.getElementById('select-' + nextElem);
                    
                    nextRow.classList.remove('disabled-row');
                    nextRow.classList.add('active-row');
                    if (nextSelect) nextSelect.disabled = false;
                    
                    // Habilitar inputs específicos
                    if (nextElem === 'imputabilidad') {
                        document.getElementById('imputabilidad-capacidad').disabled = false;
                    }
                    if (nextElem === 'culpabilidad') {
                        document.querySelectorAll('input[name="culpabilidad-forma"]').forEach(r => r.disabled = false);
                    }
                    
                    currentStep = step;
                } else {
                    // Último paso completado - mostrar resultado final
                    document.getElementById('resultado-final').style.display = 'block';
                    document.getElementById('resultado-final').scrollIntoView({ behavior: 'smooth' });
                }
            } else if (select.value !== '') {
                // Causa excluyente seleccionada - BLOQUEAR
                const causa = causasExcluyentes[select.value];
                
                status.className = 'step-status blocked';
                status.innerHTML = '<i class="fas fa-ban"></i> Causa excluyente detectada. Análisis detenido.';
                
                // Mostrar bloqueo
                document.getElementById('causa-excluyente-texto').textContent = causa.nombre;
                document.getElementById('consecuencia-texto').textContent = causa.consecuencia;
                document.getElementById('bloqueo-excluyente').style.display = 'block';
                document.getElementById('resultado-final').style.display = 'none';
                document.getElementById('bloqueo-excluyente').scrollIntoView({ behavior: 'smooth' });
                
                // Deshabilitar elementos siguientes
                for (let i = step; i < elementos.length; i++) {
                    const futureRow = document.getElementById('row-' + elementos[i]);
                    futureRow.classList.add('disabled-row');
                    futureRow.classList.remove('active-row');
                }
            }
        }

        // =============================================
        // =============================================
