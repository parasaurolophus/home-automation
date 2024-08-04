<template>
    <v-theme-provider theme="dark" with-background>
        <pre class="mermaid">
---
config:
  theme: dark
---
flowchart TD
    inception -->|iterate| inception
    inception -->|requirements| architecture
    architecture -->|iterate| architecture
    architecture -->|request change| inception
    architecture -->|specifications<br>designs| development
    development -->|iterate| development
    development -->|request change| architecture
    development -->|commit| test
    test -->|iterate| test
    test -->|report bugs| development
    test -->|approve| operations
    operations -->|deploy<br>monitor| operations
    operations -->|report bugs| development
        </pre>
    </v-theme-provider>
</template>

<script setup>
import { onMounted, onUpdated } from 'vue'
import mermaid from 'mermaid'

onMounted(mermaid.run)
onUpdated(mermaid.run)
</script>
