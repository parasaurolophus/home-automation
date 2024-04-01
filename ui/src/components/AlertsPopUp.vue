<template>
    <v-container>
        <v-row v-if="alerts.length > 1">
            <v-col>
                <v-btn @click="closeAll">
                    Close All
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
    <v-row v-for="(alert, index) in alerts" :key="index">
        <v-col>
            <v-alert v-model="alert.show" :type="alert.type" closable @update:modelValue="closeAlert">
                <template #title>{{ alert.title }}</template>
                <pre>{{ alert.text }}</pre>
            </v-alert>
        </v-col>
    </v-row>
</template>

<script setup>
import { inject } from 'vue'

const alerts = inject('alerts')

function closeAlert() {
    alerts.value = alerts.value.filter(alert => alert.show)
}

function closeAll() {
    for (let alert of alerts.value) {
        alert.show = false
    }
    closeAlert()
}
</script>
