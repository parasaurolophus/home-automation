<template>
    <v-expansion-panels>
        <v-expansion-panel v-for="(bridge, bridgeIndex) in hueModel" :key="bridgeIndex">
            <v-expansion-panel-title>{{ bridge.title }}</v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-expansion-panels>
                    <v-expansion-panel v-for="(group, groupIndex) in bridge.children" :key="groupIndex"
                        :disabled="websocketStatus != 1">
                        <v-expansion-panel-title>
                            <v-icon :color="groupColor(group)" :icon="groupIcon(group)" />
                            {{ group.title }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-btn @click="sendGroupOff(group)" class="spaced-out">
                                {{ group.title }} Off
                            </v-btn>
                            <v-btn v-for="(scene, index) in group.children" :key="index"
                                @click="sendActivateScene(scene)" class="spaced-out">
                                {{ scene.title }}
                            </v-btn>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<style scoped>
.spaced-out {
    margin: 0.25rem 0.25rem 0.25rem 0.25rem;
}
</style>

<script setup>
import { inject } from 'vue'

const hueModel = inject('hueModel')
const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')

function groupColor(group) {
    return group.on ? 'primary' : 'secondary'
}

function groupIcon(group) {
    return group.on ? 'mdi-lightbulb-on' : 'mdi-lightbulb'
}

function sendGroupOff(group) {
    websocketPublish({ payload: { on: { on: false } }, topic: group.topic, method: 'PUT' })
}

function sendActivateScene(scene) {
    websocketPublish({ payload: { recall: { action: 'active' } }, topic: scene.topic, method: 'PUT' })
}
</script>