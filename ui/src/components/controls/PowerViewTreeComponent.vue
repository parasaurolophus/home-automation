<template>
    <fieldset>
        <legend>Shades</legend>
        <v-treeview v-model="tree" :items="hub" activatable>
            <template v-slot:prepend="item">
                <v-icon v-if="item.category == 'scene'" icon="mdi-lightbulb-group-outline"></v-icon>
                <v-icon v-else-if="item.category == 'group'" icon="mdi-lightbulb-group"></v-icon>
                <v-icon v-else-if="item.category == 'bridge'" icon="mdi-hubspot"></v-icon>
                <v-icon v-else icon="mdi-home"></v-icon>
            </template>
        </v-treeview>
    </fieldset>
</template>

<script setup>
import { ref } from 'vue'
import { VTreeview } from 'vuetify/lib/labs/components.mjs'

defineProps({
    hub: Object
})

const tree = ref([])
</script>