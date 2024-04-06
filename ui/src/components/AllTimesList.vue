<template>

    <v-defaults-provider :defaults="{ VChip: { color: 'primary' } }">

        <v-list>

            <v-list-item title="current/timer/theme">
                <v-list-item-subtitle>
                    <v-chip :text="timerTheme" />
                </v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-for="(time, index) in sorted" :key="index" :title="'current/timer/time/' + time.name">
                <v-list-item-subtitle>
                    <v-chip>
                        {{ localeTime(time.time) }}
                    </v-chip>
                </v-list-item-subtitle>
            </v-list-item>

        </v-list>

    </v-defaults-provider>

</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue'

const timerTime = inject('timerTime')
const timerTheme = inject('timerTheme')

const sorted = ref([])

onMounted(sortTimes)
watch(timerTime, sortTimes)

function sortTimes() {
    const s = []
    for (let name in timerTime.value) {
        const time = timerTime.value[name]
        s.push({ name: name, time: time })
    }
    s.sort((a, b) => a.time - b.time)
    sorted.value = s
}

function localeTime(time) {
    return new Date(time).toLocaleString()
}
</script>
