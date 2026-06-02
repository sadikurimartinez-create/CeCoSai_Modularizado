async function autorizarCarpetaMIC() {
    if (!window.showDirectoryPicker) {
        if (typeof showToast === 'function') {
            showToast('El navegador no soporta acceso directo a carpetas (File System Access API).', 'warning');
        }
        return;
    }
    try {
        const handle = await window.showDirectoryPicker();
        MIC_Module.directorioMIC = handle;

        // Intentar registrar archivos de la carpeta (y subcarpetas) como reglas Wigmore
        MIC_Module.reglasWigmore = [];
        async function recolectarReglas(desdeHandle) {
            try {
                for await (const entry of desdeHandle.values()) {
                    if (!entry) continue;
                    if (entry.kind === 'directory') {
                        // Recursivo: subcarpetas dentro de MIC
                        await recolectarReglas(entry);
                        continue;
                    }
                    const name = entry.name || '';
                    var lower = name.toLowerCase();
                    // Aceptamos: texto, Word, PDF, imágenes (jpg/jpeg/png)
                    var esTexto = lower.endsWith('.txt') || lower.endsWith('.md');
                    var esWord = lower.endsWith('.doc') || lower.endsWith('.docx');
                    var esPdf  = lower.endsWith('.pdf');
                    var esImg  = lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png');
                    if (!(esTexto || esWord || esPdf || esImg)) continue;

                    const file = await entry.getFile();
                    var registro = {
                        nombreArchivo: name,
                        tipo: esTexto ? 'texto' : (esWord ? 'word' : (esPdf ? 'pdf' : 'imagen')),
                        contenido: '',
                        _fileRef: file // referencia en memoria para uso posterior con APIs de Google
                    };

                    // Solo intentamos leer como texto los .txt/.md
                    if (esTexto) {
                        const text = await file.text();
                        if (text && text.trim().length) {
                            registro.contenido = text.slice(0, 8000); // límite de seguridad
                        }
                    }

                    MIC_Module.reglasWigmore.push(registro);
                }
            } catch (inner) {
                console.warn('No se pudieron leer completamente las reglas Wigmore desde la carpeta MIC:', inner);
            }
        }

        await recolectarReglas(handle);

        if (typeof ConcienciaOperativaSAI !== 'undefined' && ConcienciaOperativaSAI) {
            ConcienciaOperativaSAI.reglasWigmore = MIC_Module.reglasWigmore || [];
        }

        // Refrescar inmediatamente la UI de contadores y biblioteca Wigmore
        try {
            actualizarContadoresMIC();
        } catch (e) {
            console.warn('No se pudieron actualizar contadores MIC tras autorizar carpeta:', e);
        }

        if (typeof showToast === 'function') {
            var msg = 'Carpeta MIC autorizada correctamente.';
            if (MIC_Module.reglasWigmore && MIC_Module.reglasWigmore.length) {
                msg += ' Reglas Wigmore cargadas: ' + MIC_Module.reglasWigmore.length + ' archivo(s) de referencia.';
            } else {
                msg += ' No se encontraron archivos .txt/.md para reglas; solo se autorizó la carpeta.';
            }
            showToast(msg, 'success');
        }
    } catch (err) {
        console.warn('Autorizar carpeta MIC cancelado o fallido:', err);
        if (typeof showToast === 'function') {
            showToast('No se autorizó ninguna carpeta MIC.', 'info');
        }
    }
}

