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
const hueBridges = inject('hueBridges')
const powerviewModel = inject('powerviewModel')
const powerviewStatus = inject('powerviewStatus')
const showAlert = inject('showAlert')
const websocketPublish = inject('websocketPublish')
const websocketStatus = inject('websocketStatus')

function findHueModel(address) {
    for (let model of hueModel.value) {
        if (model.id == address) {
            return model
        }
    }
    return undefined
}

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
    flowchart += '            click ui call uiNodeClicked() "Nothing to see here"\n'
    flowchart += '            flow["Node-RED Flow\n(' + flowStatus + ')"]\n'
    flowchart += '            class flow ' + flowClassName + '\n'
    flowchart += '            click flow call flowNodeClicked() "Reset WebSocket connection"\n'
    flowchart += '            ui <-- WebSocket --> flow\n'
    flowchart += '        end\n'
    let bridgeNumber = 1
    for (let bridge of hueBridges.value) {
        const model = findHueModel(bridge.address)
        const bridgeTitle = model?.title ?? bridge.address
        const bridgeStatus = bridge.status == -1 ? 'uninitialized' :
            bridge.status == 0 ? 'connecting' :
                bridge.status == 1 ? 'connected' :
                    'disconnected'
        const bridgeClassName = bridge.status == -1 ? 'gray' :
            bridge.status == 0 ? 'yellow' :
                bridge.status == 1 ? 'green' :
                    'red'
        const bridgeName = 'hue_bridge_' + bridgeNumber
        flowchart += '        ' + bridgeName + '["' + bridgeTitle + ' Hue Bridge\n(' + bridgeStatus + ')"]\n'
        flowchart += '        class ' + bridgeName + ' ' + bridgeClassName + '\n'
        flowchart += '        click ' + bridgeName + ' call hueBridgeNodeClicked("' + bridge.address + '") "Display Hue Bridge mDNS metadata"\n'
        flowchart += '        flow <-- WiFi --> ' + bridgeName + '\n'
        if (model?.children && model.children.length > 0) {
            const devicesName = 'hue_devices_' + bridgeNumber
            flowchart += '        ' + devicesName + '([Hue Devices])\n'
            flowchart += '        ' + bridgeName + '<-- Zigbee --> ' + devicesName + '\n'
        }
        bridgeNumber += 1
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
        flowchart += '        click powerview_hub call powerviewHubNodeClicked() "Display PowerView controls model"\n'
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
watch(hueBridges, renderMermaid)
watch(powerviewModel, renderMermaid)
watch(websocketStatus, renderMermaid)
watch(powerviewStatus, renderMermaid)

////////////////////////////////////////////////////////////////////////////////
// TO DO: investigate ways to have the mermaid diagram invoke these directly
// rather than using indirection through index.html
////////////////////////////////////////////////////////////////////////////////

// eslint-disable-next-line no-global-assign, no-undef
hueBridgeNodeClicked = (address) => {
    for (let bridge of hueBridges.value) {
        if (bridge.address == address) {
            const model = findHueModel(address)
            const text = JSON.stringify(bridge, undefined, 4)
            if (model) {
                showAlert('info', 'Hue Bridge ' + model.title, text)
            } else {
                showAlert('warning','Hue Bridge ' + bridge.address, text)
            }
            return
        }
    }
    showAlert('warning', 'hue bridge ' + address, 'no metadata found for ' + address)
}

// eslint-disable-next-line no-global-assign, no-undef
powerviewHubNodeClicked = () => showAlert('info', 'PowerView Hub', JSON.stringify(powerviewModel.value, undefined, 4))

// eslint-disable-next-line no-global-assign, no-undef
flowNodeClicked = () => websocketPublish({ payload: new Date().getTime(), topic: 'controls/refresh' })

// eslint-disable-next-line no-global-assign, no-undef
uiNodeClicked = () => showAlert('info', 'nothing to see here', 'ui node clicked')
</script>
