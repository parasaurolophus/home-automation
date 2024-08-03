import mermaid from 'mermaid'

async function renderMermaid(selector, element, diagramSource) {
    const { svg, bindFunctions } = await mermaid.render(selector, diagramSource)
    element.innerHTML = svg
    bindFunctions?.(element)
}

export { renderMermaid }
