<template>
    <v-container>
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

<script setup>
import TimerComponent from '@/components/ui/TimerComponent.vue'
import TriggerComponent from '@/components/ui/TriggerComponent.vue'
</script>