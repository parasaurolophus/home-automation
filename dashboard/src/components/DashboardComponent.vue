<template>
    <div class="columns">
        <ConnectionsDiagramComponent />
        <TimerComponent />
        <TriggerComponent />
    </div>
</template>

<style scoped>
.columns {
    display: flex;
    flex-flow: row wrap;
}
</style>

<script setup>
import ConnectionsDiagramComponent from '@/components/status/ConnectionsDiagramComponent.vue'
import TimerComponent from '@/components/status/debug/TimerComponent.vue'
import TriggerComponent from '@/components/status/debug/TriggerComponent.vue'
</script>