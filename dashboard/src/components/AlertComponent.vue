<template>
    <v-alert v-model="showError" type="error" tonal closable>
        <template v-slot:title>{{ errorTitle }}</template>
        <pre>{{ errorText }}</pre>
    </v-alert>
    <v-sheet class="buttons" v-if="!showError && (errorTitle != null)">
        <v-btn @click="toggleShowError">Show {{ errorTitle }}</v-btn>
        <v-btn @click="clearError">Clear {{ errorTitle }}</v-btn>
    </v-sheet>
    <v-alert v-model="showWarning" type="warning" tonal closable>
        <template v-slot:title>{{ warningTitle }}</template>
        <pre>{{ warningText }}</pre>
    </v-alert>
    <v-sheet class="buttons" v-if="!showWarning && (warningTitle != null)">
        <v-btn @click="toggleShowWarning">Show {{ warningTitle }}</v-btn>
        <v-btn @click="clearWarning">Clear {{ warningTitle }}</v-btn>
    </v-sheet>
</template>

<style scoped>
.buttons>* {
    margin: 0.25em;
    padding: 0.25em;
}
</style>

<script setup>

import { inject } from 'vue'

const errorTitle = inject('errorTitle')
const errorText = inject('errorText')
const showError = inject('showError')
const warningTitle = inject('warningTitle')
const warningText = inject('warningText')
const showWarning = inject('showWarning')
const websocketPublish = inject('websocketPublish')

function clearError() {

    websocketPublish({ payload: '', topic: errorTitle.value, retain: true })
    errorText.value = null
    errorTitle.value = null

}

function toggleShowError() {

    showError.value = !showError.value

}

function toggleShowWarning() {

    showWarning.value = !showWarning.value

}

function clearWarning() {

websocketPublish({ payload: '', topic: warningTitle.value, retain: true })
warningText.value = null
warningTitle.value = null

}

</script>