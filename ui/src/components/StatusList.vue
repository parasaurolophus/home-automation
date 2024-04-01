<template>
    <v-list density="compact">
        <v-list-item density="compact">
            <v-list-item-title>
                Bedtime
            </v-list-item-title>
            <v-list-item-subtitle>
                <v-chip variant="text" color="secondary" density="compact">
                    {{ timerString('bedtime') }}
                </v-chip>
            </v-list-item-subtitle>
            <v-list-item-action>
                <bedtime-settings />
            </v-list-item-action>
        </v-list-item>
        <v-list-item density="compact">
            <v-list-item-title>
                Lighting Automation
            </v-list-item-title>
            <v-list-item-subtitle>
                <v-chip variant="text" :color="settingsLighting ? 'secondary' : 'primary'" density="compact">
                    {{ settingsLighting ? 'enabled' : 'disabled' }}
                </v-chip>
            </v-list-item-subtitle>
            <v-list-item-action>
                <lighting-automation-settings />
            </v-list-item-action>
        </v-list-item>
        <v-list-item density="compact">
            <v-list-item-title>
                Shades Automation
            </v-list-item-title>
            <v-list-item-subtitle>
                <v-chip variant="text" :color="settingsShades ? 'secondary' : 'primary'" density="compact">
                    {{ settingsShades ? 'enabled' : 'disabled' }}
                </v-chip>
            </v-list-item-subtitle>
            <v-list-item-action>
                <shades-automation-settings />
            </v-list-item-action>
        </v-list-item>
    </v-list>
</template>

<script setup>
import { inject } from 'vue'
import BedtimeSettings from '@/components/BedtimeSettings.vue'
import LightingAutomationSettings from '@/components/LightingAutomationSettings.vue'
import ShadesAutomationSettings from '@/components/ShadesAutomationSettings.vue'

const settingsLighting = inject('settingsLighting')
const settingsShades = inject('settingsShades')
const timerTime = inject('timerTime')

function timerString(name) {
    if (Object.prototype.hasOwnProperty.call(timerTime.value, name)) {
        return new Date(timerTime.value[name]).toLocaleString()
    }
    return 'unknown'
}
</script>
