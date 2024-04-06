<template>
    <v-card>
        <v-card-item>
            <template #append>
                <v-icon :color="shadesColor" :icon="shadesIcon" />
            </template>
            <v-card-title>
                Shades Automation
            </v-card-title>
            <v-card-subtitle>
                <v-chip :color="shadesColor">
                    {{ shadesText }}
                </v-chip>
            </v-card-subtitle>
        </v-card-item>
        <v-card-text>
            <v-switch v-model="settingsShades" class="align-center" />
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

const computeShadesColor = inject('computeShadesColor')
const computeShadesIcon = inject('computeShadesIcon')
const computeShadesText = inject('computeShadesText')
const settingsShades = inject('settingsShades')

const shadesColor = computed(computeShadesColor)
const shadesIcon = computed(computeShadesIcon)
const shadesText = computed(computeShadesText)
</script>
