<template>
    <v-card>
        <v-card-title>{{ bridge.title }}</v-card-title>
        <v-card-text>
            <template v-for="(group, index) in bridge.children" :key="index">
                <fieldset :disabled="websocketStatus != 1">
                    <legend>
                        <v-icon :color="group.on ? 'secondary' : 'primary'"
                            :icon="group.on ? 'mdi-lightbulb-on' : 'mdi-lightbulb'"></v-icon>
                        {{ group.title }}
                    </legend>
                    <v-btn
                        @click="websocketPublish({ payload: { on: { on: false } }, topic: group.topic, method: 'PUT' })">
                        Off
                    </v-btn>
                    <v-btn v-for="(scene, index) in group.children" :key="index"
                        @click="websocketPublish({ payload: { recall: { action: 'active' } }, topic: scene.topic, method: 'PUT' })">
                        {{ scene.title }}
                    </v-btn>
                </fieldset>
            </template>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { inject } from 'vue'

defineProps({
    bridge: Object
})

const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')
</script>