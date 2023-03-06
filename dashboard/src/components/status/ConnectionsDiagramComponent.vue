<template>
    <v-card>
        <v-card-title>Connections</v-card-title>
        <v-card-text>
            <div v-html="diagram" @click.capture="diagramClicked"></div>
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
import { useTheme } from 'vuetify'
import mermaid from 'mermaid'

const theme = useTheme()
const websocketPublish = inject('websocketPublish')
const websocketStatus = inject('websocketStatus')
const hueBridges = inject('hueBridges')
const hueKeys = inject('hueKeys')
const createHueKey = inject('createHueKey')
const powerviewModel = inject('powerviewModel')
const diagram = ref('')

const diagramClicked = (event) => {

    const text = event.target.innerText

    if (text !== undefined) {

        const matches = /^Hue (\S+)/.exec(text)

        if (matches) {

            const key = hueKeys.value[matches[1]]

            if (key !== undefined) {

                alert(key)
                return

            }

            alert("Press the button on top of Hue Bridge " + matches[1])
            createHueKey(matches[1])
            return

        }
    }
}

function renderDiagram() {

    const themeName = (theme.global.current.value.dark ? '"dark"' : '"light"')
    const grayColor = (theme.global.current.value.dark ? '#888888' : '#888888')
    const redColor = (theme.global.current.value.dark ? '#880000' : '#ff0000')
    const greenColor = (theme.global.current.value.dark ? '#008800' : '#00ff00')
    const yellowColor = (theme.global.current.value.dark ? '#888800' : '#ffff00')

    let flowchart = 'flowchart LR\n\n'

    flowchart += '  %%%%{init: { '
    flowchart += '"theme": ' + themeName + ', '
    flowchart += '"flowchart": { "htmlLabels": true, "useMaxWidth": false }'
    flowchart += ' } }%%%%\n\n'

    flowchart += '  classDef gray fill:' + grayColor + ',stroke:' + grayColor + ',stroke-width:1px\n'
    flowchart += '  classDef red fill:' + redColor + ',stroke:' + redColor + ',stroke-width:1px\n'
    flowchart += '  classDef green fill:' + greenColor + ',stroke:' + greenColor + ',stroke-width:1px\n'
    flowchart += '  classDef yellow fill:' + yellowColor + ',stroke:' + yellowColor + ',stroke-width:1px\n\n'

    const flowsStatus =
        websocketStatus.value == 0 ? 'connecting' :
            websocketStatus.value == 1 ? 'connected' :
                websocketStatus.value == 2 ? 'disconnected' :
                    websocketStatus.value

    const flowsClassName = websocketStatus.value == 0 ? 'yellow' : websocketStatus.value == 1 ? 'green' : 'red'

    flowchart += '  browser["browser&nbsp;"]\n'
    flowchart += '  dashboard["dashboard&nbsp;"]\n'
    flowchart += '  flows["flows&nbsp;\n(' + flowsStatus + ')&nbsp;"]\n'
    flowchart += '  class flows ' + flowsClassName + '\n\n'

    flowchart += ' browser --- dashboard;\n\n'

    flowchart += '  subgraph "Node-RED&nbsp"\n'
    flowchart += '    dashboard --- flows\n'
    flowchart += '  end\n\n'

    let count = 0

    for (let bridge of hueBridges.value) {

        const bridgeStatus = bridge.status == -1 ? 'uninitialized' : bridge.status == 0 ? 'connecting' : bridge.status == 1 ? 'connected' : 'disconnected'
        const bridgeClassName = bridge.status == -1 ? 'gray' : bridge.status == 0 ? 'yellow' : bridge.status == 1 ? 'green' : 'red'
        const bridgeNodeName = 'hue' + ++count
        const bridgeLabel = '["Hue ' + bridge.address + '&nbsp;\n(' + bridgeStatus + ')&nbsp;"]'

        flowchart += bridgeNodeName + bridgeLabel + '\n'
        flowchart += '  class ' + bridgeNodeName + ' ' + bridgeClassName + '\n\n'
        flowchart += '  flows --- ' + bridgeNodeName + '\n\n'

    }

    if (powerviewModel.value.length > 0) {

        flowchart += '  flows---powerview["PowerView&nbsp;"]\n'

    }

    return flowchart

}

function refreshControls() {

    websocketPublish({ payload: new Date().getTime(), topic: 'controls/refresh' })

}

async function drawDiagram() {

    const { svg } = await mermaid.render('dashboard', renderDiagram())

    diagram.value = svg

}

mermaid.initialize({ startOnLoad: false })

onMounted(drawDiagram)
watch(websocketStatus, drawDiagram)
watch(hueBridges, drawDiagram)
watch(theme.global.current, drawDiagram)
</script>