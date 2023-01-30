<template>

    <h2>Controls</h2>

    <div class="wrapped">

        <div>

            <h3>Settings</h3>

            <fieldset>

                <legend>Automation</legend>

                <v-switch v-model="settingsLighting" inset hide-details>
                    <template v-slot:label>
                        Lighting automation
                        {{ settingsLighting ? 'enabled' : 'disabled' }}
                    </template>
                </v-switch>

                <v-switch v-model="settingsShades" inset hide-details>
                    <template v-slot:label>
                        Window shades automation
                        {{ settingsShades ? 'enabled' : 'disabled' }}
                    </template>
                </v-switch>

                <p>
                    Bedtime automation will be triggered at a time randomly chosen each day that is up to 30 minutes
                    before
                    or after the hour selected here:
                </p>

                <v-select v-model="settingsBedtime" :items="bedtimeOptions" item-title="label" item-value="hour"
                    label="Bedtime" return-object single-line></v-select>

            </fieldset>

        </div>

        <div v-if="powerviewModel.length > 0">

            <h3>Window Shades</h3>

            <fieldset v-for="room in powerviewModel" :key="room.id">

                <legend>{{ room.name }}</legend>

                <v-btn v-for="scene in room.scenes" :key="scene.id"
                    @click="websocketPublish({ payload: scene.id, topic: 'put/powerview/scene' })">
                    {{ scene.name }}
                </v-btn>

            </fieldset>

        </div>

        <div v-for="bridge in hueModels" :key="bridge.title">

            <h3>{{ bridge.title }}</h3>

            <fieldset v-for="group in bridge.groups" :key="group.grouped_light.id">

                <legend>{{ group.name }}</legend>

                <v-switch v-model="group.grouped_light.on.on"
                    @change="websocketPublish({ payload: { on: { on: group.grouped_light.on.on } }, topic: group.value, method: 'PUT' })"
                    inset hide-details>
                    <template v-slot:label>
                        <span v-if="group.grouped_light.on.on">On</span>
                        <span v-else>Off</span>
                    </template>
                </v-switch>

                <v-btn v-for="scene in group.scenes" :key="scene.id"
                    @click="websocketPublish({ payload: { recall: { action: 'dynamic_palette' } }, topic: scene.value, method: 'PUT' })">
                    {{ scene.metadata.name }}
                </v-btn>

            </fieldset>

        </div>

    </div>

</template>

<style scoped>
/* */
</style>

<script setup>

import { inject, watch } from 'vue'

const websocketPublish = inject('websocketPublish')
const settingsLighting = inject('settingsLighting')
const settingsShades = inject('settingsShades')
const settingsBedtime = inject('settingsBedtime')
const bedtimeOptions = inject('bedtimeOptions')
const powerviewModel = inject('powerviewModel')
const hueModels = inject('hueModels')

watch(settingsLighting, function lightingEnabledChanged(enabled) {

    websocketPublish({ payload: enabled, topic: 'settings/lighting', retain: true })

})

watch(settingsShades, function shadesEnabledChanged(enabled) {

    websocketPublish({ payload: enabled, topic: 'settings/shades', retain: true })

})

watch(settingsBedtime, function bedtimeChanged(selection) {

    websocketPublish({ payload: selection.hour, topic: 'settings/bedtime', retain: true })

})

</script>