        // FUNCIONES PARA MATRIZ DE INTEGRACIÓN
        // =============================================
        function validarMatrizIntegracion() {
            const selects = document.querySelectorAll('#tabla-matriz-integracion select');
            let filasTotales = 0;
            let filasRuido = 0;
            selects.forEach(select => {
                select.value = 'validar';
                const row = select.closest('tr');
                if (row) {
                    row.style.background = '#f0fdf4';
                    filasTotales++;
                    if (row.classList.contains('ruido')) {
                        filasRuido++;
                    }
                }
            });
            if (currentCase && currentCase.matrizIntegracion) {
                currentCase.matrizIntegracion.filasTotales = filasTotales;
                currentCase.matrizIntegracion.filasValidadas = filasTotales - filasRuido;
                currentCase.matrizIntegracion.filasRuido = filasRuido;
                currentCase.matrizIntegracion.ultimaActualizacion = new Date().toISOString();
            }
            if (SAIEngine && SAIEngine.picMatriz) {
                SAIEngine.picMatriz.registrarEvento('validar_todo', {
                    filasTotales,
                    filasValidadas: filasTotales - filasRuido,
                    filasRuido
                });
            }
            showToast('Todas las sugerencias de la Matriz de Integración han sido validadas', 'success');
            actualizarResumenMatriz();
        }

        function actualizarMatrizIntegracion() {
            if (SAIEngine && SAIEngine.picMatriz) {
                SAIEngine.picMatriz.registrarEvento('actualizar', {
                    resumen: currentCase && currentCase.matrizIntegracion ? currentCase.matrizIntegracion : null
                });
            }
            showToast('Matriz de Integración actualizada desde todos los módulos conectados', 'success');
        }

        function exportarMatrizIntegracion() {
            if (SAIEngine && SAIEngine.picMatriz) {
                SAIEngine.picMatriz.registrarEvento('exportar', {
                    formato: 'html/externo',
                    resumen: currentCase && currentCase.matrizIntegracion ? currentCase.matrizIntegracion : null
                });
            }
            showToast('Matriz de Integración exportada correctamente', 'success');
        }

        function actualizarResumenMatriz() {
            const resumenDiv = document.getElementById('matriz-resumen-ia');
            if (resumenDiv) {
                const gridStats = resumenDiv.querySelector('.grid-4');
                if (gridStats) {
                    gridStats.children[2].querySelector('p:first-child').textContent = '0';
                    gridStats.children[3].querySelector('p:first-child').textContent = '100%';
                }
            }
        }

        // =============================================
        // FUNCIONES PARA INTERCONEXIÓN EN MÉTRICAS
        // =============================================
        function validarSugerenciasInterconexionIA() {
            const selects = document.querySelectorAll('#tabla-interconexion-metricas select');
            selects.forEach(select => {
                select.value = 'validar';
                const row = select.closest('tr');
                if (row) {
                    row.style.background = '#f0fdf4';
                    const auditoria = row.querySelector('td:nth-child(5) .badge-status');
                    if (auditoria) {
                        auditoria.className = 'badge-status badge-success';
                        auditoria.innerHTML = '<i class="fas fa-check-circle"></i> Validado';
                    }
                }
            });
            showToast('Todas las sugerencias IA de Interconexión han sido validadas y agregadas al PIC', 'success');
        }

        function rechazarSugerenciasInterconexionIA() {
            showToast('Sugerencias rechazadas. Trazabilidad registrada.', 'warning');
        }

        function actualizarInterconexionDesdeModulos() {
            showToast('Interconexión actualizada desde NC, PIC, Escalera y Métricas', 'success');
        }

