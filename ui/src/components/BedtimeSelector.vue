<template>
    <v-btn-toggle mandatory v-model="bedtimeIndex">
        <v-btn v-for="(item, index) in bedtimeOptions" :key="index"
            @click="websocketPublish({ payload: bedtimeOptions[index].hour, topic: 'settings/bedtime', retain: true, label: 'user' })">
            {{ item.label }}
        </v-btn>
    </v-btn-toggle>
</template>

<script setup>
import { inject, ref, watch } from 'vue'

const websocketPublish = inject('websocketPublish')
const bedtimeOptions = inject('bedtimeOptions')
const settingsBedtime = inject('settingsBedtime')

const bedtimeIndex = ref(settingsBedtime.value.hour - bedtimeOptions.value[0].hour)

watch(settingsBedtime, () => {
    const option = bedtimeOptions.value[0]
    const bedtime = settingsBedtime.value
    const selected = bedtime.hour - option.hour
    bedtimeIndex.value = selected
})
</script>