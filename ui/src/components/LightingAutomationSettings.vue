<template>
    <v-switch v-model="settingsLighting" class="align-center">
        <template #label>
            <v-icon v-if="settingsLighting" color="primary" icon="mdi-lightbulb-on" />
            <v-icon v-else color="secondary" icon="mdi-lightbulb" />
        </template>
    </v-switch>
</template>

<style scoped>
.align-center {
    height: 100%;
    display: flex;
    align-content: center;
}
</style>

<script setup>
import { inject } from 'vue'

const settingsLighting = inject('settingsLighting')
</script>
