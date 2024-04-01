<template>
    <v-container>
        <v-row>
            <v-col>
                <v-switch v-model="settingsLighting">
                    <template #prepend>
                        <v-icon icon="mdi-lightbulb-group" :color="settingsLighting ? 'secondary' : 'primary'"></v-icon>
                    </template>
                </v-switch>
                Lighting automation
                <v-chip v-if="settingsLighting" variant="text" color="secondary">enabled</v-chip>
                <v-chip v-else variant="text" color="primary">disabled</v-chip>
            </v-col>
            <v-col class="align-center">
                <v-btn-toggle mandatory v-model="bedtimeToggle">
                    <v-btn v-for="(item, index) in bedtimeOptions" :key="index">
                        {{ item.label }}
                    </v-btn>
                </v-btn-toggle>
                Bedtime automation will be triggered at a randomly chosen time each day that is up to 30 minutes before
                or after the
                hour selected here; currently
                <v-chip variant="text" color="secondary">
                    {{ currentBedtime() }}
                </v-chip>
            </v-col>
            <v-col class="align-right">
                <v-switch v-model="settingsShades" class="align-right">
                    <template #append>
                        <v-icon icon="mdi-blinds" :color="settingsShades ? 'secondary' : 'primary'">
                        </v-icon>
                    </template>
                </v-switch>
                Shades automation
                <v-chip v-if="settingsShades" variant="text" color="secondary">enabled</v-chip>
                <v-chip v-else variant="text" color="primary">disabled</v-chip>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.align-right {
    justify-self: right;
    justify-content: right;
    justify-items: right;
    text-align: right;
}

.align-center {
    justify-self: center;
    justify-content: center;
    justify-items: center;
    text-align: center;
}
</style>

<script setup>
import { inject, ref, watch } from 'vue'

const settingsLighting = inject('settingsLighting')
const settingsShades = inject('settingsShades')
const settingsBedtime = inject('settingsBedtime')
const bedtimeOptions = inject('bedtimeOptions')
const websocketPublish = inject('websocketPublish')
const timerTime = inject('timerTime')

const bedtimeToggle = ref(settingsBedtime.value.hour - bedtimeOptions.value[0].hour)

watch(settingsLighting, (enabled) => {
    websocketPublish({ payload: enabled, topic: 'settings/lighting', retain: true, label: 'user' })
})

watch(settingsShades, (enabled) => {
    websocketPublish({ payload: enabled, topic: 'settings/shades', retain: true, label: 'user' })
})

watch(settingsBedtime, () => {

    const option = bedtimeOptions.value[0]
    const bedtime = settingsBedtime.value
    const selected = bedtime.hour - option.hour

    bedtimeToggle.value = selected
})

watch(bedtimeToggle, () => {

    const options = bedtimeOptions.value
    const index = bedtimeToggle.value
    const option = options[index]

    websocketPublish({ payload: option.hour, topic: 'settings/bedtime', retain: true, label: 'user' })
})

function currentBedtime() {

    if (Object.prototype.hasOwnProperty.call(timerTime.value, 'bedtime')) {
        return new Date(timerTime.value.bedtime).toLocaleString()
    }

    return 'unknown'
}
</script>
