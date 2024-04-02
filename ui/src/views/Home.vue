<!-- eslint-disable vue/multi-word-component-names -->
<template>

    <alerts-pop-up />

    <v-expansion-panels>

        <v-expansion-panel title="Connections" value="status">
            <v-expansion-panel-text>
                <connection-diagram />
            </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel title="Settings" value="settings">
            <v-expansion-panel-text>
                <v-container>
                    <v-row>
                        <v-col>
                            <settings-list />
                        </v-col>
                        <v-col>
                            <times-list />
                        </v-col>
                    </v-row>
                </v-container>
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

        <v-expansion-panel title="Debug" value="debug">
            <v-expansion-panel-text>
                <v-container>
                    <v-row>
                        <v-col>
                            <all-times-list />
                        </v-col>
                        <v-col>
                            <automation-trigger />
                            <v-card title="Test Icon">
                                <v-card-subtitle>
                                    <v-btn href="https://pictogrammers.com/library/mdi/" variant="text">
                                        https://pictogrammers.com/library/mdi/
                                    </v-btn>
                                </v-card-subtitle>
                                <v-card-text>
                                    <v-text-field v-model="testIcon" :prepend-icon="testIcon" />
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-expansion-panel-text>
        </v-expansion-panel>

    </v-expansion-panels>

</template>

<script setup>
import { ref } from 'vue'

import AlertsPopUp from '@/components/AlertsPopUp.vue'
import AllTimesList from '@/components/AllTimesList.vue'
import AutomationTrigger from '@/components/AutomationTrigger.vue'
import ConnectionDiagram from '@/components/ConnectionDiagram.vue'
import HueControlPanels from '@/components/HueControlPanels.vue'
import PowerViewControlPanel from '@/components/PowerViewControlPanel.vue'
import SettingsList from '@/components/SettingsList.vue'
import TimesList from '@/components/TimesList.vue'

const testIcon = ref('mdi-home-automation')
</script>
