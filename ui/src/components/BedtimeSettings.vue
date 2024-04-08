<template>
    <v-card>
        <v-card-item>
            <template #append>
                <v-icon :icon="timerThemeIcon()" />
            </template>
            <v-card-title>Bedtime</v-card-title>
            <v-card-subtitle>
                <v-chip color="primary">
                    {{ localeString }}
                </v-chip>
            </v-card-subtitle>
        </v-card-item>
        <v-card-text>
            <v-btn-toggle mandatory v-model="bedtimeIndex">
                <v-btn v-for="(item, index) in bedtimeOptions" :key="index" @click="updateSettingsBedtime(index)">
                    {{ item.label }}
                </v-btn>
            </v-btn-toggle>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue'

const timerThemeIcon = inject('timerThemeIcon')
const settingsBedtime = inject('settingsBedtime')
const timerTime = inject('timerTime')

const localeString = computed(() => new Date(timerTime.value.bedtime).toLocaleString())

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
        console.error('unsupported settingsBedtime value: ' + settingsBedtime.value)
        console.
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
