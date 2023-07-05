<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-tabs v-model="tab">
        <v-tab value="controls">Controls</v-tab>
        <v-tab value="dashboard">Dashboard</v-tab>
        <v-tab value="metadata">Metadata</v-tab>
    </v-tabs>

    <v-window v-model="tab">
        <v-window-item value="controls">
            <ControlsComponent />
        </v-window-item>
        <v-window-item value="dashboard">
            <DashboardComponent />
        </v-window-item>
        <v-window-item value="metadata">
            <MetadataComponent />
        </v-window-item>
    </v-window>
</template>

<style>
/* */
</style>

<script setup>
import { ref } from 'vue'
import ControlsComponent from '@/components/ControlsComponent.vue'
import DashboardComponent from '@/components/status/DashboardComponent.vue'
import MetadataComponent from '@/components/MetadataComponent.vue'

const tab = ref(null)
</script>