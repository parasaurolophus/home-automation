<template>
    <fieldset>
        <legend>Shades</legend>
        <v-treeview :items="hub" open-strategy="single" activatable active-strategy="single-leaf" density="compact">
            <template #prepend="{ item }">
                <template v-if="item.category == 'scene'">
                    <v-btn :prepend-icon="chooseIcon(item.title)" @click="websocketPublish({ payload: item.id, topic: 'put/powerview/scene' })">
                        {{ item.title }}
                    </v-btn>
                    <span>&nbsp;</span>
                </template>
            </template>
            <template #title="{ item }">
                <span v-if="item.category != 'scene'">{{ item.title }}</span>
            </template>
        </v-treeview>
    </fieldset>
</template>

<script setup>
import { inject } from 'vue'
import { VTreeview } from 'vuetify/lib/labs/components.mjs'

const props = defineProps({
    hub: Array
})

const websocketPublish = inject('websocketPublish')

function chooseIcon(title) {

    if (title.toLowerCase().startsWith('open ')) {
        return 'mdi-blinds-open'
    }

    return 'mdi-blinds'
}
</script>
