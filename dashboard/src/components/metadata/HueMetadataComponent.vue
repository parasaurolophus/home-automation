<template>
    <v-card>
        <v-card-title>{{ bridge.title }} ({{ bridge.address }})</v-card-title>
        <v-card-text>
            <v-container>
                <v-row v-for="(group, index) in bridge.groups" :key="index">
                    <v-col>
                        <table>
                            <caption>{{ group.name }}</caption>
                            <tr>
                                <th>type</th>
                                <td>{{ group.owner.type }}</td>
                            </tr>
                            <tr>
                                <th>grouped_light</th>
                                <td>
                                    <button :onclick="onGroupedLight"
                                        :value="bridge.address + '|' + group.grouped_light.id">
                                        {{ group.grouped_light.id }}
                                    </button>
                                </td>
                            </tr>
                            <tr v-for="(scene, index) in group.scenes" :key="index">
                                <th>{{ scene.metadata.name }}</th>
                                <td>
                                    <button :onclick="onScene" :value="bridge.address + '|' + scene.id">
                                        {{ scene.id }}
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<style scoped>
table {
    border-width: 1px;
    border-style: solid;
}
</style>

<script setup>
import { inject } from 'vue'

const showMetadataExample = inject('showMetadataExample')

defineProps({
    bridge: Object
})

function onGroupedLight(event) {

    const params = event.target.value.split('|')
    const topic = 'put/hue/' + params[0] + '/resource/grouped_light/' + params[1]
    const payload = '{ "on": { "on": true|false}}'

    showMetadataExample(topic, payload)

}

function onScene(event) {

    const params = event.target.value.split('|')
    const topic = 'put/hue/' + params[0] + '/resource/scene/' + params[1]
    const payload = '{ "recall": { "action": "active"|"dynamic_palette"}}'

    showMetadataExample(topic, payload)

}
</script>
