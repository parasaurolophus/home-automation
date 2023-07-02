<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <v-row>
            <v-col>
                <SettingsComponent />
            </v-col>
            <v-col>
                <ConnectionsDiagramComponent />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <TimerComponent />
            </v-col>
            <v-col>
                <TriggerComponent />
            </v-col>
        </v-row>
        <v-row>
            <!-- alerts -->
            <v-col>
                <AlertComponent />
            </v-col>
        </v-row>
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

<style>
fieldset>* {
    margin: 0.5em;
}
</style>

<script setup>
import { inject } from 'vue'

import ConnectionsDiagramComponent from '@/components/status/ConnectionsDiagramComponent.vue'
import TimerComponent from '@/components/status/debug/TimerComponent.vue'
import TriggerComponent from '@/components/status/debug/TriggerComponent.vue'
import AlertComponent from '@/components/AlertComponent.vue'
import SettingsComponent from '@/components/controls/SettingsComponent.vue'
import PowerViewControlsComponent from '@/components/controls/PowerViewControlsComponent.vue'
import HueControlsComponent from '@/components/controls/HueControlsComponent.vue'

const powerviewModel = inject('powerviewModel')
const hueModels = inject('hueModels')
</script>