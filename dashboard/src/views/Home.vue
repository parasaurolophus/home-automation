<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-tabs v-model="tab">
        <v-tab value="hue">Lighting</v-tab>
        <v-tab value="powerview">Window Shades</v-tab>
        <v-tab value="dashboard">Dashboard</v-tab>
        <v-tab value="metadata">Metadata</v-tab>
    </v-tabs>

    <v-window v-model="tab">
        <v-window-item value="hue">
            <v-container>
                <v-row>
                    <v-col v-for="(bridge, index) in hueModels" :key="index">
                        <HueControlsComponent :bridge="bridge" />
                    </v-col>
                </v-row>
            </v-container>
        </v-window-item>
        <v-window-item value="powerview">
            <v-container>
                <v-row>
                    <v-col>
                        <PowerViewControlsComponent :hub="powerviewModel" />
                    </v-col>
                </v-row>
            </v-container>
        </v-window-item>
        <v-window-item value="dashboard">
            <DashboardComponent />
        </v-window-item>
        <v-window-item value="metadata">
            <MetadataComponent />
        </v-window-item>
    </v-window>
</template>

<style>
/* */
</style>

<script setup>
import { inject, ref } from 'vue'
import HueControlsComponent from '@/components/controls/HueControlsComponent.vue'
import PowerViewControlsComponent from '@/components/controls/PowerViewControlsComponent.vue'
import DashboardComponent from '@/components/dashboard/DashboardComponent.vue'
import MetadataComponent from '@/components/metadata/MetadataComponent.vue'

const hueModels = inject('hueModels')
const powerviewModel = inject('powerviewModel')
const tab = ref(null)
</script>