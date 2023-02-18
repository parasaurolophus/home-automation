<template>
    <fieldset>
        <legend>Back End</legend>
        <div :class="wsStatusClass(websocketStatus)">{{ wsStatusText(websocketStatus) }}</div>
        <v-btn @click="refreshControls">Refresh Controls</v-btn>
        <v-table>
            <caption>timer</caption>
            <tr v-for="(value, name) in timer" :key="name">
                <th>{{ name }}</th>
                <td>{{ value }}</td>
            </tr>
        </v-table>
        <v-alert v-model="trigger.show" tonal closable @update:modelValue="dismissTrigger"><pre>{{ trigger.payload }}</pre></v-alert>
    </fieldset>
</template>

<style scoped>
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
const timer = inject('timer')
const trigger = inject('trigger')

function dismissTrigger() {

    trigger.value.show = false

}

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

</script>