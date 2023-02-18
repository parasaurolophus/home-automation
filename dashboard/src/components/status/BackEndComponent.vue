<template>
    <div>
        <WebSocketComponent />
        <TimerComponent />
        <TriggerComponent />
    </div>
</template>

<script setup>
import WebSocketComponent from '@/components/status/WebSocketComponent.vue'
import TimerComponent from '@/components/status/debug/TimerComponent.vue'
import TriggerComponent from '@/components/status/debug/TriggerComponent.vue'
</script>