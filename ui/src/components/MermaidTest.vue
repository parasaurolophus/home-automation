<template>
    <v-theme-provider theme="dark" with-background>
        <pre class="mermaid">
---
title: A Graph
---
graph TB

    a --> b
    b --> d

    a --> c
    c --> d
        </pre>
    </v-theme-provider>
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
