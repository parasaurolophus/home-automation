<template>

    <v-list>

        <v-list-item title="Theme">
            <template #append>
                <v-icon :icon="timerThemeIcon()" />
            </template>
            <v-list-item-subtitle>
                {{ timerTheme }}
            </v-list-item-subtitle>
            <div class="notes">
                Evening lighting theme
            </div>
        </v-list-item>

        <template v-for="(itemTime, index) in itemTimes" :key="index">
            <template v-if="timerTime && timerTime[itemTime.key]">
                <v-divider inset />
                <v-list-item :title="itemTime.title">
                    <template #append>
                        <v-icon :icon="timerTimeIcon" />
                    </template>
                    <v-list-item-subtitle>
                        {{ localeTime(timerTime[itemTime.key]) }}
                    </v-list-item-subtitle>
                    <div class="notes">
                        {{ itemTime.notes }}
                    </div>
                </v-list-item>
            </template>
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
import { computed, inject, ref } from 'vue'

const timerTime = inject('timerTime')
const timerTheme = inject('timerTheme')
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
])

function localeTime(timestamp) {
    return new Date(timestamp).toLocaleString()
}

const timerTimeIcon = computed(() => {
    switch (timerTime.value) {
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
            return 'mdi-weather-night'
        default:
            return 'mdi-cog-off'
    }
})

</script>
