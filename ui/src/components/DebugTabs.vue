<template>
    <v-tabs v-model="tab">
        <v-tab value="0">Hue Bridges</v-tab>
        <v-tab value="1">Search Hue Resources</v-tab>
        <v-tab value="2">PowerView Model</v-tab>
        <v-tab value="3">Timer Model</v-tab>
    </v-tabs>
    <v-window v-model="tab">
        <v-window-item value="0">
            <v-divider />
            <HueBridges />
        </v-window-item>
        <v-window-item value="1">
            <v-divider />
            <SearchModel v-model="hueResources" v-model:filter="hueResourcesFilter" />
        </v-window-item>
        <v-window-item value="2">
            <v-divider />
            <pre>{{ JSON.stringify(powerviewModel, undefined, 4) }}</pre>
        </v-window-item>
        <v-window-item value="3">
            <v-divider />
            <v-table>
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="label">theme</td>
                        <td class="label">{{ timerTheme }}</td>
                    </tr>
                    <tr v-for="(time, index) in timerTimes" :key="index">
                        <td class="label">{{ time.label }}</td>
                        <td>{{ new Date(time.value).toLocaleString() }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-window-item>
    </v-window>
</template>

<style scoped>
.label {
    font-family: monospace;
}
</style>

<script setup>
import { inject, onMounted, ref, watch } from 'vue'

const hueResources = inject('hueResources')
const powerviewModel = inject('powerviewModel')
const timerModel = inject('timerModel')

const tab = ref(0)
const timerTheme = ref('')
const timerTimes = ref([])

const hueResourcesFilter = ref(`(
  $address := '192.168.1.34';
  $kinds := /^(bridge_home|zone|room)$/;
  $names := /^(.*)$/;
  $bridge := $lookup($, $address);
  $groups := $sift($bridge, function($v, $k) { $k ~> $kinds }).*.*[];
  $model := $groups.(
      $gid := id;
      {
          'id': $gid,
          'type': type,
          'name': metadata.name ? metadata.name : type = 'bridge_home' ? 'All Lights' : '<unnamed>',
          'grouped_light': $bridge.grouped_light.*[owner.rid=$gid].{
                'grouped_light_id': id,
                'grouped_light_state': on.on,
                'command': {
                    'topic': 'put/hue/' & $address & '/resource/grouped_light/' & id,
                    'payload': { 'on': { 'on': $not(on.on) } },
                    'method': 'PUT'
                },
                'scenes': $bridge.scene.*[group.rid=$gid].{
                    'scene_id': id,
                    'scene_name': metadata.name,
                    'command': {
                        'topic': 'put/hue/' & $address & '/resource/scene/' & id,
                        'payload': { 'recall': { 'action': 'active' } },
                        'method': 'PUT'
                    }
            }
        }
      })[];
      $model[name ~> $names][]
)`)

onMounted(updateTimer)
watch(timerModel, updateTimer, { deep: true })

function updateTimer() {
    timerTheme.value = timerModel.value.theme
    const times = []
    for (let label of Object.getOwnPropertyNames(timerModel.value)) {
        if (label != 'theme') {
            times.push({
                label: label,
                value: timerModel.value[label]
            })
        }
    }
    times.sort((a, b) => a.value - b.value)
    timerTimes.value = times
}
</script>
