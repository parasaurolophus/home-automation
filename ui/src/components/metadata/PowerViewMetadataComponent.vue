<template>
    <v-card>
        <v-card-title>Window Shades</v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col v-for="(room, index) in hub" :key="index">
                        <fieldset>
                            <legend>{{ room.title }}</legend>
                            <table>
                                <tr>
                                    <th>id</th>
                                    <td>
                                        <button :onclick="onRoom" :value="JSON.stringify(room)" :key="index">
                                            {{ room.id }}
                                        </button>
                                    </td>
                                </tr>
                                <tr v-for="(scene, index) in room.scenes" :key="index">
                                    <th>{{ scene.title }}</th>
                                    <td>
                                        <button :onclick="onScene" :value="scene.id + '|' + scene.title">
                                            {{ scene.id }}
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        </fieldset>
                    </v-col>
                </v-row>
            </v-container>
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
    hub: Object
})

function onScene(event) {
    const params = event.target.value.split('|')
    const message = {
        topic: 'put/powerview/scene',
        payload: params[0],
        label: params[1]
    }
    const json = JSON.stringify(message, null, 4)
    showMetadataExample(json)
}

function onRoom(event) {
    const room = JSON.parse(event.target.value)
    const examples = []
    for (let shade of room.shades) {
        examples.push({
            name: shade.name,
            id: shade.id
        })
    }
    showMetadataExample(JSON.stringify(examples, null, 4))
}
</script>