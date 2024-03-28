<template>
    <v-expansion-panels>
        <v-expansion-panel :title="bridge.title">
            <v-expansion-panel-text>
                <v-expansion-panels>
                    <template v-for="(group, index) in bridge.children" :key="index">
                        <v-expansion-panel :disabled="websocketStatus != 1">
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
                                <v-btn v-for="(scene, index) in group.children" :key="index"
                                    @click="websocketPublish({ payload: { recall: { action: 'active' } }, topic: scene.topic, method: 'PUT' })">
                                    {{ scene.title }}
                                </v-btn>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </template>
                </v-expansion-panels>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup>
import { inject } from 'vue'

defineProps({
    bridge: Object
})

const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')
</script>