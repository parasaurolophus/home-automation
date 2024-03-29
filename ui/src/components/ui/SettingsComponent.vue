<template>
    <v-container>
        <v-row>
            <v-col>
                <v-switch v-model="settingsLighting">
                    <template #label>
                        <v-icon icon="mdi-lightbulb-group"></v-icon>
                        Lighting
                    </template>
                </v-switch>
                Lighting automation
                <span :style="'color:' + (settingsLighting ? secondaryColor : primaryColor) + ';'">
                    {{ settingsLighting ? 'enabled' : 'disabled' }}
                </span>
            </v-col>
            <v-col>
                <v-switch v-model="settingsShades">
                    <template #label>
                        <v-icon icon="mdi-blinds"></v-icon>
                        Shades
                    </template>
                </v-switch>
                Window shades automation
                <span :style="'color:' + (settingsShades ? secondaryColor : primaryColor) + ';'">
                    {{ settingsShades ? 'enabled' : 'disabled' }}
                </span>
            </v-col>
            <v-col>
                <v-select v-model="settingsBedtime" :items="bedtimeOptions" item-title="label" item-value="hour"
                    return-object single-line>
                </v-select>
                Bedtime automation will be triggered at a randomly chosen time each day that is up to 30 minutes before
                or after the
                hour selected here (currently <span :style="'color:' + secondaryColor + ';'"> {{ new
                    Date(currentBedtime).toLocaleString() }}</span>)
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { inject, watch } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const primaryColor = theme.global.current.value.colors.primary
const secondaryColor = theme.global.current.value.colors.secondary
const settingsLighting = inject('settingsLighting')
const settingsShades = inject('settingsShades')
const settingsBedtime = inject('settingsBedtime')
const bedtimeOptions = inject('bedtimeOptions')
const websocketPublish = inject('websocketPublish')
const currentBedtime = inject('currentBedtime')

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