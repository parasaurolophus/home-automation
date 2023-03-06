<template>
    <v-container>
        <v-row>
            <v-col v-for="(bridge, index) in hueModels" :key="index">
                <v-card>
                    <v-card-title>{{ bridge.title }}</v-card-title>
                    <v-card-text>
                        <fieldset v-for="(group, index) in bridge.groups" :key="index" :disabled="websocketStatus != 1">
                            <legend>{{ group.name }}</legend>
                            <v-switch v-model="group.grouped_light.on.on"
                                @change="websocketPublish({ payload: { on: { on: group.grouped_light.on.on } }, topic: group.value, method: 'PUT' })">
                                <template v-slot:label>
                                    <span v-if="group.grouped_light.on.on">On</span>
                                    <span v-else>Off</span>
                                </template>
                            </v-switch>
                            <v-btn v-for="(scene, index) in group.scenes" :key="index"
                                @click="websocketPublish({ payload: { recall: { action: 'dynamic_palette' } }, topic: scene.value, method: 'PUT' })">
                                {{ scene.metadata.name }}
                            </v-btn>
                        </fieldset>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
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