<!-- eslint-disable vue/multi-word-component-names -->
<template>

    <alerts-pop-up />

    <v-container>
        <v-row>
            <v-col cols="3">
                <status-list/>
            </v-col>
            <v-col>
                <v-expansion-panels>
                    <v-expansion-panel title="Connections" value="status">
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
            </v-col>
        </v-row>
    </v-container>


</template>

<script setup>
import AlertsPopUp from '@/components/AlertsPopUp.vue'
import ConnectionDiagram from '@/components/ConnectionDiagram.vue'
import HueControlPanels from '@/components/HueControlPanels.vue'
import PowerViewControlPanel from '@/components/PowerViewControlPanel.vue'
import StatusList from '@/components/StatusList.vue'
</script>
