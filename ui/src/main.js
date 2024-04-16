/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */


// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp, ref } from 'vue'

const app = createApp(App)

registerPlugins(app)

const settingsBedtime = ref(21)
app.provide('settingsBedtime', settingsBedtime)

const settingsLighting = ref(false)
app.provide('settingsLighting', settingsLighting)

const settingsShades = ref(false)
app.provide('settingsShades', settingsShades)

const alerts = ref([])
app.provide('alerts', alerts)

const hueBridges = ref({})
app.provide('hueBridges', hueBridges)

const powerviewModel = ref([])
app.provide('powerviewModel', powerviewModel)

const powerviewStatus = ref(0)
app.provide('powerviewStatus', powerviewStatus)

const timerModel = ref({})
app.provide('timerModel', timerModel)

function timerThemeIcon(value) {
    if (!value) {
        value = timerModel.value.theme || 'standard'
    }
    switch (value) {
        case 'tribal':
            return 'mdi-firework'
        case 'spooky':
            return 'mdi-halloween'
        case 'jolly':
            return 'mdi-string-lights'
        default:
            return 'mdi-lightbulb-group'
    }
}

app.provide('timerThemeIcon', timerThemeIcon)

function showAlert(type, title, text) {
    alerts.value.push({
        show: true,
        type: type,
        title: new Date().toLocaleString() + '\t| ' + title,
        text: text,
    })
}

app.provide('showAlert', showAlert)

//////////////////////////////////////////////////////////////////////////////
// monitor websocket readyState
//////////////////////////////////////////////////////////////////////////////

// model to display websocket connection
// status in BackEndComponent.vue
const websocketStatus = ref(-1)
app.provide('websocketStatus', websocketStatus)

//////////////////////////////////////////////////////////////////////////////
// provide the function for ui components to send messages to the back end
// using a websocket
//////////////////////////////////////////////////////////////////////////////

// send the given message to the back end using the websocket connection
function websocketPublish(msg) {
    if (ws === null) {
        const text = JSON.stringify(msg, undefined, 1)
        console.warn('websocket closed when attempting to send:\n' + text)
        showAlert('warning', 'websocket closed', text)
        return
    }
    ws.send(JSON.stringify(msg))
}

app.provide('websocketPublish', websocketPublish)

///////////////////////////////////////////////////////////////////////////////
// handle a hue/:bridge/resource/:kind/:id event
///////////////////////////////////////////////////////////////////////////////

const hueResources = ref({})
app.provide('hueResources', hueResources)

