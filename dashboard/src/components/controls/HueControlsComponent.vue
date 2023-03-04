<template>
    <v-card v-for="bridge in hueModels" :key="bridge.title">
        <v-card-title>{{ bridge.title }}</v-card-title>
        <v-card-text>
            <fieldset v-for="group in bridge.groups" :key="group.grouped_light.id" :disabled="websocketStatus != 1" class="column">
                <legend>{{ group.name }}</legend>
                <v-switch v-model="group.grouped_light.on.on"
                    @change="websocketPublish({ payload: { on: { on: group.grouped_light.on.on } }, topic: group.value, method: 'PUT' })">
                    <template v-slot:label>
                        <span v-if="group.grouped_light.on.on">On</span>
                        <span v-else>Off</span>
                    </template>
                </v-switch>
                <v-btn v-for="scene in group.scenes" :key="scene.id"
                    @click="websocketPublish({ payload: { recall: { action: 'dynamic_palette' } }, topic: scene.value, method: 'PUT' })">
                    {{ scene.metadata.name }}
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

const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')
const hueModels = inject('hueModels')

</script>