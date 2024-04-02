<template>
    <v-btn-toggle mandatory v-model="bedtimeIndex">
        <v-btn v-for="(item, index) in bedtimeOptions" :key="index" @click="updateSettingsBedtime(index)">
            {{ item.label }}
        </v-btn>
    </v-btn-toggle>
</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue'

const settingsBedtime = inject('settingsBedtime')

// items for v-select corresponding to settings/bedtime messages
// in SettingsComponent.vue (see settingsBedtime)
const bedtimeOptions = [
    {
        label: '9PM',
        hour: 21,
    },
    {
        label: '10PM',
        hour: 22,
    },
    {
        label: '11PM',
        hour: 23,
    },
]

const bedtimeIndex = ref(0)

onMounted(updateBedtimeIndex)

watch(settingsBedtime, updateBedtimeIndex)

function updateBedtimeIndex() {

    const selected = settingsBedtime.value - bedtimeOptions[0].hour

    if (selected < 0 || selected >= bedtimeOptions.length) {
        console.log('unsupported settingsBedtime value: ' + settingsBedtime.value)
        return
    }

    bedtimeIndex.value = selected
}

function updateSettingsBedtime(selected) {

    if (settingsBedtime.value != bedtimeOptions[selected].hour) {
        settingsBedtime.value = bedtimeOptions[selected].hour
    }
}
</script>
