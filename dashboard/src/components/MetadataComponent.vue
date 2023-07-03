<template>
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
import { inject } from 'vue'

import HueMetadataComponent from '@/components/metadata/HueMetadataComponent.vue'
import PowerViewMetadataComponent from '@/components/metadata/PowerViewMetadataComponent.vue'

const powerviewModel = inject('powerviewModel')
const hueModels = inject('hueModels')
</script>