async function generarMICConIAWigmore() {
    // 1) Reconstruir el grafo base con datos del caso
    actualizarMIC();

    // 2) Si hay reglas Wigmore y Gemini disponible, pedir una revisión de alto nivel
    if (typeof ConcienciaOperativaSAI !== 'undefined' &&
        ConcienciaOperativaSAI &&
        typeof ConcienciaOperativaSAI.llamarGemini === 'function' &&
        ConcienciaOperativaSAI.reglasWigmore &&
        ConcienciaOperativaSAI.reglasWigmore.length) {

        try {
            var narrativa = (typeof ConcienciaOperativaSAI.getNarrativa === 'function')
                ? ConcienciaOperativaSAI.getNarrativa()
                : '';
            var resumenReglas = ConcienciaOperativaSAI.reglasWigmore.map(function(r) {
                var tipo = r.tipo || 'desconocido';
                var base = '--- ' + (r.nombreArchivo || 'Regla') + ' [' + tipo.toUpperCase() + '] ---\n';
                if (r.contenido) {
                    return base + (r.contenido || '').slice(0, 2000);
                }
                return base + '(Documento binario sin extracción local: PDF/Word/Imagen. Debe tomarse como filtro metodológico y legal externo.)';
            }).join('\n\n');
            var prompt = "Actúa como Auditor de la Arquitectura de la Verdad y experto en gráficos de Wigmore.\n" +
                "Se te proporciona: (1) una narrativa resumida de la Noticia Criminal; (2) extractos de reglas Wigmore de la carpeta MIC.\n" +
                "Indica en formato de lista breve: \n" +
                "a) qué tipos de nodos no deben faltar en el MIC (Probandum, átomos, evidencias críticas, eslabones perdidos claves);\n" +
                "b) qué relaciones probatorias deben cuidarse especialmente;\n" +
                "c) alertas metodológicas si detectas riesgos de sobreinferencia.\n\n" +
                "Responde de forma muy concreta para que la Célula Investigadora ajuste manualmente el mapa.";

            var parts = [
                { text: "NARRATIVA (resumen):\n" + (narrativa ? narrativa.slice(0, 2000) : "Sin narrativa capturada.") + "\n\n" },
                { text: "REGLAS WIGMORE (extractos):\n" + resumenReglas.slice(0, 6000) + "\n\n" },
                { text: prompt }
            ];

            ConcienciaOperativaSAI.llamarGemini(parts, ConcienciaOperativaSAI.systemInstruction)
                .then(function(texto) {
                    console.log('Sugerencias Wigmore para MIC:', texto);
                    if (typeof showToast === 'function') {
                        showToast('IA Wigmore: se generaron sugerencias para ajustar el MIC. Revise la consola.', 'info');
                    }
                })
                .catch(function(err) {
                    console.warn('Error al consultar Gemini para MIC Wigmore:', err);
                    if (typeof showToast === 'function') {
                        showToast('MIC generado. No se pudieron obtener sugerencias IA Wigmore: ' + (err.message || err), 'warning');
                    }
                });
        } catch (e) {
            console.warn('Error en flujo IA de generarMICConIAWigmore:', e);
        }
    } else if (typeof showToast === 'function') {
        showToast('MIC generado con la información actual (modo Wigmore básico, sin IA adicional).', 'success');
    }
}

async function analizarReglaWigmoreConIA(idx) {
    try {
        if (!MIC_Module.reglasWigmore || !MIC_Module.reglasWigmore.length) {
            if (typeof showToast === 'function') showToast('No hay documentos MIC registrados para análisis.', 'warning');
            return;
        }
        var regla = MIC_Module.reglasWigmore[idx];
        if (!regla) {
            if (typeof showToast === 'function') showToast('No se encontró el documento seleccionado.', 'error');
            return;
        }
        if (!regla._fileRef) {
            if (typeof showToast === 'function') showToast('Este documento MIC no está disponible como archivo en memoria.', 'warning');
            return;
        }
        if (typeof ConcienciaOperativaSAI === 'undefined' || !ConcienciaOperativaSAI || typeof ConcienciaOperativaSAI.analizarDictamen !== 'function') {
            if (typeof showToast === 'function') showToast('El módulo de Conciencia Operativa SAI no está disponible.', 'error');
            return;
        }

        var file = regla._fileRef;
        var lower = (regla.nombreArchivo || '').toLowerCase();
        var mime = file.type || '';
        if (!mime) {
            if (lower.endsWith('.pdf')) mime = 'application/pdf';
            else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) mime = 'image/jpeg';
            else if (lower.endsWith('.png')) mime = 'image/png';
        }
        if (!mime) {
            if (typeof showToast === 'function') showToast('Tipo de archivo no soportado para análisis IA.', 'warning');
            return;
        }

        if (typeof showToast === 'function') {
            showToast('Analizando "' + (regla.nombreArchivo || 'documento MIC') + '" con IA. Esto puede tardar unos segundos…', 'info');
        }

        var dataUrl = await new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onload = function(e) { resolve(e.target.result); };
            reader.onerror = function(err) { reject(err); };
            reader.readAsDataURL(file);
        });

        var narrativa = (typeof ConcienciaOperativaSAI.getNarrativa === 'function')
            ? ConcienciaOperativaSAI.getNarrativa()
            : '';
        var codigo = (typeof ConcienciaOperativaSAI.getCodigoPenalNombre === 'function')
            ? ConcienciaOperativaSAI.getCodigoPenalNombre()
            : 'no cargado';

        var texto = await ConcienciaOperativaSAI.analizarDictamen(narrativa, codigo, dataUrl, mime);

        if (!ConcienciaOperativaSAI.hallazgosDictamenes) ConcienciaOperativaSAI.hallazgosDictamenes = [];
        ConcienciaOperativaSAI.hallazgosDictamenes.push({
            nombreArchivo: regla.nombreArchivo || 'Documento MIC',
            texto: texto,
            fecha: new Date().toISOString(),
            origen: 'MIC'
        });
        if (typeof ConcienciaOperativaSAI.renderHallazgos === 'function') {
            ConcienciaOperativaSAI.renderHallazgos();
        }

        if (typeof showToast === 'function') {
            showToast('Análisis IA del documento MIC completado. Revise el panel de dictámenes en Conciencia Operativa.', 'success');
        }
    } catch (e) {
        console.warn('Error al analizar documento MIC con IA:', e);
        if (typeof showToast === 'function') {
            showToast('Error al analizar documento MIC con IA: ' + (e.message || e), 'error');
        }
    }
}

