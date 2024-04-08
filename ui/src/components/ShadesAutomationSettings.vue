<template>
    <v-card>
        <v-card-item>
            <template #append>
                <v-icon :color="settingsColor" :icon="settingsIcon" />
            </template>
            <v-card-title>
                Shades Automation
            </v-card-title>
            <v-card-subtitle>
                <v-chip :color="settingsColor">
                    {{ settingsText }}
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

const settingsShades = inject('settingsShades')

const settingsColor = computed(() => settingsShades.value ? 'primary' : 'secondary')
const settingsIcon = computed(() => settingsShades.value ? 'mdi-blinds-open' : 'mdi-blinds')
const settingsText = computed(() => settingsShades.value ? 'enabled' : 'disabled')
</script>
