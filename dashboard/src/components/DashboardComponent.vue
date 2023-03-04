<template>
    <div class="row">
        <ConnectionsDiagramComponent />
        <TimerComponent />
        <TriggerComponent />
    </div>
</template>

<style scoped>
/* */
</style>

<script setup>
import ConnectionsDiagramComponent from '@/components/status/ConnectionsDiagramComponent.vue'
import TimerComponent from '@/components/status/debug/TimerComponent.vue'
import TriggerComponent from '@/components/status/debug/TriggerComponent.vue'
</script>