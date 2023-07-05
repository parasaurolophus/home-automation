<template>
    <fieldset>
        <legend>Timer</legend>
        <table>
            <tr v-for="(value, name) in timer" :key="name">
                <th>{{ name }}</th>
                <td>{{ value }}</td>
            </tr>
        </table>
    </fieldset>
</template>

<style scoped>
/* */
</style>

<script setup>
import { inject } from 'vue'

const timer = inject('timer')
</script>