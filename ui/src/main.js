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

// cached payloads of hue/{address}/model messages as they arrive
// (see hueModels)
const cachedHueModels = {}

// items for v-select corresponding to settings/bedtime messages
// in SettingsComponent.vue (see settingsBedtime)
const bedtimeOptions = ref([
    { label: '9PM', hour: 21 },
    { label: '10PM', hour: 22 },
    { label: '11PM', hour: 23 },
])
app.provide('bedtimeOptions', bedtimeOptions)

// model for settings/bedtime messages
// (the value of this must match the .hour of
// one of the bedtimeOptions)
const settingsBedtime = ref(bedtimeOptions.value[0])
app.provide('settingsBedtime', settingsBedtime)
const settingsBedtimeLabel = ref('')
app.provide('settingsBedtimeLabel', settingsBedtimeLabel)

// model for settings/lighting messages
const settingsLighting = ref(false)
app.provide('settingsLighting', settingsLighting)
const settingsLightingLabel = ref('')
app.provide('settingsLightingLabel', settingsLightingLabel)

// model for settings/shades messages
const settingsShades = ref(false)
app.provide('settingsShades', settingsShades)
const settingsShadesLabel = ref('')
app.provide('settingsShadesLabel', settingsShadesLabel)

// models for alerts
const alerts = ref([])
app.provide('alerts', alerts)

// model for HueBridgesComponent.vue
const hueBridges = ref([])
app.provide('hueBridges', hueBridges)

// model for HueControlsComponent.vue, based
// on contents of cachedHueModels, updated
// each time a hue/{address}/model event
// message is received
const hueModel = ref([])
app.provide('hueModel', hueModel)

// model for PowerViewControls.vue, updated
// each time a powerview/model event message
// is received
const powerviewModel = ref([])
app.provide('powerviewModel', powerviewModel)

// model for ConnectionsDiagramComponent.vue,
// update each time a powerview/status event
// message is received
const powerviewStatus = ref(0)
app.provide('powerviewStatus', powerviewStatus)

const timerValues = ref([])
app.provide('timerValues', timerValues)

// model for timer event debugging output
const timerTime = ref('')
app.provide('timerTime', timerTime)

// model for timer theme debugging output
const timerTheme = ref('')
app.provide('timerTheme', timerTheme)

// model for trigger event debugging output
const trigger = ref("none received since\npage last reloaded")
app.provide('trigger', trigger)

// model for hue/{address}/key messages
const hueKeys = ref({})
app.provide('hueKeys', hueKeys)

//////////////////////////////////////////////////////////////////////////////
// get hue keys then invoke after()
//////////////////////////////////////////////////////////////////////////////

function getHueKeys(after) {

    const matches = /^([^:]+):\/\/([^:]+).*$/.exec(window.location)
    let url = 'http://127.0.0.1:1880/hue-keys'

    if (Array.isArray(matches) && (matches.length == 3)) {

        url = matches[1] + '://' + matches[2] + ':1880/hue-keys'

    }

    const request = new Request(url)

    fetch(request)

        .then((response) => {

            if (!response.ok) {

                console.log(response)
                alerts.value.push({
                    show: true,
                    title: 'error getting hue keys',
                    type: 'error',
                    text: JSON.stringify(response, undefined, 1)
                })
                return null

            }

            return response.blob()

        })

        .then(async (blob) => {

            if (blob) {

                hueKeys.value = JSON.parse(await blob.text())

            } else {

                console.log('hue-keys blob is null')

            }

            after()

        })
}

//////////////////////////////////////////////////////////////////////////////
// Trigger the Hue key creation flow
//////////////////////////////////////////////////////////////////////////////

function createHueKey(address) {

    websocketPublish({
        payload: address,
        topic: 'put/hue/create-key'
    })
}

app.provide('createHueKey', createHueKey)

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

        console.log('websocket closed when attempting to send:\n' + text)
        alerts.value.push({
            show: true,
            title: 'websocket closed',
            type: 'warning',
            text: text
        })
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
        alerts.value.push({
            show: true,
            title: 'ws.onerror',
            type: 'error',
            text: text
        })

    }

    // update models based on messages received from the back end
    ws.onmessage = (event) => {

        // node-red's msg object is received as a JSON
        // string in event.data
        const msg = JSON.parse(event.data)

        if (msg.topic == 'timer/time') {

            timerTime.value = msg.payload
            return

        }

        if (msg.topic == 'debug/timer/theme') {

            timerTheme.value = msg.payload
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
            settingsLightingLabel.value = msg.label
            return

        }

        if (msg.topic == 'settings/shades') {

            settingsShades.value = msg.payload
            settingsShadesLabel.value = msg.label
            return

        }

        if (msg.topic == 'settings/bedtime') {

            for (let option of bedtimeOptions.value) {

                if (option.hour == msg.payload) {

                    settingsBedtime.value = option
                    settingsBedtimeLabel.value = msg.label
                    return

                }
            }

            const text = JSON.stringify(msg.payload, undefined, 1)

            console.log('no bedtime option found matching ' + text)
            alerts.value.push({
                show: true,
                title: 'Invalid settings/bedtime payload',
                type: 'error',
                text: text
            })
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

        if (msg.topic == 'debug/automation/trigger') {

            trigger.value = msg.payload
            return

        }

        if (/^.+\/error$/.exec(msg.topic)) {

            const text = JSON.stringify(msg.payload, undefined, 1)
            console.log(text)

            if (msg.payload !== '') {

                alerts.value.push({
                    show: true,
                    title: msg.topic,
                    type: 'error',
                    text: text
                })
            }

            return

        }

        if (/^.+\/warning$/.exec(msg.topic)) {

            const text = JSON.stringify(msg.payload, undefined, 1)
            console.log(text)

            if (msg.payload !== '') {

                alerts.value.push({
                    show: true,
                    title: msg.topic,
                    type: 'warning',
                    text: text
                })
            }

            return

        }

        if (/^.+\/info$/.exec(msg.topic)) {

            const text = JSON.stringify(msg.payload, undefined, 1)
            console.log(text)

            if (msg.payload !== '') {

                alerts.value.push({
                    show: true,
                    title: msg.topic,
                    type: 'info',
                    text: text
                })
            }

            return

        }

        let matches = /^debug\/timer\/time\/([^/]+)$/.exec(msg.topic)

        if (Array.isArray(matches) && (matches.length == 2)) {

            if (msg.payload === '') {

                timerValues.value = timerValues.value.filter(pair => pair[0] != matches[1])
                return
            }

            const pairs = timerValues.value.filter(pair => pair[0] != matches[1]).concat([[matches[1], msg.payload]])
            pairs.sort((a, b) => a[1] - b[1])
            timerValues.value = pairs
            return
        }

        matches = /^hue\/(.+)\/key$/.exec(msg.topic)

        if (Array.isArray(matches) && (matches.length == 2)) {

            hueKeys.value[matches[1]] = msg.payload
            return

        }
    }
}

getHueKeys(connectWS)

//////////////////////////////////////////////////////////////////////////////

app.mount('#app')