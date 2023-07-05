<template>
    <v-container>
        <v-row>
            <v-col>
                <PowerViewControlsComponent :hub="powerviewModel" />
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="(bridge, index) in hueModels" :key="index">
                <HueControlsComponent :bridge="bridge" />
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
/* */
</style>

<script setup>
import { inject } from 'vue'

import PowerViewControlsComponent from '@/components/controls/PowerViewControlsComponent.vue'
import HueControlsComponent from '@/components/controls/HueControlsComponent.vue'

const powerviewModel = inject('powerviewModel')
const hueModels = inject('hueModels')
</script>