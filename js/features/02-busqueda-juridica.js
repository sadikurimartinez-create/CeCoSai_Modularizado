(function(){
  const csdSel = document.getElementById('csd-selector');
  const card = document.getElementById('ncx-card');
  const bar = document.getElementById('ncx-bar');
  const pct = document.getElementById('ncx-percent');
  const status = document.getElementById('ncx-status');
  const help = document.getElementById('ncx-ai-help');
  const validate = document.getElementById('ncx-validate');
  const ncxTable = document.getElementById('ncx-support-table');

  // Nexo Causal siempre visible
  if(card) card.style.display = 'block';

  function actualizarTablaNexoCausal(csdId) {
    if (!ncxTable) return;
    const tbody = ncxTable.querySelector('tbody');
    if (!tbody) return;

    const actividades = actividadesPorCSD[csdId] || [];
    let totalAcreditacion = 0;
    let html = '';

    actividades.forEach(act => {
      const isLow = act.aportacion < 15 || act.eval.includes('Pendiente') || act.eval.includes('CRÍTICO');
      const isMed = act.aportacion >= 15 && act.aportacion < 25;
      const badgeClass = isLow ? 'badge-warning' : (act.eval.includes('Alta') ? 'badge-success' : 'badge-info');
      
      html += `<tr>
        <td>${act.actividad}</td>
        <td>${act.soporte}</td>
        <td><span class="badge-status ${badgeClass}">IA</span> ${act.eval}</td>
        <td><strong>${act.aportacion}%</strong></td>
        <td>
          <select class="form-control ncx-decision" data-aportacion="${act.aportacion}">
            <option value="">Seleccione...</option>
            <option value="validar">Validar</option>
            <option value="rechazar">Rechazar</option>
          </select>
        </td>
      </tr>`;
      totalAcreditacion += act.aportacion;
    });

    tbody.innerHTML = html || '<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);">Seleccione un CSD para ver las actividades vinculadas.</td></tr>';
    
    // Recalcular porcentaje
    recalcNexo();
  }

  function recalcNexo(){
    let totalValidado = 0;
    let totalPosible = 0;
    
    document.querySelectorAll('.ncx-decision').forEach(sel => {
      const aport = parseInt(sel.dataset.aportacion) || 0;
      totalPosible += aport;
      if(sel.value === 'validar') {
        totalValidado += aport;
      }
    });
    
    // Si no hay selecciones, usar el progreso de la escalera como base
    if(totalPosible === 0) {
      let base = document.querySelectorAll('.heptatonic-row.completed-row').length * 15;
      let pctVal = Math.min(100, base);
      if(bar) bar.style.width = pctVal + '%';
      if(pct) pct.textContent = pctVal + '%';
      if(bar) bar.className = 'progress-fill ' + (pctVal >= 90 ? 'high' : pctVal >= 60 ? 'medium' : 'low');
      if(status) {
        status.className = 'badge-status ' + (pctVal >= 90 ? 'badge-success' : pctVal >= 60 ? 'badge-warning' : 'badge-neutral');
        status.textContent = pctVal >= 90 ? 'Acreditado' : pctVal >= 60 ? 'En Progreso' : 'Pendiente';
      }
      return;
    }
    
    let pctVal = Math.round((totalValidado / totalPosible) * 100);
    if(bar) bar.style.width = pctVal + '%';
    if(pct) pct.textContent = pctVal + '%';
    if(bar) bar.className = 'progress-fill ' + (pctVal >= 90 ? 'high' : pctVal >= 60 ? 'medium' : 'low');
    if(status) {
      status.className = 'badge-status ' + (pctVal >= 90 ? 'badge-success' : pctVal >= 60 ? 'badge-warning' : 'badge-danger');
      status.textContent = pctVal >= 90 ? 'Acreditado' : pctVal >= 60 ? 'En Progreso' : 'Insuficiente';
    }
  }

  if(csdSel){
    csdSel.addEventListener('change', function(){
      actualizarTablaNexoCausal(this.value);
      recalcNexo();
    });
    // Inicializar con valor actual si existe
    if(csdSel.value) {
      actualizarTablaNexoCausal(csdSel.value);
    }
  }

  // Event delegation para las selecciones de la tabla
  if(ncxTable) {
    ncxTable.addEventListener('change', function(e) {
      if(e.target.classList.contains('ncx-decision')) {
        recalcNexo();
        if(e.target.value === 'validar') {
          showToast('Actividad validada para el Nexo Causal', 'success');
        } else if(e.target.value === 'rechazar') {
          showToast('Actividad rechazada del Nexo Causal', 'warning');
        }
      }
    });
  }

  if(help) {
    help.addEventListener('click', function(){
      const csdId = csdSel ? csdSel.value : '';
      if(!csdId) {
        showToast('Seleccione un CSD primero para obtener sugerencias de IA', 'warning');
        return;
      }
      
      const sugerenciasIA = {
        'csd-01': 'IA SUGIERE: Fortalecer con rastreo UIF de cuentas en el extranjero. La constancia de servidor público es esencial para el elemento normativo del peculado.',
        'csd-02': 'IA SUGIERE: Cuantificar monto exacto del fraude. Vincular testimonial de Beatriz Cano con instrucciones directas de Roberto.',
        'csd-03': 'IA SUGIERE: Verificar domicilio actual de Marco. Analizar todas las empresas a su nombre para detectar patrón de empresas fachada.',
        'csd-04': 'IA SUGIERE: Completar dictamen de TODAS las facturas. Alta probabilidad de condena si se vincula directamente a Marco con la elaboración.',
        'csd-05': 'IA SUGIERE: Reforzar conocimiento previo del esquema mediante testimonios de subordinados. Ejecutar cateo programado.',
        'csd-06': 'IA ALERTA: Acreditación débil en este CSD. URGENTE obtener evidencia de transferencias al 20% para evitar desvanecimiento.',
        'csd-07': 'IA SUGIERE: URGENTE consultar registros de personal policial. Sin constancia de cargo, el tipo penal podría no configurarse.',
        'csd-08': 'IA ALERTA CRÍTICA: Este CSD tiene alto riesgo de desvanecimiento. Priorizar dictamen balístico y verificación de coartada inmediatamente.'
      };
      
      alert(sugerenciasIA[csdId] || 'IA sugiere fortalecer actividades directamente vinculadas a conducta, medio y resultado para elevar la acreditación.');
    });
  }

  if(validate) {
    validate.addEventListener('click', function(){
      const pctVal = parseInt(pct ? pct.textContent : '0');
      if(pctVal >= 90){
        showToast('Nexo Causal VALIDADO por el Fiscal. Se integra al expediente.', 'success');
        status.textContent = 'VALIDADO';
        status.className = 'badge-status badge-success';
      } else if(pctVal >= 60) {
        showToast('Nexo Causal en progreso. Se requiere completar actividades pendientes.', 'warning');
      } else {
        showToast('Nexo Causal INSUFICIENTE. No alcanza el umbral mínimo del 60%.', 'error');
      }
    });
  }

  document.addEventListener('change', recalcNexo);
})();
