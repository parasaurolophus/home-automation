<template>
    <v-alert v-model="showAlert" variant="tonal" type="info" closable>
        <pre>{{ alertMessage }}</pre>
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
const alertMessage = ref(null)
const powerviewModel = inject('powerviewModel')
const hueModels = inject('hueModels')

provide('showAlert', (message) => {
    alertMessage.value = message
    showAlert.value = true
})
</script>