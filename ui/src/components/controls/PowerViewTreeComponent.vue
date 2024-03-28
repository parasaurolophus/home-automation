<template>
    <fieldset>
        <legend>Shades</legend>
        <v-treeview :items="hub" open-strategy="single" activatable active-strategy="single-leaf" density="compact">
            <template #prepend="{ item }">
                <template v-if="item.category == 'scene'">
                    <v-btn @click="websocketPublish({ payload: item.id, topic: 'put/powerview/scene' })">
                        {{ item.title }}
                    </v-btn>
                    <span>&nbsp;</span>
                </template>
            </template>
            <template #title="{ item }">
                <span v-if="item.category != 'scene'" class="room-title">{{ item.title }}</span>
            </template>
        </v-treeview>
    </fieldset>
</template>

<style scoped>
.room-title {
    font-style: italic;
}
</style>

<script setup>
import { inject } from 'vue'
import { VTreeview } from 'vuetify/lib/labs/components.mjs'

const props = defineProps({
    hub: Array
})

const websocketPublish = inject('websocketPublish')
</script>
