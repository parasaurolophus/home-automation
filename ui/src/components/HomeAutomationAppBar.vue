<template>

    <v-app-bar class="app-bar" title="Home Automation">
        <template #prepend>
            <v-app-bar-nav-icon @click.stop="displayMenu = !displayMenu">
            </v-app-bar-nav-icon>
        </template>
        <theme-selector />
    </v-app-bar>

    <v-navigation-drawer v-model="displayMenu">
        <SettingsControls />
        <v-divider />
        <TimesList />
    </v-navigation-drawer>

</template>

<script setup>
import { inject, ref } from 'vue'

const standardTimerThemeIcon = inject('standardTimerThemeIcon')
const timerTheme = inject('timerTheme')
const timerThemeIcons = inject('timerThemeIcons')

const displayMenu = ref(false)
</script>
