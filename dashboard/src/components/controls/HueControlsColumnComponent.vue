<template>
    <!--
        N.B. this SFC assumes it will be inserted into a <v-row>!

        To be used on its own, wrap the following in
        <v-container><v-row>...</v-row></v-container>
    -->
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
                        @click="websocketPublish({ payload: { recall: { action: 'active' } }, topic: scene.value, method: 'PUT' })">
                        {{ scene.metadata.name }}
                    </v-btn>
                    <table>
                        <tr>
                            <th>grouped_light.id for {{ group.owner.type }}</th>
                            <td>{{ group.grouped_light.id }}</td>
                        </tr>
                        <tr v-for="(scene, index) in group.scenes" :key="index">
                            <th>{{ scene.metadata.name }}</th>
                            <td>{{ scene.id }}</td>
                        </tr>
                    </table>
                </fieldset>
            </v-card-text>
        </v-card>
    </v-col>
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