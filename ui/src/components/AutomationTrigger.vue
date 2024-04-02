<template>
    <v-card title="current/automation/trigger">
        <v-card-text>
            <pre>{{ JSON.stringify(automationTrigger, undefined, 4) }}</pre>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { inject } from 'vue'

const automationTrigger = inject('automationTrigger')
</script>
