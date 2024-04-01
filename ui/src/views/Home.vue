<!-- eslint-disable vue/multi-word-component-names -->
<template>

    <alerts-pop-up />

    <v-expansion-panels>

        <v-expansion-panel title="Status" value="status">
            <v-expansion-panel-text eager>
                <connection-diagram />
            </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel title="Lighting" value="lighting">
            <v-expansion-panel-text>
                <hue-control-panels />
            </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel title="Window Shades" value="shades">
            <v-expansion-panel-text>
                <power-view-control-panel />
            </v-expansion-panel-text>
        </v-expansion-panel>

    </v-expansion-panels>

</template>

<script setup>
import AlertsPopUp from '@/components/AlertsPopUp.vue'
import ConnectionDiagram from '@/components/ConnectionDiagram.vue'
import HueControlPanels from '@/components/HueControlPanels.vue'
import PowerViewControlPanel from '@/components/PowerViewControlPanel.vue'
</script>
