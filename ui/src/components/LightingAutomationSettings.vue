<template>
    <v-card>
        <v-card-item>
            <template #append>
                <v-icon :color="settingsColor(settingsLighting)" :icon="lightingSettingsIcon()" />
            </template>
            <v-card-title>
                Lighting Automation
            </v-card-title>
            <v-card-subtitle>
                <v-chip :color="settingsColor(settingsLighting)">
                    {{ settingsText(settingsLighting) }}
                </v-chip>
            </v-card-subtitle>
        </v-card-item>
        <v-card-text>
            <v-switch v-model="settingsLighting" class="align-center" />
        </v-card-text>
    </v-card>
</template>

<style scoped>
.align-center {
    height: 100%;
    align-self: center;
    align-items: center;
    align-content: center;
    display: flex;
}
</style>

<script setup>
import { inject } from 'vue'

const lightingSettingsIcon = inject('lightingSettingsIcon')
const settingsColor = inject('settingsColor')
const settingsLighting = inject('settingsLighting')
const settingsText = inject('settingsText')
</script>
