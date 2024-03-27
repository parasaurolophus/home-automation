<template>
    <fieldset>
        <legend>Lighting</legend>
        <v-treeview v-model="tree" :items="bridges" activatable active-strategy="single-leaf" density="compact">
            <template v-slot:append="{ item }">
                <v-switch v-if="item.category == 'group'" v-model="item.on"
                    @change="websocketPublish({ payload: { on: { on: item.on } }, topic: item.topic, method: 'PUT' })">
                    <template v-slot:label>
                        <span v-if="item.on">on</span>
                        <span v-else>off</span>
                    </template>
                </v-switch>
                <v-btn v-else-if="item.category == 'scene'"
                    @click="websocketPublish({ payload: { recall: { action: 'active' } }, topic: item.topic, method: 'PUT' })">
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
    bridges: Object
})

const websocketPublish = inject('websocketPublish')
const tree = ref([])

function itemsActivated(event) {
    console.log(JSON.stringify(tree.value, undefined, 4))
}
</script>
