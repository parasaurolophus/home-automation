<!-- eslint-disable vue/multi-word-component-names -->
<template>

    <v-container>
        <v-row>
            <v-col>
                <AlertComponent />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4">
                <SettingsComponent />
            </v-col>
            <v-col>
                <ConnectionsDiagramComponent />
            </v-col>
        </v-row>
    </v-container>

    <v-expansion-panels>
        <v-expansion-panel title="Lighting">
            <v-expansion-panel-text>
                <template v-for="(bridge, index) in hueModel" :key="index">
                    <HueControlsComponent :bridge="bridge" />
                </template>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

    <v-expansion-panels>
        <v-expansion-panel title="Window Shades">
            <v-expansion-panel-text>
                <PowerViewControlsComponent :hub="powerviewModel" />
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

    <v-expansion-panels>
        <v-expansion-panel title="Debug">
            <v-expansion-panel-text>
                <v-container>
                    <v-row>
                        <v-col cols="4">
                            <TimerComponent />
                        </v-col>
                        <v-col>
                            <TriggerComponent />
                        </v-col>
                    </v-row>
                </v-container>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

</template>

<script setup>
import { inject } from 'vue'
import AlertComponent from '@/components/ui/AlertComponent.vue'
import ConnectionsDiagramComponent from '@/components/ui/ConnectionsDiagramComponent.vue'
import HueControlsComponent from '@/components/controls/HueControlsComponent.vue'
import PowerViewControlsComponent from '@/components/controls/PowerViewControlsComponent.vue'
import SettingsComponent from '@/components/ui/SettingsComponent.vue'
import TimerComponent from '@/components/ui/TimerComponent.vue'
import TriggerComponent from '@/components/ui/TriggerComponent.vue'

const hueModel = inject('hueModel')
const powerviewModel = inject('powerviewModel')
</script>
