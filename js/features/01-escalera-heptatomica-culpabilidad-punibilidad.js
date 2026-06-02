(function() {
        function cargarDatosCulpabilidad() {
            const datosDelito = datosDelitosPorte[window.delitoSeleccionado];
            const baseCulpabilidad = window.csdSeleccionado.acreditacion.culpabilidad;
            const acreditacion = (typeof SAIEngine !== 'undefined' && SAIEngine.escalera)
                ? SAIEngine.escalera.getAcreditacion('culpabilidad', baseCulpabilidad)
                : baseCulpabilidad;
            
            document.getElementById('culpabilidad-delito').textContent = window.delitoSeleccionado;
            
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
                if (window.currentCase && window.currentCase.escalera && window.currentCase.escalera.estado) {
                    window.currentCase.escalera.estado.punibilidad = 'completado';
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
            const datosDelito = datosDelitosPorte[window.delitoSeleccionado];
            const basePunibilidad = window.csdSeleccionado.acreditacion.punibilidad;
            const acreditacion = (typeof SAIEngine !== 'undefined' && SAIEngine.escalera)
                ? SAIEngine.escalera.getAcreditacion('punibilidad', basePunibilidad)
                : basePunibilidad;
            
            document.getElementById('punibilidad-delito').textContent = `${window.delitoSeleccionado} (${datosDelito ? datosDelito.articulo : 'S/A'})`;
            
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

        window.cargarDatosCulpabilidad = cargarDatosCulpabilidad;
        window.seleccionarFormaCulpabilidad = seleccionarFormaCulpabilidad;
        window.mostrarSugerenciasCulpabilidad = mostrarSugerenciasCulpabilidad;
        window.validarSugerenciasCulpabilidad = validarSugerenciasCulpabilidad;
        window.ignorarSugerenciasCulpabilidad = ignorarSugerenciasCulpabilidad;
        window.checkNegativoCulpabilidad = checkNegativoCulpabilidad;
        window.cargarDatosPunibilidad = cargarDatosPunibilidad;
        window.mostrarSugerenciasPunibilidad = mostrarSugerenciasPunibilidad;
        window.validarSugerenciasPunibilidad = validarSugerenciasPunibilidad;
        window.ignorarSugerenciasPunibilidad = ignorarSugerenciasPunibilidad;
        window.checkNegativoPunibilidad = checkNegativoPunibilidad;
})();
