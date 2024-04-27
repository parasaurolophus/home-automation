<template>
    <v-expansion-panels>
        <template v-for="room in powerviewModel" :key="room.name">
            <v-expansion-panel v-if="room.scenes" :disabled="websocketStatus != 1">
                <v-expansion-panel-title>{{ room.name }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <template v-for="scene in room.scenes" :key="scene.name">
                        <v-btn class="spaced-out"
                            @click="websocketPublish({ payload: scene.id, topic: 'put/powerview/scene' })">
                            {{ scene.name }}
                        </v-btn>
                    </template>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </template>
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