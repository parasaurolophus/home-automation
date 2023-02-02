<template>

    <div class="wrapped">

        <BackEndComponent />
        <HueBridgesComponent />
        <TimerComponent />

    </div>

</template>

<style scoped>
th,
td {
    margin: 1px;
    padding: 1px 0.5em 1px 0.5em;
}

th {
    text-align: right;
}
</style>

<script setup>

import BackEndComponent from '@/components/BackEndComponent.vue'
import HueBridgesComponent from '@/components/HueBridgesComponent.vue'
import TimerComponent from '@/components/TimerComponent.vue'

</script>