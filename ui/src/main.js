/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp, ref } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)

//////////////////////////////////////////////////////////////////////////////
// provide models for ui components based on messages received from the
// back end using a websocket
//////////////////////////////////////////////////////////////////////////////

// items for v-select corresponding to settings/bedtime messages
// in SettingsComponent.vue (see settingsBedtime)
const bedtimeOptions = ref([
    { label: '9PM', hour: 21 },
    { label: '10PM', hour: 22 },
    { label: '11PM', hour: 23 },
])

app.provide('bedtimeOptions', bedtimeOptions)

const settingsBedtime = ref(bedtimeOptions.value[0])
app.provide('settingsBedtime', settingsBedtime)

const currentBedtime = ref(0)
app.provide('currentBedtime', currentBedtime)

const settingsLighting = ref(false)
app.provide('settingsLighting', settingsLighting)

const settingsShades = ref(false)
app.provide('settingsShades', settingsShades)

const alerts = ref([])
app.provide('alerts', alerts)

const hueBridges = ref([])
app.provide('hueBridges', hueBridges)

const hueModel = ref([])
app.provide('hueModel', hueModel)

const powerviewModel = ref([])
app.provide('powerviewModel', powerviewModel)

const powerviewStatus = ref(0)
app.provide('powerviewStatus', powerviewStatus)

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

function showAlert(type, title, text) {
    alerts.value.push({
        show: true,
        type: type,
        title: new Date().toLocaleString() + '\t| ' + title,
        text: text,
    })
}

app.provide('showAlert', showAlert)

// send the given message to the back end using the websocket connection
function websocketPublish(msg) {

    if (ws === null) {

        const text = JSON.stringify(msg, undefined, 1)

        console.log('websocket closed when attempting to send:\n' + text)
        showAlert('warning', 'websocket closed', text)
        return

    }

    ws.send(JSON.stringify(msg))

}

app.provide('websocketPublish', websocketPublish)

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

        console.log(text)
        showAlert('error', 'ws.onerror', text)

    }

    // update models based on messages received from the back end
    ws.onmessage = (event) => {

        // node-red's msg object is received as a JSON
        // string in event.data
        const msg = JSON.parse(event.data)

        if (msg.topic == 'timer/time') {

            console.log(JSON.stringify(msg, undefined, 4))
            return

        }

        if (msg.topic == 'current/timer/theme') {

            console.log(JSON.stringify(msg, undefined, 4))
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

            settingsLighting.value = msg.payload
            return

        }

        if (msg.topic == 'settings/shades') {

            settingsShades.value = msg.payload
            return

        }

        if (msg.topic == 'settings/bedtime') {

            for (let option of bedtimeOptions.value) {

                if (option.hour == msg.payload) {

                    settingsBedtime.value = option
                    return

                }
            }

            const text = JSON.stringify(msg.payload, undefined, 1)

            console.log('no bedtime option found matching ' + text)
            showAlert('error', 'Invalid settings/bedtime payloader', text)
            return

        }

        if (msg.topic == 'hue/model') {

            hueModel.value = msg.payload
            return
        }

        if (msg.topic == 'hue/bridges') {

            hueBridges.value = msg.payload
            return
        }

        if (msg.topic == 'automation/trigger') {

            console.log(JSON.stringify(msg, undefined, 4))
            return

        }

        if (msg.topic == 'current/timer/time/bedtime') {

            currentBedtime.value = msg.payload
            return
        }

        if (/^.+\/error$/.exec(msg.topic)) {

            const text = JSON.stringify(msg.payload, undefined, 1)
            console.log(text)

            if (msg.payload !== '') {

                showAlert('error', msg.topic, text)
            }

            return

        }

        if (/^.+\/warning$/.exec(msg.topic)) {

            const text = JSON.stringify(msg.payload, undefined, 1)
            console.log(text)

            if (msg.payload !== '') {

                showAlert('warning', msg.topic, text)
            }

            return

        }

        if (/^.+\/info$/.exec(msg.topic)) {

            const text = JSON.stringify(msg.payload, undefined, 1)
            console.log(text)

            if (msg.payload !== '') {

                showAlert('info', msg.topic, text)
            }

            return

        }

        let matches = /^current\/timer\/time\/([^/]+)$/.exec(msg.topic)

        if (Array.isArray(matches) && (matches.length == 2)) {

            msg.at = new Date(msg.at).toLocaleString()
            console.log(JSON.stringify(msg, undefined, 4))
            return
        }

        matches = /^hue\/(.+)\/key$/.exec(msg.topic)

        if (Array.isArray(matches) && (matches.length == 2)) {

            hueKeys.value[matches[1]] = msg.payload
            return

        }
    }
}

connectWS()

//////////////////////////////////////////////////////////////////////////////

app.mount('#app')