function handleHueResource(address, kind, id, payload) {

    const hue = hueResources.value || {}
    const bridge = hueResources.value[address] || {}
    const resources = bridge[kind] || {}
    const resource = resources[id] || {}
    let update = false

    try {

        for (let property of Object.getOwnPropertyNames(payload)) {

            const value = payload[property]

            if (resource[property] != value) {
                resource[property] = value
                update = true
            }
        }

    } finally {

        if (update) {
            resources[id] = resource
            bridge[kind] = resources
            hue[address] = bridge
            hueResources.value = hue
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// connect to the back end using a websocket
///////////////////////////////////////////////////////////////////////////////

// websocket connection to the back end
let ws = null

// timer used to periodically update
// the websocket status display
let wsReadyStateTimer = null

// timer used to maintain the websocket
// connection to the back end
let wsReconnectTimer = null

const messageCount = ref(0)
app.provide('messageCount', messageCount)

const lastMessage = ref(null)
app.provide('lastMessage', lastMessage)

// create the ws connection to the back end
function connectWS() {

    // do nothing if already connecting or connected
    if (ws !== null) {
        if ((ws.readyState === 0) || (ws.readyState === 1)) {
            return
        }
    }

    // stop the current readystate timer
    if (wsReadyStateTimer !== null) {
        clearInterval(wsReadyStateTimer)
        wsReadyStateTimer = null
    }

    // stop the current reconnect timer
    if (wsReconnectTimer !== null) {
        clearInterval(wsReconnectTimer)
        wsReconnectTimer = null
    }

    // open a new websocket connection
    const matches = /^([^:]+):\/\/([^:]+).*$/.exec(window.location)
    let url = 'ws://127.0.0.1:1880/broker'

    if (Array.isArray(matches) && (matches.length == 3)) {
        url = ((matches[1] == 'https') ? 'wss' : 'ws') + '://' + matches[2] + ':1880/broker'
    }

    ws = new WebSocket(url)

    //display the initial status
    websocketStatus.value = ws.readyState

    // start the reconnect timer
    wsReconnectTimer = setInterval(connectWS, 5000)

    // start the websocket status timer
    ws.onopen = () => {
        websocketStatus.value = ws.readyState
        wsReadyStateTimer = setInterval(() => { websocketStatus.value = ws.readyState }, 1000)
        setTimeout(
            () => {
                websocketPublish({
                    payload: new Date().getTime(),
                    topic: 'controls/refresh',
                })
            },
            1000,
        )
    }


    // cancel the websocket status timer
    ws.onclose = () => {
        clearInterval(wsReadyStateTimer)
        wsReadyStateTimer = null
        websocketStatus.value = ws.readyState
    }

    // log errors
    ws.onerror = (event) => {
        const text = JSON.stringify(event, undefined, 1)
        console.error(text)
        showAlert('error', 'ws.onerror', text)
    }

    // update models based on messages received from the back end
    ws.onmessage = (event) => {
        // node-red's msg object is received as a JSON
        // string in event.data
        const msg = JSON.parse(event.data)
        messageCount.value += 1
        lastMessage.value = msg
        if (msg.topic == 'timer/model') {
            timerModel.value = msg.payload
            return
        }
        if (msg.topic == 'powerview/model') {
            powerviewModel.value = msg.payload
            return
        }
        if (msg.topic == 'powerview/status') {
            powerviewStatus.value = msg.payload
            return
        }
        if (msg.topic == 'settings/lighting') {
            if (settingsLighting.value != msg.payload) {
                settingsLighting.value = msg.payload
            }
            return
        }
        if (msg.topic == 'settings/shades') {
            if (settingsShades.value != msg.payload) {
                settingsShades.value = msg.payload
            }
            return
        }
        if (msg.topic == 'settings/bedtime') {
            if (settingsBedtime.value != msg.payload) {
                settingsBedtime.value = msg.payload
            }
            return
        }
        if (/.+\/error$/.exec(msg.topic)) {
            const text = JSON.stringify(msg.payload, undefined, 1)
            console.error(text)
            if (msg.payload !== '') {
                showAlert('error', msg.topic, text)
            }
            return
        }
        if (/.+\/warning$/.exec(msg.topic)) {
            const text = JSON.stringify(msg.payload, undefined, 1)
            console.warn(text)
            if (msg.payload !== '') {
                showAlert('warning', msg.topic, text)
            }
            return
        }
        if (/.+\/info$/.exec(msg.topic)) {
            const text = JSON.stringify(msg.payload, undefined, 1)
            console.log(text)
            if (msg.payload !== '') {
                showAlert('info', msg.topic, text)
            }
            return
        }
        let matches = /^hue\/([^/]+)\/resource\/([^/]+)\/([^/]+)$/.exec(msg.topic)
        if (matches?.length == 4) {
            handleHueResource(matches[1], matches[2], matches[3], msg.payload)
            return
        }
        matches = /^hue\/([^/]+)$/.exec(msg.topic)
        if (matches?.length == 2) {
            const bridge = hueBridges.value[matches] || {}
            for (let property of Object.getOwnPropertyNames(msg.payload)) {
                bridge[property] = msg.payload[property]
            }
            hueBridges.value[matches[1]] = bridge
            return
        }
        matches = /^hue\/([^/]+)\/(title|status)$/.exec(msg.topic)
        if (matches?.length == 3) {
            const bridge = hueBridges.value[matches[1]] || {}
            bridge[matches[2]] = msg.payload
            hueBridges.value[matches[1]] = bridge
            return
        }
    }
}

connectWS()

//////////////////////////////////////////////////////////////////////////////

app.mount('#app')
