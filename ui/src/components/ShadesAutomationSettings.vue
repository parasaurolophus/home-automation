<template>
    <div class="align-center">
        <v-switch v-model="settingsShades" class="align-center" density="compact">
            <template #label>
                <v-icon v-if="settingsShades" color="secondary" icon="mdi-blinds-open" />
                <v-icon v-else color="primary" icon="mdi-blinds" />
            </template>
        </v-switch>
    </div>
</template>

<style scoped>
.align-center {
    height: 100%;
    display: flex;
    align-content: center;
}

.align-center>* {
    margin: 0 0.5rem 0 0.5rem;
}
</style>

<script setup>
import { inject } from 'vue'

const settingsShades = inject('settingsShades')
</script>