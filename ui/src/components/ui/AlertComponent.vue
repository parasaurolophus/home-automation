<template>
    <div v-for="(alert, index) in alerts" :key="index">
        <v-alert v-model="alert.show" :type="alert.type" closable @update:modelValue="closeAlert">
            <template v-slot:title>{{ alert.title }}</template>
            <pre>{{ alert.text }}</pre>
        </v-alert>
    </div>
</template>

<style scoped>
/* */
</style>

<script setup>
import { inject } from 'vue'

const alerts = inject('alerts')

function closeAlert() {

    alerts.value = alerts.value.filter(alert => alert.show)

}
</script>