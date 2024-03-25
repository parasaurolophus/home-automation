<template>
    <v-container>
        <v-row>
            <v-col v-for="(room, index) in hub" :key="index">
                <fieldset :disabled="websocketStatus != 1">
                    <legend>{{ room.title }}</legend>
                    <v-btn v-for="(scene, index) in room.children" :key="index"
                        @click="websocketPublish({ payload: scene.id, topic: 'put/powerview/scene' })">
                        {{ scene.title }}
                    </v-btn>
                </fieldset>
            </v-col>
        </v-row>
    </v-container>
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