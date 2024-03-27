<!-- eslint-disable vue/multi-word-component-names -->
<template>

    <v-tabs v-model="tab">
        <v-tab value="hue">Lighting</v-tab>
        <v-tab value="powerview">Window Shades</v-tab>
        <v-tab value="dashboard">Dashboard</v-tab>
        <v-tab value="metadata">Metadata</v-tab>
        <v-tab value="example">Example</v-tab>
    </v-tabs>

    <v-window v-model="tab">

        <v-window-item value="hue">
            <v-container>
                <v-row>
                    <v-col v-for="(bridge, index) in hueModel" :key="index">
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

        <v-window-item value="example">
            <v-container>
                <v-row>
                    <v-col>
                        <table>
                            <tr v-for="(icon, index) in icons" :key="index">
                                <th>{{ icon }}</th>
                                <td><v-icon :icon="icon"></v-icon></td>
                            </tr>
                        </table>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <MermaidComponent diagram-url="/ui/diagram.mmd" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <PowerViewTreeComponent :hub="powerviewModel" />
                    </v-col>
                    <v-col>
                        <HueTreeComponent :bridges="hueModel" />
                    </v-col>
                </v-row>
            </v-container>
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
import DashboardComponent from '@/components/ui/DashboardComponent.vue'
import MetadataComponent from '@/components/metadata/MetadataComponent.vue'
import MermaidComponent from '@/components/MermaidComponent.vue'
import HueTreeComponent from '@/components/controls/HueTreeComponent.vue'
import PowerViewTreeComponent from '@/components/controls/PowerViewTreeComponent.vue'

const hueModel = inject('hueModel')
const powerviewModel = inject('powerviewModel')
const tab = ref(null)
const icons = ref([
    'mdi-home',
    'mdi-blinds',
    'mdi-blinds-open',
    'mdi-lightbulb',
    'mdi-lightbulb-multiple',
    'mdi-lightbulb-group',
    'mdi-lightbulb-on'
])
</script>
