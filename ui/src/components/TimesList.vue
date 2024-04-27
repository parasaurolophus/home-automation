<template>

    <v-list>

        <v-list-item title="Theme">
            <v-list-item-subtitle>{{ timerModel.theme }}</v-list-item-subtitle>
            <div class="notes">evening lighting theme</div>
        </v-list-item>

        <template v-for="(itemTime, index) in itemTimes" :key="index">

            <v-divider inset />

            <v-list-item :title="itemTime.title">
                <v-list-item-subtitle>{{ localeTime(itemTime.key) }}</v-list-item-subtitle>
                <div class="notes">{{ itemTime.notes }}</div>
            </v-list-item>

        </template>

    </v-list>

</template>

<style scoped>
.notes {
    font-size: small;
    width: 100%;
    align-self: right;
    text-align: right;
}
</style>

<script setup>
import { inject } from 'vue'

const timerModel = inject('timerModel')

const itemTimes = [
    {
        title: 'Sunrise',
        key: 'sunrise',
        notes: 'all lights off, morning shades',
    },
    {
        title: 'Midday',
        key: 'midday',
        notes: 'all shades open',
    },
    {
        title: 'Afternoon',
        key: 'afternoon',
        notes: 'afternoon shades',
    },
    {
        title: 'Sunset',
        key: 'sunset',
        notes: 'evening lights, all shades open',
    },
    {
        title: 'Dusk',
        key: 'dusk',
        notes: 'all shades closed',
    },
    {
        title: 'Bedtime',
        key: 'bedtime',
        notes: 'night lights, all shades closed',
    },
    {
        title: 'Midnight',
        key: 'midnight',
        notes: 'night lights, all shades closed',
    },
]

function localeTime(key) {
    if (timerModel.value[key]) {
        return new Date(timerModel.value[key]).toLocaleString()
    }
    const message = key + ' not specified'
    console.warn(message)
    return message
}

</script>
