<template>
    <div v-if="lights.length > 0" class="controls">
        <div class="title">Lights</div>
        <v-btn v-for="(light, index) in lights" :key="index" @click="toggleLight(address, light)" class="spaced-out">
            {{ light.metadata?.name ?? light.id ?? "Unknown Light" }}
        </v-btn>
    </div>
</template>

<style scoped>
.controls {
    margin: 1rem;
}

.spaced-out {
    margin: 0.25rem 0.25rem 0.25rem 0.25rem;
}

.title {
    font-size: small;
}
</style>

<script setup>
import { inject, ref } from 'vue'
import { findLights } from '@/hue'

const props = defineProps(['address', 'group', 'resources'])

const websocketPublish = inject('websocketPublish')

const lights = ref(findLights(props.resources, props.group))

function toggleLight(address, light) {
    websocketPublish({
        payload: { on: { on: !light.on.on } },
        topic: 'put/hue/' + address + '/resource/light/' + light.id,
        method: 'PUT',
    })
}
</script>