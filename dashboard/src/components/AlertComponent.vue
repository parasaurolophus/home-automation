<template>
    <v-alert v-model="showAlert" type="error" tonal closable>
        <template v-slot:title>{{ alertTitle }}</template>
        <pre>{{ alertText }}</pre>
    </v-alert>
    <v-sheet id="buttons" v-if="!showAlert && (alertTitle != null)">
        <v-btn @click="toggleShowAlert">Show {{ alertTitle }}</v-btn>
        <v-btn @click="clearAlert">Clear {{ alertTitle }}</v-btn>
    </v-sheet>
</template>

<style scoped>
#buttons>* {
    margin: 0.25em;
    padding: 0.25em;
}
</style>

<script setup>

import { inject } from 'vue'

const alertTitle = inject('alertTitle')
const alertText = inject('alertText')
const showAlert = inject('showAlert')
const websocketPublish = inject('websocketPublish')

function clearAlert() {

    websocketPublish({ payload: '', topic: alertTitle.value, retain: true })
    alertText.value = null
    alertTitle.value = null

}

function toggleShowAlert() {

    showAlert.value = !showAlert.value

}

</script>