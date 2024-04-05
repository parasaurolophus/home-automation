<template>
    <v-switch v-model="settingsShades" class="align-center">
        <template #label>
            <v-icon v-if="settingsShades" color="primary" icon="mdi-blinds-open" />
            <v-icon v-else color="secondary" icon="mdi-blinds" />
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

const settingsShades = inject('settingsShades')
</script>
