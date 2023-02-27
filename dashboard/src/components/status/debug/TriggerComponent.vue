<template>
    <v-card>
        <v-card-title>Trigger</v-card-title>
        <v-card-text>
            <pre>{{ trigger }}</pre>
        </v-card-text>
    </v-card>
</template>

<script setup>

import { inject } from 'vue'

const trigger = inject('trigger')

</script>