<template>
    <v-card>
        <v-card-title>
            {{ bridge.title }}
            (<button :onclick="onOpenClip" :value="bridge.address">{{ bridge.address }}</button>)
        </v-card-title>
        <v-card-text>
            <fieldset v-for="(group, index) in bridge.groups" :key="index">
                <legend>{{ group.title }}</legend>
                <table>
                    <tr>
                        <th>type</th>
                        <td>{{ group.owner.type }}</td>
                    </tr>
                    <tr>
                        <th>grouped_light</th>
                        <td>
                            <button :onclick="onGroupedLight"
                                :value="bridge.address + '|' + group.grouped_light.id + '|' + group.title">
                                {{ group.grouped_light.id }}
                            </button>
                        </td>
                    </tr>
                    <tr v-for="(scene, index) in group.scenes" :key="index">
                        <th>{{ scene.title }}</th>
                        <td>
                            <button :onclick="onScene"
                                :value="bridge.address + '|' + scene.id + '|' + group.title + '/' + scene.title">
                                {{ scene.id }}
                            </button>
                        </td>
                    </tr>
                </table>
            </fieldset>
        </v-card-text>
    </v-card>
</template>

<style scoped>
/* */
</style>

<script setup>
import { inject } from 'vue'

const showMetadataExample = inject('showMetadataExample')

defineProps({
    bridge: Object
})

function onOpenClip(event) {
    const url = 'https://' + encodeURI(event.target.value) + '/debug/clip.html'
    window.open(url, '_blank')
}

function onGroupedLight(event) {

    const params = event.target.value.split('|')
    const message = {
        topic: 'put/hue/' + params[0] + '/resource/grouped_light/' + params[1],
        payload: { on: { on: false } },
        method: 'PUT',
        label: params[2]
    }
    const json = JSON.stringify(message, null, 4)

    showMetadataExample(json)

}

function onScene(event) {

    const params = event.target.value.split('|')
    const message = {
        topic: 'put/hue/' + params[0] + '/resource/scene/' + params[1],
        payload: { recall: { action: 'active' } },
        method: 'PUT',
        label: params[2]
    }
    const json = JSON.stringify(message, null, 4)

    showMetadataExample(json)

}
</script>
