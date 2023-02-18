<template>
    <fieldset>
        <legend>Timer</legend>
        <v-table>
            <tr v-for="(value, name) in timer" :key="name">
                <th>{{ name }}</th>
                <td>{{ value }}</td>
            </tr>
        </v-table>
    </fieldset>
</template>

<script setup>

import { inject } from 'vue'

const timer = inject('timer')

</script>