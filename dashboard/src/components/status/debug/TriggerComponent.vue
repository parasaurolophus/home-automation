<template>
    <div v-if="trigger">
        <div>&nbsp;</div>
        <v-card>
            <v-card-title>automation/trigger</v-card-title>
            <v-card-text>
                <pre v-html="trigger"></pre>
            </v-card-text>
        </v-card>
    </div>
</template>

<style scoped>
/* */
</style>

<script setup>
import { inject } from 'vue'

const trigger = inject('trigger')
</script>