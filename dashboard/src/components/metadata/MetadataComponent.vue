<template>
    <v-alert v-model="showAlert" variant="tonal" type="info" closable>
        <table>
            <tr>
                <th>topic</th>
                <td>{{ alertMessage.topic }}</td>
            </tr>
            <tr>
                <th>payload</th>
                <td>{{ alertMessage.payload }}</td>
            </tr>
        </table>
    </v-alert>
    <v-container>
        <v-row>
            <v-col>
                <PowerViewMetadataComponent :hub="powerviewModel" />
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="(bridge, index) in hueModels" :key="index">
                <HueMetadataComponent :bridge="bridge" />
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
/* */
</style>

<script setup>
import { inject, ref, provide } from 'vue'

import HueMetadataComponent from '@/components/metadata/HueMetadataComponent.vue'
import PowerViewMetadataComponent from '@/components/metadata/PowerViewMetadataComponent.vue'

const showAlert = ref(false)

const alertMessage = ref({
    topic: '',
    payload: ''
})

const powerviewModel = inject('powerviewModel')
const hueModels = inject('hueModels')

provide('showMetadataExample', (topic, payload) => {

    alertMessage.value.topic = topic
    alertMessage.value.payload = payload
    showAlert.value = true

})
</script>