<template>

    <v-app-bar class="app-bar" title="Home Automation">
        <template #prepend>
            <v-app-bar-nav-icon @click.stop="displayMenu = !displayMenu">
            </v-app-bar-nav-icon>
        </template>
        <div class="pad">{{ messageCount }}</div>
        <div class="pad">{{ status }}</div>
        <ThemeSelector />
    </v-app-bar>

    <v-navigation-drawer v-model="displayMenu">
        <TimesList />
    </v-navigation-drawer>

</template>

<style scoped>
.pad {
    margin: 0.25rem;
}
</style>

<script setup>
import { computed, inject, ref } from 'vue'

const messageCount = inject('messageCount')
const websocketStatus = inject('websocketStatus')

const displayMenu = ref(false)

const status = computed(() => {

    switch (websocketStatus.value) {

        case 0:
            return 'connecting'

        case 1:
            return 'connected'

        default:
            return 'error'
    }
})
</script>
