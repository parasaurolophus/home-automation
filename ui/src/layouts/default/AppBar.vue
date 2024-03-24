<template>
    <v-app-bar>
        <v-app-bar-title>Home Automation</v-app-bar-title>
        <div class="app-bar-switch">
            <v-switch v-model="selectedTheme" :label="selectedTheme" false-value="dark" false-icon="mdi-weather-night"
                true-value="light" true-icon="mdi-weather-sunny" @change="setTheme" />
        </div>
    </v-app-bar>
</template>

<style scoped>
.app-bar-switch {
    height: 100%;
    display: flex;
    align-content: center;
}

.app-bar-switch>* {
    margin: 0 1rem 0 0;
}
</style>

<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const selectedTheme = ref('dark')

function setTheme() {

    theme.global.name.value = selectedTheme.value

}
</script>
