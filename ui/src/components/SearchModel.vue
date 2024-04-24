<template>
    <v-textarea v-model="filter" label="JSONata" auto-grow />
    <pre>{{ rendered }}</pre>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import jsonata from 'jsonata'

const model = defineModel()

const filter = defineModel('filter', {
    type: String,
    default: '$',
})

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
            filtered.value = null
            return
        }
        filtered.value = await expression.evaluate(model.value)
    } catch (e) {
        filtered.value = null
    }
}
</script>
