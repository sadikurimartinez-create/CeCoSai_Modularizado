        // DESCARGA DE ARCHIVO
        function descargarArchivo() {
            const html = document.documentElement.outerHTML;
            const blob = new Blob(['<!DOCTYPE html>\n' + html], {type: 'text/html'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'CeCoSAI_v9_MIC_Wigmore.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('✓ Archivo descargado (incluye módulo MIC)', 'success');

            // Intentar persistir el Caso SAI en el backend (opcional)
            try {
                if (typeof currentCase !== 'undefined' && currentCase) {
                    // Asegurar que haya un id de caso
                    if (!currentCase.id) {
                        currentCase.id = 'CASO-' + Date.now();
                    }
                    const payload = JSON.stringify(currentCase);
                    fetch(`http://localhost:8000/cases/${encodeURIComponent(currentCase.id)}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: payload
                    }).then(resp => {
                        if (!resp.ok) {
                            console.warn('No se pudo guardar el Caso SAI en el backend:', resp.status);
                        } else if (typeof showToast === 'function') {
                            showToast('Caso SAI enviado al backend.', 'success');
                        }
                    }).catch(err => {
                        console.warn('Backend CeCoSAI no disponible para guardar el caso:', err);
                    });
                }
            } catch (e) {
                console.warn('Error al intentar enviar currentCase al backend:', e);
            }
        }

        // INICIALIZACIÓN - SIN DETENIDO por defecto
        document.addEventListener('DOMContentLoaded', function() {
            toggleDetenidos(false);
        });

        // =============================================
        // Guardar Sujeto (función original)
        function guardarSujeto() {
            closeModal('modal-agregar-sujeto');
            showToast('Sujeto agregado correctamente a la carpeta de investigación', 'success');
        }

        // Guardar Actividad
        function guardarActividad() {
            closeModal('modal-agregar-actividad');
            showToast('Actividad agregada al Plan de Investigación Criminal', 'success');
        }

        // Generar Oficio
        function generarOficio(event) {
            const btn = event && event.target ? event.target : null;
            if (btn) btn.classList.add('loading');
            
            setTimeout(() => {
                if (btn) btn.classList.remove('loading');
                closeModal('modal-oficio');
                showToast('Documento generado exitosamente. Descarga iniciada.', 'success');
            }, 1500);
        }

        // Aprobar cuestionamiento de fricción
        function aprobarCuestionamiento(btn) {
            const section = btn.closest('.expandable-section');
            section.style.background = '#dcfce7';
            section.style.borderColor = '#22c55e';
            btn.closest('.decision-group').innerHTML = '<span class="badge-status badge-success"><i class="fas fa-check"></i> Agregado a PIC</span>';
            showToast('Cuestionamiento agregado al Plan de Investigación', 'success');
        }

        // Descartar cuestionamiento
        function descartarCuestionamiento(btn) {
            const section = btn.closest('.expandable-section');
            section.style.opacity = '0.5';
            btn.closest('.decision-group').innerHTML = '<span class="badge-status badge-neutral"><i class="fas fa-times"></i> Descartado</span>';
            showToast('Cuestionamiento descartado', 'warning');
        }

        // =============================================
