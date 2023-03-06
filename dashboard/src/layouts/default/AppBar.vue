<template>
    <v-app-bar>
        <v-app-bar-title>Dashboard </v-app-bar-title>
        <v-btn @click="toggleTheme">{{ theme.global.current.value.dark ? 'light' : 'dark' }}</v-btn>
    </v-app-bar>
</template>

<style scoped>
/* */
</style>

<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {

    const newTheme = theme.global.current.value.dark ? 'light' : 'dark'

    theme.global.name.value = newTheme

}
</script>
