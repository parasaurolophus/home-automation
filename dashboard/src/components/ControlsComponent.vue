<template>
    <div class="columns">
        <SettingsComponent class="narrow"/>
        <PowerViewControlsComponent />
        <HueControlsComponent />
    </div>
</template>

<style scoped>
.columns {
    display: flex;
    flex-flow: row wrap;
}

.narrow {
    width: 25rem;
}
</style>

<script setup>
import SettingsComponent from '@/components/controls/SettingsComponent.vue'
import PowerViewControlsComponent from '@/components/controls/PowerViewControlsComponent.vue'
import HueControlsComponent from '@/components/controls/HueControlsComponent.vue'
</script>