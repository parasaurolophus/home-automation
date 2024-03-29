<!-- eslint-disable vue/multi-word-component-names -->
<template>

    <AlertComponent />

    <v-expansion-panels variant="popout" v-model="settingsOpened">

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

    </v-expansion-panels>

</template>

<script setup>
import { inject } from 'vue'
import AlertComponent from '@/components/ui/AlertComponent.vue'
import ConnectionsDiagramComponent from '@/components/ui/ConnectionsDiagramComponent.vue'
import DebugComponent from '@/components/ui/DebugComponent.vue'
import HueControlsComponent from '@/components/controls/HueControlsComponent.vue'
import PowerViewControlsComponent from '@/components/controls/PowerViewControlsComponent.vue'
import SettingsComponent from '@/components/ui/SettingsComponent.vue'

const settingsOpened = inject('settingsOpened')
</script>
