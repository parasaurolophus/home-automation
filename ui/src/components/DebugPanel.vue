<template>
    <v-container>
        <v-row>
            <v-col>
                <AllTimesList />
            </v-col>
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
import { ref } from 'vue'

const testIcon = ref('mdi-home-automation')
</script>
