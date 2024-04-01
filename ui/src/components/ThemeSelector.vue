<template>
    <v-btn-toggle v-model="selectedTheme" mandatory>
        <v-btn icon="mdi-weather-night" @click="setTheme('dark')" />
        <v-btn icon="mdi-weather-sunny" @click="setTheme('light')" />
    </v-btn-toggle>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const selectedTheme = ref(theme.global.name.value == 'dark' ? 0 : 1)

function setTheme(name) {
    theme.global.name.value = name
}
</script>