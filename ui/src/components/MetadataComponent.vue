<template>
    <v-expansion-panels>
        <v-expansion-panel title="Hue Bridges">
            <v-expansion-panel-text>
                <v-treeview :items="hueModel" return-object activatable active-strategy="single-independent"
                    open-strategy="single" v-model:activated="activeHueItem" v-model:opened="openHueGroup">
                    <template #title="{ item }">
                        {{ item.title }}
                        <pre
                            v-if="item.category == 'group'">{{ JSON.stringify({ payload: { on: { on: false } }, topic: item.topic, method: 'PUT' }, undefined, 4) }}</pre>
                        <pre
                            v-else-if="item.category == 'scene'">{{ JSON.stringify({ payload: { recall: { action: 'active' } }, topic: item.topic, method: 'PUT' }, undefined, 4) }}</pre>
                    </template>
                </v-treeview>
            </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="PowerView Hub">
            <v-expansion-panel-text>
                <v-treeview :items="powerviewModel" return-object activatable active-strategy="single-independent"
                    open-strategy="single" v-model:activated="activePowerviewItem" v-model:opened="openPowerviewGroup">
                    <template #title="{ item }">
                        {{ item.title }}
                        <pre
                            v-if="item.category == 'scene'">{{ JSON.stringify({ payload: item.id, topic: 'put/powerview/scene' }, undefined, 4) }}</pre>
                    </template>
                </v-treeview>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup>
import { inject, ref, watch } from 'vue'
import { VTreeview } from 'vuetify/lib/labs/components.mjs';

const hueModel = inject('hueModel')
const powerviewModel = inject('powerviewModel')

const activeHueItem = ref([])
const openHueGroup = ref([])
const activePowerviewItem = ref([])
const openPowerviewGroup = ref([])

watch(activeHueItem, () => console.log('active hue: ' + JSON.stringify(activeHueItem.value, undefined, 4)))
watch(openHueGroup, () => console.log('open hue: ' + JSON.stringify(activeHueItem.value, undefined, 4)))
watch(activePowerviewItem, () => console.log('active powerview: ' + JSON.stringify(activePowerviewItem.value, undefined, 4)))
watch(openPowerviewGroup, () => console.log('open powerview: ' + JSON.stringify(activePowerviewItem.value, undefined, 4)))
</script>
