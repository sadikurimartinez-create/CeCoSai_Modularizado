(function() {
// Function to apply visual style to an edge based on its forceProbatoria
function applyEdgeStyle(edgeId, forceProbatoria) {
    if (!MIC_Module.edgesDS || !MIC_Module.options) return;

    const edge = MIC_Module.edgesDS.get(edgeId);
    if (!edge) return;

    const style = (MIC_Module.edgeStyles && MIC_Module.edgeStyles[forceProbatoria]) || (MIC_Module.edgeStyles && MIC_Module.edgeStyles.dflt) || { color: { color: '#64748b' }, width: 1.5, dashes: false, arrows: { to: { enabled: true, scaleFactor: 0.8 } }, font: { color: '#cbd5e1', size: 10 }, label: '' };

    const updatedEdge = {
        id: edgeId,
        forceProbatoria: forceProbatoria, // Persist the forceProbatoria
        color: style.color,
        width: style.width,
        dashes: style.dashes,
        arrows: style.arrows,
        font: style.font,
        label: style.label
    };

    MIC_Module.edgesDS.update(updatedEdge);
}

// Function to cycle through forceProbatoria types
function cycleEdgeForceProbatoria(edgeId) {
    if (!MIC_Module.edgesDS) return;

    const edge = MIC_Module.edgesDS.get(edgeId);
    if (!edge) return;

    const forceTypes = ['conclusive', 'strong', 'indiciary', 'negation'];
    let currentIndex = forceTypes.indexOf(edge.forceProbatoria);
    if (currentIndex === -1) currentIndex = 0; // Default to conclusive if not set

    const nextIndex = (currentIndex + 1) % forceTypes.length;
    const nextForce = forceTypes[nextIndex];

    applyEdgeStyle(edgeId, nextForce);
    validateArgumentHealth(); // Re-validate after changing edge style
    if (typeof showToast === 'function') showToast(`Fuerza probatoria de vínculo actualizada a: ${nextForce.toUpperCase()}`, 'info');
}

// Function to validate argument health (node colors and alerts)
function validateArgumentHealth() {
    if (!MIC_Module.nodesDS || !MIC_Module.edgesDS) return;

    // Reset all nodes to their default colors/borders first
    MIC_Module.nodesDS.forEach(node => {
        const originalNode = MIC_Module.nodesDS.get(node.id);
        let defaultColor = { background: '#020617', border: '#38bdf8' }; // Default for most nodes
        let defaultBorderWidth = 1;

        if (originalNode.tipoMic === 'probandum') {
            defaultColor = { background: '#0f172a', border: '#22c55e' };
            defaultBorderWidth = 3; // Double border
        } else if (originalNode.tipoMic === 'atomoTHD') {
            defaultColor = { background: '#f97316', border: '#ea580c' };
        } else if (originalNode.tipoMic === 'testimonio') {
            defaultColor = { background: '#0b1120', border: '#38bdf8' };
        } else if (originalNode.tipoMic === 'hecho') {
            defaultColor = { background: '#052e16', border: '#22c55e' };
        } else if (originalNode.tipoMic === 'indicio') {
            defaultColor = { background: '#111827', border: '#eab308' };
        } else if (originalNode.tipoMic === 'eslabon') {
            defaultColor = { background: '#0f172a', border: '#f97316' };
        }

        MIC_Module.nodesDS.update({
            id: node.id,
            color: { ...defaultColor, highlight: { background: defaultColor.background, border: '#fefce8' } },
            borderWidth: defaultBorderWidth,
            borderDashes: false, // Reset dashed border
            image: undefined // Remove custom image if any
        });
    });

    // Validate Inference (Rombo) nodes
    MIC_Module.nodesDS.forEach(node => {
        if (node.shape === 'diamond') { // Inference node
            const connectedEdges = MIC_Module.network.getConnectedEdges(node.id);
            let hasSolidConnectionFromEvidenceSource = false;

            for (const edgeId of connectedEdges) {
                const edge = MIC_Module.edgesDS.get(edgeId);
                if (!edge) continue;

                const fromNodeId = edge.from;
                const fromNode = MIC_Module.nodesDS.get(fromNodeId);

                if (fromNode && fromNode.shape === 'box' && (edge.forceProbatoria === 'conclusive' || edge.forceProbatoria === 'strong')) {
                    hasSolidConnectionFromEvidenceSource = true;
                    break;
                }
            }

            if (!hasSolidConnectionFromEvidenceSource) {
                // Change color to soft red
                MIC_Module.nodesDS.update({
                    id: node.id,
                    color: { background: '#fef2f2', border: '#ef4444', highlight: { background: '#fef2f2', border: '#dc2626' } }
                });
            }
        }

        // Validate Probandum (Rectángulo Doble) nodes
        if (node.tipoMic === 'probandum') { // Main Conclusion node
            const connectedEdges = MIC_Module.network.getConnectedEdges(node.id);
            let hasNegationIncoming = false;

            for (const edgeId of connectedEdges) {
                const edge = MIC_Module.edgesDS.get(edgeId);
                if (!edge) continue;

                // Check only incoming edges
                if (edge.to === node.id && edge.forceProbatoria === 'negation') {
                    hasNegationIncoming = true;
                    break;
                }
            }

            if (hasNegationIncoming) {
                // Display alert icon (e.g., change border to dashed red or add an image)
                MIC_Module.nodesDS.update({
                    id: node.id,
                    color: { background: '#0f172a', border: '#ef4444', highlight: { background: '#16a34a', border: '#dc2626' } },
                    borderWidth: 3,
                    borderDashes: [5, 5] // Punteado para alerta
                    // Could also use a custom image: image: 'path/to/alert_icon.png', shape: 'image'
                });
            }
        }
    });
}

window.applyEdgeStyle = applyEdgeStyle;
window.cycleEdgeForceProbatoria = cycleEdgeForceProbatoria;
window.validateArgumentHealth = validateArgumentHealth;
})();
