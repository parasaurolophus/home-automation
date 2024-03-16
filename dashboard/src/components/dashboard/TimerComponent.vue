<template>
    <fieldset>
        <legend>Timer</legend>
        <table>
            <tr v-for="(pair, index) in sorted(timer)" :key="index">
                <th>{{ pair[0] }}</th>
                <td>{{ pair[1] }}</td>
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
    return result.sort((a, b) => {
        const v1 = a[1]
        const v2 = b[1]
        if (v1 == v2) {
            return 0
        }
        if (v1 < v2) {
            return -1
        }
        return 1
    })
}
</script>
