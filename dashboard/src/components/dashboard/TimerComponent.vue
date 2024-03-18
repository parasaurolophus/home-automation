<template>
    <fieldset :disabled="websocketStatus != 1">
        <legend>Timer</legend>
        <table>
            <tr v-for="(pair, index) in timerValues" :key="index">
                <th :class="{ 'last-time': pair[0] == timerTime }">
                    <a @click="websocketPublish({ payload: pair[0], topic: 'timer/time' })">
                        {{ pair[0] }}
                    </a>
                </th>
                <td :class="{ 'next-trigger': pair[0] == nextTrigger(), 'last-time': pair[0] == lastTrigger() }">
                    {{ localeString(pair[1]) }}
                </td>
            </tr>
        </table>
    </fieldset>
</template>

<style scoped>
.next-trigger {
    border: thin solid;
}
.last-time {
    color: darkmagenta;
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

    if (typeof(trigger.value) == 'object') {
        return trigger.value["timer/time"]
    }

    return trigger.value
}
</script>
