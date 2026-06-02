// =============================================
// TRAZABILIDAD Y UI DE HIPÓTESIS
// =============================================

// Registrar acción en trazabilidad de hipótesis
function registrarAccionHipotesis(bloque, accion, detalle) {
    const fecha = new Date().toLocaleString('es-MX');
    console.log('[TRAZABILIDAD HIPÓTESIS] ' + fecha + ' | Bloque: ' + bloque + ' | Acción: ' + accion + ' | Detalle: ' + detalle);
    
    if (typeof FriccionIA !== 'undefined' && FriccionIA.trazabilidad) {
        FriccionIA.trazabilidad.push({
            fecha: fecha,
            elemento: 'HIPÓTESIS-' + bloque.toUpperCase(),
            accion: accion,
            detalle: detalle,
            usuario: 'Fiscal'
        });
    }
}

// Verificar si todos los bloques están validados
function verificarBloquesCompletos() {
    const factico = document.getElementById('estado-bloque-factico');
    const probatorio = document.getElementById('estado-bloque-probatorio');
    const juridico = document.getElementById('estado-bloque-juridico');
    
    if (factico && probatorio && juridico) {
        const todosValidados = factico.textContent.includes('Validado') && probatorio.textContent.includes('Validado') && juridico.textContent.includes('Validado');
        if (todosValidados && typeof showToast === 'function') {
            showToast('🎉 ¡Todos los bloques de la Teoría del Caso han sido validados!', 'success');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Botones de validar/modificar bloques en Hipótesis
    document.querySelectorAll('.decision-group .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.card');
            const badge = card ? card.querySelector('.badge-status') : null;
            
            if (this.classList.contains('btn-success')) {
                if (badge) { badge.className = 'badge-status badge-success'; badge.textContent = 'Validado'; }
                if (typeof showToast === 'function' && !this.hasAttribute('data-call')) showToast('Bloque validado correctamente', 'success');
            } else if (this.classList.contains('btn-secondary')) {
                if (badge) { badge.className = 'badge-status badge-warning'; badge.textContent = 'En edición'; }
                if (typeof showToast === 'function' && !this.hasAttribute('data-call')) showToast('Bloque en modo edición', 'warning');
            }
        });
    });

    // Acciones SAI (Botones simples en la tabla)
    document.querySelectorAll('#tab-hipotesis-sai .btn-success.btn-sm').forEach(btn => { btn.addEventListener('click', function() { const row = this.closest('tr'); if (row) { row.style.background = '#dcfce7'; this.parentElement.innerHTML = '<span class="badge-status badge-success"><i class="fas fa-check"></i> Aprobada</span>'; if (typeof showToast === 'function') showToast('Acción aprobada y agregada al flujo', 'success'); } }); });
    document.querySelectorAll('#tab-hipotesis-sai .btn-secondary.btn-sm').forEach(btn => { btn.addEventListener('click', function() { const row = this.closest('tr'); if (row) { row.style.opacity = '0.5'; this.parentElement.innerHTML = '<span class="badge-status badge-neutral"><i class="fas fa-times"></i> Rechazada</span>'; if (typeof showToast === 'function') showToast('Acción rechazada', 'warning'); } }); });
});

window.registrarAccionHipotesis = registrarAccionHipotesis;
window.verificarBloquesCompletos = verificarBloquesCompletos;