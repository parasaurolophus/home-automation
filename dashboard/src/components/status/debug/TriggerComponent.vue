<template>
    <fieldset v-if="trigger.show">
        <legend>Automation Trigger</legend>
        <v-alert v-model="trigger.show" type="info" tonal closable @update:modelValue="closeTrigger">
            <pre>{{ trigger.payload }}</pre>
        </v-alert>
    </fieldset>
</template>

<style scoped>
/* */
</style>

<script setup>

import { inject } from 'vue'

const trigger = inject('trigger')

function closeTrigger() {

    trigger.value.show = false

}

</script>