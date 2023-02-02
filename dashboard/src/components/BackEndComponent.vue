<template>

    <fieldset>

        <legend>Back End</legend>

        <v-btn @click="refreshControls">Refresh Controls</v-btn>

        <div :class="wsStatusClass(websocketStatus)">{{ wsStatusText(websocketStatus) }}</div>

        <v-btn @click="sendError">Send Error</v-btn>

        <v-btn @click="sendWarning">Send Warning</v-btn>

    </fieldset>

</template>

<style scoped>
fieldset>* {
    margin: 0.25em;
    padding: 0.25em;
}

th,
td {
    margin: 1px;
    padding: 1px 0.5em 1px 0.5em;
}

th {
    text-align: right;
}
.ws-disconnected {
    color: white;
    background-color: darkred;
}

.ws-connecting,
.ws-closing {
    color: black;
    background-color: yellow;
}

.ws-connected {
    color: white;
    background-color: darkgreen;
}
</style>

<script setup>

import { inject } from 'vue'

const websocketPublish = inject('websocketPublish')
const websocketStatus = inject('websocketStatus')

function refreshControls() {

    websocketPublish({ payload: new Date().getTime(), topic: 'controls/refresh' })

}

function wsStatusText(status) {

    switch (status) {

        case 0:
            return 'connecting'

        case 1:
            return 'connected'

        case 2:
            return 'disconnecting'

        default:
            return 'disconnected'
    }
}

function wsStatusClass(status) {

    switch (status) {

        case 0:
            return 'ws-connecting'

        case 1:
            return 'ws-connected'

        case 2:
            return 'ws-disconnecting'

        default:
            return 'ws-disconnected'
    }
}

function sendError() {

    websocketPublish({
        payload: new Date().toLocaleString(),
        topic: 'test/error',
        retain: true
    })

}

function sendWarning() {

    websocketPublish({
        payload: new Date().toLocaleString(),
        topic: 'test/warning',
        retain: true
    })

}

</script>