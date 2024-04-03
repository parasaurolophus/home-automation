<template>

    <v-app-bar class="app-bar">
        <template #prepend>
            <v-app-bar-nav-icon @click.stop="displayMenu = !displayMenu"></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title>Home Automation</v-app-bar-title>
        <v-chip v-if="nextTime">
            {{ nextTime.label }}:
            {{ new Date(nextTime.time).toLocaleString() }}
        </v-chip>
        <v-chip>{{ timerTheme }}</v-chip>
        <theme-selector />
    </v-app-bar>

    <v-navigation-drawer v-model="displayMenu">
        <settings-controls />
        <v-divider />
        <times-list />
    </v-navigation-drawer>

</template>

<script setup>
import { inject, ref } from 'vue'

const timerTheme = inject('timerTheme')
const nextTime = inject('nextTime')

const displayMenu = ref(false)
</script>
