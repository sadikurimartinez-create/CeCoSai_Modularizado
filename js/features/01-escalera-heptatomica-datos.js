        // ESCALERA HEPTATÓMICA - Diccionarios de Datos
        // =============================================
        
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

        // =============================================

// Referencias globales para integracion entre archivos.
window.causasExcluyentes = causasExcluyentes;
window.datosCSDCompletos = datosCSDCompletos;
window.datosDelitosPorte = datosDelitosPorte;
