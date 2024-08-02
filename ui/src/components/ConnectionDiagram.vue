<template>
    <v-card>
        <v-card-text>
            <pre ref="diagram"></pre>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="onResetConnections()">Reconnect</v-btn>
            <v-btn v-for="(bridge, address) in hueBridges" @click="onHueBridgeInfo(address)">
                Hue Bridge {{ hueTitle[address] ?? ('Hue Bridge' + address) }}
            </v-btn>
            <v-btn v-if="Object.getOwnPropertyNames(powerviewModel).length > 0" @click="onPowerViewInfo()">
                PowerView Hub
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { onMounted, ref, inject, watch } from 'vue'
import { useTheme } from 'vuetify'
import mermaid from 'mermaid'

const theme = useTheme()

const diagram = ref(null)

const hueBridges = inject('hueBridges')
const hueStatus = inject('hueStatus')
const hueTitle = inject('hueTitle')
const hueResources = inject('hueResources')
const powerviewModel = inject('powerviewModel')
const powerviewStatus = inject('powerviewStatus')
const showAlert = inject('showAlert')
const websocketPublish = inject('websocketPublish')
const websocketStatus = inject('websocketStatus')

var refreshTimer = null

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
    flowchart += '            flow["Node-RED Flow\n(' + flowStatus + ')"]\n'
    flowchart += '            class flow ' + flowClassName + '\n'
    flowchart += '            ui <-- WebSocket --> flow\n'
    flowchart += '        end\n'
    let bridgeNumber = 1
    for (let address in hueBridges.value) {
        const bridgeTitle = hueTitle.value[address] ?? address
        const bridgeStatus = hueStatus.value[address] == -1 ? 'uninitialized' :
            hueStatus.value[address] == 0 ? 'connecting' :
                hueStatus.value[address] == 1 ? 'connected' :
                    'disconnected'
        const bridgeClassName = hueStatus[address] == -1 ? 'gray' :
            hueStatus.value[address] == 0 ? 'yellow' :
                hueStatus.value[address] == 1 ? 'green' :
                    'red'
        const bridgeName = 'hue_bridge_' + bridgeNumber
        flowchart += '        ' + bridgeName + '["' + bridgeTitle + ' Hue Bridge\n(' + bridgeStatus + ')"]\n'
        flowchart += '        class ' + bridgeName + ' ' + bridgeClassName + '\n'
        flowchart += '        flow <-- WiFi --> ' + bridgeName + '\n'
        const resources = hueResources.value[address]
        if (resources) {
            const devicesName = 'hue_devices_' + bridgeNumber
            flowchart += '        ' + devicesName + '([Hue Devices])\n'
            flowchart += '        ' + bridgeName + '<-- Zigbee --> ' + devicesName + '\n'
        }
        bridgeNumber += 1
    }
    if (Object.getOwnPropertyNames(powerviewModel.value).length > 0) {
        const powerviewClassName = powerviewStatus.value === 0 ? 'yellow' :
            powerviewStatus.value === 1 ? 'green' :
                'red'
        const hubStatus = powerviewStatus.value == 0 ? 'unknown' :
            powerviewStatus.value == 1 ? 'connected' :
                'error'
        flowchart += '        powerview_hub["PowerView Hub\n(' + hubStatus + ')"]\n'
        flowchart += '        class powerview_hub ' + powerviewClassName + '\n'
        flowchart += '        flow <-- WiFi --> powerview_hub\n'
        if (hasShades()) {
            flowchart += '        powerview_shades([PowerView Shades])\n'
            flowchart += '        powerview_hub <-- Bluetooth --> powerview_shades\n'
        }
    }
    flowchart += '    end\n'
    return flowchart
}

function hasShades() {
    for (let roomId of Object.getOwnPropertyNames(powerviewModel.value)) {
        const room = powerviewModel.value[roomId]
        if (room.scenes) {
            return true
        }
    }
    return false
}

function refreshDiagram() {

    if (refreshTimer !== null) {
        clearTimeout(refreshTimer)
    }
    refreshTimer = setTimeout(
        () => {
            refreshTimer = null
            renderMermaid()
        },
        1000)
}

async function renderMermaid() {
    const flowchart = buildDiagram()
    const { svg, bindFunctions } = await mermaid.render('ui', flowchart)
    diagram.value.innerHTML = svg
    bindFunctions?.(diagram.value)
}

mermaid.flowchartConfig = { width: '100%' }
onMounted(refreshDiagram)
watch(hueBridges, refreshDiagram)
watch(hueResources, refreshDiagram)
watch(hueStatus, refreshDiagram)
watch(hueTitle, refreshDiagram)
watch(powerviewModel, refreshDiagram)
watch(websocketStatus, refreshDiagram)
watch(powerviewStatus, refreshDiagram)
watch(theme.global.current, refreshDiagram)

////////////////////////////////////////////////////////////////////////////////
// TO DO: investigate ways to have the mermaid diagram invoke these directly
// rather than using indirection through index.html
////////////////////////////////////////////////////////////////////////////////

function onHueBridgeInfo(address) {
    const bridge = hueBridges.value[address]
    if (!bridge) {
        showAlert('error', 'Missing Hue Bridge', 'No Hue Bridge found for ' + address)
        return
    }
    if (!hueResources.value[address]) {
        websocketPublish({
            payload: address,
            topic: 'put/hue/create-key'
        })
        showAlert('warning', 'put/hue/create-key', 'Press button on bridge ' + address + ' to create key')
        return
    }
    const text = JSON.stringify(bridge, undefined, 4)
    showAlert('info', 'Hue Bridge ' + (hueTitle[address] ?? address), text)
}

function onPowerViewInfo() {
    showAlert('info', 'PowerView Hub', JSON.stringify(powerviewModel.value, undefined, 4))
}

function onResetConnections() {
    powerviewModel.value = {}
    hueResources.value = {}
    renderMermaid()
    websocketPublish({ payload: new Date().getTime(), topic: 'controls/refresh' })
}
</script>
