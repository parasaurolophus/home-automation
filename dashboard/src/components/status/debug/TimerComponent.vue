<template>
    <v-card>
        <v-card-title>Timer</v-card-title>
        <v-card-text>
            <v-table>
                <tr v-for="(value, name) in timer" :key="name">
                    <th>{{ name }}</th>
                    <td>{{ value }}</td>
                </tr>
            </v-table>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { inject } from 'vue'

const timer = inject('timer')
</script>