<template>
    <fieldset>
        <legend>Timer</legend>
        <table>
            <tr v-for="(pair, index) in sorted(timer)" :key="index">
                <th>{{ pair[0] }}</th>
                <td>{{ localeString(pair[1]) }}</td>
            </tr>
        </table>
    </fieldset>
</template>

<style scoped>
/* */
</style>

<script setup>
import { inject } from 'vue'

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
