<template>
    <v-tabs v-model="tab">
        <v-tab v-for="(bridge, address, index) in hueBridges" :key="address" :value="index">
            {{ hueTitle[address] }}
        </v-tab>
    </v-tabs>
    <v-window v-model="tab">
        <v-window-item v-for="(bridge, address, index) in hueBridges" :key="address" :value="index">
            <v-card>
                <v-card-title>
                    {{ address }}
                </v-card-title>
                <v-card-subtitle>
                    WebSocket readyState
                    {{ hueStatus[address] }}
                </v-card-subtitle>
                <v-card-text>
                    <pre>{{ JSON.stringify(bridge, undefined, 4) }}</pre>
                </v-card-text>
            </v-card>
        </v-window-item>
    </v-window>
</template>

<script setup>
import { inject, ref } from 'vue'
import jsonata from 'jsonata'

const hueBridges = inject('hueBridges')
const hueStatus = inject('hueStatus')
const hueTitle = inject('hueTitle')

const tab = ref(0)
</script>
