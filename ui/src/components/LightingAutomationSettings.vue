<template>
    <v-card>
        <v-card-item>
            <template #append>
                <v-icon :color="settingsColor" :icon="settingsIcon" />
            </template>
            <v-card-title>
                Lighting Automation
            </v-card-title>
            <v-card-subtitle>
                <v-chip :color="settingsColor">
                    {{ settingsText }}
                </v-chip>
            </v-card-subtitle>
        </v-card-item>
        <v-card-text>
            <v-switch v-model="settingsLighting" class="align-center" @click.stop.prevent="clicked" />
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

const settingsLighting = inject('settingsLighting')
const websocketPublish = inject('websocketPublish')

const settingsColor = computed(() => settingsLighting.value ? 'primary' : 'secondary')
const settingsIcon = computed(() => settingsLighting.value ? 'mdi-lightbulb-on' : 'mdi-lightbulb')
const settingsText = computed(() => settingsLighting.value ? 'enabled' : 'disabled')

function clicked() {
    websocketPublish({
        payload: !settingsLighting.value,
        topic: 'settings/lighting',
        retain: true,
        label: 'user',
    })
}
</script>
