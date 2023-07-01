<template>
    <!--
        N.B. this SFC assumes it will be inserted into a <v-row>!

        To be used on its own, wrap the following <v-container><v-row>
    -->
    <v-col v-for="(bridge, index) in hueModels" :key="index">
        <v-card>
            <v-card-title>{{ bridge.title }}</v-card-title>
            <v-card-text>
                <fieldset v-for="(group, index) in bridge.groups" :key="index" :disabled="websocketStatus != 1">
                    <legend>{{ group.name }}</legend>
                    <table>
                        <tr>
                            <th>grouped_light.id</th>
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
const hueModels = inject('hueModels')
</script>