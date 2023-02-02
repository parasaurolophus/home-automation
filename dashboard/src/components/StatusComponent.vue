<template>

    <div class="wrapped">

        <BackEndComponent />
        <HueBridgesComponent />
        <TimerComponent />

    </div>

</template>

<style scoped>
.wrapped {
    display: flex;
    flex-flow: row wrap;
}

.wrapped>* {
    margin: 0.25em;
    padding: 0.25em;
}
</style>

<script setup>

import BackEndComponent from '@/components/BackEndComponent.vue'
import HueBridgesComponent from '@/components/HueBridgesComponent.vue'
import TimerComponent from '@/components/TimerComponent.vue'

</script>