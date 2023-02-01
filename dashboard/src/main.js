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

var models = {}

const bedtimeOptions = ref([
    { label: '9PM', hour: 21 },
    { label: '10PM', hour: 22 },
    { label: '11PM', hour: 23 },
])

const settingsBedtime = ref(bedtimeOptions.value[0])
const settingsLighting = ref(false)
const settingsShades = ref(false)
const websocketStatus = ref(-1)
const automationTrigger = ref(null)
const dailySunrise = ref(null)
const dailySunset = ref(null)
const dailyBedtime = ref(null)
const dailyTheme = ref(null)
const timerTime = ref(null)
const errorTitle = ref(null)
const errorText = ref(null)
const showError = ref(false)
const warningTitle = ref(null)
const warningText = ref(null)
const showWarning = ref(false)
const hueKeys = ref({})
const hueBridges = ref({})
const hueModels = ref([])
const powerviewModel = ref([])

app.provide('bedtimeOptions', bedtimeOptions)
app.provide('settingsBedtime', settingsBedtime)
app.provide('settingsLighting', settingsLighting)
app.provide('settingsShades', settingsShades)
app.provide('websocketStatus', websocketStatus)
app.provide('powerviewModel', powerviewModel)
app.provide('hueModels', hueModels)
app.provide('hueBridges', hueBridges)
app.provide('automationTrigger', automationTrigger)
app.provide('dailySunrise', dailySunrise)
app.provide('dailySunset', dailySunset)
app.provide('dailyBedtime', dailyBedtime)
app.provide('dailyTheme', dailyTheme)
app.provide('timerTime', timerTime)
app.provide('errorTitle', errorTitle)
app.provide('errorText', errorText)
app.provide('warningTitle', warningTitle)
app.provide('warningText', warningText)
app.provide('showError', showError)
app.provide('showWarning', showWarning)
app.provide('hueKeys', hueKeys)

//////////////////////////////////////////////////////////////////////////////
// provide the function for ui components to send messages to the back end
// using a websocket
//////////////////////////////////////////////////////////////////////////////

// send the given message to the back end using the websocket connection
function websocketPublish(msg) {

    if (ws === null) {

        console.log('websocket closed when attempting to send:\n' + JSON.stringify(msg, undefined, 1))
        return

    }

    ws.send(JSON.stringify(msg))

}

app.provide('websocketPublish', websocketPublish)

///////////////////////////////////////////////////////////////////////////////
// connect to the back end using a websocket
///////////////////////////////////////////////////////////////////////////////

// websocket connection to the back end
var ws = null

// timer used to periodically update
// the websocket status display
var wsReadyStateTimer = null

// timer used to maintain the websocket
// connection to the back end
var wsReconnectTimer = null

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

        console.log(JSON.stringify(event, undefined, 1))

    }

    // update models based on messages received from the back end
    ws.onmessage = (event) => {

        const msg = JSON.parse(event.data)

        if (msg.topic == 'daily/sunrise') {

            dailySunrise.value = msg.payload
            return

        }

        if (msg.topic == 'daily/sunset') {

            dailySunset.value = msg.payload
            return

        }

        if (msg.topic == 'daily/bedtime') {

            dailyBedtime.value = msg.payload
            return

        }

        if (msg.topic == 'daily/theme') {

            dailyTheme.value = msg.payload
            return

        }

        if (msg.topic == 'timer/time') {

            timerTime.value = msg.payload
            return

        }

        if (msg.topic == 'automation/trigger') {

            automationTrigger.value = msg.payload
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

            console.log('no bedtime option found matching ' + JSON.stringify(msg.payload, undefined, 1))
            return

        }

        if (msg.topic == 'hue/bridges') {

            hueBridges.value = msg.payload
            return

        }

        if (/^.+\/error$/.exec(msg.topic)) {

            console.log(msg)

            if (msg.payload !== '') {

                errorTitle.value = msg.topic
                errorText.value = JSON.stringify(msg.payload, undefined, 1)
                showError.value = true

            }

            return

        }

        if (/^.+\/warning$/.exec(msg.topic)) {

            console.log(msg)

            if (msg.payload !== '') {

                warningTitle.value = msg.topic
                warningText.value = JSON.stringify(msg.payload, undefined, 1)
                showWarning.value = true

            }

            return

        }

        let matches = /^hue\/(.+)\/key$/.exec(msg.topic)

        if (Array.isArray(matches) && (matches.length == 2)) {

            hueKeys.value[matches[1]] = msg.payload
            return

        }

        if (msg.topic == 'powerview/model') {

            powerviewModel.value = msg.payload
            return

        }

        matches = /^hue\/([^/]+)\/model$/.exec(msg.topic)

        if (Array.isArray(matches) && (matches.length == 2)) {

            models[matches[1]] = msg.payload
            const sorted = []

            for (let label in models) {

                sorted.push(models[label])

            }

            sorted.sort((a, b) => { return a.title.localeCompare(b.title) })
            hueModels.value = sorted
            return

        }
    }
}

wsReconnectTimer = setInterval(connectWS, 5000)

connectWS()

//////////////////////////////////////////////////////////////////////////////

app.mount('#app')