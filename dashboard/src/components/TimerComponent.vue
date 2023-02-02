<template>

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

</template>

<style scoped>
fieldset>* {
    margin: 0.25em;
    padding: 0.25em;
}

th,
td {
    margin: 1px;
    padding: 1px 0.5em 1px 0.5em;
}

th {
    text-align: right;
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

function formatAutomationTrigger(automationTrigger) {

    const trigger = {}

    for (let property in automationTrigger) {

        trigger[property] = automationTrigger[property]

    }

    trigger.timestamp = new Date(trigger.timestamp).toLocaleString()
    return trigger

}

</script>