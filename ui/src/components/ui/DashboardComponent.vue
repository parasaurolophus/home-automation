<template>
    <v-container>
        <v-row>
            <v-col>
                <AlertComponent />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4">
                <SettingsComponent />
            </v-col>
            <v-col>
                <ConnectionsDiagramComponent />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4">
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
import AlertComponent from '@/components/ui/AlertComponent.vue'
import ConnectionsDiagramComponent from '@/components/ui/ConnectionsDiagramComponent.vue'
import SettingsComponent from '@/components/ui/SettingsComponent.vue'
import TimerComponent from '@/components/ui/TimerComponent.vue'
import TriggerComponent from '@/components/ui/TriggerComponent.vue'
</script>
