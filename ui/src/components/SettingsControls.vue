<template>

    <v-list>

        <v-list-item title="Bedtime">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.bedtime).toLocaleString() }}
                </v-chip>
                <template v-if="settingsBedtimeLabel">
                    ({{ settingsBedtimeLabel }})
                </template>
            </v-list-item-subtitle>
            <v-list-item-action>
                <BedtimeSettings />
            </v-list-item-action>
        </v-list-item>

        <v-list-item title="Lighting Automation">
            <v-list-item-subtitle>
                <v-chip variant="text" :color="settingsLighting ? 'primary' : 'secondary'">
                    {{ settingsLighting ? 'enabled' : 'disabled' }}
                </v-chip>
                <template v-if="settingsLightingLabel">
                    ({{ settingsLightingLabel }})
                </template>
            </v-list-item-subtitle>
            <v-list-item-action>
                <LightingAutomationSettings />
            </v-list-item-action>
        </v-list-item>

        <v-list-item title="Shades Automation">
            <v-list-item-subtitle>
                <v-chip variant="text" :color="settingsShades ? 'primary' : 'secondary'">
                    {{ settingsShades ? 'enabled' : 'disabled' }}
                </v-chip>
                <template v-if="settingsShadesLabel">
                    ({{ settingsShadesLabel }})
                </template>
            </v-list-item-subtitle>
            <v-list-item-action>
                <ShadesAutomationSettings />
            </v-list-item-action>
        </v-list-item>

    </v-list>

</template>

<script setup>
import { inject } from 'vue'

const settingsBedtimeLabel = inject('settingsBedtimeLabel')
const settingsLighting = inject('settingsLighting')
const settingsLightingLabel = inject('settingsLightingLabel')
const settingsShades = inject('settingsShades')
const settingsShadesLabel = inject('settingsShadesLabel')
const timerTime = inject('timerTime')
</script>
