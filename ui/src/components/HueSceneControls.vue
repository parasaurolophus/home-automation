<template>
    <div v-if="scenes.length > 0" class="controls">
        <div class="title">Scenes</div>
        <v-btn v-for="(scene, index) in scenes" :key="index" @click="activateScene(props.address, scene)"
            class="spaced-out">
            {{ scene.metadata?.name ?? scene.id ?? 'Unknown Scene' }}
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
import { findScenes } from '@/hue'

const props = defineProps(['address', 'group', 'resources'])

const websocketPublish = inject('websocketPublish')

const scenes = ref(findScenes(props.resources, props.group))

function activateScene(address, scene) {
    websocketPublish({
        payload: { recall: { action: 'active' } },
        topic: 'put/hue/' + address + '/resource/scene/' + scene.id,
        method: 'PUT'
    })
}
</script>