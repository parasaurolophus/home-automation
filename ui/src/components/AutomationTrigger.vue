<template>
    <v-card title="current/automation/trigger">
        <v-card-subtitle>
            {{ localeString }}
        </v-card-subtitle>
        <v-card-text>
            <pre>{{ stringified }}</pre>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { computed, inject } from 'vue'

const automationTrigger = inject('automationTrigger')

const stringified = computed(() => JSON.stringify(automationTrigger.value, undefined, 4))

const localeString = computed(() => new Date(automationTrigger.value.at).toLocaleString())
</script>
