<template>
    <v-card>
        <v-card-item>
            <template #append>
                <v-icon :color="lightingColor" :icon="lightingIcon" />
            </template>
            <v-card-title>
                Lighting Automation
            </v-card-title>
            <v-card-subtitle>
                <v-chip :color="lightingColor">
                    {{ lightingText }}
                </v-chip>
            </v-card-subtitle>
        </v-card-item>
        <v-card-text>
            <v-switch v-model="settingsLighting" class="align-center" />
        </v-card-text>
    </v-card>
</template>

<style scoped>
.align-center {
    height: 100%;
    align-self: center;
    align-items: center;
    align-content: center;
    display: flex;
}
</style>

<script setup>
import { computed, inject } from 'vue'

const computeLightingColor = inject('computeLightingColor')
const computeLightingIcon = inject('computeLightingIcon')
const computeLightingText = inject('computeLightingText')
const settingsLighting = inject('settingsLighting')

const lightingColor = computed(computeLightingColor)
const lightingIcon = computed(computeLightingIcon)
const lightingText = computed(computeLightingText)
</script>
