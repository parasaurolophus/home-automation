<template>
    <v-card>
        <v-card-title>{{ bridge.title }}</v-card-title>
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
                                <td>{{ group.grouped_light.id }}</td>
                            </tr>
                            <tr v-for="(scene, index) in group.scenes" :key="index">
                                <th>{{ scene.metadata.name }}</th>
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
    bridge: Object
})
</script>