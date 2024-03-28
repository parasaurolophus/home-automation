<template>
    <v-expansion-panels>
        <v-expansion-panel v-for="(room, index) in hub" :key="index" :disabled="websocketStatus != 1">
            <v-expansion-panel-title>{{ room.title }}</v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-btn v-for="(scene, index) in room.children" :key="index"
                    @click="websocketPublish({ payload: scene.id, topic: 'put/powerview/scene' })">
                    {{ scene.title }}
                </v-btn>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup>
import { inject } from 'vue'

defineProps({
    hub: Object
})

const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')
</script>