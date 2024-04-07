<template>
    <v-card>
        <v-card-item>
            <template #append>
                <v-icon :color="settingsColor(settingsShades)" :icon="shadesSettingsIcon()" />
            </template>
            <v-card-title>
                Shades Automation
            </v-card-title>
            <v-card-subtitle>
                <v-chip :color="settingsColor(settingsShades)">
                    {{ settingsText(settingsShades) }}
                </v-chip>
            </v-card-subtitle>
        </v-card-item>
        <v-card-text>
            <v-switch v-model="settingsShades" class="align-center" />
        </v-card-text>
    </v-card>
</template>

<style scoped>
.align-center {
    height: 100%;
    align-self: center;
    align-items: center;
    align-content: center;
    display: flex;
}
</style>

<script setup>
import { inject } from 'vue'

const settingsColor = inject('settingsColor')
const settingsText = inject('settingsText')
const settingsShades = inject('settingsShades')
const shadesSettingsIcon = inject('shadesSettingsIcon')
</script>
