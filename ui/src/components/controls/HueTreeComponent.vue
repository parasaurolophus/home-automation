<template>
    <fieldset>
        <legend>Lighting</legend>
        <v-treeview :items="bridges" open-strategy="single" activatable active-strategy="single-leaf" density="compact">
            <template #prepend="{ item }">
                <v-switch v-if="item.category == 'group'" v-model="item.on"
                    @change="websocketPublish({ payload: { on: { on: item.on } }, topic: item.topic, method: 'PUT' })">
                    <template #label>{{ item.title }}</template>
                </v-switch>
                <v-btn v-else-if="item.category == 'scene'"
                    @click="websocketPublish({ payload: { recall: { action: 'active' } }, topic: item.topic, method: 'PUT' })">
                    {{ item.title }}
                </v-btn>
                <span v-if="['group', 'scene'].includes(item.category)">&nbsp;</span>
            </template>
            <template #title="{ item }">
                <span v-if="!['group', 'scene'].includes(item.category)" class="group-title">{{ item.title }}</span>
            </template>
        </v-treeview>
    </fieldset>
</template>

<style scoped>
.group-title {
    font-style: italic;
}
</style>

<script setup>
import { inject } from 'vue'
import { VTreeview } from 'vuetify/lib/labs/components.mjs'

const props = defineProps({
    bridges: Array
})

const websocketPublish = inject('websocketPublish')
</script>
