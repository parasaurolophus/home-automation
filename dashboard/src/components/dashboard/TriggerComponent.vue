<template>
    <fieldset>
        <legend>automation/trigger</legend>
        <pre v-html="formattedTrigger()"></pre>
    </fieldset>
</template>

<style scoped>
/* */
</style>

<script setup>
import { inject } from 'vue'

const trigger = inject('trigger')

function formattedTrigger() {

    if (typeof(trigger.value) == 'object') {
        return JSON.stringify(trigger.value, undefined, 1)
    }

    return trigger.value
}
</script>