<template>
    <v-table>
        <thead>
            <tr>
                <th>Label</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="label">theme</td>
                <td class="label">{{ timerTheme }}</td>
            </tr>
            <tr v-for="(time, index) in timerTimes" :key="index">
                <td class="label">{{ time.label }}</td>
                <td>{{ new Date(time.value).toLocaleString() }}</td>
            </tr>
        </tbody>
    </v-table>
</template>

<style scoped>
.label {
    font-family: monospace;
}
</style>

<script setup>
import { inject, onMounted, ref, watch } from 'vue'

const timerModel = inject('timerModel')

const timerTheme = ref('')
const timerTimes = ref([])

onMounted(updateTimer)
watch(timerModel, updateTimer, { deep: true })

function updateTimer() {
    timerTheme.value = timerModel.value.theme
    const times = []
    for (let label of Object.getOwnPropertyNames(timerModel.value)) {
        if (label != 'theme') {
            times.push({
                label: label,
                value: timerModel.value[label]
            })
        }
    }
    times.sort((a, b) => a.value - b.value)
    timerTimes.value = times
}
</script>