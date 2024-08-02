<template>
    <v-tabs v-model="tab">
        <v-tab value="0">Hue Bridges</v-tab>
        <v-tab value="1">Search Hue Resources</v-tab>
        <v-tab value="2">PowerView Model</v-tab>
        <v-tab value="3">Timer Model</v-tab>
        <v-tab value="4">Last Message</v-tab>
        <v-tab value="5">Mermaid Test</v-tab>
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
            <SearchModel v-model="powerviewModel" />
        </v-window-item>
        <v-window-item value="3">
            <v-divider />
            <TimerTimes />
        </v-window-item>
        <v-window-item value="4">
            <v-divider />
            <pre>{{ JSON.stringify(lastMessage, undefined, 4) }}</pre>
        </v-window-item>
        <v-window-item value="5">
            <v-divider />
            <MermaidTest />
        </v-window-item>
    </v-window>
</template>

<script setup>
import { inject, onMounted, onUpdated, ref } from 'vue'
import { useTheme } from 'vuetify'
import mermaid from 'mermaid'

const hueResources = inject('hueResources')
const lastMessage = inject('lastMessage')
const powerviewModel = inject('powerviewModel')

const tab = ref(null)
const theme = useTheme()

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

onMounted(initializeMermaid)
onUpdated(initializeMermaid)

function initializeMermaid() {
    mermaid.initialize({
        startOnLoad: false,
        theme: theme.global.current.value.dark ? 'dark' : 'light',
    })
}
</script>
