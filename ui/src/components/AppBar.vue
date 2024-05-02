<template>
    <v-defaults-provider :defaults="defaults">
        <v-app-bar class="app-bar" title="Home Automation" density="comfortable">
            <template v-if="debugMode">
                <v-chip color="primary">{{ messageCount }}</v-chip>
                <v-divider />
                <v-chip :color="statusColor">{{ statusText }}</v-chip>
                <v-divider />
            </template>
            <DebugModeSelector />
            <v-divider />
            <ThemeSelector />
        </v-app-bar>
    </v-defaults-provider>
</template>

<style scoped>
.pad {
    margin: 0.25rem;
    padding: 0.25em;
    border: solid 1px;
}
</style>

<script setup>
import { computed, inject, ref } from 'vue'
import { VDivider } from 'vuetify/lib/components/index.mjs';

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

const defaults = ref({
    VChip: {
        variant: 'elevated',
        rounded: 'pill',
    },
    VDivider: {
        vertical: true,
        thickness: "1rem",
        color: "surface",
    },
})
</script>
