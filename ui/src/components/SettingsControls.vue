<template>

    <v-list>

        <v-list-item title="Bedtime">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.bedtime).toLocaleString() }}
                </v-chip>
            </v-list-item-subtitle>
            <v-list-item-action>
                <bedtime-settings />
            </v-list-item-action>
        </v-list-item>

        <v-list-item title="Lighting Automation">
            <v-list-item-subtitle>
                <v-chip variant="text" :color="settingsLighting ? 'primary' : 'secondary'">
                    {{ settingsLighting ? 'enabled' : 'disabled' }}
                </v-chip>
            </v-list-item-subtitle>
            <v-list-item-action>
                <lighting-automation-settings />
            </v-list-item-action>
        </v-list-item>

        <v-list-item title="Shades Automation">
            <v-list-item-subtitle>
                <v-chip variant="text" :color="settingsShades ? 'primary' : 'secondary'">
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

const settingsLighting = inject('settingsLighting')
const settingsShades = inject('settingsShades')
const timerTime = inject('timerTime')
</script>
