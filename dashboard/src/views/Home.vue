<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <v-row>
            <!-- dashboard -->
            <v-col>
                <ConnectionsDiagramComponent />
            </v-col>
            <v-col>
                <TimerComponent />
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
            <!-- controls -->
            <v-col>
                <SettingsComponent />
            </v-col>
            <v-col>
                <PowerViewControlsComponent />
            </v-col>
        </v-row>
        <v-row>
            <!--
                HueControlsComponent assumes it will
                be inserted directly into a <v-row>
            -->
            <HueControlsComponent />
        </v-row>
        <v-row>
            <!--
                HueMetaDataComponent assumes it will
                be inserted into a <v-row>
            -->
            <HueMetaDataComponent />
        </v-row>
    </v-container>
</template>

<script setup>
import ConnectionsDiagramComponent from '@/components/status/ConnectionsDiagramComponent.vue'
import TimerComponent from '@/components/status/debug/TimerComponent.vue'
import TriggerComponent from '@/components/status/debug/TriggerComponent.vue'
import AlertComponent from '@/components/AlertComponent.vue'
import SettingsComponent from '@/components/controls/SettingsComponent.vue'
import PowerViewControlsComponent from '@/components/controls/PowerViewControlsComponent.vue'
import HueControlsComponent from '@/components/controls/HueControlsComponent.vue'
import HueMetaDataComponent from '@/components/status/HueMetaDataComponent.vue'
</script>