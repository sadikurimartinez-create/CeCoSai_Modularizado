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

        // Radio item selection styling
        document.querySelectorAll('.radio-item input, .checkbox-item input').forEach(input => {
            input.addEventListener('change', function() {
                const name = this.name;
                document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
                    radio.closest('.radio-item, .checkbox-item').classList.remove('selected');
                });
                if (this.checked) {
                    this.closest('.radio-item, .checkbox-item').classList.add('selected');
                }
            });
        });

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

        // GENERACIÓN DE PREGUNTAS IA - FRICCIÓN LÓGICA
        const preguntasImputacion = [
            "¿Cómo se acredita el acuerdo previo entre los coautores?",
            "¿La cadena de custodia del arma está debidamente documentada?",
            "¿El reconocimiento de imputados fue libre de sugestión?",
            "¿Existe evidencia de la vigilancia previa a las víctimas?",
            "¿Se puede acreditar la adquisición o procedencia del arma?",
            "¿Las víctimas fueron atendidas psicológicamente?",
            "¿Hay registro de las llamadas de extorsión realizadas?"
        ];
        
        const preguntasAcusacion = [
            "¿Se ha valorado correctamente el daño psicológico?",
            "¿Se cuenta con evidencia para acreditar la coautoría del prófugo?",
            "¿Los dictámenes periciales cumplen con el Art. 368 CNPP?",
            "¿Se han considerado las agravantes por pluralidad de víctimas?",
            "¿El monto del rescate exigido está documentado?",
            "¿Se solicitará extinción de dominio sobre los bienes asegurados?",
            "¿Cuál es la estrategia si el prófugo es detenido posteriormente?"
        ];
        
        let preguntasGeneradasImp = 0;
        let preguntasGeneradasAcu = 0;

        function generarPreguntasFriccion(tipo) {
            const lista = document.getElementById('lista-' + tipo);
            const preguntas = tipo === 'imputacion' ? preguntasImputacion : preguntasAcusacion;
            let contador = tipo === 'imputacion' ? preguntasGeneradasImp : preguntasGeneradasAcu;
            
            if (contador >= preguntas.length) {
                showToast('No hay más preguntas disponibles', 'warning');
                return;
            }
            
            const numPreguntas = Math.min(2, preguntas.length - contador);
            for (let i = 0; i < numPreguntas; i++) {
                const nuevoLi = document.createElement('li');
                nuevoLi.style.marginBottom = '8px';
                nuevoLi.textContent = preguntas[contador + i];
                lista.appendChild(nuevoLi);
            }
            
            if (tipo === 'imputacion') preguntasGeneradasImp += numPreguntas;
            else preguntasGeneradasAcu += numPreguntas;
            
            showToast(`✓ ${numPreguntas} preguntas generadas por IA`, 'success');
        }

