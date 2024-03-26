<template>
    <v-treeview :items="hueModel" density="compact" activatable>
    </v-treeview>
</template>

<script setup>
import { inject } from 'vue'
import { VTreeview } from 'vuetify/lib/labs/components.mjs'

const hueModel = inject('hueModel')

</script>