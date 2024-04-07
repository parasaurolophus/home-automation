<template>
    <v-container>
        <v-row>
            <v-col>
                <AllTimesList />
            </v-col>
            <v-col>
                <v-list title="Timer Themes">
                    <v-list-item v-for="(theme, index) in allThemes" :key="index">
                        <template #append>
                            <v-icon :color="timerThemeColor(theme)" :icon="timerThemeIcon(theme)" />
                        </template>
                        <v-chip :color="timerThemeColor(theme)" variant="text">
                            {{ theme }}
                        </v-chip>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <AutomationTrigger />
                <v-card title="Test Icon">
                    <v-card-subtitle>
                        <v-btn href="https://pictogrammers.com/library/mdi/" variant="plain">
                            https://pictogrammers.com/library/mdi/
                        </v-btn>
                    </v-card-subtitle>
                    <v-card-text>
                        <v-text-field v-model="testIcon" :prepend-icon="testIcon" />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { inject, ref } from 'vue'

const timerThemeColor = inject('timerThemeColor')
const timerThemeIcon = inject('timerThemeIcon')

const allThemes = ref([
    'tribal',
    'spooky',
    'jolly',
    'standard',
    'fubar',
])
const testIcon = ref('mdi-home-automation')
</script>
