<template>
    <v-card v-if="powerviewModel.length > 0">
        <v-card-title>Window Shades</v-card-title>
        <v-card-text>
            <fieldset v-for="room in powerviewModel" :key="room.id" :disabled="websocketStatus != 1" class="column">
                <legend>{{ room.name }}</legend>
                <v-btn v-for="scene in room.scenes" :key="scene.id"
                    @click="websocketPublish({ payload: scene.id, topic: 'put/powerview/scene' })">
                    {{ scene.name }}
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
const powerviewModel = inject('powerviewModel')

</script>