<!-- eslint-disable vue/multi-word-component-names -->
<template>

    <AlertComponent />

    <v-expansion-panels v-model="settingsOpened">

        <v-expansion-panel title="Connections" value="connections">
            <v-expansion-panel-text eager>
                <ConnectionsDiagramComponent />
            </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel title="Settings" value="settings">
            <v-expansion-panel-text>
                <SettingsComponent />
            </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel title="Lighting" value="lighting">
            <v-expansion-panel-text>
                <HueControlsComponent />
            </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel title="Window Shades" value="shades">
            <v-expansion-panel-text>
                <PowerViewControlsComponent />
            </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel title="Debug" value="debug">
            <v-expansion-panel-text>
                <DebugComponent />
            </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel title="Metadata" value="metadata">
            <v-expansion-panel-text>
                <MetadataComponent />
            </v-expansion-panel-text>
        </v-expansion-panel>

    </v-expansion-panels>

</template>

<script setup>
import { inject } from 'vue'
import AlertComponent from '@/components/AlertComponent.vue'
import ConnectionsDiagramComponent from '@/components/ConnectionsDiagramComponent.vue'
import DebugComponent from '@/components/DebugComponent.vue'
import HueControlsComponent from '@/components/HueControlsComponent.vue'
import MetadataComponent from '@/components/MetadataComponent.vue'
import PowerViewControlsComponent from '@/components/PowerViewControlsComponent.vue'
import SettingsComponent from '@/components/SettingsComponent.vue'

const settingsOpened = inject('settingsOpened')
</script>
