<template>

    <div class="wrapped">

        <fieldset>

            <legend>Back End</legend>

            <v-btn @click="refreshControls">Refresh Controls</v-btn>

            <div :class="wsStatusClass(websocketStatus)">{{ wsStatusText(websocketStatus) }}</div>

        </fieldset>

        <fieldset :disabled="websocketStatus != 1">

            <legend>Hue Bridges</legend>

            <v-table v-for="bridge in hueBridges" :key="bridge.id">
                <tr>
                    <th>address</th>
                    <td>{{ bridge.address }}</td>
                </tr>
                <tr>
                    <th>port</th>
                    <td>{{ bridge.port }}</td>
                </tr>
                <tr>
                    <th>id</th>
                    <td>{{ bridge.id }}</td>
                </tr>
                <tr>
                    <th>model</th>
                    <td>{{ bridge.model }}</td>
                </tr>
                <tr>
                    <th>name</th>
                    <td>{{ bridge.name }}</td>
                </tr>
                <tr>
                    <th>host</th>
                    <td>{{ bridge.host }}</td>
                </tr>
                <tr>
                    <th>key</th>
                    <td v-if="hueKeys[bridge.address]">{{ hueKeys[bridge.address] }}</td>
                    <td v-else><v-btn @click="createHueKey(bridge.address)">create key</v-btn></td>
                </tr>
                <tr>
                    <th>status</th>
                    <td :class="esStatusClass(bridge.status)">{{ esStatusText(bridge.status) }}</td>
                </tr>
            </v-table>

        </fieldset>

        <fieldset>

            <legend>Timer</legend>

            <v-table>
                <tr v-if="time !== null">
                    <th>Now</th>
                    <td>{{ time }}</td>
                </tr>
                <tr v-if="dailySunrise !== null">
                    <th>Sunrise</th>
                    <td>{{ new Date(dailySunrise).toLocaleString() }}</td>
                </tr>
                <tr v-if="noon !== null">
                    <th>Noon</th>
                    <td>{{ noon }}</td>
                </tr>
                <tr v-if="dailySunset !== null">
                    <th>Sunset</th>
                    <td>{{ new Date(dailySunset).toLocaleString() }}</td>
                </tr>
                <tr v-if="dailyBedtime !== null">
                    <th>Bedtime</th>
                    <td>{{ new Date(dailyBedtime).toLocaleString() }}</td>
                </tr>
                <tr v-if="dailyTheme !== null">
                    <th>Theme</th>
                    <td>{{ dailyTheme }}</td>
                </tr>
                <tr v-if="timerTime !== null">
                    <th>Time</th>
                    <td>{{ timerTime }}</td>
                </tr>
                <tr v-if="altitude !== null">
                    <th>Altitude</th>
                    <td>{{ altitude }}</td>
                </tr>
                <tr v-if="azimuth !== null">
                    <th>Azimuth</th>
                    <td>{{ azimuth }}</td>
                </tr>
            </v-table>

            <v-sheet v-if="automationTrigger !== null" color="tertiary" theme="light">
                <pre>{{ formatAutomationTrigger(automationTrigger) }}</pre>
            </v-sheet>

        </fieldset>

    </div>

</template>

<style scoped>
th,
td {
    margin: 1px;
    padding: 1px 0.5em 1px 0.5em;
}

th {
    text-align: right;
}

.ws-disconnected,
.es-disconnected {
    color: white;
    background-color: darkred;
}

.ws-connecting,
.ws-closing,
.es-connecting {
    color: black;
    background-color: yellow;
}

.ws-connected,
.es-connected {
    color: white;
    background-color: darkgreen;
}
</style>

<script setup>

import { ref, inject } from 'vue'
import suncalc from 'suncalc'

const LATITUDE = 43.019670
const LONGITUDE = -89.303820

const dailySunrise = inject('dailySunrise')
const dailySunset = inject('dailySunset')
const dailyBedtime = inject('dailyBedtime')
const dailyTheme = inject('dailyTheme')
const timerTime = inject('timerTime')
const websocketStatus = inject('websocketStatus')
const hueBridges = inject('hueBridges')
const hueKeys = inject('hueKeys')
const websocketPublish = inject('websocketPublish')
const automationTrigger = inject('automationTrigger')

const time = ref(null)
const noon = ref(null)
const altitude = ref(null)
const azimuth = ref(null)

function updateTimes() {

    const now = new Date()

    const oneAM = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(), 1)

    const times = suncalc.getTimes(oneAM, LATITUDE, LONGITUDE)
    const position = suncalc.getPosition(now, LATITUDE, LONGITUDE)

    time.value = now.toLocaleString()
    noon.value = times.solarNoon.toLocaleString()
    altitude.value = position.altitude
    azimuth.value = position.azimuth

}

setInterval(updateTimes, 60000)
updateTimes()

function refreshControls() {

    websocketPublish({ payload: new Date().getTime(), topic: 'controls/refresh' })

}

function formatAutomationTrigger(automationTrigger) {

    const trigger = {}

    for (let property in automationTrigger) {

        trigger[property] = automationTrigger[property]

    }

    trigger.timestamp = new Date(trigger.timestamp).toLocaleString()
    return trigger

}

function esStatusText(status) {

    switch (status) {

        case 0:
            return 'connecting'

        case 1:
            return 'connected'

        default:
            return 'disconnected'
    }
}

function esStatusClass(status) {

    switch (status) {

        case 0:
            return 'es-connecting'

        case 1:
            return 'es-connected'

        default:
            return 'es-disconnected'
    }
}

function wsStatusText(status) {

    switch (status) {

        case 0:
            return 'connecting'

        case 1:
            return 'connected'

        case 2:
            return 'disconnecting'

        default:
            return 'disconnected'
    }
}

function wsStatusClass(status) {

    switch (status) {

        case 0:
            return 'ws-connecting'

        case 1:
            return 'ws-connected'

        case 2:
            return 'ws-disconnecting'

        default:
            return 'ws-disconnected'
    }
}

function createHueKey(address) {

    websocketPublish({
        payload: address,
        topic: 'put/hue/create-key'
    })

}

</script>