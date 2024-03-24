<template>
    <v-treeview :items="hueTree" density="compact" activatable>
    </v-treeview>
</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue'
import { VTreeview } from 'vuetify/lib/labs/components.mjs'

const hueModels = inject('hueModels')
const hueTree = ref([])

watch(hueModels, updateTree)
onMounted(updateTree)

function updateTree() {

    const tree = []

    for (let bridge of hueModels.value) {

        const groups = bridge.groups.map((group) => {

            const scenes = group.scenes.map((scene) => {

                return {
                    id: scene.id,
                    title: scene.metadata.name
                }
            })

            const childen = [{ id: group.grouped_light.id, title: 'Toggle'}].concat(scenes)

            return {
                // id: group.grouped_light.id,
                title: group.name,
                children: childen
            }
        })

        tree.push({
            id: bridge.address,
            title: bridge.title,
            children: groups
        })
    }

    hueTree.value = tree
}
</script>