<template>
    <v-expansion-panels v-for="(resources, address) in hueResources" :key="address">
        <v-expansion-panel :title="hueTitle[address] ?? address">
            <v-expansion-panel-text>
                <v-expansion-panels>
                    <template v-for="(kind, kindIndex) in ['bridge_home', 'zone', 'room']" :key="kindIndex">
                        <template v-if="hasResourcesOfKind(resources, kind)">
                            <v-expansion-panel v-for="(group, groupId, groupIndex) in sortedResources(resources[kind])"
                                :key="groupIndex">
                                <template
                                    v-for="(groupedLight, groupedLightIndex) in findGroupedLight(resources, group)"
                                    :key="groupedLightIndex">
                                    <v-expansion-panel-title>
                                        <template v-if="kind == 'bridge_home'">All Lights</template>
                                        <template v-else>{{ group.metadata?.name ?? group.id ??
                                            props.groupId }} ({{ kind }})</template>
                                        <template #actions v-if="groupedLight?.on">
                                            <v-switch v-model="groupedLight.on.on"
                                                @click.stop.prevent="toggleGroup(address, groupedLight)" />
                                        </template>
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        <HueSceneControls :address="address" :resources="resources" :group="group" />
                                        <HueLightControls :address="address" :resources="resources" :group="group" />
                                    </v-expansion-panel-text>
                                </template>
                            </v-expansion-panel>
                        </template>
                    </template>
                </v-expansion-panels>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup>
import { inject, ref } from 'vue'
import { compareNames, findGroupedLight } from '@/hue'

const hueTitle = inject('hueTitle')
const hueResources = inject('hueResources')
const websocketPublish = inject('websocketPublish')

function hasResourcesOfKind(resources, kind) {
    return resources[kind] && Object.getOwnPropertyNames(resources[kind]).length > 0
}

function toggleGroup(address, groupedLight) {
    websocketPublish({
        payload: { on: { on: !groupedLight.on.on } },
        topic: 'put/hue/' + address + '/resource/grouped_light/' + groupedLight.id,
        method: 'PUT',
    })
}

function sortedResources(resources) {
    const r = []
    for (let id of Object.getOwnPropertyNames(resources)) {
        r.push(resources[id])
    }
    if (r.length < 2) {
        return r
    }
    return r.sort(compareNames)
}
</script>
