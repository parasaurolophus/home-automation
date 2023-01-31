<template>

    <h2>Status</h2>

    <div class="wrapped">

        <fieldset>

            <legend>Connection</legend>

            <v-text-field :class="wsStatusClass(websocketStatus)" readonly label="Connection"
                :model-value="wsStatusText(websocketStatus)"></v-text-field>

            <v-btn @click="refreshControls">Refresh Controls</v-btn>

        </fieldset>

        <fieldset>

            <legend>Hue Bridges</legend>

            <div class="wrapped">

                <dl v-for="bridge in hueBridges" :key="bridge.id">
                    <dt>address</dt>
                    <dd>{{ bridge.address }}</dd>
                    <dt>port</dt>
                    <dd>{{ bridge.port }}</dd>
                    <dt>id</dt>
                    <dd>{{ bridge.id }}</dd>
                    <dt>model</dt>
                    <dd>{{ bridge.model }}</dd>
                    <dt>name</dt>
                    <dd>{{ bridge.name }}</dd>
                    <dt>host</dt>
                    <dd>{{ bridge.host }}</dd>
                    <dt>status</dt>
                    <dd :class="esStatusClass(bridge.status)">{{ esStatusText(bridge.status) }}</dd>
                </dl>

            </div>

        </fieldset>

        <fieldset v-if="showTime">

            <legend>Timer</legend>

            <v-table>
                <tr v-if="dailySunrise !== null">
                    <th>Sunrise</th>
                    <td>{{ new Date(dailySunrise).toLocaleString() }}</td>
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

import { inject } from 'vue'

const dailySunrise = inject('dailySunrise')
const dailySunset = inject('dailySunset')
const dailyBedtime = inject('dailyBedtime')
const dailyTheme = inject('dailyTheme')
const timerTime = inject('timerTime')
const websocketStatus = inject('websocketStatus')
const hueBridges = inject('hueBridges')
const websocketPublish = inject('websocketPublish')
const automationTrigger = inject('automationTrigger')

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

function showTime() {

    if (dailySunrise !== null) {

        return true

    }

    if (dailySunset !== null) {

        return true

    }

    if (dailyBedtime !== null) {

        return true

    }

    if (dailyTheme !== null) {

        return true

    }

    if (timerTime !== null) {

        return true

    }

    return false

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

</script>