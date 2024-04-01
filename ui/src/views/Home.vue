<!-- eslint-disable vue/multi-word-component-names -->
<template>

    <AlertComponent />

    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>Bedtime</v-card-title>
                    <v-card-text>
                        {{ timerString('bedtime') }}
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col><v-spacer /></v-col>
            <v-col>
                <v-card-title>Lighting Automation</v-card-title>
                <v-card-text>
                    {{ settingsLighting ? 'enabled' : 'disabled' }}
                </v-card-text>
            </v-col>
            <v-col><v-spacer /></v-col>
            <v-col>
                <v-card-title>Shades Automation</v-card-title>
                <v-card-text>
                    {{ settingsBedtime ? 'enabled' : 'disabled' }}
                </v-card-text>
            </v-col>
        </v-row>
    </v-container>

    <v-expansion-panels>

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

        <v-expansion-panel title="Status" value="status">
            <v-expansion-panel-text eager>
                <StatusComponent />
            </v-expansion-panel-text>
        </v-expansion-panel>

    </v-expansion-panels>

</template>

<script setup>
import { inject } from 'vue'
import AlertComponent from '@/components/AlertComponent.vue'
import StatusComponent from '@/components/StatusComponent.vue'
import HueControlsComponent from '@/components/HueControlsComponent.vue'
import PowerViewControlsComponent from '@/components/PowerViewControlsComponent.vue'

const timerTime = inject('timerTime')
const settingsLighting = inject('settingsLighting')
const settingsBedtime = inject('settingsBedtime')

function timerString(name) {
    if (Object.prototype.hasOwnProperty.call(timerTime.value, name)) {
        return new Date(timerTime.value[name]).toLocaleString()
    }
    return 'unknown'
}
</script>
