<template>
    <v-tabs v-model="tab">
        <v-tab value="0">Hue Bridges</v-tab>
        <v-tab value="1">Search Hue Resources</v-tab>
        <v-tab value="2">PowerView Model</v-tab>
    </v-tabs>
    <v-window v-model="tab">
        <v-window-item value="0">
            <v-table>
                <thead>
                    <tr>
                        <th>address</th>
                        <th>title</th>
                        <th>status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(title, address, index) in hueTitle" :key="index">
                        <td><a :href="'#bridge-' + address">{{ address }}</a></td>
                        <td>{{ title }}</td>
                        <td>{{ hueStatus[address] }}</td>
                    </tr>
                </tbody>
            </v-table>
            <v-divider />
            <v-list>
                <v-list-item v-for="(bridge, address, index) in hueBridges" :key="index">
                    <v-list-item-title><a :id="'bridge-' + address">{{ address }}</a></v-list-item-title>
                    <pre>{{ JSON.stringify(bridge, undefined, 4) }}</pre>
                </v-list-item>
            </v-list>
        </v-window-item>
        <v-window-item value="1">
            <SearchModel v-model="hueResources" v-model:filter="hueResourcesFilter" />
        </v-window-item>
        <v-window-item value="2">
            <pre>{{ JSON.stringify(powerviewModel, undefined, 4) }}</pre>
        </v-window-item>
    </v-window>
</template>

<script setup>
import { inject, ref } from 'vue'

const hueBridges = inject('hueBridges')
const hueResources = inject('hueResources')
const hueStatus = inject('hueStatus')
const hueTitle = inject('hueTitle')
const powerviewModel = inject('powerviewModel')

const tab = ref(0)

const hueResourcesFilter = ref(`(
  $address := '192.168.1.34';
  $kind := 'bridge_home';
  $bridge := $lookup($, $address);
  $groups := $lookup($bridge, $kind).*[];
  $model := $groups.(
      $gid := id;
      {
          "id": $gid,
          "type": type,
          "name": metadata.name,
          "grouped_light": $bridge.grouped_light.*[owner.rid=$gid].{
              "grouped_light_id": id,
              "grouped_light_state": on.on,
              "scenes": $bridge.scene.*[group.rid=$gid].{
                "scene_id": id,
                "scene_name": metadata.name
              }
          }
      })[];
)`)
</script>
