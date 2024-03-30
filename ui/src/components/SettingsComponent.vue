<template>
    <v-container>
        <v-row>
            <v-col>
                <div>
                    <v-switch v-model="settingsLighting">
                        <template #label>
                            <v-icon icon="mdi-lightbulb-group"
                                :color="settingsLighting ? 'secondary' : 'primary'"></v-icon>
                        </template>
                    </v-switch>
                </div>
                <div>
                    Lighting automation
                    <span v-if="settingsLighting" :style="'color:' + secondaryColor">enabled</span>
                    <span v-else :style="'color:' + primaryColor">disabled</span>
                </div>
            </v-col>
            <v-col>
                <div>
                    <v-switch v-model="settingsShades">
                        <template #label>
                            <v-icon icon="mdi-blinds" :color="settingsShades ? 'secondary' : 'primary'"></v-icon>
                        </template>
                    </v-switch>
                    <div>
                        Shades automation
                        <span v-if="settingsShades" :style="'color:' + secondaryColor">enabled</span>
                        <span v-else :style="'color:' + primaryColor">disabled</span>
                    </div>
                </div>
            </v-col>
            <v-col>
                <div>
                    <v-btn-toggle mandatory v-model="bedtimeToggle">
                        <v-btn v-for="(item, index) in bedtimeOptions" :key="index">
                            {{ item.label }}
                        </v-btn>
                    </v-btn-toggle>
                </div>
                <div :style="'color:' + secondaryColor + ';'">
                    {{ new Date(currentBedtime).toLocaleString() }}
                </div>
                <div>
                    Bedtime automation will be triggered at a randomly chosen time each day that is up to 30 minutes
                    before or after
                    the hour selected here
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { inject, ref, watch } from 'vue'
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
</script>
