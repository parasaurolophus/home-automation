<template>

    <v-app-bar class="app-bar" title="Home Automation" extended>
        <template #prepend>
            <v-app-bar-nav-icon @click.stop="displayMenu = !displayMenu">
            </v-app-bar-nav-icon>
        </template>
        <template #extension>
            <v-spacer />
            <v-chip v-if="automationTrigger" color="secondary">
                {{ automationTrigger['timer/time'] ?? 'no time specified' }}
                {{ new Date(automationTrigger.at).toLocaleString() }}
            </v-chip>
            <v-chip v-if="nextTrigger" color="primary">
                {{ nextTrigger.label }}
                {{ new Date(nextTrigger.time).toLocaleString() }}
            </v-chip>
        </template>
        <v-icon :color="settingsLighting ? 'primary' : 'secondary'">
            {{ settingsLighting ? 'mdi-lightbulb-on' : 'mdi-lightbulb' }}
        </v-icon>
        <v-icon :color="settingsShades ? 'primary' : 'secondary'">
            {{ settingsShades ? 'mdi-blinds-open' : 'mdi-blinds' }}
        </v-icon>
        <v-icon>
            {{ timerThemeIcons[timerTheme] ?? standardTimerThemeIcon }}
        </v-icon>
        <v-divider vertical />
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

const automationTrigger = inject('automationTrigger')
const nextTrigger = inject('nextTrigger')
const settingsLighting = inject('settingsLighting')
const settingsShades = inject('settingsShades')
const standardTimerThemeIcon = inject('standardTimerThemeIcon')
const timerTheme = inject('timerTheme')
const timerThemeIcons = inject('timerThemeIcons')

const displayMenu = ref(false)
</script>
