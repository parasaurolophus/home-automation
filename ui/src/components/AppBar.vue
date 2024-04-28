<template>
    <v-defaults-provider :defaults="defaults">
        <v-app-bar class="app-bar" title="Home Automation" density="comfortable">
            <v-container>
                <v-row>
                    <v-col>
                        <v-chip v-if="debugMode" color="primary">{{ messageCount }}</v-chip>
                        <v-spacer v-else />
                    </v-col>
                    <v-col>
                        <v-chip v-if="debugMode" :color="statusColor">{{ statusText }}</v-chip>
                        <v-spacer v-else />
                    </v-col>
                    <v-col>
                        <DebugModeSelector />
                    </v-col>
                    <v-col>
                        <ThemeSelector />
                    </v-col>
                </v-row>
            </v-container>
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
})
</script>
