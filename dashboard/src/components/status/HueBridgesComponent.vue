<template>
    <v-card :disabled="websocketStatus != 1">
        <v-card-title>Hue Bridges</v-card-title>
        <v-card-text>
            <div class="wrapped">
                <div v-for="(bridge, index) in hueBridges" :key="bridge.id">
                    <v-table>
                        <tr>
                            <th>address</th>
                            <td>{{ bridge.address }}</td>
                        </tr>
                        <tr>
                            <th>port</th>
                            <td>{{ bridge.port }}</td>
                        </tr>
                        <tr>
                            <th>id</th>
                            <td>{{ bridge.id }}</td>
                        </tr>
                        <tr>
                            <th>model</th>
                            <td>{{ bridge.model }}</td>
                        </tr>
                        <tr>
                            <th>name</th>
                            <td>{{ bridge.name }}</td>
                        </tr>
                        <tr>
                            <th>host</th>
                            <td>{{ bridge.host }}</td>
                        </tr>
                        <tr>
                            <th>key</th>
                            <td v-if="hueKeys[bridge.address]">{{ hueKeys[bridge.address] }}</td>
                            <td v-else><v-btn @click="createHueKey(bridge.address)">create key</v-btn></td>
                        </tr>
                        <tr>
                            <th>status</th>
                            <td :class="esStatusClass(bridge.status)">{{ esStatusText(bridge.status) }}</td>
                        </tr>
                    </v-table>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<style scoped>
hr {
    margin: 0.5em 0 0.5em 0;
}

.es-disconnected {
    color: white;
    background-color: darkred;
}

.es-connecting {
    color: black;
    background-color: yellow;
}

.es-connected {
    color: white;
    background-color: darkgreen;
}
</style>

<script setup>

import { inject } from 'vue'

const websocketPublish = inject('websocketPublish')
const websocketStatus = inject('websocketStatus')
const hueBridges = inject('hueBridges')
const hueKeys = inject('hueKeys')

function esStatusText(status) {

    switch (status) {

        case 0:
            return 'connecting'

        case 1:
            return 'connected'

        default:
            return 'disconnected'
    }
}

function esStatusClass(status) {

    switch (status) {

        case 0:
            return 'es-connecting'

        case 1:
            return 'es-connected'

        default:
            return 'es-disconnected'
    }
}

function createHueKey(address) {

    websocketPublish({
        payload: address,
        topic: 'put/hue/create-key'
    })

}

</script>