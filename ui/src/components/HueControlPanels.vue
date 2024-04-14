<template>
    <v-expansion-panels>
        <template v-for="(bridge, bridgeIndex) in [hueResources[address]]" :key="bridgeIndex">
            <template v-for="(kind, kindIndex) in ['zone', 'room']" :key="kindIndex">
                <template v-for="(group, groupId) in bridge[kind]" :key="groupId">
                    <template v-for="(groupedLight, groupedLightIndex) in [findGroupedLight(bridge, group)]"
                        :key="groupedLightIndex">
                        <v-expansion-panel>
                            <v-expansion-panel-title>
                                <v-switch v-if="groupedLight?.on" v-model="groupedLight.on.on"
                                    @click.stop.prevent="toggleGroup(groupedLight)">
                                    <template #label>{{ group.metadata?.name ?? group.id ?? groupId }}</template>
                                </v-switch>
                                <div v-else>{{ group.metadata?.title ?? group.id ?? groupId }}</div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-btn v-for="(scene, index) in findScenes(hueResources[address], group)" :key="index"
                                    @click="activateScene(scene)" class="spaced-out">
                                    {{ scene.metadata?.name ?? scene.id ?? 'Unknown Scene' }}
                                </v-btn>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </template>
                </template>
            </template>
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
import { findGroupedLight, findScenes } from '@/hue'

const props = defineProps(['address'])

const hueResources = inject('hueResources')
const websocketPublish = inject('websocketPublish')

function toggleGroup(groupedLight) {

    websocketPublish({
        payload: { on: { on: !groupedLight.on.on } },
        topic: 'put/hue/' + props.address + '/resource/grouped_light/' + groupedLight.id, method: 'PUT',
    })
}

function activateScene(scene) {
    websocketPublish({
        payload: { recall: { action: 'active' } },
        topic: 'put/hue/' + props.address + '/resource/scene/' + scene.id, method: 'PUT'
    })
}
</script>
