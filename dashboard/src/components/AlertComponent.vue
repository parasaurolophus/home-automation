<template>

    <div v-for="error in errors" :key="error.title">
        <v-alert v-model="error.show" type="error" tonal closable @update:modelValue="closeError">
            <template v-slot:title>{{ error.title }}</template>
            <pre>{{ error.text }}</pre>
        </v-alert>
    </div>

    <div v-for="warning in warnings" :key="warning.title">
        <v-alert v-model="warning.show" type="warning" tonal closable @update:modelValue="closeWarning">
            <template v-slot:title>{{ warning.title }}</template>
            <pre>{{ warning.text }}</pre>
        </v-alert>
    </div>

    <div v-for="info in infos" :key="info.title">
        <v-alert v-model="info.show" type="info" tonal closable @update:modelValue="closeInfo">
            <template v-slot:title>{{ info.title }}</template>
            <pre>{{ info.text }}</pre>
        </v-alert>
    </div>

</template>

<style scoped>
.buttons>* {
    margin: 0.25em;
    padding: 0.25em;
}
</style>

<script setup>

import { inject } from 'vue'

const errors = inject('errors')
const warnings = inject('warnings')
const infos = inject('infos')

function closeError() {

    errors.value = errors.value.filter(error => error.show)

}

function closeWarning() {

    warnings.value = warnings.value.filter(warning => warning.show)

}

function closeInfo() {

    infos.value = infos.value.filter(warning => warning.show)

}

</script>