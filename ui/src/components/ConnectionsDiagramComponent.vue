<template>
    <pre ref="diagram"></pre>
</template>

<script setup>
import { onMounted, ref, inject, watch } from 'vue'
import { useTheme } from 'vuetify'
import mermaid from 'mermaid'

const theme = useTheme()

const diagram = ref(null)

const websocketPublish = inject('websocketPublish')
const websocketStatus = inject('websocketStatus')
const hueBridges = inject('hueBridges')
const hueKeys = inject('hueKeys')
const createHueKey = inject('createHueKey')
const powerviewModel = inject('powerviewModel')
const powerviewStatus = inject('powerviewStatus')

function findBridge(address) {

    for (let bridge of hueBridges.value) {

        if (bridge.address == address) {

            return bridge

        }
    }

    return null

}

function hueClickedHandler(address) {

    const bridge = findBridge(address)
    const key = hueKeys.value[address]

    if (!bridge) {

        websocketPublish({
            topic: 'hue/bridge/error',
            payload: 'No Hue Bridge found for ' + address
        })

        return

    }

    const bridgeInfo = {}

    for (let property in bridge) {

        const value = bridge[property]

        bridgeInfo[property] = value

    }

    if (key) {

        bridgeInfo.key = key

    }

    websocketPublish({
        topic: 'hue/bridge/info',
        payload: bridgeInfo
    })

    if (!key) {

        alert('Press button on top of bridge ' + address + ' before proceeding...')
        createHueKey(address)

    }
}

///////////////////////////////////////////////////////////////////////////////

function renderDiagram() {

    const themeName = (theme.global.current.value.dark ? '"dark"' : '"light"')
    const grayColor = (theme.global.current.value.dark ? '#888888' : '#888888')
    const redColor = (theme.global.current.value.dark ? '#880000' : '#ff0000')
    const greenColor = (theme.global.current.value.dark ? '#008800' : '#00ff00')
    const yellowColor = (theme.global.current.value.dark ? '#888800' : '#ffff00')

    let flowchart = ''

    flowchart += 'flowchart TB\n\n'

    flowchart += '  %%%%{init: { '
    flowchart += '"theme": ' + themeName + ', '
    flowchart += '"flowchart": { "htmlLabels": true, "useMaxWidth": true }'
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

    flowchart += '  ui["ui&nbsp;"]\n'
    flowchart += '  flows["flows&nbsp;\n(' + flowsStatus + ')&nbsp;"]\n'
    flowchart += '  class flows ' + flowsClassName + '\n'
    flowchart += '  click flows call flowsNodeClicked()\n\n'

    flowchart += 'subgraph "LAN&nbsp;"\n\n'

    flowchart += '    subgraph "Node-RED&nbsp;"\n'
    flowchart += '      ui --- flows\n'
    flowchart += '      class ui green\n'
    flowchart += '      click ui call uiNodeClicked()\n'
    flowchart += '    end\n\n'

    let index = 0

    for (let bridge of hueBridges.value) {

        const bridgeStatus = bridge.status == -1 ? 'uninitialized' : bridge.status == 0 ? 'connecting' : bridge.status == 1 ? 'connected' : 'disconnected'
        const bridgeClassName = bridge.status == -1 ? 'gray' : bridge.status == 0 ? 'yellow' : bridge.status == 1 ? 'green' : 'red'
        const bridgeNodeName = 'hue' + ++index
        const bridgeLabel =
            '["Hue ' + bridge.address + '&nbsp;\n' +
            '(' + bridgeStatus + ')&nbsp;"]'

        flowchart += bridgeNodeName + bridgeLabel + '\n'
        flowchart += '    class ' + bridgeNodeName + ' ' + bridgeClassName + '\n\n'
        flowchart += '    click ' + bridgeNodeName + ' call hueBridgeNodeClicked("' + bridge.address + '")\n'
        flowchart += '    flows --- ' + bridgeNodeName + '\n\n'

    }

    if (powerviewModel.value.length > 0) {

        const className = powerviewStatus.value === 0 ? 'yellow' : powerviewStatus.value === 1 ? 'green' : 'red'
        flowchart += '    flows --- powerview["PowerView&nbsp;"]\n'
        flowchart += '    class powerview ' + className + '\n'
        flowchart += '    click powerview call powerviewHubNodeClicked()\n\n'

    }

    flowchart += '  end\n'
    return flowchart

}

async function drawDiagram() {

    const { svg, bindFunctions } = await mermaid.render('ui', renderDiagram())

    diagram.value.innerHTML = svg
    bindFunctions?.(diagram.value)
}

mermaid.flowchartConfig = { width: '100%' }
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })
onMounted(drawDiagram)
watch(websocketStatus, drawDiagram)
watch(hueBridges, drawDiagram)
watch(theme.global.current, drawDiagram)
watch(powerviewStatus, drawDiagram)

////////////////////////////////////////////////////////////////////////////////
// TO DO: investigate ways to have the mermaid diagram invoke
// hueClickedHandler() directly rather than using indirection through index.html
////////////////////////////////////////////////////////////////////////////////

// eslint-disable-next-line no-global-assign, no-undef
hueBridgeNodeClicked = hueClickedHandler

// eslint-disable-next-line no-global-assign, no-undef
powerviewHubNodeClicked = () => alert('powerview node clicked')

// eslint-disable-next-line no-global-assign, no-undef
flowsNodeClicked = () => websocketPublish({ payload: new Date().getTime(), topic: 'controls/refresh' })

// eslint-disable-next-line no-global-assign, no-undef
uiNodeClicked = () => alert('ui node clicked')
</script>
