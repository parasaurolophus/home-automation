<template>
    <fieldset>
        <legend>automation/trigger</legend>
        <pre v-if="trigger" v-html="trigger"></pre>
        <p v-else>None received since dashboard was reloaded</p>
    </fieldset>
</template>

<style scoped>
/* */
</style>

<script setup>
import { inject } from 'vue'

const trigger = inject('trigger')
</script>