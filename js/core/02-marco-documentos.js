(function() {
        var EjesRectoresSAI = {
            CPEUM: 'C:\\Users\\sadi7\\OneDrive\\Desktop\\Eco SAI\\CeCoSai\\CURSOR CECOSAI\\CPEUM.pdf',
            CNPP: 'C:\\Users\\sadi7\\OneDrive\\Desktop\\Eco SAI\\CeCoSai\\CURSOR CECOSAI\\CNPP.pdf'
        };
        var marcoJuridico = {
            codigoPenal: null,
            legislaciones: [],
            ejesRectores: EjesRectoresSAI
        };
        
        if (typeof window.currentCase === 'undefined') {
            window.currentCase = {};
        }
        window.currentCase.marcoJuridico = marcoJuridico;


        function actualizarMarcoJuridicoUI() {
            var penalEl = document.getElementById('estado-codigo-penal');
            var listaEl = document.getElementById('lista-legislaciones');
            if (penalEl) {
                if (marcoJuridico.codigoPenal) {
                    penalEl.classList.remove('marco-pill--warn');
                    penalEl.classList.add('marco-pill--ok');
                    penalEl.innerHTML = '<i class="fas fa-check-circle"></i><span>Código Penal: ' + marcoJuridico.codigoPenal.nombre + '</span>';
                } else {
                    penalEl.classList.add('marco-pill--warn');
                    penalEl.classList.remove('marco-pill--ok');
                    penalEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Sin Código Penal seleccionado</span>';
                }
            }
            if (listaEl) {
                listaEl.innerHTML = '';
                if (marcoJuridico.legislaciones && marcoJuridico.legislaciones.length > 0) {
                    marcoJuridico.legislaciones.forEach(function(lex, idx) {
                        var li = document.createElement('li');
                        li.innerHTML = '<i class="fas fa-file-alt"></i> <span>' + (idx + 1) + '. ' + lex.nombre + '</span>';
                        listaEl.appendChild(li);
                    });
                }
            }
        }
        function handleCodigoPenalChange(event) {
            var file = event.target.files && event.target.files[0];
            if (!file) return;
            marcoJuridico.codigoPenal = { nombre: file.name, fecha: new Date().toISOString() };
            window.currentCase.marcoJuridico = marcoJuridico;
            actualizarMarcoJuridicoUI();
            if (typeof showToast === 'function') showToast('Código Penal establecido como filtro principal de tipicidad.', 'success');
            event.target.value = '';
        }
        function handleLegislacionesChange(event) {
            var files = Array.from(event.target.files || []);
            if (!files.length) return;
            files.forEach(function(file) {
                marcoJuridico.legislaciones.push({ nombre: file.name, fecha: new Date().toISOString() });
            });
            window.currentCase.marcoJuridico = marcoJuridico;
            actualizarMarcoJuridicoUI();
            if (typeof showToast === 'function') showToast(files.length + ' legislación(es) agregada(s) al marco jurídico.', 'success');
            event.target.value = '';
        }
        function tieneCodigoPenalSeleccionado() {
            return !!(marcoJuridico && marcoJuridico.codigoPenal);
        }

        var documentosCaso = [];
        window.currentCase.documentosCaso = documentosCaso;
        function actualizarListaDocumentosCaso() {
            var lista = document.getElementById('lista-documentos-caso');
            var empty = document.getElementById('documentos-caso-empty');
            if (!lista) return;
            lista.innerHTML = '';
            if (documentosCaso.length === 0) {
                if (empty) empty.style.display = 'block';
                return;
            }
            if (empty) empty.style.display = 'none';
            documentosCaso.forEach(function(doc, idx) {
                var li = document.createElement('li');
                li.innerHTML = '<i class="fas fa-file-alt"></i> <span>' + doc.nombre + '</span>' +
                    '<a href="#" class="doc-remove" data-call="quitarDocumentoCaso" data-call-arg="' + idx + '" data-call-arg-type="number" aria-label="Quitar documento"><i class="fas fa-times-circle"></i></a>';
                lista.appendChild(li);
            });
        }
        function handleDocumentosCasoChange(event) {
            var files = Array.from(event.target.files || []);
            if (!files.length) return;
            files.forEach(function(file) {
                documentosCaso.push({ nombre: file.name, fecha: new Date().toISOString(), tamano: file.size });
            });
            window.currentCase.documentosCaso = documentosCaso;
            actualizarListaDocumentosCaso();
            if (typeof showToast === 'function') showToast(files.length + ' documento(s) agregado(s) al caso.', 'success');
            event.target.value = '';
        }
        function quitarDocumentoCaso(idx) {
            if (idx < 0 || idx >= documentosCaso.length) return;
            documentosCaso.splice(idx, 1);
            window.currentCase.documentosCaso = documentosCaso;
            actualizarListaDocumentosCaso();
        }

        // Exponer funciones y estado al entorno global
        window.marcoJuridico = marcoJuridico;
        window.documentosCaso = documentosCaso;
        window.handleCodigoPenalChange = handleCodigoPenalChange;
        window.handleLegislacionesChange = handleLegislacionesChange;
        window.tieneCodigoPenalSeleccionado = tieneCodigoPenalSeleccionado;
        window.handleDocumentosCasoChange = handleDocumentosCasoChange;
        window.quitarDocumentoCaso = quitarDocumentoCaso;
        window.actualizarMarcoJuridicoUI = actualizarMarcoJuridicoUI;
        window.actualizarListaDocumentosCaso = actualizarListaDocumentosCaso;
})();
