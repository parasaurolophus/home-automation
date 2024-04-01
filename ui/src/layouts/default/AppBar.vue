<template>
    <v-app-bar class="app-bar" density="compact" extension-height="96">
        <v-app-bar-title>Home Automation</v-app-bar-title>
        <template #extension>
            <app-bar-extension />
        </template>
        <bedtime-settings />
        <lighting-automation-settings />
        <shades-automation-settings />
        <theme-selector />
    </v-app-bar>
</template>

<script setup>
import AppBarExtension from '@/components/AppBarExtension.vue'
import BedtimeSettings from '@/components/BedtimeSettings.vue'
import LightingAutomationSettings from '@/components/LightingAutomationSettings.vue'
import ShadesAutomationSettings from '@/components/ShadesAutomationSettings.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
</script>
