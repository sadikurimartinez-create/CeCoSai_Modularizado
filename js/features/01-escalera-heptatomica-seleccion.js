(function() {
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

            window.csdSeleccionado = datosCSDCompletos[selector.value];
            // Actualizar Caso SAI en memoria
            window.currentCase.id = window.currentCase.id || ('CASO-' + selector.value);
            window.currentCase.csdId = window.csdSeleccionado.id;
            
            // Verificar si tiene múltiples delitos
            if (window.csdSeleccionado.delitos.length > 1) {
                selectorDelito.style.display = 'block';
                poblarSelectorDelitos(window.csdSeleccionado.delitos);
                panelInfo.style.display = 'none';
                container.style.display = 'none';
            } else {
                selectorDelito.style.display = 'none';
                window.delitoSeleccionado = window.csdSeleccionado.delitos[0];
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
            
            window.delitoSeleccionado = selectorDelito.value;
            window.currentCase.delito = window.delitoSeleccionado;
            iniciarAnalisisEscalera();
        }

        function iniciarAnalisisEscalera() {
            const panelInfo = document.getElementById('panel-info-csd-escalera');
            const container = document.getElementById('escalera-container');
            
            // Inicializar núcleo lógico de Escalera para este CSD/delito
            if (typeof SAIEngine !== 'undefined' && SAIEngine.escalera) {
                SAIEngine.escalera.init(
                    window.currentCase.id || null,
                    window.csdSeleccionado && window.csdSeleccionado.id ? window.csdSeleccionado.id : null,
                    window.delitoSeleccionado || null,
                    window.csdSeleccionado && window.csdSeleccionado.acreditacion ? window.csdSeleccionado.acreditacion : null
                );
                // Sincronizar acreditación en currentCase
                if (window.currentCase.escalera && window.currentCase.escalera.acreditacion) {
                    window.currentCase.escalera.acreditacion = {
                        ...window.currentCase.escalera.acreditacion,
                        ...window.csdSeleccionado.acreditacion
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
            const datosDelito = datosDelitosPorte[window.delitoSeleccionado];
            
            contenido.innerHTML = `
                <div class="grid-2" style="gap: 16px;">
                    <div>
                        <p><strong><i class="fas fa-user"></i> Sujeto Activo:</strong> ${window.csdSeleccionado.sujeto}</p>
                        <p style="margin-top: 6px;"><strong><i class="fas fa-gavel"></i> Delito:</strong> ${window.delitoSeleccionado} (${datosDelito ? datosDelito.articulo : 'S/A'})</p>
                        <p style="margin-top: 6px;"><strong><i class="fas fa-users"></i> Grado de Participación:</strong> ${window.csdSeleccionado.grado}</p>
                    </div>
                    <div>
                        <p><strong><i class="fas fa-calendar"></i> Fecha de Nacimiento:</strong> ${window.csdSeleccionado.fechaNacimiento}</p>
                        <p style="margin-top: 6px;"><strong><i class="fas fa-clock"></i> Edad al Momento de los Hechos:</strong> ${window.csdSeleccionado.edadHechos} años</p>
                        <p style="margin-top: 6px;"><strong><i class="fas fa-balance-scale"></i> Bien Jurídico:</strong> ${datosDelito ? datosDelito.bienJuridico : 'Pendiente'}</p>
                    </div>
                </div>
            `;
        }

        window.seleccionarCSDEscalera = seleccionarCSDEscalera;
        window.seleccionarDelitoEscalera = seleccionarDelitoEscalera;
        window.iniciarAnalisisEscalera = iniciarAnalisisEscalera;
        window.actualizarPanelInfoCSD = actualizarPanelInfoCSD;
        window.poblarSelectorDelitos = poblarSelectorDelitos;
})();

        // =============================================
        // FUNCIONES DE CONDUCTA
        // =============================================
