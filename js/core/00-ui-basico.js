        // Tab Navigation
        function showTab(tabId) {
            if (tabId !== 'nc' && tabId !== 'conexiones' && typeof tieneCodigoPenalSeleccionado === 'function' && !tieneCodigoPenalSeleccionado()) {
                if (typeof showToast === 'function') showToast('Trinomio SAI: No se puede proceder sin un Código Penal como base de tipicidad.', 'warning');
                return;
            }
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById('tab-' + tabId).classList.add('active');
            
            // Add active to clicked nav item
            document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
            
            // Update header title
            const titles = {
                'nc': 'Noticia Criminal',
                'pic': 'Plan de Investigación Criminal',
                'resultados-inv': 'Resultados Investigativos',
                'mic': 'Mapa de Investigación Criminal (MIC)',
                'escalera': 'Escalera de Validación Heptatómica',
                'metricas': 'Métricas de Acreditación',
                'escritos': 'Escritos Procesales',
                'hipotesis': 'Hipótesis',
                'friccion': 'Fricción Lógica',
                'dashboard': 'Dashboard de Supervisión',
                'conexiones': 'CONEXIONES',
                'hipotesis-sai': 'Hipótesis Investigativa – Núcleo SAI'
            };
            document.getElementById('current-section-title').textContent = titles[tabId];
            
            // Si se muestra el MIC, asegurar inicialización correcta y redibujado
            if (tabId === 'mic') {
                if (typeof safeInitMICNetwork === 'function') {
                    setTimeout(safeInitMICNetwork, 100);
                } else if (typeof actualizarMIC === 'function') {
                    actualizarMIC();
                }
            }
            if (tabId === 'conexiones' && typeof actualizarSemaforos === 'function') {
                actualizarSemaforos();
            }
            // Si se muestra Noticia Criminal, asegurar visibilidad del bloque Denuncia Base según forma de recepción
            if (tabId === 'nc' && typeof toggleDenunciaBaseWrap === 'function') toggleDenunciaBaseWrap();
        }

        // Toggle Suggestions
        function toggleSuggestion(element) {
            const content = element.nextElementSibling;
            content.classList.toggle('show');
            element.textContent = content.classList.contains('show') ? 'Ocultar Sugerencias' : 'Ver Sugerencias';
        }

        // Constitutional Timer (Demo) - CONDICIONAL
        let timeRemaining = 48 * 60 * 60;
        let timerInterval = null;
        
        function updateTimer() {
            const hours = Math.floor(timeRemaining / 3600);
            const minutes = Math.floor((timeRemaining % 3600) / 60);
            const seconds = timeRemaining % 60;
            document.getElementById('timer').textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            if (timeRemaining > 0) timeRemaining--;
        }

        function startTimer() {
            if (!timerInterval) timerInterval = setInterval(updateTimer, 1000);
        }
        
        function stopTimer() {
            if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        }

        // TOGGLE DETENIDOS - Muestra/oculta temporizador
        function toggleDetenidos(conDetenido) {
            const detenidosInfo = document.getElementById('detenidos-info');
            const timerContainer = document.getElementById('timer-container');
            const radioSin = document.getElementById('radio-sin-detenido');
            const radioCon = document.getElementById('radio-con-detenido');
            
            if (conDetenido) {
                if (detenidosInfo) detenidosInfo.style.display = 'block';
                if (timerContainer) timerContainer.classList.add('visible');
                if (radioSin) radioSin.classList.remove('selected');
                if (radioCon) radioCon.classList.add('selected');
                startTimer();
                showToast('⏱️ Tiempo Constitucional ACTIVADO - 48 horas', 'warning');
            } else {
                if (detenidosInfo) detenidosInfo.style.display = 'none';
                if (timerContainer) timerContainer.classList.remove('visible');
                if (radioSin) radioSin.classList.add('selected');
                if (radioCon) radioCon.classList.remove('selected');
                stopTimer();
            }
        }

        // Exponer UI Básica al entorno global
        window.showTab = showTab;
        window.toggleSuggestion = toggleSuggestion;
        window.toggleDetenidos = toggleDetenidos;
