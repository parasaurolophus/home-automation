<template>
    <v-card>
        <v-card-item>
            <v-card-title>
                Bedtime
            </v-card-title>
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
import { inject, onMounted, ref, watch } from 'vue'

const settingsBedtime = inject('settingsBedtime')
const timerModel = inject('timerModel')
const websocketPublish = inject('websocketPublish')

const localeString = ref('broken')
const bedtimeIndex = ref(0)

onMounted(mount)

watch(timerModel, updateLocaleString, { deep: true })
watch(settingsBedtime, updateBedtimeIndex)

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

function mount() {
    updateLocaleString()
    updateBedtimeIndex()
}

function updateBedtimeIndex() {

    const selected = settingsBedtime.value - bedtimeOptions[0].hour

    if (selected < 0 || selected >= bedtimeOptions.length) {
        console.error('unsupported settingsBedtime value: ' + settingsBedtime.value)
        console.
            return
    }

    if (bedtimeIndex.value != selected) {
        bedtimeIndex.value = selected
    }
}

function updateSettingsBedtime(selected) {

    if (settingsBedtime.value != bedtimeOptions[selected].hour) {
        settingsBedtime.value = bedtimeOptions[selected].hour
        websocketPublish({
            topic: 'settings/bedtime',
            payload: settingsBedtime.value,
            retain: true,
            label: 'user',
        })
    }
}

function updateLocaleString() {
    if (timerModel.value.bedtime) {
        localeString.value = new Date(timerModel.value.bedtime).toLocaleString()
    } else {
        localeString.value = 'not specified'
    }
}
</script>
