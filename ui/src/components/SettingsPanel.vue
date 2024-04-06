import LightingAutomationSettings from './LightingAutomationSettings.vue';

import BedtimeSettings from './BedtimeSettings.vue';
<template>
    <v-container>
        <v-row>
            <v-col>
                <LightingAutomationSettings />
            </v-col>
            <v-col>
                <BedtimeSettings />
            </v-col>
            <v-col>
                <ShadesAutomationSettings />
            </v-col>
        </v-row>
    </v-container>
</template>