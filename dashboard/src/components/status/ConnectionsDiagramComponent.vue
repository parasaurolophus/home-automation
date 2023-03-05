<template>
    <v-card>
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
import { useTheme } from 'vuetify'
import { onMounted, ref, inject, watch } from 'vue'
import mermaid from 'mermaid'

const theme = useTheme()
const websocketPublish = inject('websocketPublish')

const diagram = ref('')
const websocketStatus = inject('websocketStatus')
const hueBridges = inject('hueBridges')
const powerviewModel = inject('powerviewModel')

function renderDiagram() {

    let graph = 'graph LR\n\n'

    graph += '  %%%%{init: { "theme": ' + (theme.global.current.value.dark ? '"dark"' : '"light"') + ' }}%%%%\n\n'

    graph += '  classDef red fill:#aa0000,stroke:#333,stroke-width:1px;\n'
    graph += '  classDef green fill:#00aa00,stroke:#333,stroke-width:1px;\n'
    graph += '  classDef yellow fill:#aaaa00,stroke:#333,stroke-width:1px;\n\n'

    graph += '  browser-- "HTTP&nbsp;" -->dashboard\n\n'

    graph += '  subgraph "Node-RED&nbsp;"\n'
    graph += '    dashboard<-- "WebSocket&nbsp;\n(status ' + websocketStatus.value + ')&nbsp;" -->flows;\n'
    graph += '  end\n\n'
    graph += '  class flows ' + (websocketStatus.value == 0 ? 'yellow' : websocketStatus.value == 1 ? 'green' : 'red') + '\n\n;'

    let count = 0

    for (let bridge of hueBridges.value) {

        const className = bridge.status == 0 ? 'yellow' : bridge.status == 1 ? 'green' : 'red'
        const nodeName = 'hue' + ++count
        const label = '["Hue ' + bridge.address + '&nbsp;"]'
        graph += '  flows<-- "EventSource&nbsp;\n(status ' + bridge.status + ')&nbsp;" --->' + nodeName + label + ';\n'
        graph += '  class ' + nodeName + ' ' + className + '\n\n'

    }

    if (powerviewModel.value.length > 0) {

        graph += '  flows-- "HTTP&nbsp;\n(synchronous)&nbsp;" --->powerview["PowerView&nbsp;"];\n'

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
        htmlLabels: true
    }
})

onMounted(drawDiagram)
watch(websocketStatus, drawDiagram)
watch(hueBridges, drawDiagram)
watch(theme.global.current, drawDiagram)
</script>