        // FUNCIONES PARA SUJETOS PASIVOS
        // =============================================
        let sujetosPasivos = [];
        let contadorSP = 1;

        function guardarSujetoPasivo() {
            const nombre = document.getElementById('sp-nombre').value.trim();
            const fechaNacimiento = document.getElementById('sp-fecha-nacimiento').value;
            const curp = document.getElementById('sp-curp').value.trim();
            const domicilio = document.getElementById('sp-domicilio').value.trim();
            const tipoVictima = document.getElementById('sp-tipo-victima').value;
            const delitosSelect = document.getElementById('sp-delitos');
            const delitosSeleccionados = Array.from(delitosSelect.selectedOptions).map(opt => opt.text);
            const descripcionDano = document.getElementById('sp-descripcion-dano').value.trim();

            if (!nombre) {
                showToast('El nombre del sujeto pasivo es obligatorio', 'error');
                return;
            }

            const nuevoSP = {
                id: 'SP-' + String(contadorSP).padStart(2, '0'),
                nombre: nombre,
                fechaNacimiento: fechaNacimiento,
                curp: curp,
                domicilio: domicilio,
                tipoVictima: tipoVictima,
                delitos: delitosSeleccionados,
                descripcionDano: descripcionDano,
                fechaRegistro: new Date().toISOString()
            };

            sujetosPasivos.push(nuevoSP);
            contadorSP++;

            actualizarListaSujetosPasivos();
            limpiarFormularioSP();
            closeModal('modal-agregar-sujeto-pasivo');
            showToast('Sujeto Pasivo "' + nombre + '" agregado correctamente con ID ' + nuevoSP.id, 'success');
            
            // Actualizar análisis IA
            actualizarAnalisisIASP();
        }

        function actualizarListaSujetosPasivos() {
            const contenedor = document.getElementById('lista-sujetos-pasivos');
            const mensaje = document.getElementById('mensaje-sin-sujetos-pasivos');
            
            if (sujetosPasivos.length === 0) {
                contenedor.style.display = 'none';
                mensaje.style.display = 'block';
                return;
            }

            mensaje.style.display = 'none';
            contenedor.style.display = 'grid';
            contenedor.innerHTML = '';

            sujetosPasivos.forEach((sp, index) => {
                const tipoLabel = {
                    'directa': 'Víctima Directa',
                    'indirecta': 'Víctima Indirecta',
                    'colectiva': 'Víctima Colectiva',
                    'potencial': 'Víctima Potencial'
                }[sp.tipoVictima] || 'Sin especificar';

                const card = document.createElement('div');
                card.style.cssText = 'padding: 16px; background: #f0f9ff; border-radius: 10px; border: 1px solid #bfdbfe; border-left: 4px solid #3b82f6;';
                card.setAttribute('data-testid', 'sp-card-' + sp.id);
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span class="badge-status badge-info">${sp.id}</span>
                        <button class="btn btn-danger btn-sm" data-call="eliminarSujetoPasivo" data-call-arg="${index}" data-call-arg-type="number" style="padding: 4px 8px;" data-testid="sp-eliminar-${sp.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="form-group" style="margin-bottom: 8px;">
                        <label class="form-label" style="font-size: 0.7rem; color: var(--text-secondary);">Nombre:</label>
                        <p style="font-weight: 600; font-size: 0.9rem;">${sp.nombre}</p>
                    </div>
                    <div class="form-group" style="margin-bottom: 8px;">
                        <label class="form-label" style="font-size: 0.7rem; color: var(--text-secondary);">Tipo de Víctima:</label>
                        <span class="badge-status badge-warning">${tipoLabel}</span>
                    </div>
                    <div class="form-group" style="margin-bottom: 8px;">
                        <label class="form-label" style="font-size: 0.7rem; color: var(--text-secondary);">Delitos:</label>
                        <p style="font-size: 0.8rem;">${sp.delitos.length > 0 ? sp.delitos.join(', ') : 'Sin especificar'}</p>
                    </div>
                    ${sp.descripcionDano ? `
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="font-size: 0.7rem; color: var(--text-secondary);">Daño Sufrido:</label>
                        <p style="font-size: 0.78rem; color: var(--text-secondary);">${sp.descripcionDano}</p>
                    </div>` : ''}
                `;
                contenedor.appendChild(card);
            });
        }

        function eliminarSujetoPasivo(index) {
            const sp = sujetosPasivos[index];
            sujetosPasivos.splice(index, 1);
            actualizarListaSujetosPasivos();
            showToast('Sujeto Pasivo "' + sp.nombre + '" eliminado', 'warning');
        }

        function limpiarFormularioSP() {
            document.getElementById('sp-nombre').value = '';
            document.getElementById('sp-fecha-nacimiento').value = '';
            document.getElementById('sp-curp').value = '';
            document.getElementById('sp-domicilio').value = '';
            document.getElementById('sp-tipo-victima').value = '';
            document.getElementById('sp-delitos').selectedIndex = -1;
            document.getElementById('sp-descripcion-dano').value = '';
        }

        function actualizarAnalisisIASP() {
            const analisisDiv = document.getElementById('sp-analisis-ia');
            if (sujetosPasivos.length > 0) {
                analisisDiv.innerHTML = `
                    <p style="font-size: 0.8rem;"><strong><i class="fas fa-check-circle" style="color: var(--success);"></i> ${sujetosPasivos.length} sujeto(s) pasivo(s) registrado(s)</strong></p>
                    <p style="font-size: 0.75rem; margin-top: 8px; color: var(--text-secondary);">La IA sugiere verificar medidas de protección para víctimas directas y considerar reparación del daño.</p>
                `;
            }
        }

        // =============================================
