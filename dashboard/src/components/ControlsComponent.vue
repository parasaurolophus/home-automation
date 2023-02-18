<template>
    <div class="wrapped">
        <SettingsComponent />
        <PowerViewControlsComponent />
        <HueControlsComponent />
    </div>
</template>

<script setup>
import SettingsComponent from '@/components/controls/SettingsComponent.vue'
import PowerViewControlsComponent from '@/components/controls/PowerViewControlsComponent.vue'
import HueControlsComponent from '@/components/controls/HueControlsComponent.vue'
</script>