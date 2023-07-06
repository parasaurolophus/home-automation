<template>
    <v-card>
        <v-card-title>Window Shades</v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col v-for="(room, index) in hub" :key="index">
                        <fieldset>
                            <legend>{{ room.name }}</legend>
                            <table>
                                <tr>
                                    <th>id</th>
                                    <td>{{ room.id }}</td>
                                </tr>
                                <tr v-for="(scene, index) in room.scenes" :key="index">
                                    <th>{{ scene.name }}</th>
                                    <td>
                                        <button :onclick="onScene" :value="scene.id + '|' + scene.name">
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
</script>