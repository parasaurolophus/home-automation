<template>
    <v-card>
        <v-card-text>
            <fieldset>
                <legend>Timer</legend>
                <table>
                    <tr v-for="(value, name) in timer" :key="name">
                        <th>{{ name }}</th>
                        <td>{{ value }}</td>
                    </tr>
                </table>
            </fieldset>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { inject } from 'vue'

const timer = inject('timer')
</script>