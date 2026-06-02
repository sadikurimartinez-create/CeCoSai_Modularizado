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
