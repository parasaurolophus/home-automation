<template>
    <v-switch v-model="settingsLighting" class="align-center" />
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
