<template>
    <div v-if="trigger">
        <v-card>
            <v-card-text>
                <fieldset>
                    <legend>automation/trigger</legend>
                    <pre v-html="trigger"></pre>
                </fieldset>
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