<template>

    <v-app-bar class="app-bar" title="Home Automation">
        <template #prepend>
            <v-app-bar-nav-icon @click.stop="displayMenu = !displayMenu">
            </v-app-bar-nav-icon>
        </template>
        <theme-selector />
    </v-app-bar>

    <v-navigation-drawer v-model="displayMenu">
        <TimesList />
    </v-navigation-drawer>

</template>

<script setup>
import { ref } from 'vue'

const displayMenu = ref(false)
</script>
