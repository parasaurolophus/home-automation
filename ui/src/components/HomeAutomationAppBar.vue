<template>

    <v-app-bar class="app-bar">
        <template #prepend>
            <v-app-bar-nav-icon @click.stop="displayMenu = !displayMenu"></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title>Home Automation</v-app-bar-title>
        <theme-selector />
    </v-app-bar>

    <v-navigation-drawer v-model="displayMenu">
        <settings-list />
        <v-divider />
        <times-list />
    </v-navigation-drawer>

</template>

<script setup>
import { ref } from 'vue'

const displayMenu = ref(false)
</script>
