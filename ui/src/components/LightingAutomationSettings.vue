<template>
    <div class="align-center">
        <v-switch v-model="settingsLighting" class="align-center">
            <template #prepend>
                <v-icon v-if="settingsLighting" color="secondary" icon="mdi-lightbulb-on" />
                <v-icon v-else color="primary" icon="mdi-lightbulb" />
            </template>
        </v-switch>
    </div>
</template>

<style scoped>
.align-center {
    height: 100%;
    display: flex;
    align-content: center;
}

.align-center>* {
    margin: 0 0.5rem 0 0.5rem;
}
</style>

<script setup>
import { inject } from 'vue'

const settingsLighting = inject('settingsLighting')
</script>