<template>
    <v-btn-toggle v-model="selected" mandatory>
        <v-btn icon="mdi-bug-outline" @click.stop.prevent="debugMode = false" />
        <v-btn icon="mdi-bug-check" @click.stop.prevent="debugMode = true" />
    </v-btn-toggle>
</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue'

const debugMode = inject('debugMode')

const selected = ref(0)

onMounted(updateSelected)
watch(debugMode, updateSelected)

function updateSelected() {
    selected.value = debugMode.value ? 1 : 0
}
</script>