<template>
    <fieldset>
        <legend>Lighting</legend>
        <v-treeview v-model="tree" :items="bridges" activatable>
        </v-treeview>
    </fieldset>
</template>

<script setup>
import { ref } from 'vue'
import { VTreeview } from 'vuetify/lib/labs/components.mjs'

defineProps({
    bridges: Object
})

const tree = ref([])
</script>
