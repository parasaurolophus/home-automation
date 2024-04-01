<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card density="compact">
                    <v-card-title>
                        Bedtime
                    </v-card-title>
                    <v-card-text>
                        <v-chip variant="text" color="secondary">
                            {{ timerString('bedtime') }}
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card density="compact">
                    <v-card-title>
                        Lighting Automation
                    </v-card-title>
                    <v-card-text>
                        <v-chip variant="text" :color="settingsLighting ? 'secondary' : 'primary'">
                            {{ settingsLighting ? 'enabled' : 'disabled' }}
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card density="compact">
                    <v-card-title>
                        Shades Automation
                    </v-card-title>
                    <v-card-text>
                        <v-chip variant="text" :color="settingsShades ? 'secondary' : 'primary'">
                            {{ settingsShades ? 'enabled' : 'disabled' }}
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col><v-spacer /></v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { inject } from 'vue'
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
