<template>
    <v-card v-if="trigger.show">
        <v-card-title>Automation Trigger</v-card-title>
        <v-card-text>
            <v-alert v-model="trigger.show" type="info" tonal closable @update:modelValue="closeTrigger">
                <pre>{{ trigger.payload }}</pre>
            </v-alert>
        </v-card-text>
    </v-card>
</template>

<script setup>

import { inject } from 'vue'

const trigger = inject('trigger')

function closeTrigger() {

    trigger.value.show = false

}

</script>