<template>
    <v-expansion-panels>
        <v-expansion-panel v-for="(room, index) in powerviewModel" :key="index" :disabled="websocketStatus != 1">
            <v-expansion-panel-title>{{ room.title }}</v-expansion-panel-title>
            <v-expansion-panel-text>
                <template v-for="(scene, index) in room.children" :key="index">
                    <v-btn class="spaced-out"
                        @click="websocketPublish({ payload: scene.id, topic: 'put/powerview/scene' })">
                        {{ scene.title }}
                    </v-btn>
                </template>
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

const powerviewModel = inject('powerviewModel')
const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')
</script>