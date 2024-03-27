<template>
    <v-card>
        <v-card-title>{{ bridge.title }}</v-card-title>
        <v-card-text>
            <fieldset v-for="(group, index) in bridge.children" :key="index" :disabled="websocketStatus != 1">
                <legend>{{ group.title }}</legend>
                <v-switch v-model="group.on"
                    @change="websocketPublish({ payload: { on: { on: group.on } }, topic: group.topic, method: 'PUT' })">
                    <template v-slot:label>
                        <span v-if="group.state">On</span>
                        <span v-else>Off</span>
                    </template>
                </v-switch>
                <v-btn v-for="(scene, index) in group.children" :key="index"
                    @click="websocketPublish({ payload: { recall: { action: 'active' } }, topic: scene.topic, method: 'PUT' })">
                    {{ scene.title }}
                </v-btn>
            </fieldset>
        </v-card-text>
    </v-card>
</template>

<style scoped>
/* */
</style>

<script setup>
import { inject } from 'vue'

defineProps({
    bridge: Object
})

const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')
</script>