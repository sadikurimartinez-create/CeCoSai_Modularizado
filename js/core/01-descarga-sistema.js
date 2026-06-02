(function() {
        // DESCARGA DE ARCHIVO
        function descargarArchivo() {
            const html = document.documentElement.outerHTML;
            const blob = new Blob(['<!DOCTYPE html>\n' + html], {type: 'text/html'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'CeCoSAI_v9_MIC_Wigmore.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('✓ Archivo descargado (incluye módulo MIC)', 'success');

            // Intentar persistir el Caso SAI en el backend (opcional)
            try {
                if (typeof currentCase !== 'undefined' && currentCase) {
                    // Asegurar que haya un id de caso
                    if (!currentCase.id) {
                        currentCase.id = 'CASO-' + Date.now();
                    }
                    const payload = JSON.stringify(currentCase);
                    fetch(`http://localhost:8000/cases/${encodeURIComponent(currentCase.id)}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: payload
                    }).then(resp => {
                        if (!resp.ok) {
                            console.warn('No se pudo guardar el Caso SAI en el backend:', resp.status);
                        } else if (typeof showToast === 'function') {
                            showToast('Caso SAI enviado al backend.', 'success');
                        }
                    }).catch(err => {
                        console.warn('Backend CeCoSAI no disponible para guardar el caso:', err);
                    });
                }
            } catch (e) {
                console.warn('Error al intentar enviar currentCase al backend:', e);
            }
        }
        
        window.descargarArchivo = descargarArchivo;
})();
