<template>

    <div v-if="powerviewModel.length > 0">

        <p class="controls-label">Window Shades</p>

        <fieldset v-for="room in powerviewModel" :key="room.id" :disabled="websocketStatus != 1">

            <legend>{{ room.name }}</legend>

            <v-btn v-for="scene in room.scenes" :key="scene.id"
                @click="websocketPublish({ payload: scene.id, topic: 'put/powerview/scene' })">
                {{ scene.name }}
            </v-btn>

        </fieldset>

    </div>

</template>

<style scoped>
/*  */
</style>

<script setup>

import { inject } from 'vue'

const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')
const powerviewModel = inject('powerviewModel')

</script>