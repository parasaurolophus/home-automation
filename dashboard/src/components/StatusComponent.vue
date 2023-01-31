<template>

    <h2>Status</h2>

    <div class="wrapped">

        <fieldset>

            <legend>Connection</legend>

            <v-text-field readonly label="Connection" v-model="websocketStatus"></v-text-field>

            <v-btn @click="refreshControls">Refresh Controls</v-btn>

            <v-sheet color="tertiary" theme="light">
                <pre v-if="automationTrigger">{{ formatAutomationTrigger(automationTrigger) }}</pre>
            </v-sheet>

        </fieldset>

        <fieldset>

            <legend>Hue Bridges</legend>

            <div class="wrapped">

                <dl v-for="bridge in hueBridges" :key="bridge.id">
                    <dt>address</dt>
                    <dd>{{ bridge.address }}</dd>
                    <dt>port</dt>
                    <dd>{{ bridge.port }}</dd>
                    <dt>id</dt>
                    <dd>{{ bridge.id }}</dd>
                    <dt>model</dt>
                    <dd>{{ bridge.model }}</dd>
                    <dt>name</dt>
                    <dd>{{ bridge.name }}</dd>
                    <dt>host</dt>
                    <dd>{{ bridge.host }}</dd>
                    <dt>status</dt>
                    <dd>{{ bridge.status }}</dd>
                </dl>

            </div>

        </fieldset>

    </div>

</template>

<style scoped>
/* */
</style>

<script setup>

import { inject } from 'vue'

const websocketStatus = inject('websocketStatus')
const hueBridges = inject('hueBridges')
const websocketPublish = inject('websocketPublish')
const automationTrigger = inject('automationTrigger')

function refreshControls() {

    websocketPublish({ payload: new Date().getTime(), topic: 'controls/refresh' })

}

function formatAutomationTrigger(automationTrigger) {

    const trigger = {}

    for (let property in automationTrigger) {

        trigger[property] = automationTrigger[property]

    }

    trigger.timestamp = new Date(trigger.timestamp).toLocaleString()
    return JSON.stringify(trigger, undefined, 1)

}

</script>