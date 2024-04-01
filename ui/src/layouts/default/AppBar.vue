<template>
    <v-app-bar class="app-bar" extension-height="96">
        <v-app-bar-title>Home Automation</v-app-bar-title>
        <template #extension>
            <v-container>
                <v-row>
                    <v-col>
                        <v-card>
                            <v-card-title>Bedtime</v-card-title>
                            <v-card-text>
                                {{ timerString('bedtime') }}
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card>
                            <v-card-title>Lighting Automation</v-card-title>
                            <v-card-text>
                                {{ settingsLighting ? 'enabled' : 'disabled' }}
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card>
                            <v-card-title>Shades Automation</v-card-title>
                            <v-card-text>
                                {{ settingsShades ? 'enabled' : 'disabled' }}
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col><v-spacer /></v-col>
                </v-row>
            </v-container>
        </template>
        <v-btn-toggle mandatory v-model="bedtimeIndex">
            <v-btn v-for="(item, index) in bedtimeOptions" :key="index"
                @click="websocketPublish({ payload: bedtimeOptions[index].hour, topic: 'settings/bedtime', retain: true, label: 'user' })">
                {{ item.label }}
            </v-btn>
        </v-btn-toggle>
        <div class="align-center">
            <v-switch v-model="settingsLighting" class="align-center">
                <template #prepend>
                    <v-icon v-if="settingsLighting" color="secondary" icon="mdi-lightbulb-on" />
                    <v-icon v-else color="primary" icon="mdi-lightbulb" />
                </template>
            </v-switch>
        </div>
        <div class="align-center">
            <v-switch v-model="settingsShades" class="align-center">
                <template #prepend>
                    <v-icon v-if="settingsShades" color="secondary" icon="mdi-blinds-open" />
                    <v-icon v-else color="primary" icon="mdi-blinds" />
                </template>
            </v-switch>
        </div>
        <v-btn-toggle v-model="selectedTheme" mandatory>
            <v-btn icon="mdi-weather-night" @click="setTheme('dark')" />
            <v-btn icon="mdi-weather-sunny" @click="setTheme('light')" />
        </v-btn-toggle>
    </v-app-bar>
</template>

<style scoped>
.align-center {
    height: 100%;
    display: flex;
    align-content: center;
}

.align-center>* {
    margin: 0 0.5rem 0 0.5rem;
}
</style>

<script setup>
import { inject, ref, watch } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const bedtimeOptions = inject('bedtimeOptions')
const settingsBedtime = inject('settingsBedtime')
const settingsLighting = inject('settingsLighting')
const settingsShades = inject('settingsShades')
const timerTime = inject('timerTime')
const websocketPublish = inject('websocketPublish')

const selectedTheme = ref(theme.global.name.value == 'dark' ? 0 : 1)
const bedtimeIndex = ref(settingsBedtime.value.hour - bedtimeOptions.value[0].hour)

function setTheme(name) {
    theme.global.name.value = name
}

watch(settingsBedtime, selectedBedtimeHour)

function selectedBedtimeHour() {
    const option = bedtimeOptions.value[0]
    const bedtime = settingsBedtime.value
    const selected = bedtime.hour - option.hour
    bedtimeIndex.value = selected
}

function timerString(name) {
    if (Object.prototype.hasOwnProperty.call(timerTime.value, name)) {
        return new Date(timerTime.value[name]).toLocaleString()
    }
    return 'unknown'
}
</script>
