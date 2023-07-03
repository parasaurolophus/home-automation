<template>
    <v-card v-if="hub.length > 0">
        <v-card-title>Window Shades</v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col v-for="(room, index) in hub" :key="index">
                        <table>
                            <caption>{{ room.name }}</caption>
                            <tr>
                                <th>id</th>
                                <td>{{ room.id }}</td>
                            </tr>
                            <tr v-for="(scene, index) in room.scenes" :key="index">
                                <th>{{ scene.name }}</th>
                                <td>{{ scene.id }}</td>
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
defineProps({
    hub: Object
})
</script>