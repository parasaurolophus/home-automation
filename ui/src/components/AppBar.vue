<template>
    <v-app-bar class="app-bar" title="Home Automation" density="comfortable">
        <template v-if="debugMode">
            <v-chip color="primary" variant="elevated" rounded="pill">{{ messageCount }}</v-chip>
            <v-divider vertical />
            <v-chip :color="statusColor" variant="elevated" rounded="pill">{{ statusText }}</v-chip>
            <v-divider vertical />
        </template>
        <DebugModeSelector />
        <v-divider vertical />
        <ThemeSelector />
    </v-app-bar>
</template>

<style scoped>
.pad {
    margin: 0.25rem;
    padding: 0.25em;
    border: solid 1px;
}
</style>

<script setup>
import { computed, inject } from 'vue'

const debugMode = inject('debugMode')
const messageCount = inject('messageCount')
const websocketStatus = inject('websocketStatus')

const statusText = computed(() => {
    switch (websocketStatus.value) {
        case 0:
            return 'connecting'
        case 1:
            return 'connected'
        default:
            return 'error'
    }
})

const statusColor = computed(() => {
    switch (websocketStatus.value) {
        case 0:
            return 'yellow'
        case 1:
            return 'green'
        default:
            return 'red'
    }
})
</script>
