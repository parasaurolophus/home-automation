<template>
    <v-expansion-panels variant="popout">
        <v-expansion-panel v-for="(bridge, bridgeIndex) in hueModel" :key="bridgeIndex">
            <v-expansion-panel-title>{{ bridge.title }}</v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-expansion-panels variant="popout">
                    <v-expansion-panel v-for="(group, groupIndex) in bridge.children" :key="groupIndex"
                        :disabled="websocketStatus != 1">
                        <v-expansion-panel-title>
                            <v-icon :color="group.on ? 'secondary' : 'primary'"
                                :icon="group.on ? 'mdi-lightbulb-on' : 'mdi-lightbulb'"></v-icon>
                            {{ group.title }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-btn
                                @click="websocketPublish({ payload: { on: { on: false } }, topic: group.topic, method: 'PUT' })">
                                Off
                            </v-btn>
                            <template v-for="(scene, index) in group.children" :key="index">
                                &nbsp;
                                <v-btn
                                    @click="websocketPublish({ payload: { recall: { action: 'active' } }, topic: scene.topic, method: 'PUT' })">
                                    {{ scene.title }}
                                </v-btn>
                            </template>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup>
import { inject } from 'vue'

const hueModel = inject('hueModel')
const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')
</script>