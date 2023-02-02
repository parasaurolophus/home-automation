<template>

    <div class="wrapped">

        <SettingsComponent />
        <PowerViewControlsComponent />
        <HueControlsComponent />

    </div>

</template>

<style scoped>
.wrapped {
    display: flex;
    flex-flow: row wrap;
}
</style>

<script setup>

import SettingsComponent from '@/components/SettingsComponent.vue'
import PowerViewControlsComponent from '@/components/PowerViewControlsComponent.vue'
import HueControlsComponent from '@/components/HueControlsComponent.vue'

</script>