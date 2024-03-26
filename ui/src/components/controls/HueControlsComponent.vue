<template>
    <v-card>
        <v-card-title>{{ bridge.title }}</v-card-title>
        <v-card-text>
            <fieldset v-for="(group, index) in bridge.children" :key="index" :disabled="websocketStatus != 1">
                <legend>{{ group.title }}</legend>
                <v-switch v-model="group.grouped_light.on.on"
                    @change="websocketPublish({ payload: { on: { on: group.grouped_light.on.on } }, topic: group.value, method: 'PUT' })">
                    <template v-slot:label>
                        <span v-if="group.grouped_light.on.on">On</span>
                        <span v-else>Off</span>
                    </template>
                </v-switch>
                <v-btn v-for="(scene, index) in group.children" :key="index"
                    @click="websocketPublish({ payload: { recall: { action: 'active' } }, topic: scene.value, method: 'PUT' })">
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