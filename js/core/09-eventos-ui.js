// Eventos generales de interfaz.
// Este archivo conecta botones y menu sin depender de atributos onclick en el HTML.
(function () {
    var downloadActions = {
        'descargar-sistema': 'descargarArchivo',
        'exportar-datos': 'exportarDatos',
        'importar-datos': 'importarDatos'
    };

    function onReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function bindNavigation() {
        document.querySelectorAll('.nav-item[data-tab]').forEach(function (item) {
            item.addEventListener('click', function (event) {
                event.preventDefault();
                if (typeof window.showTab === 'function') {
                    window.showTab(item.dataset.tab);
                }
            });

            item.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    item.click();
                }
            });
        });
    }

    function bindMobileMenu() {
        var button = document.querySelector('.mobile-menu-btn');
        if (!button) return;

        button.addEventListener('click', function () {
            if (typeof window.toggleMobileMenu === 'function') {
                window.toggleMobileMenu();
            }
        });
    }

    function bindImportFileInput() {
        var input = document.getElementById('import-file-input');
        if (!input) return;

        input.addEventListener('change', function (event) {
            if (typeof window.handleImportFile === 'function') {
                window.handleImportFile(event);
            }
        });
    }

    function bindExpandableSections() {
        document.querySelectorAll('.expandable-header').forEach(function (header) {
            header.addEventListener('click', function () {
                if (typeof window.toggleExpand === 'function') {
                    window.toggleExpand(header);
                }
            });

            header.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    header.click();
                }
            });
        });
    }
    function bindModalCloseButtons() {
        document.querySelectorAll('[data-close-modal]').forEach(function (button) {
            button.addEventListener('click', function () {
                if (typeof window.closeModal === 'function') {
                    window.closeModal(button.dataset.closeModal);
                }
            });
        });
    }
    function bindQuestionActions() {
        document.querySelectorAll('[data-question-action]').forEach(function (button) {
            button.addEventListener('click', function () {
                if (button.dataset.questionAction === 'approve' && typeof window.aprobarCuestionamiento === 'function') {
                    window.aprobarCuestionamiento(button);
                }

                if (button.dataset.questionAction === 'discard' && typeof window.descartarCuestionamiento === 'function') {
                    window.descartarCuestionamiento(button);
                }
            });
        });
    }
    function resolveFunction(path) {
        return path.split('.').reduce(function (current, part) {
            return current && current[part];
        }, window);
    }

    function resolveCallTarget(path) {
        var parts = path.split('.');
        var context = window;

        for (var i = 0; i < parts.length - 1; i++) {
            context = context && context[parts[i]];
        }

        return {
            context: context || window,
            fn: context && context[parts[parts.length - 1]]
        };
    }

    function collectCallArgs(dataset) {
        var args = [];
        if (Object.prototype.hasOwnProperty.call(dataset, 'callArg')) {
            args.push(parseDataValue(dataset.callArg, dataset.callArgType));
        }
        if (Object.prototype.hasOwnProperty.call(dataset, 'callArg2')) {
            args.push(parseDataValue(dataset.callArg2, dataset.callArg2Type));
        }
        return args;
    }
    function bindFunctionCalls() {
        document.addEventListener('click', function (event) {
            var button = event.target.closest('[data-call]');
            if (!button) return;

            event.preventDefault();
            var target = resolveCallTarget(button.dataset.call);
            if (typeof target.fn === 'function') {
                target.fn.apply(target.context, collectCallArgs(button.dataset));
            }
        });
    }

    function bindTargetClicks() {
        document.querySelectorAll('[data-click-target]').forEach(function (button) {
            button.addEventListener('click', function () {
                var target = document.getElementById(button.dataset.clickTarget);
                if (target) target.click();
            });
        });
    }

    function bindPaginationButtons() {
        document.addEventListener('click', function (event) {
            var button = event.target.closest('[data-pagination-table][data-pagination-page]');
            if (!button) return;

            if (window.CeCoSAI_Pagination && typeof window.CeCoSAI_Pagination.goToPage === 'function') {
                window.CeCoSAI_Pagination.goToPage(button.dataset.paginationTable, Number(button.dataset.paginationPage));
            }
        });
    }

    function bindEventFunctionCalls() {
        document.querySelectorAll('[data-call-event]').forEach(function (button) {
            button.addEventListener('click', function (event) {
                var target = resolveCallTarget(button.dataset.callEvent);
                if (typeof target.fn === 'function') {
                    target.fn.call(target.context, event);
                }
            });
        });
    }

    function bindStopPropagation() {
        document.querySelectorAll('[data-stop-propagation]').forEach(function (element) {
            element.addEventListener('click', function (event) {
                event.stopPropagation();
            });
        });
    }
    function parseDataValue(value, type) {
        if (type === 'boolean') return value === 'true';
        if (type === 'number') return Number(value);
        return value;
    }

    function bindChangeHandlers() {
        document.querySelectorAll('[data-change-call]').forEach(function (element) {
            element.addEventListener('change', function () {
                var fn = resolveFunction(element.dataset.changeCall);
                if (typeof fn !== 'function') return;

                if (Object.prototype.hasOwnProperty.call(element.dataset, 'changeArg')) {
                    fn.call(window, parseDataValue(element.dataset.changeArg, element.dataset.changeArgType));
                } else {
                    fn.call(window);
                }
            });
        });

        document.querySelectorAll('[data-change-event]').forEach(function (element) {
            element.addEventListener('change', function (event) {
                var fn = resolveFunction(element.dataset.changeEvent);
                if (typeof fn === 'function') {
                    fn.call(window, event);
                }
            });
        });

        document.addEventListener('change', function (event) {
            var target = event.target;
            
            // Estilos dinámicos para radio y checkbox (Delegación)
            if (target.matches('.radio-item input, .checkbox-item input')) {
                var name = target.name;
                if (name) {
                    document.querySelectorAll('input[name="' + name + '"]').forEach(function(radio) {
                        var container = radio.closest('.radio-item, .checkbox-item');
                        if (container) container.classList.remove('selected');
                    });
                }
                if (target.checked) {
                    var container = target.closest('.radio-item, .checkbox-item');
                    if (container) container.classList.add('selected');
                }
            }

            var element = event.target.closest('[data-page-size-table]');
            if (!element) return;

            if (window.CeCoSAI_Pagination && typeof window.CeCoSAI_Pagination.changePageSize === 'function') {
                window.CeCoSAI_Pagination.changePageSize(element.dataset.pageSizeTable, element.value);
            }
        });
    }
    function bindDownloadMenu() {
        document.querySelectorAll('[data-action]').forEach(function (button) {
            button.addEventListener('click', function () {
                var functionName = downloadActions[button.dataset.action];
                if (functionName && typeof window[functionName] === 'function') {
                    window[functionName]();
                }

                var dropdown = document.getElementById('dropdown-descargas');
                if (dropdown) dropdown.removeAttribute('open');
            });
        });
    }

    onReady(function () {
        bindNavigation();
        bindMobileMenu();
        bindDownloadMenu();
        bindImportFileInput();
        bindExpandableSections();
        bindModalCloseButtons();
        bindQuestionActions();
        bindFunctionCalls();
        bindTargetClicks();
        bindPaginationButtons();
        bindEventFunctionCalls();
        bindStopPropagation();
        bindChangeHandlers();
    });
}());