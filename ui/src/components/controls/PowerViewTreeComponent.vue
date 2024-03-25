<template>
    <v-treeview :items="hub" density="compact" activatable>
    </v-treeview>
</template>

<script setup>
import { VTreeview } from 'vuetify/lib/labs/components.mjs'

defineProps({
    hub: Object
})
</script>