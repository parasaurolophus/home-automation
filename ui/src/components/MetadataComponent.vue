<template>
    <v-expansion-panels>
        <v-expansion-panel title="Hue Bridges">
            <v-expansion-panel-text>
                <pre>{{ JSON.stringify(hueModel, undefined, 4) }}</pre>
            </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="PowerView Hub">
            <v-expansion-panel-text>
                <pre>{{ JSON.stringify(powerviewModel, undefined, 4) }}</pre>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup>
import { inject } from 'vue'

const hueModel = inject('hueModel')
const powerviewModel = inject('powerviewModel')
</script>
