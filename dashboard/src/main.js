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
let cachedHueModels = {}

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

// model for settings/lighting messages
const settingsLighting = ref(false)
app.provide('settingsLighting', settingsLighting)

// model for settings/shades messages
const settingsShades = ref(false)
app.provide('settingsShades', settingsShades)

// model for automation/trigger event messages
const automationTrigger = ref(null)
app.provide('automationTrigger', automationTrigger)

// model for daily/sunrise event messages
const dailySunrise = ref(null)
app.provide('dailySunrise', dailySunrise)

// model for daily/sunset event messages
const dailySunset = ref(null)
app.provide('dailySunset', dailySunset)

// model for daily/bedtime event messages
const dailyBedtime = ref(null)
app.provide('dailyBedtime', dailyBedtime)

// model for daily/theme event messages
const dailyTheme = ref(null)
app.provide('dailyTheme', dailyTheme)

// model for timer/time event messages
const timerTime = ref(null)
app.provide('timerTime', timerTime)

// value for title slot of a v-alert
// used to display error messages
// in AlertComponent.vue
const errorTitle = ref(null)
app.provide('errorTitle', errorTitle)

// text to display in a v-alert
// used to display error messages
// in AlertComponent.vue
const errorText = ref(null)
app.provide('errorText', errorText)

// model for a v-alert used to display
// error messages in AlertComponent.vue
const showError = ref(false)
app.provide('showError', showError)

// value for title slot of a v-alert
// used to display warning messages
// in AlertComponent.vue
const warningTitle = ref(null)
app.provide('warningTitle', warningTitle)

// text to display in a v-alert
// used to display warning messages
// in AlertComponent.vue
const warningText = ref(null)
app.provide('warningText', warningText)

// model for a v-alert used to display
// warning messages in AlertComponent.vue
const showWarning = ref(false)
app.provide('showWarning', showWarning)

// model for hue/{address}/key messages
const hueKeys = ref({})
app.provide('hueKeys', hueKeys)

// model for HueBridgesComponent.vue
const hueBridges = ref({})
app.provide('hueBridges', hueBridges)

// model for HueControlsComponent.vue, based
// on contents of cachedHueModels, updated
// each time a hue/{address}/model event
// message is received
const hueModels = ref([])
app.provide('hueModels', hueModels)

// model for PowerViewControls.vue, updated
// each time a powerview/model event message
// is received
const powerviewModel = ref([])
app.provide('powerviewModel', powerviewModel)

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

        console.log(JSON.stringify(event, undefined, 1))

    }

    // update models based on messages received from the back end
    ws.onmessage = (event) => {

        // node-red's msg object is received as a JSON
        // string in event.data
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
            errorTitle.value = 'Invalid settings/bedtime payload'
            errorText.value = msg.payload
            showError.value = true
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

            cachedHueModels[matches[1]] = msg.payload
            const sorted = []

            for (let label in cachedHueModels) {

                sorted.push(cachedHueModels[label])

            }

            sorted.sort((a, b) => { return a.title.localeCompare(b.title) })
            hueModels.value = sorted
            return

        }
    }
}

connectWS()

//////////////////////////////////////////////////////////////////////////////

app.mount('#app')