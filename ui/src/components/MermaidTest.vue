<template>
<pre class="mermaid">
    graph TB

        a --> b
        b --> d

        a --> c
        c --> d
</pre>
</template>

<script setup>
import { onMounted, onUpdated } from 'vue'
import mermaid from 'mermaid'

onMounted(runMermaid)
onUpdated(runMermaid)

function runMermaid() {
    mermaid.run()
}
</script>