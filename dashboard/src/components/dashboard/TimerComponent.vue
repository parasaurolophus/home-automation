<template>
    <fieldset :disabled="websocketStatus != 1">
        <legend>Timer</legend>
        <table>
            <tr v-for="(pair, index) in timerValues" :key="index">
                <th :class="{ selected: pair[0] == timerTime }">
                    <a @click="websocketPublish({ payload: pair[0], topic: 'timer/time' })">
                        {{ pair[0] }}
                    </a>
                </th>
                <td :class="{ selected: pair[0] == nextTrigger() }">
                    {{ localeString(pair[1]) }}
                </td>
            </tr>
        </table>
    </fieldset>
</template>

<style scoped>
.selected {
    border: thin solid;
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
</script>
