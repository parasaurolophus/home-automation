<template>
    <v-tabs v-model="tab">
        <v-tab value="0">hueTitle</v-tab>
        <v-tab value="1">hueStatus</v-tab>
        <v-tab value="2">hueBridges</v-tab>
        <v-tab value="3">hueResources</v-tab>
        <v-tab value="4">powerviewModel</v-tab>
    </v-tabs>
    <v-window v-model="tab">
        <v-window-item value="0">
            <ExpandJson :value="hueTitle" path="hueTitle"/>
        </v-window-item>
        <v-window-item value="1">
            <ExpandJson :value="hueStatus" path="hueStatus"/>
        </v-window-item>
        <v-window-item value="2">
            <ExpandJson :value="hueBridges" path="hueBridges"/>
        </v-window-item>
        <v-window-item value="3">
            <ExpandJson :value="hueResources" path="hueResources"/>
        </v-window-item>
        <v-window-item value="4">
            <ExpandJson :value="powerviewModel" path="powerviewModel"/>
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
</script>
