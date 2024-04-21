<template>
    <v-textarea v-model="filter" label="JSONata" />
    <pre>{{ rendered }}</pre>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import jsonata from 'jsonata'

const model = defineModel()

const filter = ref('$')
const filtered = ref(null)

const rendered = computed(render)

function render() {
    return JSON.stringify(filtered.value, undefined, 4)
}

onMounted(evaluate)
watch(filter, evaluate)
watch(model, evaluate, { deep: true })

async function evaluate() {
    try {
        const expression = jsonata(filter.value)
        if (expression === undefined) {
            console.warn(filter.value + ' selected nothing')
            filtered.value = null
            return
        }
        console.log('expression compiled')
        filtered.value = await expression.evaluate(model.value)
        console.log('expression evaluated')
    } catch (e) {
        console.error(e)
    }
}
</script>
