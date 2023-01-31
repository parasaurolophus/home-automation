<template>
    <v-alert v-model="showAlert" type="error" tonal closable>
        <template v-slot:title>{{ alertTitle }}</template>
        <pre>{{ alertText }}</pre>
    </v-alert>
    <v-sheet v-if="!showAlert && (alertTitle != null)">
        <v-btn @click="clearAlert">Clear {{ alertTitle }}</v-btn>
    </v-sheet>
</template>

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

</script>