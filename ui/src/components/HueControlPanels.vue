<template>
    <v-expansion-panels v-for="(bridge, address) in hueBridges" :key="address">
        <v-expansion-panel v-for="(resources, bridgeIndex) in [hueResources[address]]" :key="bridgeIndex"
            :title="hueTitle[address] ?? address">
            <v-expansion-panel-text>
                <v-expansion-panels>
                    <template v-for="(kind, kindIndex) in ['zone', 'room']" :key="kindIndex">
                        <v-expansion-panel v-if="hasResourcesOfKind(resources, kind)" :title="capitalize(kind)">
                            <v-expansion-panel-text>
                                <v-expansion-panels>
                                    <v-expansion-panel v-for="(group, groupId, groupIndex) in resources[kind]" :key="groupIndex">
                                        <template
                                            v-for="(groupedLight, groupedLightIndex) in findGroupedLight(resources, group)"
                                            :key="groupedLightIndex">
                                            <v-expansion-panel-title>
                                                {{ group.metadata?.name ?? group.id ?? groupId }}
                                                <template #actions v-if="groupedLight?.on">
                                                    <v-switch v-model="groupedLight.on.on"
                                                        @click.stop.prevent="toggleGroup(address, groupedLight)" />
                                                </template>
                                            </v-expansion-panel-title>
                                            <v-expansion-panel-text>
                                                <v-btn v-for="(scene, index) in findScenes(resources, group)"
                                                    :key="index" @click="activateScene(address, scene)"
                                                    class="spaced-out">
                                                    {{ scene.metadata?.name ?? scene.id ?? 'Unknown Scene' }}
                                                </v-btn>
                                            </v-expansion-panel-text>
                                        </template>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </template>
                </v-expansion-panels>
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
import { findGroupedLight, findScenes } from '@/hue'

const hueBridges = inject('hueBridges')
const hueTitle=inject('hueTitle')
const hueResources = inject('hueResources')
const websocketPublish = inject('websocketPublish')

function hasResourcesOfKind(resources, kind) {
    return resources[kind] && Object.getOwnPropertyNames(resources[kind].length > 0)
}

function capitalize(s) {
    return s.charAt(0).toLocaleUpperCase() + s.substring(1)
}

function toggleGroup(address, groupedLight) {

    websocketPublish({
        payload: { on: { on: !groupedLight.on.on } },
        topic: 'put/hue/' + address + '/resource/grouped_light/' + groupedLight.id, method: 'PUT',
    })
}

function activateScene(address, scene) {
    websocketPublish({
        payload: { recall: { action: 'active' } },
        topic: 'put/hue/' + address + '/resource/scene/' + scene.id, method: 'PUT'
    })
}
</script>
