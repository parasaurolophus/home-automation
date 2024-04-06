<template>
    <v-switch v-model="settingsShades" class="align-center" />
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
