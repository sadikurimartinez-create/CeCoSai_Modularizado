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

// Exponer globalmente
window.guardarSujeto = guardarSujeto;
window.guardarActividad = guardarActividad;
window.generarOficio = generarOficio;
window.aprobarCuestionamiento = aprobarCuestionamiento;
window.descartarCuestionamiento = descartarCuestionamiento;
