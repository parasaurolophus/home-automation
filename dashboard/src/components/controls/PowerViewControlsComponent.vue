<template>
    <v-card v-if="hub.length > 0">
        <v-card-title>Window Shades</v-card-title>
        <v-card-text>
            <fieldset v-for="(room, index) in hub" :key="index" :disabled="websocketStatus != 1">
                <legend>{{ room.name }}</legend>
                <v-btn v-for="(scene, index) in room.scenes" :key="index"
                    @click="websocketPublish({ payload: scene.id, topic: 'put/powerview/scene' })">
                    {{ scene.name }}
                </v-btn>
                <table>
                    <tr>
                        <th>{{ room.name }}</th>
                        <td>{{ room.id }}</td>
                    </tr>
                    <tr v-for="(scene, index) in room.scenes" :key="index">
                        <th>{{ scene.name }}</th>
                        <td>{{ scene.id }}</td>
                    </tr>
                </table>
            </fieldset>
        </v-card-text>
    </v-card>
</template>

<style scoped>
/* */
</style>

<script setup>
import { inject } from 'vue'

defineProps({
    hub: Object
})

const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')
</script>