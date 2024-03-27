<template>
    <fieldset>
        <legend>Shades</legend>
        <v-treeview v-model="tree" :items="hub" activatable active-strategy="single-leaf" density="compact">
            <template v-slot:append="{ item }">
                <v-btn v-if="item.category == 'scene'"
                    @click="websocketPublish({ payload: item.id, topic: 'put/powerview/scene' })">
                    activate
                </v-btn>
            </template>
        </v-treeview>
    </fieldset>
</template>

<script setup>
import { inject, ref } from 'vue'
import { VTreeview } from 'vuetify/lib/labs/components.mjs'

defineProps({
    hub: Object
})

const websocketPublish = inject('websocketPublish')
const tree = ref([])
</script>
