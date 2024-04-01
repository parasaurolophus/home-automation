<template>
    <v-app-bar class="app-bar">
        <v-app-bar-title>Home Automation</v-app-bar-title>
        <template #extension>
            <app-bar-extension />
        </template>
        <bedtime-selector/>
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
        <theme-selector />
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
import { inject } from 'vue'
import AppBarExtension from '@/components/AppBarExtension.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
import BedtimeSelector from '@/components/BedtimeSelector.vue'

const settingsLighting = inject('settingsLighting')
const settingsShades = inject('settingsShades')
</script>
