<template>
    <v-card :disabled="websocketStatus != 1">
        <v-card-title>Settings</v-card-title>
        <v-card-text>
            <fieldset>
                <legend>Automation</legend>
                <v-switch v-model="settingsLighting">
                    <template v-slot:label>
                        Lighting automation
                        {{ settingsLighting ? 'enabled' : 'disabled' }}
                    </template>
                </v-switch>
                <v-switch v-model="settingsShades">
                    <template v-slot:label>
                        Window shades automation
                        {{ settingsShades ? 'enabled' : 'disabled' }}
                    </template>
                </v-switch>
                <p>
                    Bedtime automation will be triggered at a randomly chosen time each day
                    that is up to 30 minutes before or after the hour selected here:
                </p>
                <v-select v-model="settingsBedtime" :items="bedtimeOptions" item-title="label" item-value="hour"
                    label="Bedtime" return-object single-line />
            </fieldset>
        </v-card-text>
    </v-card>
</template>

<style scoped>
/*  */
</style>

<script setup>
import { inject, watch } from 'vue'

const settingsLighting = inject('settingsLighting')
const settingsShades = inject('settingsShades')
const settingsBedtime = inject('settingsBedtime')
const bedtimeOptions = inject('bedtimeOptions')
const websocketPublish = inject('websocketPublish')
const websocketStatus = inject('websocketStatus')

watch(settingsLighting, function lightingEnabledChanged(enabled) {

    websocketPublish({ payload: enabled, topic: 'settings/lighting', retain: true })

})

watch(settingsShades, function shadesEnabledChanged(enabled) {

    websocketPublish({ payload: enabled, topic: 'settings/shades', retain: true })

})

watch(settingsBedtime, function bedtimeChanged(selection) {

    websocketPublish({ payload: selection.hour, topic: 'settings/bedtime', retain: true })

})
</script>