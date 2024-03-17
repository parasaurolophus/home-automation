<template>
    <fieldset :disabled="websocketStatus != 1">
        <legend>Timer</legend>
        <table>
            <tr v-for="(pair, index) in sorted(timer)" :key="index">
                <th>
                    <!--
                    <v-btn @click="websocketPublish({ payload: pair[0], topic: 'timer/time' })">
                        {{ pair[0] }}
                    </v-btn>
                    -->
                    <a @click="websocketPublish({ payload: pair[0], topic: 'timer/time' })">
                        {{ pair[0] }}
                    </a>
                </th>
                <td>{{ localeString(pair[1]) }}</td>
            </tr>
        </table>
    </fieldset>
</template>

<style scoped>
a:hover {
    text-decoration: underline;
    cursor: pointer;
}
</style>

<script setup>
import { inject } from 'vue'

const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')
const timer = inject('timer')

function sorted(obj) {
    const result = []
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            result.push([key, obj[key]])
        }
    }
    return result.sort((a, b) => { return a[1] - b[1] })
}

function localeString(t) {
    return new Date(t).toLocaleString()
}
</script>
