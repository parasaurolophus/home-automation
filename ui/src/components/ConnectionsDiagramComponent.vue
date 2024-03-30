<template>
    <pre ref="diagram"></pre>
</template>

<script setup>
import { onMounted, ref, inject, watch } from 'vue'
import { useTheme } from 'vuetify'
import mermaid from 'mermaid'

const theme = useTheme()

const diagram = ref(null)

const hueModel = inject('hueModel')
const powerviewModel = inject('powerviewModel')
const powerviewStatus = inject('powerviewStatus')
const showAlert = inject('showAlert')
const websocketPublish = inject('websocketPublish')
const websocketStatus = inject('websocketStatus')

function buildDiagram() {
    const themeName = (theme.global.current.value.dark ? '"dark"' : '"light"')
    const grayColor = (theme.global.current.value.dark ? '#888888' : '#888888')
    const redColor = (theme.global.current.value.dark ? '#880000' : '#ff0000')
    const greenColor = (theme.global.current.value.dark ? '#008800' : '#00ff00')
    const yellowColor = (theme.global.current.value.dark ? '#888800' : '#ffff00')
    const flowStatus =
        websocketStatus.value == 0 ? 'connecting' :
            websocketStatus.value == 1 ? 'connected' :
                websocketStatus.value == 2 ? 'disconnected' :
                    websocketStatus.value
    const flowClassName = websocketStatus.value == 0 ? 'yellow' :
        websocketStatus.value == 1 ? 'green' :
            'red'
    let flowchart = ''
    flowchart += 'flowchart TB\n'
    flowchart += '    %%%%{init: { "theme": ' + themeName + ', "flowchart": { "htmlLabels": true, "useMaxWidth": true } } }%%%%\n'
    flowchart += '    classDef gray fill:' + grayColor + ',stroke:' + grayColor + ',stroke-width:1px\n'
    flowchart += '    classDef red fill:' + redColor + ',stroke:' + redColor + ',stroke-width:1px\n'
    flowchart += '    classDef green fill:' + greenColor + ',stroke:' + greenColor + ',stroke-width:1px\n'
    flowchart += '    classDef yellow fill:' + yellowColor + ',stroke:' + yellowColor + ',stroke-width:1px\n'
    flowchart += '    subgraph LAN\n'
    flowchart += '        subgraph Node-RED\n'
    flowchart += '            ui["Vuetify-based UI"]\n'
    flowchart += '            class ui green\n'
    flowchart += '            click ui call uiNodeClicked()\n'
    flowchart += '            flow["Node-RED Flow\n(' + flowStatus + ')"]\n'
    flowchart += '            class flow ' + flowClassName + '\n'
    flowchart += '            click flow call flowNodeClicked()\n'
    flowchart += '            ui <-- WebSocket --> flow\n'
    flowchart += '        end\n'
    let counter = 0
    for (let model of hueModel.value) {
        const bridgeStatus = model.status == -1 ? 'uninitialized' :
            model.status == 0 ? 'connecting' :
                model.status == 1 ? 'connected' :
                    'disconnected'
        const bridgeClassName = model.status == -1 ? 'gray' :
            model.status == 0 ? 'yellow' :
                model.status == 1 ? 'green' :
                    'red'
        const bridgeName = 'hue_bridge' + counter
        const lightsName = 'hue_lights' + counter
        flowchart += '        ' + bridgeName + '["' + model.title + ' Hue Bridge\n(' + bridgeStatus + ')"]\n'
        flowchart += '        class ' + bridgeName + ' ' + bridgeClassName + '\n'
        flowchart += '        click ' + bridgeName + ' call hueBridgeNodeClicked("' + model.id + '")\n'
        flowchart += '        ' + lightsName + '([Hue Lights])\n'
        flowchart += '        flow <-- WiFi --> ' + bridgeName + '\n'
        flowchart += '        ' + bridgeName + '<-- Zigbee --> ' + lightsName + '\n'
        counter += 1
    }
    if (powerviewModel.value.length > 0) {
        const powerviewClassName = powerviewStatus.value === 0 ? 'yellow' :
            powerviewStatus.value === 1 ? 'green' :
                'red'
        const hubStatus = powerviewStatus.value == 0 ? 'unknown' :
            powerviewStatus.value == 1 ? 'connected' :
                'error'
        flowchart += '        powerview_hub["PowerView Hub\n(' + hubStatus + ')"]\n'
        flowchart += '        class powerview_hub ' + powerviewClassName + '\n'
        flowchart += '        powerview_shades([PowerView Shades])\n'
        flowchart += '        flow <-- WiFi --> powerview_hub\n'
        flowchart += '        powerview_hub <-- Bluetooth --> powerview_shades\n'
        flowchart += '        click powerview_hub call powerviewHubNodeClicked()\n'
    }
    flowchart += '    end\n'
    return flowchart
}

async function renderMermaid() {

    const flowchart = buildDiagram()
    console.log(flowchart)
    const { svg, bindFunctions } = await mermaid.render('ui', flowchart)

    diagram.value.innerHTML = svg
    bindFunctions?.(diagram.value)
}

mermaid.flowchartConfig = { width: '100%' }
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })
onMounted(renderMermaid)
watch(hueModel, renderMermaid)
watch(powerviewModel, renderMermaid)
watch(websocketStatus, renderMermaid)
watch(powerviewStatus, renderMermaid)

////////////////////////////////////////////////////////////////////////////////
// TO DO: investigate ways to have the mermaid diagram invoke these directly
// rather than using indirection through index.html
////////////////////////////////////////////////////////////////////////////////

function findHueModel(address) {

    for (let model of hueModel.value) {

        if (model.id == address) {
            return model
        }
    }
    return undefined
}

// eslint-disable-next-line no-global-assign, no-undef
hueBridgeNodeClicked = (address) => {
    const model = findHueModel(address)
    if (model) {
        const text = JSON.stringify(model, undefined, 4)
        showAlert('info', model.title, text)
        return
    }
    showAlert('warning', 'hue bridge ' + address, 'no model found for ' + address)
}

// eslint-disable-next-line no-global-assign, no-undef
powerviewHubNodeClicked = () => showAlert('info', 'powerview hub', JSON.stringify(powerviewModel.value, undefined, 4))

// eslint-disable-next-line no-global-assign, no-undef
flowNodeClicked = () => websocketPublish({ payload: new Date().getTime(), topic: 'controls/refresh' })

// eslint-disable-next-line no-global-assign, no-undef
uiNodeClicked = () => alert('ui node clicked')
</script>
