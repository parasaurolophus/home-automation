<template>

    <v-list>

        <v-list-item title="Theme">
            <template #append>
                <v-icon :icon="timerThemeIcon()" />
            </template>
            <v-list-item-subtitle>
                {{ timerModel.theme }}
            </v-list-item-subtitle>
            <div class="notes">
                evening lighting theme
            </div>
        </v-list-item>

        <template v-for="(itemTime, index) in itemTimes" :key="index">
            <v-divider inset />
            <v-list-item :title="itemTime.title">
                <template #append>
                    <v-icon :icon="timerTimeIcon(itemTime.key)" />
                </template>
                <v-list-item-subtitle>
                    {{ localeTime(itemTime.key) }}
                </v-list-item-subtitle>
                <div class="notes">
                    {{ itemTime.notes }}
                </div>
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
import { inject, ref } from 'vue'

const timerModel = inject('timerModel')
const timerThemeIcon = inject('timerThemeIcon')

const itemTimes = ref([
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
])

function localeTime(key) {
    if (timerModel.value.times) {
        for (let time of timerModel.value.times) {
            if (time.title == key) {
                return new Date(time.timestamp).toLocaleString()
            }
        }
    }
    const message = key + ' not specified'
    console.warn(message)
    return message
}

function timerTimeIcon(key) {
    switch (key) {
        case 'sunrise':
            return 'mdi-weather-sunset-up'
        case 'midday':
            return 'mdi-sun-angle-outline'
        case 'afternoon':
            return 'mdi-sun-angle'
        case 'sunset':
            return 'mdi-weather-sunset-down'
        case 'dusk':
            return 'mdi-blinds'
        case 'bedtime':
        case 'midnight':
            return 'mdi-weather-night'
        default:
            return 'mdi-cog-off'
    }
}

</script>
