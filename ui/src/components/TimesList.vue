<template>

    <v-list>

        <v-list-item title="Theme">
            <template #append>
                <v-icon :color="timerThemeColor" :icon="timerThemeIcon" />
            </template>
            <v-list-item-subtitle>
                <v-chip :color="timerThemeColor">
                    {{ timerTheme }}
                </v-chip>
            </v-list-item-subtitle>
            <div class="notes">
                Evening lighting theme
            </div>
        </v-list-item>

        <template v-for="(itemTime, index) in itemTimes" :key="index">
            <template v-if="automationTrigger && nextTrigger && timerTime && timerTime[itemTime.key]">
                <v-divider inset />
                <v-list-item :title="itemTime.title">
                    <v-list-item-subtitle>
                        <v-chip :color="chipColor(itemTime)">
                            {{ localeTime(timerTime[itemTime.key]) }}
                        </v-chip>
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

const computeTimerThemeColor = inject('computeTimerThemeColor')
const computeTimerThemeIcon = inject('computeTimerThemeIcon')
const automationTrigger = inject('automationTrigger')
const nextTrigger = inject('nextTrigger')
const timerTime = inject('timerTime')
const timerTheme = inject('timerTheme')

const timerThemeColor = computed(computeTimerThemeColor)
const timerThemeIcon = computed(computeTimerThemeIcon)

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

function chipColor(itemTime) {
    const nextTime = nextTrigger.value.time
    const selectedTime = timerTime.value[itemTime.key]
    if (selectedTime == nextTime) {
        return 'primary'
    }
    if (selectedTime < nextTime) {
        return 'secondary'
    }
    return false
}

function localeTime(timestamp) {
    return new Date(timestamp).toLocaleString()
}
</script>
