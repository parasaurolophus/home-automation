<template>
    <v-card theme="light" color="tertiary">
        <v-card-title>Connections</v-card-title>
        <v-card-text>
            <div v-html="diagram"></div>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="refreshControls" color="secondary">Refresh Controls</v-btn>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
/* */
</style>

<script setup>
import { onMounted, ref, inject, watch } from 'vue'
import mermaid from 'mermaid'

const websocketPublish = inject('websocketPublish')

const diagram = ref('')
const websocketStatus = inject('websocketStatus')
const hueBridges = inject('hueBridges')
const powerviewModel = inject('powerviewModel')

function renderDiagram() {

    let graph = 'flowchart LR\n\n'

    graph += '  classDef red fill:#aa0000,stroke:#333,stroke-width:1px;\n'
    graph += '  classDef green fill:#00aa00,stroke:#333,stroke-width:1px;\n'
    graph += '  classDef yellow fill:#aaaa00,stroke:#333,stroke-width:1px;\n\n'

    graph += '  browser-- "HTTP" -->dashboard\n\n'

    graph += '  subgraph Node-RED\n'
    graph += '    dashboard<-- "WebSocket\n(status ' + websocketStatus.value + ')" -->flows;\n'
    graph += '  end\n\n'
    graph += '  class flows ' + (websocketStatus.value == 0 ? 'yellow' : websocketStatus.value == 1 ? 'green' : 'red') + '\n\n;'

    let count = 0

    for (let bridge of hueBridges.value) {

        const className = bridge.status == 0 ? 'yellow' : bridge.status == 1 ? 'green' : 'red'
        const nodeName = 'hue' + ++count
        const label = '["Hue Bridge ' + bridge.address + '"]'
        graph += '  flows<-- "EventSource\n(status ' + bridge.status + ')" --->' + nodeName + label + ';\n'
        graph += '  class ' + nodeName + ' ' + className + '\n\n'

    }

    if (powerviewModel.value.length > 0) {

        graph += '  flows-- "HTTP\n(synchronous)" --->powerview["PowerView Hub"];\n'
        graph += '  class powerview green;\n\n'

    }

    return graph

}

function refreshControls() {

    websocketPublish({ payload: new Date().getTime(), topic: 'controls/refresh' })

}

async function drawDiagram() {

    const { svg } = await mermaid.render('dashboard', renderDiagram())

    diagram.value = svg

}

mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    flowchart: {
        useMaxWidth: false,
        htmlLabels: false
    }
})

onMounted(drawDiagram)
watch(websocketStatus, drawDiagram)
watch(hueBridges, drawDiagram)
</script>