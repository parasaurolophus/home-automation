<template>
    <fieldset :disabled="websocketStatus != 1">
        <legend>Settings</legend>
        <v-switch v-model="settingsLighting">
            <template v-slot:label>
                Lighting automation
                {{ settingsLighting ? 'enabled' : 'disabled' }}
                ({{ settingsLightingLabel }})
            </template>
        </v-switch>
        <v-switch v-model="settingsShades">
            <template v-slot:label>
                Window shades automation
                {{ settingsShades ? 'enabled' : 'disabled' }}
                ({{ settingsShadesLabel }})
            </template>
        </v-switch>
        <p>
            Bedtime automation will be triggered at a randomly chosen time each day
            that is up to 30 minutes before or after the hour selected here:
        </p>
        <v-select v-model="settingsBedtime" :items="bedtimeOptions" item-title="label" item-value="hour" return-object
            single-line />
        ({{ settingsBedtimeLabel }})
    </fieldset>
</template>

<style scoped>
/*  */
</style>

<script setup>
import { inject, watch } from 'vue'

const settingsLighting = inject('settingsLighting')
const settingsLightingLabel = inject('settingsLightingLabel')
const settingsShades = inject('settingsShades')
const settingsShadesLabel = inject('settingsShadesLabel')
const settingsBedtime = inject('settingsBedtime')
const settingsBedtimeLabel = inject('settingsBedtimeLabel')
const bedtimeOptions = inject('bedtimeOptions')
const websocketPublish = inject('websocketPublish')
const websocketStatus = inject('websocketStatus')

watch(settingsLighting, function lightingEnabledChanged(enabled) {

    websocketPublish({ payload: enabled, topic: 'settings/lighting', retain: true, label: 'user' })

})

watch(settingsShades, function shadesEnabledChanged(enabled) {

    websocketPublish({ payload: enabled, topic: 'settings/shades', retain: true, label: 'user' })

})

watch(settingsBedtime, function bedtimeChanged(selection) {

    websocketPublish({ payload: selection.hour, topic: 'settings/bedtime', retain: true, label: 'user' })

})
</script>