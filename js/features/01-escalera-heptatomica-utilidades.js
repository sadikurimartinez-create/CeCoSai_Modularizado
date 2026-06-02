(function() {
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
            window.currentStep = 0;
            
            // Resetear todos los rows
            window.elementos.forEach((elem, index) => {
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
            const elemName = window.elementos[step - 1];
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
                if (step < window.elementos.length) {
                    const nextElem = window.elementos[step];
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
                    
                    window.currentStep = step;
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
                for (let i = step; i < window.elementos.length; i++) {
                    const futureRow = document.getElementById('row-' + window.elementos[i]);
                    futureRow.classList.add('disabled-row');
                    futureRow.classList.remove('active-row');
                }
            }
        }

        // =============================================
        // =============================================

// Funciones publicas usadas por la interfaz.
window.actualizarAcreditacionElemento = actualizarAcreditacionElemento;
window.bloquearEscalera = bloquearEscalera;
window.resetEscaleraCompleta = resetEscaleraCompleta;
window.cargarDatosCSDEnEscalera = cargarDatosCSDEnEscalera;
window.resetEscalera = resetEscalera;
window.validateStep = validateStep;
window.checkNegative = checkNegative;
})();
