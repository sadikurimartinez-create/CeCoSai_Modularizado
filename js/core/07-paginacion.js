// MÓDULO 2: PAGINACIÓN DE TABLAS
// ============================================
const CeCoSAI_Pagination = {
    pageSize: 10,
    currentPage: {},
    
    // Inicializar paginación para una tabla
    init: function(tableId, options = {}) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const totalRows = rows.length;
        
        if (totalRows <= this.pageSize) return; // No necesita paginación
        
        this.currentPage[tableId] = 1;
        
        // Crear contenedor de paginación
        const container = document.createElement('div');
        container.className = 'pagination-container';
        container.id = `pagination-${tableId}`;
        container.innerHTML = `
            <div class="pagination-info">
                <span id="pagination-info-${tableId}">Mostrando 1-${Math.min(this.pageSize, totalRows)} de ${totalRows}</span>
                <select class="page-size-select" data-page-size-table="${tableId}" aria-label="Registros por página">
                    <option value="5">5</option>
                    <option value="10" selected>10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
            <div class="pagination-controls" id="pagination-controls-${tableId}"></div>
        `;
        
        table.parentNode.appendChild(container);
        
        this.render(tableId, rows);
    },
    
    // Renderizar página actual
    render: function(tableId, rows = null) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        if (!rows) {
            rows = Array.from(tbody.querySelectorAll('tr'));
        }
        
        const totalRows = rows.length;
        const totalPages = Math.ceil(totalRows / this.pageSize);
        const currentPage = this.currentPage[tableId] || 1;
        const start = (currentPage - 1) * this.pageSize;
        const end = Math.min(start + this.pageSize, totalRows);
        
        // Ocultar todas las filas y mostrar solo las de la página actual
        rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? '' : 'none';
        });
        
        // Actualizar info
        const infoEl = document.getElementById(`pagination-info-${tableId}`);
        if (infoEl) {
            infoEl.textContent = `Mostrando ${start + 1}-${end} de ${totalRows}`;
        }
        
        // Actualizar controles
        const controlsEl = document.getElementById(`pagination-controls-${tableId}`);
        if (controlsEl) {
            let html = '';
            
            // Botón anterior
            html += `<button class="pagination-btn" data-pagination-table="${tableId}" data-pagination-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Página anterior">
                <i class="fas fa-chevron-left"></i>
            </button>`;
            
            // Números de página
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                    html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-pagination-table="${tableId}" data-pagination-page="${i}" aria-label="Página ${i}">${i}</button>`;
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                    html += `<span style="padding: 0 4px;">...</span>`;
                }
            }
            
            // Botón siguiente
            html += `<button class="pagination-btn" data-pagination-table="${tableId}" data-pagination-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Página siguiente">
                <i class="fas fa-chevron-right"></i>
            </button>`;
            
            controlsEl.innerHTML = html;
        }
    },
    
    // Ir a página específica
    goToPage: function(tableId, page) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const totalPages = Math.ceil(rows.length / this.pageSize);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage[tableId] = page;
        this.render(tableId, rows);
    },
    
    // Cambiar tamaño de página
    changePageSize: function(tableId, newSize) {
        this.pageSize = parseInt(newSize);
        this.currentPage[tableId] = 1;
        this.render(tableId);
    }
};


window.CeCoSAI_Pagination = CeCoSAI_Pagination;
