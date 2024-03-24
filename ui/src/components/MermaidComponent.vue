<template>
    <fieldset>
        <legend>Mermaid Test</legend>
        <pre ref="diagram"></pre>
    </fieldset>
</template>

<style scoped>
/* */
</style>

<script setup>
import { onMounted, ref } from 'vue'
import { useTheme } from 'vuetify'
import mermaid from 'mermaid'

const props = defineProps({
    diagramUrl: String
})
const theme = useTheme()
const diagram = ref(null)

mermaid.flowchartConfig = { width: '100%' }
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })

onMounted(async () => {
    await fetch(props.diagramUrl)
        .then((response) => response.text())
        .then(async (text) => {
            const { svg, bindFuntions } = await mermaid.render('diagram', text)
            diagram.value.innerHTML = svg
            bindFuntions?.(diagram.value)
        })
})
</script>
