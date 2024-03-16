<template>
    <fieldset>
        <legend>automation/trigger</legend>
        <pre v-html="trigger"></pre>
    </fieldset>
</template>

<style scoped>
/* */
</style>

<script setup>
import { inject } from 'vue'

const trigger = inject('trigger')
</script>