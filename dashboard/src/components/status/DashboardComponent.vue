<template>
    <v-container>
        <v-row>
            <v-col>
                <AlertComponent />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <SettingsComponent />
            </v-col>
            <v-col>
                <ConnectionsDiagramComponent />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <TimerComponent />
            </v-col>
            <v-col>
                <TriggerComponent />
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
/* */
</style>

<script setup>
import AlertComponent from '@/components/status/AlertComponent.vue'
import ConnectionsDiagramComponent from '@/components/status/ConnectionsDiagramComponent.vue'
import SettingsComponent from '@/components/controls/SettingsComponent.vue'
import TimerComponent from '@/components/status/debug/TimerComponent.vue'
import TriggerComponent from '@/components/status/debug/TriggerComponent.vue'
</script>