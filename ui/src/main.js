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
import { createApp, ref, watch } from 'vue'

const app = createApp(App)

registerPlugins(app)

//////////////////////////////////////////////////////////////////////////////
// provide models for ui components based on messages received from the
// back end using a websocket
//////////////////////////////////////////////////////////////////////////////

const settingsBedtime = ref(21)
app.provide('settingsBedtime', settingsBedtime)

const settingsBedtimeLabel = ref(null)
app.provide('settingsBedtimeLabel', settingsBedtimeLabel)

watch(settingsBedtime, () => websocketPublish({
    topic: 'settings/bedtime',
    payload: settingsBedtime.value,
    retain: true,
    label: 'user',
}))

const settingsLighting = ref(false)
app.provide('settingsLighting', settingsLighting)

const settingsLightingLabel = ref(null)
app.provide('settingsLightingLabel', settingsLightingLabel)

watch(settingsLighting, () => websocketPublish({
    topic: 'settings/lighting',
    payload: settingsLighting.value,
    retain: true,
    label: 'user',
}))

const settingsShades = ref(false)
app.provide('settingsShades', settingsShades)

const settingsShadesLabel = ref(null)
app.provide('settingsShadesLabel', settingsShadesLabel)

watch(settingsShades, () => websocketPublish({
    topic: 'settings/shades',
    payload: settingsShades.value,
    retain: true,
    label: 'user',
}))

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

const timerTheme = ref('')
app.provide('timerTheme', timerTheme)

const automationTrigger = ref(null)
app.provide('automationTrigger', automationTrigger)

const timerTime = ref({})
app.provide('timerTime', timerTime)

const nextTrigger = ref(null)
app.provide('nextTrigger', nextTrigger)

function updateNextTrigger() {
    const date = new Date()
    const now = date.getTime()
    const times = []
    for (let label in timerTime.value) {
        times.push({
            time: timerTime.value[label],
            label: label,
        })
    }
    times.sort((a, b) => a.time - b.time)
    for (let time of times) {
        if (time.time > now) {
            if (nextTrigger.value?.time != time.time) {
                nextTrigger.value = time
            }
            return
        }
    }
    nextTrigger.value = null
    console.error(
        'no trigger time found at ' + date.toLocaleString(),
        JSON.stringify(timerTime.value, undefined, 4),
    )
}

function timerThemeColor(value) {
    if (!value) {
        value = timerTheme.value
    }
    switch (value) {
        case 'tribal':
            return 'blue-darken-3'
        case 'spooky':
            return 'orange-darken-3'
        case 'jolly':
            return 'light-green-darken-3'
        default:
            return 'amber'
    }
}

app.provide('timerThemeColor', timerThemeColor)

function timerThemeIcon(value) {
    if (!value) {
        value = timerTheme.value
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

function shadesSettingsIcon() {
    return settingsShades.value ? 'mdi-blinds-open' : 'mdi-blinds'
}

app.provide('shadesSettingsIcon', shadesSettingsIcon)

function lightingSettingsIcon() {
    return settingsLighting.value ? 'mdi-lightbulb-on' : 'mdi-lightbulb'
}

app.provide('lightingSettingsIcon', lightingSettingsIcon)

function settingsColor(value) {
    return value ? 'primary' : 'secondary'
}

app.provide('settingsColor', settingsColor)

function settingsText(value) {
    return value ? 'enabled' : 'disabled'
}

app.provide('settingsText', settingsText)

function timerTimeIcon(value) {
    if (!value) {
        value = timerTime.value
    }
    switch (value) {
        case 'sunrise':
            return 'mdi-weather-sunset-up'
        case 'midday':
            return 'mdi-sun-angle-outline'
        case 'afternoon':
            return 'mdi-sun-angle'
        case 'sunset':
            return 'mdi-weather-sunset-down'
        case 'dusk':
            return 'mdi-blinds'
        case 'bedtime':
            return 'mdi-weather-night'
        default:
            return 'mdi-cog-off'
    }
}

app.provide('timerTimeIcon', timerTimeIcon)

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
        console.warn('websocket closed when attempting to send:\n' + text)
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
        console.error(text)
        showAlert('error', 'ws.onerror', text)
    }

    // update models based on messages received from the back end
    ws.onmessage = (event) => {
        // node-red's msg object is received as a JSON
        // string in event.data
        const msg = JSON.parse(event.data)
        console.log(JSON.stringify(msg, undefined, 4))
        if (msg.topic == 'current/automation/trigger') {
            automationTrigger.value = msg.payload
            updateNextTrigger()
            return
        }
        if (msg.topic == 'current/timer/theme') {
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
            settingsLightingLabel.value = msg.label
            if (settingsLighting.value != msg.payload) {
                settingsLighting.value = msg.payload
            }
            return
        }
        if (msg.topic == 'settings/shades') {
            settingsShadesLabel.value = msg.label
            if (settingsShades.value != msg.payload) {
                settingsShades.value = msg.payload
            }
            return
        }
        if (msg.topic == 'settings/bedtime') {
            settingsBedtimeLabel.value = msg.label
            if (settingsBedtime.value != msg.payload) {
                settingsBedtime.value = msg.payload
            }
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
        let matches = /^current\/timer\/time\/([^/]+)$/.exec(msg.topic)
        if (Array.isArray(matches) && (matches.length == 2)) {
            timerTime.value[matches[1]] = msg.payload
            updateNextTrigger()
            return
        }
    }
}

connectWS()

//////////////////////////////////////////////////////////////////////////////

app.mount('#app')
