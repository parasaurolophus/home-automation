<template>
    <v-container>
        <v-row align-items="end">
            <v-col>
                Lighting automation
                {{ settingsLighting ? 'enabled' : 'disabled' }}
            </v-col>
            <v-col>
                Window shades automation
                {{ settingsShades ? 'enabled' : 'disabled' }}
            </v-col>
            <v-col>
                Bedtime automation will be triggered at a randomly chosen time each day that is up to 30 minutes before
                or after the hour selected here:
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-switch v-model="settingsLighting">
                </v-switch>
            </v-col>
            <v-col>
                <v-switch v-model="settingsShades">
                </v-switch>
            </v-col>
            <v-col>
                <v-select v-model="settingsBedtime" :items="bedtimeOptions" item-title="label" item-value="hour"
                    return-object single-line>
                </v-select>
            </v-col>
        </v-row>
        <v-row align-items="start">
            <v-col>
                ({{ settingsLightingLabel }})
            </v-col>
            <v-col>
                ({{ settingsShadesLabel }})
            </v-col>
            <v-col>
                ({{ settingsBedtimeLabel }})
            </v-col>
        </v-row>
    </v-container>
</template>

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