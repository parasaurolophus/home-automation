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
import { renderMermaid } from '@/renderMermaid'

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
    const mermaidTheme = theme.global.current.value.dark ? 'dark' : 'default'
    const gray = theme.global.current.value.dark ? '#888888' : '#888888'
    const red = theme.global.current.value.dark ? '#880000' : '#ff0000'
    const green = theme.global.current.value.dark ? '#008800' : '#00ff00'
    const yellow = theme.global.current.value.dark ? '#888800' : '#ffff00'
    const flowStatus =
        websocketStatus.value == 0 ? 'connecting' :
            websocketStatus.value == 1 ? 'connected' :
                websocketStatus.value == 2 ? 'disconnected' :
                    websocketStatus.value
    const flowClassName = websocketStatus.value == 0 ? 'yellow' :
        websocketStatus.value == 1 ? 'green' :
            'red'
    let flowchart = `---
config:
  theme: ${mermaidTheme}
---
flowchart TB
    classDef gray fill:${gray},stroke:${gray},stroke-width:1px
    classDef red fill:${red},stroke:${red},stroke-width:1px
    classDef green fill:${green},stroke:${green},stroke-width:1px
    classDef yellow fill:${yellow},stroke:${yellow},stroke-width:1px
    subgraph LAN&nbsp;
        subgraph Node-RED&nbsp;
            ui["Vuetify-based UI&nbsp;"]
            class ui green
            flow["Node-RED Flow&nbsp;<br>(${flowStatus})"]
            class flow ${flowClassName}
            ui <-- WebSocket --> flow
        end`
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
        const bridgeName = `hue_bridge_${bridgeNumber}`
        flowchart += `
        ${bridgeName}["${bridgeTitle} Hue Bridge&nbsp;<br>(${bridgeStatus})"]
        class ${bridgeName} ${bridgeClassName}
        flow <-- WiFi --> ${bridgeName}`
        const resources = hueResources.value[address]
        if (resources) {
            const devicesName = `hue_devices_${bridgeNumber}`
            flowchart += `
        ${devicesName}([Hue Devices&nbsp;])
        ${bridgeName}  <-- Zigbee --> ${devicesName}`
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
        flowchart += `
        powerview_hub["PowerView Hub&nbsp;<br>(${hubStatus})"]
        class powerview_hub ${powerviewClassName}
        flow <-- WiFi --> powerview_hub`
        if (hasShades()) {
            flowchart += `
        powerview_shades([PowerView Shades&nbsp;])
        powerview_hub <-- Bluetooth --> powerview_shades`
        }
    }
    flowchart += `
    end`
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
            renderMermaid('ui', diagram.value, buildDiagram())
        },
        1000)
}

onMounted(refreshDiagram)
watch(hueBridges, refreshDiagram)
watch(hueResources, refreshDiagram)
watch(hueStatus, refreshDiagram)
watch(hueTitle, refreshDiagram)
watch(powerviewModel, refreshDiagram)
watch(websocketStatus, refreshDiagram)
watch(powerviewStatus, refreshDiagram)
watch(theme.global.current, refreshDiagram)

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
