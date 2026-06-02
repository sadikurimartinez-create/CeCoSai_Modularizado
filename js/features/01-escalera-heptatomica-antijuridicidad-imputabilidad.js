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
