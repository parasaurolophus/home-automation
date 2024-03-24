<template>
    <div>
        <fieldset>
            <legend>debug/timer/theme</legend>
            <v-text>{{ timerTheme }}</v-text>
        </fieldset>
    </div>
    <div>
        <fieldset :disabled="websocketStatus != 1">
            <legend>^debug/timer/time/([^/]+)$</legend>
            <table>
                <tr v-for="(pair, index) in timerValues" :key="index">
                    <th :class="{ 'last-time': pair[0] == timerTime }">
                        <a @click="websocketPublish({ payload: pair[0], topic: 'timer/time' })">
                            {{ pair[0] }}
                        </a>
                    </th>
                    <td :class="{ 'next-time': pair[0] == nextTrigger(), 'last-time': pair[0] == lastTrigger() }">
                        {{ localeString(pair[1]) }}
                    </td>
                </tr>
            </table>
        </fieldset>
    </div>
</template>

<style scoped>
.last-time {
    border: thin solid;
}

.next-time {
    border: thin dashed;
}

a:hover {
    text-decoration: underline;
    cursor: pointer;
}
</style>

<script setup>
import { inject } from 'vue'

const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')
const timerValues = inject('timerValues')
const timerTime = inject('timerTime')
const trigger = inject('trigger')
const timerTheme = inject('timerTheme')

function localeString(t) {
    return new Date(t).toLocaleString()
}

function nextTrigger() {

    const now = new Date().getTime()

    for (let pair of timerValues.value) {

        if (pair[1] > now) {
            return pair[0]
        }
    }

    return ''
}

function lastTrigger() {

    if (typeof (trigger.value) == 'object') {
        return trigger.value["timer/time"]
    }

    return trigger.value
}
</script>
